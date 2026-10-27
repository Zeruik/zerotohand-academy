'use strict';
// Run with Node. Each phase is a separate real Electron process with explicitly
// isolated userData AND sessionData; no real learner archive or key is touched.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'..'),notes=path.join(root,'dev-notes');
const {configureProtectionPaths,createProtection}=require('../desktop/protection.cjs');
const {createStore9}=require('../desktop/store.cjs');
const phaseIndex=process.argv.indexOf('--phase'),phase=phaseIndex>=0?process.argv[phaseIndex+1]:null;
const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function fixture(revision){const id='native-upgrade-0001';return{format:'zth-local-store',version:9,activeProfileId:id,settings:{autoSave:true,motion:'system'},profiles:{[id]:{version:9,profile:{id,name:'Synthetic native phase '+revision},done:['c-values'],notes:{'c-values':'Synthetic private note '+revision},answers9:{drafts:{},attempts:[{lessonId:'c-values',questionId:'numeric',kind:'numeric',answer:String(revision),correct:true}]},changes9:[]}},revision};}
if(phase){
 const {app,safeStorage}=require('electron'),base=path.resolve(arg('--fixture-dir')||'');
 assert.ok(['write','update','read'].includes(phase),'Unknown test phase');
 assert.equal(path.dirname(base),notes,'Worker data must stay in this project dev-notes folder');
 assert.match(path.basename(base),/^protection-native-v10-[0-9]+-[a-f0-9]+$/);
 const keyDirectory=path.join(base,'PrivateKeyContext'),archive=path.join(base,'Archives'),legacyArchive=path.join(base,'LegacySync');
 app.setName('Isolated native test '+phase); // Names differ, but key paths stay fixed.
 configureProtectionPaths(app,keyDirectory);
 app.whenReady().then(async()=>{
  assert.equal(process.platform,'win32');assert.equal(app.getPath('userData'),keyDirectory);assert.equal(app.getPath('sessionData'),keyDirectory);
  const protection=await createProtection(safeStorage),store=createStore9(archive,protection),legacy=createStore9(legacyArchive,protection);
  if(phase==='write'){
   assert.equal((await store.load()).data,null);await store.save(fixture(1));
   fs.mkdirSync(legacyArchive,{recursive:true});fs.writeFileSync(path.join(legacyArchive,'learning-store.zthdb'),JSON.stringify({format:'zth-local-store',version:1,ciphertext:safeStorage.encryptString(JSON.stringify(fixture(70))).toString('base64')}));
  }else{
   const loaded=await store.load();assert.equal(loaded.recovered,false);assert.equal(loaded.data.revision,phase==='update'?1:2);assert.deepEqual(loaded.data,{...fixture(phase==='update'?1:2),producerVersion:'10.0.0'});
   assert.deepEqual((await legacy.load()).data,fixture(70),'Async protection reads sync ciphertext from an earlier process');
   if(phase==='update')await store.save(fixture(2));
   else{const previous=JSON.parse(fs.readFileSync(path.join(archive,'learning-store.zthdb.previous'),'utf8'));const previousData=JSON.parse(await protection.decrypt(Buffer.from(previous.ciphertext,'base64')));assert.deepEqual(previousData,{...fixture(1),producerVersion:'10.0.0'});}
  }
  const raw=fs.readFileSync(path.join(archive,'learning-store.zthdb'),'utf8');assert.ok(!raw.includes('Synthetic native phase'));assert.ok(!raw.includes('Synthetic private note'));
  fs.writeFileSync(path.join(base,phase+'.json'),JSON.stringify({passed:true,phase,pid:process.pid,electron:process.versions.electron,explicitUserData:true,explicitSessionData:true,revision:phase==='write'?1:2,syncCompatibility:phase!=='write',normalQuitRequested:true}));
  app.quit(); // Deliberately exercise normal preference/key flushing, never app.exit.
 }).catch(error=>{fs.writeFileSync(path.join(base,phase+'.json'),JSON.stringify({passed:false,phase,error:error.message}));process.exitCode=1;app.quit();});
}else{
 (async()=>{
  assert.equal(process.platform,'win32','This acceptance test requires Windows and its native protection service.');
  fs.mkdirSync(notes,{recursive:true});const base=path.join(notes,'protection-native-v10-'+Date.now()+'-'+crypto.randomBytes(4).toString('hex'));fs.mkdirSync(base);
  const electron=require('./desktop-runtime/node_modules/electron'),checks=[],phases=[];
  async function runPhase(next){const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
   await new Promise((resolve,reject)=>{const child=cp.spawn(electron,[__filename,'--phase',next,'--fixture-dir',base],{cwd:root,env,windowsHide:true,stdio:['ignore','ignore','pipe']});let errorOutput='',timedOut=false;child.stderr.on('data',data=>{errorOutput=(errorOutput+data).slice(-4000);});const timer=setTimeout(async()=>{timedOut=true;await require('../desktop/flashing.cjs').terminateProcessTree(child);},45000);child.on('error',error=>{clearTimeout(timer);reject(error);});child.on('close',code=>{clearTimeout(timer);if(timedOut)reject(Error('Isolated Electron phase timed out: '+next));else if(code!==0)reject(Error('Electron phase failed: '+next+' '+errorOutput));else resolve();});});
   const item=JSON.parse(fs.readFileSync(path.join(base,next+'.json'),'utf8'));assert.equal(item.passed,true,item.error);phases.push(item);return item;
  }
  const archiveFile=path.join(base,'Archives','learning-store.zthdb'),legacyFile=path.join(base,'LegacySync','learning-store.zthdb');
  const stateFile=path.join(base,'PrivateKeyContext','Local State');
  const keyFingerprint=()=>{const state=JSON.parse(fs.readFileSync(stateFile,'utf8'));assert.equal(typeof state.os_crypt?.encrypted_key,'string');assert.ok(state.os_crypt.encrypted_key.length>20);return hash(state.os_crypt.encrypted_key);};
  await runPhase('write');const firstKey=keyFingerprint(),legacyHash=hash(fs.readFileSync(legacyFile));checks.push('First process wrote an encrypted archive and normal quit persisted its protected key');
  await runPhase('update');assert.equal(keyFingerprint(),firstKey);assert.equal(hash(fs.readFileSync(legacyFile)),legacyHash);checks.push('Second process reused the protected key, decrypted both async and legacy sync data, and saved a new revision');
  const beforeFinalRead=hash(fs.readFileSync(archiveFile));await runPhase('read');assert.equal(keyFingerprint(),firstKey);assert.equal(hash(fs.readFileSync(archiveFile)),beforeFinalRead);assert.equal(hash(fs.readFileSync(legacyFile)),legacyHash);checks.push('Third process read the updated archive and previous revision without changing either test archive');
  assert.equal(new Set(phases.map(x=>x.pid)).size,3);checks.push('Three distinct native Electron processes used the same explicit isolated userData/sessionData despite different app names');
  const report={passed:true,at:new Date().toISOString(),checks,phases,protectedKeyPersisted:true,keyContextStable:true,legacySyncCiphertextUnchanged:true,noRealLearnerDataAccessed:true,fixtureDirectory:path.relative(root,base),scope:'Real Windows safeStorage across three separately launched Electron processes, each using normal app.quit. No installed user profile, actual learner archive or existing Local State was accessed.'};fs.writeFileSync(path.join(notes,'protection-native-v10-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,checks:checks.length,phases:phases.length,scope:report.scope}));
 })().catch(error=>{fs.mkdirSync(notes,{recursive:true});fs.writeFileSync(path.join(notes,'protection-native-v10-results.json'),JSON.stringify({passed:false,error:error.stack},null,2));console.error(error);process.exitCode=1;});
}
