'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {storagePath10}=require('../desktop/storage-path.cjs'),{createStore9}=require('../desktop/store.cjs');
// Structural path-isolation test only. Real encryption is covered by the native
// Windows protection suite; this codec intentionally does not test encryption.
const codec={encrypt:text=>Buffer.from(text),decrypt:bytes=>bytes.toString()};
const record=name=>({format:'zth-local-store',version:9,activeProfileId:'profile-isolation-001',settings:{autoSave:true,motion:'system'},profiles:{'profile-isolation-001':{version:9,profile:{id:'profile-isolation-001',name},done:[],notes:{start:name}}}});
(async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),'zth-storage-profile-'));try{
 const install=path.join(root,'Install'),production=path.join(root,'Existing archives'),legacy=path.join(root,'Legacy');for(const d of [install,production,legacy])await fs.mkdir(d);
 await createStore9(production,codec).save(record('PRODUCTION_SENTINEL'));await createStore9(legacy,codec).save(record('LEGACY_SENTINEL'));await fs.writeFile(path.join(install,'storage-location.json'),JSON.stringify({archivePath:production}));const original=await fs.readFile(path.join(production,'learning-store.zthdb'));
 const profileA=path.join(root,'Profile A'),profileB=path.join(root,'Profile B'),a=await storagePath10(install,legacy,codec,{profileDirectory:profileA});assert.equal(a.directory,path.join(profileA,'Archives'));assert.equal((await a.store.load()).data,null);assert.equal(a.migrated,false);await a.store.save(record('SYNTHETIC_PROFILE_A'));
 const b=await storagePath10(install,legacy,codec,{profileDirectory:profileB});assert.equal((await b.store.load()).data,null);const ordinary=await storagePath10(install,legacy,codec);assert.equal(ordinary.directory,production);assert.equal((await ordinary.store.load()).data.profiles['profile-isolation-001'].notes.start,'PRODUCTION_SENTINEL');assert.deepEqual(await fs.readFile(path.join(production,'learning-store.zthdb')),original);
 for(const bad of ['relative','',0])await assert.rejects(storagePath10(install,legacy,codec,{profileDirectory:bad}),/PROFILE/);await assert.rejects(storagePath10(install,legacy,codec,{profileDirectory:path.parse(root).root}),/PROFILE/);
 console.log('PASS explicit profiles ignore production archive pointers and legacy migration; normal startup preserves the production archive');
}finally{await fs.rm(root,{recursive:true,force:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
