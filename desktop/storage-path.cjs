const fs=require('fs/promises');
const path=require('path');
const {createStore9}=require('./store.cjs');
async function storagePath10(installRoot,legacyRoot,codec){
 const fallback=path.join(installRoot,'Archives'),config=path.join(installRoot,'storage-location.json');
 let directory=fallback;
 try{const raw=JSON.parse((await fs.readFile(config,'utf8')).replace(/^\uFEFF/,''));if(typeof raw.archivePath!=='string'||!path.isAbsolute(raw.archivePath)||/[\0\r\n]/.test(raw.archivePath))throw Error('STORAGE_LOCATION_INVALID');directory=path.resolve(raw.archivePath);}catch(e){if(e.code!=='ENOENT')throw e;}
 await fs.mkdir(directory,{recursive:true});
 const probe=path.join(directory,'.write-check-'+require('crypto').randomUUID());let created=false;
 try{await fs.writeFile(probe,'',{flag:'wx'});created=true;}catch{throw Error('STORAGE_NOT_WRITABLE');}finally{if(created)await fs.unlink(probe).catch(()=>{});}
 const store=createStore9(directory,codec);let migrated=false;
 // Never overwrite a selected existing archive. A corrupt archive must fail visibly.
 const target=await store.load();
 if(!target.data&&legacyRoot&&path.resolve(legacyRoot)!==directory){const old=createStore9(legacyRoot,codec);const previous=await old.load();if(previous.data){await store.save(previous.data);migrated=true;}}
 return{directory,store,migrated};
}
module.exports={storagePath10};
