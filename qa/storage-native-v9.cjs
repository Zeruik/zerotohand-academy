for (const stream of [process.stdout,process.stderr]) stream?.on('error',error=>{if(error.code!=='EPIPE')throw error;});
const {app,safeStorage}=require('electron');
const fs=require('fs/promises'),path=require('path'),assert=require('assert/strict');
const {createStore9}=require('../desktop/store.cjs');
app.whenReady().then(async()=>{
 const root=path.resolve(__dirname,'..'),dir=path.join(root,'dev-notes','native-store-v9-'+Date.now());
 assert.equal(safeStorage.isEncryptionAvailable(),true);
 const store=createStore9(dir,{encrypt:text=>safeStorage.encryptString(text),decrypt:bytes=>safeStorage.decryptString(bytes)});
 const id='native-learner-0001',profile={version:9,profile:{id,name:'QA native learner',birthday:'2000-02-29',gender:'unset',seconds:60},done:['c-values'],notes:{'c-values':'Private native note'},answers9:{drafts:{},attempts:[{lessonId:'c-values',questionId:'numeric',kind:'numeric',answer:'wrong',correct:false},{lessonId:'c-values',questionId:'numeric',kind:'numeric',answer:'6',correct:true}]},changes9:[],lang:'en',theme:'warm'};
 const data={format:'zth-local-store',version:9,producerVersion:'10.0.0',activeProfileId:id,settings:{autoSave:true,motion:'system'},profiles:{[id]:profile}};
 await store.save(data);assert.deepEqual((await store.load()).data,data);
 const file=path.join(dir,'learning-store.zthdb'),raw=await fs.readFile(file,'utf8');assert.ok(!raw.includes(profile.profile.name));assert.ok(!raw.includes('2000-02-29'));
 await store.save(data);const invalid=JSON.stringify({format:'zth-local-store',version:1,savedAt:new Date().toISOString(),ciphertext:safeStorage.encryptString('{}').toString('base64')});await fs.writeFile(file,invalid);const recovered=await store.load();assert.equal(recovered.recovered,true);assert.deepEqual(recovered.data,data);await fs.writeFile(file+'.previous',invalid);await assert.rejects(store.load(),/STORE_UNREADABLE/);await assert.rejects(store.save(data),/STORE_UNREADABLE/);assert.equal(await fs.readFile(file,'utf8'),invalid);assert.equal(await fs.readFile(file+'.previous','utf8'),invalid);
 await fs.writeFile(path.join(root,'dev-notes/storage-native-v9-results.json'),JSON.stringify({passed:true,electron:process.versions.electron,platform:process.platform,checks:['Windows safeStorage available','Encrypted actual v9 schema file written','Exact profile and attempt history round trip','No name or birthday plaintext in file','Decryptable schema corruption recovers valid previous file','Two invalid schemas cannot be loaded or overwritten']},null,2));
 console.log('PASS actual Electron safeStorage encrypted file round trip');app.exit(0);
}).catch(e=>{console.error(e);app.exit(1);});
