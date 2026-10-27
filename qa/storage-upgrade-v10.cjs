'use strict';
const assert=require('assert/strict'),fs=require('fs/promises'),path=require('path'),crypto=require('crypto');
const {createStore9}=require('../desktop/store.cjs');
const root=path.resolve(__dirname,'..'),checks=[];
const key=crypto.randomBytes(32);
const codec={encrypt(text){const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',key,iv),body=Buffer.concat([c.update(text,'utf8'),c.final()]);return Buffer.concat([iv,c.getAuthTag(),body]);},decrypt(bytes){const c=crypto.createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));c.setAuthTag(bytes.subarray(12,28));return Buffer.concat([c.update(bytes.subarray(28)),c.final()]).toString('utf8');}};
function fixture(revision=1){const id='upgrade-test-0001';return{format:'zth-local-store',version:9,activeProfileId:id,settings:{autoSave:true,motion:'system'},profiles:{[id]:{version:9,profile:{id,name:'Synthetic learner'},done:['c-values'],notes:{'c-values':'Synthetic note'},answers9:{drafts:{},attempts:[]},changes9:[]}},revision};}
function envelope(data,extra={}){return JSON.stringify({format:'zth-local-store',version:1,ciphertext:codec.encrypt(JSON.stringify(data)).toString('base64'),...extra});}
async function check(name,run){await run();checks.push({name,passed:true});console.log('PASS '+name);}
(async()=>{
 await fs.mkdir(path.join(root,'dev-notes'),{recursive:true});
 const base=await fs.mkdtemp(path.join(root,'dev-notes','storage-upgrade-v10-'));
 async function pair(name,current,previous){const dir=path.join(base,name);await fs.mkdir(dir);const file=path.join(dir,'learning-store.zthdb');if(current!==undefined)await fs.writeFile(file,current);if(previous!==undefined)await fs.writeFile(file+'.previous',previous);return{dir,file,store:createStore9(dir,codec)};}
 await check('Unmarked schema 9 remains readable and the next save adds a fixed producer without mutating input',async()=>{
  const raw=fixture(),old=envelope(raw),{file,store}=await pair('legacy',old);assert.deepEqual((await store.load()).data,raw);const before=JSON.stringify(raw);await store.save(raw);assert.equal(JSON.stringify(raw),before);const disk=JSON.parse(await fs.readFile(file,'utf8'));assert.equal(disk.producerVersion,'10.0.0');assert.deepEqual((await store.load()).data,{...raw,producerVersion:'10.0.0'});assert.equal(await fs.readFile(file+'.previous','utf8'),old);
 });
 const variants=[
  ['envelope-version',()=>envelope(fixture(),{version:2})],
  ['payload-version',()=>envelope({...fixture(),version:10})],
  ['record-version',()=>{const d=fixture();d.profiles[d.activeProfileId].version=10;return envelope(d);}],
  ['envelope-producer',()=>envelope(fixture(),{producerVersion:'10.0.1'})],
  ['payload-producer',()=>envelope({...fixture(),producerVersion:'10.1.0'})],
  ['record-producer',()=>{const d=fixture();d.profiles[d.activeProfileId].producerVersion='11.0.0';return envelope(d);}]
 ];
 for(const [name,future]of variants)for(const slot of ['current','previous'])await check('Future '+name+' in '+slot+' blocks both read and write; neither file changes',async()=>{
  const newer=future(),older=envelope(fixture()),current=slot==='current'?newer:older,previous=slot==='previous'?newer:older;
  const {file,store}=await pair(name+'-'+slot,current,previous);
  await assert.rejects(store.load(),/STORE_NEWER_VERSION/);await assert.rejects(store.save(fixture(2)),/STORE_NEWER_VERSION/);
  assert.equal(await fs.readFile(file,'utf8'),current);assert.equal(await fs.readFile(file+'.previous','utf8'),previous);assert.equal(await fs.stat(file+'.pending').then(()=>true,()=>false),false);
 });
 await check('A higher producer arriving after load is checked again before any write',async()=>{
  const {file,store}=await pair('late-future',envelope(fixture()));await store.load();const newer=envelope({...fixture(),producerVersion:'11.0.0'});await fs.writeFile(file,newer);await assert.rejects(store.save(fixture(3)),/STORE_NEWER_VERSION/);assert.equal(await fs.readFile(file,'utf8'),newer);
 });
 await check('Corruption still recovers the old valid copy; recovery never copies corruption over that backup',async()=>{
  const backup=envelope(fixture(4)),{file,store}=await pair('corrupt-current','broken',backup);const recovered=await store.load();assert.equal(recovered.recovered,true);assert.equal(recovered.data.revision,4);await store.save(fixture(5));assert.equal((await store.load()).data.revision,5);assert.equal(await fs.readFile(file+'.previous','utf8'),backup);
 });
 await check('Two corrupt files still block writing and retain exact bytes',async()=>{
  const {file,store}=await pair('both-corrupt','bad-current','bad-previous');await assert.rejects(store.load(),/STORE_UNREADABLE/);await assert.rejects(store.save(fixture()),/STORE_UNREADABLE/);assert.equal(await fs.readFile(file,'utf8'),'bad-current');assert.equal(await fs.readFile(file+'.previous','utf8'),'bad-previous');
 });
 await check('Incoming future data is rejected before rewriting the producer marker',async()=>{
  const {file,store}=await pair('incoming',envelope(fixture()));const before=await fs.readFile(file,'utf8');for(const value of [{...fixture(),version:10},{...fixture(),producerVersion:'10.0.1'}])assert.throws(()=>store.save(value),/STORE_NEWER_VERSION/);assert.equal(await fs.readFile(file,'utf8'),before);
 });
 await check('A valid older marker is accepted and concurrent saves preserve ordered snapshots',async()=>{
  const {file,store}=await pair('older-producer',envelope({...fixture(),producerVersion:'9.9.9'}));assert.equal((await store.load()).data.producerVersion,'9.9.9');await Promise.all([store.save(fixture(7)),store.save(fixture(8))]);assert.equal((await store.load()).data.revision,8);const previous=JSON.parse(codec.decrypt(Buffer.from(JSON.parse(await fs.readFile(file+'.previous','utf8')).ciphertext,'base64')));assert.equal(previous.revision,7);assert.equal(previous.producerVersion,'10.0.0');
 });
 await fs.writeFile(path.join(root,'dev-notes','storage-upgrade-v10-results.json'),JSON.stringify({passed:true,checks,scope:'Synthetic local files with authenticated encryption; legacy compatibility, downgrade refusal and corruption recovery. Not a cross-version installer or second-computer test.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
