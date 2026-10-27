'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const {load,plain,root}=require('./harness-v10.cjs');
const checks=[],windows=[];
async function check(name,fn){await fn();checks.push({name,passed:true});console.log('PASS '+name);}
(async()=>{
 const a=await load();windows.push(a);const p=a.w.ProfileStore9;await p.save();const record=plain(p.record()),snapshot=plain(p.snapshot());
 await check('Current records and encrypted portable archives retain their producer version',async()=>{assert.equal(snapshot.producerVersion,'10.0.0');assert.equal(record.producerVersion,'10.0.0');const packed=await p.archive.pack(record,'fictional-qa-password');assert.deepEqual(plain(await p.archive.unpack(packed,'fictional-qa-password')),record);});
 await check('Future versions and unknown course data reject import without truncating existing learners',async()=>{
  const bad=[{...record,version:10},{...record,producerVersion:'10.1.0'},{...record,done:['future-course']},{...record,notes:{'future-course':'keep this note'}},{...record,cases8:{'future-course':{predict:'keep'}}},{...record,answers9:{drafts:{'future-course':{q:{value:'keep'}}},attempts:[]}}];
  for(const r of bad){await assert.rejects(p.importRecord(r,'keep'),/STORE_NEWER_VERSION|STORE_CATALOG_UNSUPPORTED/);assert.deepEqual(plain(p.snapshot()),snapshot);}
 });
 await check('A newer browser store or unknown catalogue blocks automatic writes and keeps original bytes',async()=>{
  for(const raw of [{...snapshot,producerVersion:'11.0.0'},{...snapshot,version:10},{...snapshot,profiles:{...snapshot.profiles,[record.profile.id]:{...record,notes:{'future-course':'do not discard'}}}}]){
   const original=JSON.stringify(raw),b=await load({storage:{'zth-store-v9':original}});windows.push(b);assert.equal(b.w.ProfileStore9.getStatus().blocked,true);await assert.rejects(b.w.ProfileStore9.save(),/STORE_BLOCKED/);assert.equal(b.w.localStorage.getItem('zth-store-v9'),original);
  }
 });
 await check('Existing unmarked schema 9 records remain readable and upgrade without losing notes',async()=>{
  const old=plain(snapshot);delete old.producerVersion;for(const r of Object.values(old.profiles)){delete r.producerVersion;r.notes.start='legacy note';}
  const b=await load({storage:{'zth-store-v9':JSON.stringify(old)}});windows.push(b);assert.equal(b.w.ProfileStore9.getStatus().blocked,false);await b.w.ProfileStore9.save();assert.equal(b.w.ProfileStore9.record().notes.start,'legacy note');assert.equal(b.w.ProfileStore9.snapshot().producerVersion,'10.0.0');
 });
 assert.ok(windows.every(x=>x.errors.length===0));fs.writeFileSync(path.join(root,'dev-notes/archive-compatibility-v10-results.json'),JSON.stringify({passed:true,htmlSha256:a.htmlSha256,checks},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>windows.forEach(x=>x.close()));
