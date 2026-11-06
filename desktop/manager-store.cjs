'use strict';
const fs=require('fs/promises'),path=require('path');
const LIMIT=6*1024*1024;
function validate(text){
 if(typeof text!=='string'||Buffer.byteLength(text)>LIMIT)throw Error('MANAGER_SIZE');
 const e=JSON.parse(text);
 if(e?.format==='zth-manager'&&e.version>1)throw Error('MANAGER_NEWER_VERSION');
 const base64=(s,n)=>typeof s==='string'&&/^[A-Za-z0-9+/]+={0,2}$/.test(s)&&Buffer.from(s,'base64').toString('base64')===s&&(!n||Buffer.from(s,'base64').length===n);
 if(e?.format!=='zth-manager'||e.version!==1||e.encrypted!==true||e.algorithm!=='AES-256-GCM'||e.kdf!=='PBKDF2-SHA256'||e.iterations!==210000||!base64(e.salt,16)||!base64(e.iv,12)||!base64(e.ciphertext)||Buffer.from(e.ciphertext,'base64').length<16)throw Error('MANAGER_FORMAT');
 return text;
}
function createManagerStore(directory){
 const current=path.join(directory,'manager-store.zthdb'),previous=current+'.previous',pending=current+'.pending';let queue=Promise.resolve();
 async function read(file){try{if((await fs.stat(file)).size>LIMIT)throw Error('MANAGER_SIZE');return{data:validate(await fs.readFile(file,'utf8'))};}catch(e){if(e.code==='ENOENT')return{missing:true};return{error:e};}}
 async function state(){const [main,backup]=await Promise.all([read(current),read(previous)]);if([main,backup].some(x=>x.error?.message==='MANAGER_NEWER_VERSION'))throw Error('MANAGER_NEWER_VERSION');return{main,backup};}
 async function load(){await queue.catch(()=>{});const {main,backup}=await state();if(main.data)return{data:main.data,recovered:false};if(backup.data)return{data:backup.data,recovered:true};if(main.missing&&backup.missing)return{data:null};throw Error('MANAGER_UNREADABLE');}
 function save(data){validate(data);const task=queue.catch(()=>{}).then(async()=>{const {main,backup}=await state();if(!main.data&&!backup.data&&!(main.missing&&backup.missing))throw Error('MANAGER_UNREADABLE');await fs.mkdir(directory,{recursive:true});const handle=await fs.open(pending,'w',0o600);try{await handle.writeFile(data,'utf8');await handle.sync();}finally{await handle.close();}if(main.data)await fs.copyFile(current,previous);await fs.rename(pending,current);return{savedAt:new Date().toISOString()};});queue=task;return task;}
 return{load,save};
}
module.exports={createManagerStore,validate};

