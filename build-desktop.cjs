'use strict';
// Async per-file operations avoid Node's Windows cpSync native fast-fail.
// Existing generated output is validated and quarantined, never recursively deleted.
const fs=require('node:fs/promises'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname),bundle=path.join(root,'dist','desktop'),runtime=path.join(root,'qa/desktop-runtime/node_modules/electron/dist'),flashing=path.join(root,'dist/flashing-v10');
const io=file=>process.platform==='win32'?path.toNamespacedPath(file):file;
function below(base,target){const relative=path.relative(base,target);return !!relative&&!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative);}
function privateName(name){return /\.(zth|zthm|zthdb)(?:\.|$)/i.test(name)||/^(Archives|Local State|storage-location\.json)$/i.test(name);}
async function exists(file){try{await fs.lstat(io(file));return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
async function inventory(folder,{rejectPrivate=false}={}){
 const first=await fs.lstat(io(folder));if(!first.isDirectory()||first.isSymbolicLink())throw Error('Expected a real directory, not a link: '+folder);
 const files=[],directories=[],pending=[''];
 while(pending.length){const relative=pending.pop();for(const item of await fs.readdir(io(path.join(folder,relative)),{withFileTypes:true})){
  const name=path.join(relative,item.name);if(item.isSymbolicLink())throw Error('Unexpected link in generated inputs/output: '+name);
  if(rejectPrivate&&privateName(item.name))throw Error('Private storage found; preserve it outside generated output before rebuilding: '+name);
  if(item.isDirectory()){directories.push(name);pending.push(name);}else if(item.isFile())files.push(name);else throw Error('Unexpected non-regular entry: '+name);
 }}return {files,directories};
}
async function assertGeneratedTarget(){
 const realRoot=await fs.realpath(io(root));if(path.resolve(realRoot)!==root)throw Error('Build root must not be a junction or symlink.');
 if(bundle!==path.join(root,'dist','desktop')||!below(root,bundle))throw Error('Unsafe generated-output directory.');
 for(const file of [path.join(root,'dist'),bundle])if(await exists(file)){const st=await fs.lstat(io(file));if(!st.isDirectory()||st.isSymbolicLink()||!below(root,await fs.realpath(io(file))))throw Error('Generated directory escapes the workspace.');}
 if(await exists(bundle))await inventory(bundle,{rejectPrivate:true});
}
async function copyTree(source,destination,plan){
 const listing=plan||await inventory(source);await fs.mkdir(io(destination),{recursive:true});
 for(const relative of listing.directories.sort((a,b)=>a.split(path.sep).length-b.split(path.sep).length)){const target=path.resolve(destination,relative);if(!below(destination,target))throw Error('Unsafe copy directory.');await fs.mkdir(io(target),{recursive:true});}
 let cursor=0;await Promise.all(Array.from({length:8},async()=>{for(;;){const index=cursor++;if(index>=listing.files.length)break;const relative=listing.files[index],from=path.resolve(source,relative),to=path.resolve(destination,relative);if(!below(source,from)||!below(destination,to))throw Error('Unsafe copy entry.');const st=await fs.lstat(io(from));if(!st.isFile()||st.isSymbolicLink())throw Error('Copy source changed or is not a regular file.');await fs.copyFile(io(from),io(to));if((await fs.stat(io(to))).size!==st.size)throw Error('Copy size mismatch: '+relative);}}));
 return listing.files.length;
}
function runNode(file){return new Promise((resolve,reject)=>{const child=cp.spawn(process.execPath,[path.join(root,file)],{cwd:root,stdio:'inherit',windowsHide:true});child.on('error',reject);child.on('exit',(code,signal)=>code===0?resolve():reject(Error(file+' failed ('+(signal||code)+').')));});}
async function quarantinePrevious(){
 if(!await exists(bundle))return;
 const notes=path.join(root,'dev-notes');if(await exists(notes)){const st=await fs.lstat(io(notes));if(!st.isDirectory()||st.isSymbolicLink()||!below(root,await fs.realpath(io(notes))))throw Error('Unsafe private quarantine directory.');}else await fs.mkdir(io(notes));
 const target=path.join(notes,'desktop-replaced-v12-'+new Date().toISOString().replace(/\D/g,'')+'-'+crypto.randomBytes(3).toString('hex'));
 if(!below(notes,target)||bundle!==path.join(root,'dist','desktop')||await exists(target))throw Error('Unsafe quarantine target.');
 await fs.rename(io(bundle),io(target));console.log('Previous generated output preserved under dev-notes.');
}
async function refreshApp(){
 if(!await exists(path.join(bundle,'ZeroToHand.exe')))throw Error('Build the runtime and toolchain before refreshing application content.');
 const app=path.join(bundle,'resources/app');await fs.mkdir(io(app),{recursive:true});
 for(const file of ['package.json','main.cjs','preload.cjs','store.cjs','manager-store.cjs','storage-path.cjs','flashing.cjs','protection.cjs'])await fs.copyFile(io(path.join(root,'desktop',file)),io(path.join(app,file)));
 const html=await fs.readFile(io(path.join(root,'ZeroToHand-Engineering-Academy.html')));await fs.writeFile(io(path.join(app,'index.html')),html);
 await fs.copyFile(io(path.join(root,'ZeroToHand-Academy.ico')),io(path.join(app,'icon.ico')));
 console.log('Application content refreshed. HTML SHA256 '+crypto.createHash('sha256').update(html).digest('hex'));
}
async function main(){
 const args=new Set(process.argv.slice(2));for(const arg of args)if(!['--allow-private-toolchain','--runtime-only','--refresh-app'].includes(arg))throw Error('Unknown build option: '+arg);
 if(args.has('--runtime-only')&&args.has('--refresh-app'))throw Error('Choose runtime-only or refresh-app, not both.');
 console.log('Checking fixed generated paths and private-data boundary...');await assertGeneratedTarget();
 if(args.has('--refresh-app')){await refreshApp();return;}
 if(!await exists(path.join(runtime,'electron.exe')))throw Error('Install the pinned desktop dependencies and Electron runtime first.');
 const manifest=JSON.parse(await fs.readFile(io(path.join(flashing,'bundle.json')),'utf8'));if(manifest.format!=='zth-flashing-toolchain'||manifest.version!==10||!Array.isArray(manifest.files))throw Error('Unexpected offline toolchain manifest.');
 if(!manifest.distributionReady&&!args.has('--allow-private-toolchain'))throw Error('Toolchain corresponding-source review is not complete.');
 const runtimePlan=await inventory(runtime,{rejectPrivate:true}),sdkPlan=await inventory(flashing,{rejectPrivate:true});
 const expected=new Set(manifest.files.map(entry=>entry.file).concat('bundle.json'));if(expected.size!==sdkPlan.files.length||sdkPlan.files.some(file=>!expected.has(file.split(path.sep).join('/'))))throw Error('Toolchain inventory differs from reviewed manifest.');
 await quarantinePrevious();await fs.mkdir(io(bundle),{recursive:true});
 console.log('Copying Electron runtime ('+runtimePlan.files.length+' files)...');await copyTree(runtime,bundle,runtimePlan);await fs.rename(io(path.join(bundle,'electron.exe')),io(path.join(bundle,'ZeroToHand.exe')));await runNode('build-exe-brand-v12.cjs');
 console.log('Copying offline toolchain ('+sdkPlan.files.length+' files)...');await copyTree(flashing,path.join(bundle,'resources/flashing-v10'),sdkPlan);
 if(args.has('--runtime-only'))console.log('Runtime and offline toolchain ready. Run node build-desktop.cjs --refresh-app after the final HTML build.');else{await refreshApp();console.log('Desktop bundle complete.');}
}
module.exports={below,privateName,inventory,copyTree};
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
