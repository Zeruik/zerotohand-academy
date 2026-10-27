// Profile lifecycle verification using the real profile functions and v8 record wrapper.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),checks=[],reportPath=path.join(root,'dev-notes/profiles-v8-results.json');
const profileSource=fs.readFileSync(path.join(root,'src/profiles-v5.js'),'utf8');
const practiceSource=fs.readFileSync(path.join(root,'src/practice-v8.js'),'utf8');
const experienceSource=fs.readFileSync(path.join(root,'src/experience-v8.js'),'utf8');
const extrasSource=experienceSource.slice(experienceSource.indexOf('const _safeRecord8='),experienceSource.indexOf('function caseMarkup8'));
assert.ok(extrasSource.includes('learningExtras8'),'The real v8 learning record wrapper must be present');
const startupSource=fs.readFileSync(path.join(root,'src/experience-v4.js'),'utf8').split(/\r?\n/).slice(0,3).join('\n');
const plain=x=>JSON.parse(JSON.stringify(x));
const makeRecord=(id,name,marker,week=3)=>({version:8,profile:{id,name,lastStudiedAt:'2026-10-27T00:00:00Z',lastLessonId:'c-values',seconds:100},done:['c-values'],notes:{'c-values':marker+' notes'},completedAt:{'c-values':'2026-10-27T00:00:00Z'},lang:'en',theme:'warm',cases8:{'c-values':{predict:marker+' prediction',evidence:marker+' evidence',explain:marker+' explanation',checks:[0,1],savedAt:'2026-10-27T00:00:00Z',reviewAt:'2026-10-30T00:00:00Z',reviewCount:1}},practice8:{version:1,terminal:{completed:['locate'],drafts:{locate:{prediction:marker+' terminal prediction',explanation:marker+' terminal reason',mode:'cmd'}}},c:{completed:['distance'],drafts:{distance:{prediction:marker+' C prediction',explanation:marker+' C reason',code:'int distance = speed * seconds;'}}}},path8:{week}});
const check=async(name,fn)=>{await fn();checks.push({name,passed:true});console.log('PASS '+name);};

(async()=>{
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const windows=[],allErrors=[];
 function load(storage){
  const vc=new VirtualConsole();vc.on('jsdomError',e=>allErrors.push(e.message));
  const bootstrap=`const LESSONS=[{id:'start',title:'Start'},{id:'c-values',title:'C values'},{id:'linux-files',title:'Linux files'}];\n${startupSource}\nfunction T(z,e){return UI4.lang==='en'?e:z;}function E(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}function title4(l){return l.title;}function save4(){localStorage.setItem('zth-client-v4',JSON.stringify(UI4));}function render4(){document.body.querySelector('.sidebar4').innerHTML='';document.body.querySelector('main').innerHTML='';}function nav4(v,id){UI4.view=v;UI4.id=id;}var notices=[];function notice4(text){notices.push(text);}`;
  const access=`window.profileTest={get:()=>JSON.parse(JSON.stringify(UI4)),index:()=>JSON.parse(JSON.stringify(PROFILES5)),set:raw=>Object.assign(UI4,raw),save:()=>save4(),record:()=>record5(),safe:raw=>safeRecord5(raw),extras:raw=>sanitizeLearningExtras5(raw),edit:()=>editProfile5(),review:raw=>reviewImport5(raw),apply:raw=>applyRecord5(raw),report:r=>reportHTML5(r),pack:(r,p)=>Archive5.pack(r,p),unpack:(r,p)=>Archive5.unpack(r,p)};`;
  const html='<!doctype html><body><aside class="sidebar4"></aside><div class="backup4"></div><main></main><span id="client-status"></span><script>'+[bootstrap,profileSource,practiceSource,extrasSource,access].join('\n').replace(/<\/script/gi,'<\\/script')+'</script>';
  const dom=new JSDOM(html,{url:'https://profile.local.test',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w,'crypto',{value:crypto.webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.setInterval=()=>0;w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};for(const [k,v]of Object.entries(storage))w.localStorage.setItem(k,v);}});windows.push(dom);assert.ok(dom.window.profileTest,allErrors.join('\n'));return dom;
 }
 const storageOf=dom=>Object.fromEntries(Array.from({length:dom.window.localStorage.length},(_,i)=>{const k=dom.window.localStorage.key(i);return[k,dom.window.localStorage.getItem(k)];}));
 const submit=async(dom,values={})=>{const form=dom.window.document.querySelector('.dialog5 form');assert.ok(form);for(const [name,value]of Object.entries(values)){const el=form.elements.namedItem(name);assert.ok(el,name);el.value=value;}form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));await new Promise(resolve=>setTimeout(resolve,0));};
 const a=makeRecord('learner-A-0001','Learner A','A',5),b=makeRecord('learner-B-0002','Learner B','B',17);
 let dom=load({'zth-client-v4':JSON.stringify(a),'zth-profiles-v5':JSON.stringify({broken:null,[a.profile.id]:a,[b.profile.id]:b})}),api=dom.window.profileTest;
 await check('Reload retains active and inactive v8 records before the late v8 UI wrapper; one malformed index entry does not discard other learners',()=>{
  assert.equal(api.get().cases8['c-values'].predict,'A prediction');assert.equal(api.get().practice8.terminal.drafts.locate.mode,'cmd');assert.equal(api.get().path8.week,5);assert.equal(api.index()[b.profile.id].cases8['c-values'].predict,'B prediction');assert.equal(api.index()[b.profile.id].practice8.c.drafts.distance.code,b.practice8.c.drafts.distance.code);assert.equal(api.index()[b.profile.id].path8.week,17);
 });
 await check('Actual learner-switch form restores B without renaming it or sharing A state',async()=>{
  api.edit();await submit(dom,{name:'Should not rename B',profile:b.profile.id});assert.equal(api.get().profile.name,'Learner B');assert.equal(api.get().cases8['c-values'].predict,'B prediction');assert.equal(api.get().path8.week,17);assert.equal(api.index()[a.profile.id].cases8['c-values'].predict,'A prediction');
  const edited=api.get();edited.cases8['c-values'].predict='B changed';edited.practice8.c.drafts.distance.code='int distance = seconds * speed;';edited.path8.week=20;api.set(edited);api.save();api.edit();await submit(dom,{profile:a.profile.id});assert.equal(api.get().cases8['c-values'].predict,'A prediction');assert.equal(api.get().path8.week,5);assert.equal(api.index()[b.profile.id].cases8['c-values'].predict,'B changed');assert.equal(api.index()[b.profile.id].path8.week,20);
 });
 let newId;
 await check('Creating a learner clears all course/case/practice/path data and closes a previous learner practice dialog',async()=>{
  dom.window.PRACTICE8.open('terminal');assert.ok(dom.window.document.querySelector('.practice8-dialog'));api.edit();await submit(dom,{name:'New learner',profile:'new'});const r=api.get();newId=r.profile.id;assert.notEqual(newId,a.profile.id);assert.equal(r.profile.name,'New learner');assert.deepEqual(plain(r.done),[]);assert.deepEqual(plain(r.notes),{});assert.deepEqual(plain(r.cases8),{});assert.deepEqual(plain(r.practice8),{version:1,terminal:{completed:[],drafts:{}},c:{completed:[],drafts:{}}});assert.equal(r.path8.week,1);assert.equal(dom.window.document.querySelector('.practice8-dialog'),null);assert.equal(api.index()[a.profile.id].cases8['c-values'].predict,'A prediction');
 });
 await check('Reload after creating a learner preserves its empty state and both previous learner records',()=>{
  dom=load(storageOf(dom));api=dom.window.profileTest;assert.equal(api.get().profile.id,newId);assert.deepEqual(plain(api.get().cases8),{});assert.equal(api.get().path8.week,1);assert.equal(api.index()[a.profile.id].cases8['c-values'].predict,'A prediction');assert.equal(api.index()[b.profile.id].cases8['c-values'].predict,'B changed');
 });
 await check('Legacy archive import replaces absent v8 fields with empty defaults instead of inheriting current learner data',async()=>{
  api.edit();await submit(dom,{profile:a.profile.id});const legacy={profile:{id:'legacy-user-0001',name:'Legacy'},done:[],notes:{},lang:'en',theme:'light'};api.review(legacy);await submit(dom);const r=api.get();assert.equal(r.profile.id,'legacy-user-0001');assert.deepEqual(plain(r.cases8),{});assert.deepEqual(plain(r.practice8.terminal.completed),[]);assert.equal(r.path8.week,1);assert.equal(api.index()[a.profile.id].cases8['c-values'].predict,'A prediction');
 });
 await check('Importing an existing learner ID announces an independent copy and cannot overwrite local records',async()=>{
  const original=plain(api.index()[a.profile.id]),incoming=makeRecord(a.profile.id,'Imported A','ARCHIVE',30);api.review(incoming);assert.match(dom.window.document.querySelector('.dialog5').textContent,/new ID|independent copy/);await submit(dom);const r=api.get();assert.notEqual(r.profile.id,a.profile.id);assert.equal(r.cases8['c-values'].predict,'ARCHIVE prediction');assert.equal(r.path8.week,30);assert.deepEqual(plain(api.index()[a.profile.id]),original);assert.equal(incoming.profile.id,a.profile.id);
  const importedId=r.profile.id;const mutation=api.get();mutation.cases8['c-values'].predict='changed copy';api.set(mutation);api.save();assert.equal(api.index()[a.profile.id].cases8['c-values'].predict,'A prediction');assert.equal(api.index()[importedId].cases8['c-values'].predict,'changed copy');
 });
 await check('Encrypted and checksummed archives preserve cases, practice drafts and selected week',async()=>{
  const record=api.record(),packed=await api.pack(record,'test-only-passphrase');assert.equal(packed.encrypted,true);const decoded=await api.unpack(packed,'test-only-passphrase');assert.deepEqual(plain(decoded),plain(record));const safe=api.safe(decoded);assert.deepEqual(plain(safe.practice8),plain(record.practice8));assert.deepEqual(plain(safe.cases8),plain(record.cases8));assert.equal(safe.path8.week,30);const before=api.get();await assert.rejects(()=>api.unpack(packed,'wrong-passphrase'));assert.deepEqual(plain(api.get()),plain(before));const clear=await api.pack(record,'');clear.payload.path8.week=90;await assert.rejects(()=>api.unpack(clear,''));
 });
 await check('Malformed records fail before altering active or saved learners',()=>{
  const active=plain(api.get()),index=plain(api.index());for(const bad of [null,[],{},'not a record'])assert.throws(()=>api.apply(bad));assert.deepEqual(plain(api.get()),active);assert.deepEqual(plain(api.index()),index);
 });
 await check('Printable report shows bounded task/practice counts while excluding all private learning text',async()=>{
  const r=makeRecord('report-user-0001','<script>unsafe</script>','PRIVATE_REPORT');
  r.notes['c-values']='PRIVATE_NOTES';r.cases8['c-values'].predict='PRIVATE_PREDICTION';r.cases8['c-values'].evidence='PRIVATE_EVIDENCE';r.cases8['c-values'].explain='PRIVATE_EXPLANATION';
  r.cases8['linux-files']={predict:'PRIVATE_UNSAVED',evidence:'PRIVATE_UNSAVED_EVIDENCE',explain:'reason',savedAt:null};
  r.cases8.start={evidence:' ',savedAt:'2026-10-27T00:00:00Z'};
  r.practice8.terminal.completed=['locate','copy','copy','unknown'];r.practice8.c.completed=['distance','integer','branch','loop','unknown'];r.practice8.c.drafts.distance.code='PRIVATE_CODE_DRAFT';
  api.set({lang:'en'});const html=await api.report(r),view=new JSDOM(html);assert.equal(view.window.document.querySelector('[data-report-evidence5]').dataset.reportEvidence5,'1');assert.equal(view.window.document.querySelector('[data-report-terminal5]').dataset.reportTerminal5,'2');assert.equal(view.window.document.querySelector('[data-report-c5]').dataset.reportC5,'4');
  for(const secret of ['PRIVATE_REPORT','PRIVATE_NOTES','PRIVATE_PREDICTION','PRIVATE_EVIDENCE','PRIVATE_EXPLANATION','PRIVATE_UNSAVED','PRIVATE_CODE_DRAFT'])assert.ok(!html.includes(secret),secret);
  assert.equal(view.window.document.querySelector('script'),null);assert.ok(html.includes('&lt;script&gt;unsafe&lt;/script&gt;'));assert.match(view.window.document.body.textContent,/Learner self-record/);assert.match(view.window.document.body.textContent,/Virtual exercise checks/);assert.match(view.window.document.body.textContent,/not a school-issued qualification/);view.window.close();
  const backup=await api.pack(api.safe(r),'report-test-password'),restored=await api.unpack(backup,'report-test-password');assert.equal(restored.cases8['c-values'].predict,'PRIVATE_PREDICTION');assert.equal(restored.cases8['c-values'].evidence,'PRIVATE_EVIDENCE');assert.equal(restored.cases8['c-values'].explain,'PRIVATE_EXPLANATION');assert.equal(restored.practice8.c.drafts.distance.code,'PRIVATE_CODE_DRAFT');assert.equal(restored.notes['c-values'],'PRIVATE_NOTES');
  api.set({lang:'zh'});const zh=await api.report(r);assert.match(zh,/学习者自我记录/);assert.match(zh,/虚拟练习判定/);assert.ok(!zh.includes('PRIVATE_CODE_DRAFT'));api.set({lang:'en'});
 });
 await check('The initial sanitizer and the late v8 wrapper agree on bounded allowlisted learning fields',()=>{
  const raw=makeRecord('sanitize-user-0001','Clean','TEST');raw.cases8.unknown={predict:'remove'};raw.cases8['c-values'].checks=[0,0,-1,50,1.2,2];raw.cases8['c-values'].reviewCount=2.9;raw.practice8.terminal.completed=['locate','locate','unknown'];raw.practice8.terminal.drafts.locate={prediction:'x'.repeat(9000),explanation:'reason',mode:'invalid',history:'private'};raw.practice8.c.drafts.distance.code='x'.repeat(9000);raw.practice8.c.drafts.unknown={code:'remove'};raw.path8.week=7.9;
  const canonical=api.extras(raw),wrapped=api.safe(raw);assert.deepEqual(plain({cases8:wrapped.cases8,practice8:wrapped.practice8,path8:wrapped.path8}),plain(canonical));assert.equal(wrapped.cases8.unknown,undefined);assert.deepEqual(plain(wrapped.cases8['c-values'].checks),[0,2]);assert.equal(wrapped.cases8['c-values'].reviewCount,2);assert.equal(wrapped.practice8.terminal.drafts.locate.prediction.length,1200);assert.equal(wrapped.practice8.terminal.drafts.locate.history,undefined);assert.equal(wrapped.practice8.c.drafts.distance.code.length,8000);assert.equal(wrapped.practice8.c.drafts.unknown,undefined);assert.equal(wrapped.path8.week,7);
 });
 await check('Local index reload does not silently drop learners after the former twentieth-entry cutoff',()=>{
  const many=Object.fromEntries(Array.from({length:25},(_,i)=>{const r=makeRecord('learner-many-'+String(i).padStart(4,'0'),'Learner '+i,'M'+i);return[r.profile.id,r];}));const w=load({'zth-client-v4':JSON.stringify(a),'zth-profiles-v5':JSON.stringify(many)});assert.equal(Object.keys(w.window.profileTest.index()).length,25);assert.equal(w.window.profileTest.index()['learner-many-0024'].cases8['c-values'].predict,'M24 prediction');
 });
 await check('Profile IDs cannot use prototype sentinel names and lifecycle DOM emits no uncaught errors',()=>{
  const raw=makeRecord('__proto__','Prototype','P');assert.notEqual(api.safe(raw).profile.id,'__proto__');assert.deepEqual(allErrors,[]);
 });
 windows.forEach(w=>w.window.close());fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({passed:true,checks,scope:'Real profile logic, current v8 record wrapper, localStorage reloads, actual dialog form submissions and archive crypto in JSDOM. No full-app browser or native-installation claim.'},null,2));console.log('ALL PASSED '+checks.length);
})().catch(e=>{fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({passed:false,checks,error:e.stack},null,2));console.error(e);process.exitCode=1;});
