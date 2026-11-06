'use strict';
const assert=require('assert/strict'),fs=require('fs/promises'),path=require('path');
const {createManagerStore}=require('../desktop/manager-store.cjs');
(async()=>{
 const root=path.resolve(__dirname,'../dev-notes');await fs.mkdir(root,{recursive:true});const dir=await fs.mkdtemp(path.join(root,'manager-storage-v11-')),file=path.join(dir,'manager-store.zthdb'),store=createManagerStore(dir);
 const envelope=n=>JSON.stringify({format:'zth-manager',version:1,encrypted:true,algorithm:'AES-256-GCM',kdf:'PBKDF2-SHA256',iterations:210000,salt:Buffer.alloc(16,n).toString('base64'),iv:Buffer.alloc(12,n).toString('base64'),ciphertext:Buffer.alloc(32,n).toString('base64')});
 assert.equal((await store.load()).data,null);await store.save(envelope(1));await store.save(envelope(2));assert.equal((await createManagerStore(dir).load()).data,envelope(2));assert.equal(await fs.readFile(file+'.previous','utf8'),envelope(1));
 await fs.writeFile(file,'broken');assert.equal((await store.load()).recovered,true);await store.save(envelope(3));assert.equal(await fs.readFile(file+'.previous','utf8'),envelope(1));
 assert.throws(()=>store.save('{"learners":["plaintext"]}'),/MANAGER_FORMAT/);
 await fs.writeFile(file,JSON.stringify({format:'zth-manager',version:2}));await assert.rejects(store.load(),/MANAGER_NEWER_VERSION/);await assert.rejects(store.save(envelope(4)),/MANAGER_NEWER_VERSION/);
 await fs.writeFile(file,'broken');await fs.writeFile(file+'.previous','broken');await assert.rejects(store.load(),/MANAGER_UNREADABLE/);await assert.rejects(store.save(envelope(4)),/MANAGER_UNREADABLE/);assert.equal(await fs.readFile(file,'utf8'),'broken');
 await fs.writeFile(path.join(root,'manager-storage-v11-results.json'),JSON.stringify({passed:true,checks:['separate encrypted file and fresh-process load','atomic save keeps previous','recovery keeps valid backup','reject plaintext','future version blocks writes','corrupt pair never overwritten']},null,2));console.log('PASS manager storage: six checks');
})().catch(e=>{console.error(e);process.exitCode=1;});
