// Generated-document integration checks. GPU and native installation are reviewed separately.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),checks=[],errors=[];
(async()=>{
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const html=fs.readFileSync(path.join(root,'ZeroToHand-Engineering-Academy.html'),'utf8'),vc=new VirtualConsole();
 vc.on('jsdomError',e=>{if(e.type==='unhandled exception')errors.push(e.message);});
 const dom=new JSDOM(html,{url:'https://offline.test',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  Object.defineProperty(w,'crypto',{value:crypto.webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};
  w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLElement.prototype.getClientRects=function(){return[{}];};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.HTMLCanvasElement.prototype.getContext=function(kind){if(kind!=='2d')return null;return new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{if(k==='measureText')return{width:String(a[0]).length*10};},set:(o,k,v)=>(o[k]=v,true)});};
 }});
 const w=dom.window,d=w.document,plain=x=>JSON.parse(JSON.stringify(x));
 await w.ProfileStore9?.ready; await new Promise(resolve=>setTimeout(resolve,0));
 function check(name,fn){try{fn();checks.push({name,passed:true});console.log('PASS '+name);}catch(e){checks.push({name,passed:false,error:e.stack});console.error('FAIL '+name+': '+e.message);}}
 function click(s){const e=d.querySelector(s);assert.ok(e,'Missing '+s);e.click();}
 function input(s,value,type='input'){const e=d.querySelector(s);assert.ok(e);e.value=value;e.dispatchEvent(new w.Event(type,{bubbles:true}));}
 check('Original supplied wordmark is embedded unchanged behind a presentation alpha mask',()=>{
  const uri=d.querySelector('.brand4 img').src;assert.ok(uri.startsWith('data:image/svg+xml;base64,'));const svg=Buffer.from(uri.split(',')[1],'base64').toString();
  const jpg=Buffer.from(svg.match(/data:image\/jpeg;base64,([^"']+)/)[1],'base64');assert.ok(jpg.equals(fs.readFileSync(path.join(root,'assets/zerotohand-logo-original.jpg'))));assert.match(svg,/feColorMatrix/);assert.equal(d.querySelector('.brand4').textContent,'');
 });
 check('Novice entry, course counts and the 96-week route use the current curriculum',()=>{
  assert.equal(d.querySelector('.resume10 [data-lesson]').dataset.lesson,'pc-parts');assert.equal(d.querySelector('.resume10 progress').max,106);
  w.nav4('path');assert.equal(d.querySelectorAll('.week-grid8 article').length,96);input('[data-week8]','3.8','change');assert.equal(w.eval('UI4.path8.week'),3);
  const ids=new Set(w.eval('LESSONS.map(l=>l.id)'));for(const b of d.querySelectorAll('[data-lesson]'))assert.ok(ids.has(b.dataset.lesson));
 });
 check('Computer lessons use relevant practice and show primary references instead of an unrelated circuit',()=>{
  w.nav4('lesson','win-files');assert.ok(d.querySelector('.lesson-work7 .practice8-entry'));assert.equal(d.querySelector('.bench4'),null);assert.equal(d.querySelector('.lesson-quicklinks7 [data-lab]'),null);assert.ok(d.querySelector('.lesson-references8 a').href.startsWith('https://support.microsoft.com/'));
  w.nav4('lesson','c-arrays');assert.ok(d.querySelector('.lesson-work7 .concept-workbench7'));assert.equal(d.querySelector('.bench4'),null);assert.ok(d.querySelector('[data-case8=c-arrays]'));
 });
 check('Expanded workbenches exit using Escape, navigation and reset without leaving a scroll lock',()=>{
  w.nav4('lab','meter');click('[data-expand8]');assert.ok(d.body.classList.contains('has-expanded8'));assert.equal(d.querySelector('.bench4').getAttribute('aria-modal'),'true');
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.ok(!d.body.classList.contains('has-expanded8'));assert.equal(d.querySelector('.bench4').getAttribute('role'),null);
  click('[data-expand8]');w.nav4('lab','go2');assert.ok(!d.body.classList.contains('has-expanded8'));click('[data-expand8]');click('[data-sim=reset]');assert.ok(!d.querySelector('.expanded8'));assert.ok(!d.body.classList.contains('has-expanded8'));
 });
 check('Robot display, sliders, preset selection and paused manual editing agree',()=>{
  w.nav4('lab','go2');click('[data-motion-mode9=pose]');click('[data-robot-preset8=crouch]');let s=w.sim4('go2');assert.equal(s.preset,'crouch');assert.equal(s.run,false);
  const name='FL_thigh_joint',sl=d.querySelector(`[data-joint8=${name}]`);assert.ok(Math.abs(+sl.value-s.joints[name])<.00011);input(`[data-joint8=${name}]`,'1.0');assert.equal(s.selectedJoint,name);assert.equal(s.run,false);assert.equal(s.joints[name],1);assert.match(d.querySelector(`[data-joint-read8=${name}]`).textContent,/57\.3/);
  w.advance4('go2',s,.1);w.paint4('go2',s);assert.ok(Math.abs(+d.querySelector(`[data-joint8=${name}]`).value-s.joints[name])<.00011);
 });
 check('Case drafts survive language changes, and incomplete evidence cannot schedule a review',()=>{
  w.nav4('lesson','pc-parts');input('[data-case-field8=predict]','未保存的修改不会写进原文件。');click('[data-client=language]');assert.equal(d.querySelector('[data-case-field8=predict]').value,'未保存的修改不会写进原文件。');click('[data-case-save8]');assert.ok(!w.eval('UI4.cases8["pc-parts"].savedAt'));
  input('[data-case-field8=evidence]','保存文件并重新打开，看到原来的三行文字。');input('[data-case-field8=explain]','保存把编辑写入文件，关闭窗口本身并不等于保存。');for(const e of d.querySelectorAll('[data-case-check8]')){e.checked=true;e.dispatchEvent(new w.Event('change',{bubbles:true}));}click('[data-case-save8]');const r=w.eval('UI4.cases8["pc-parts"]');assert.ok(Date.parse(r.savedAt)>0);assert.ok(Math.abs((Date.parse(r.reviewAt)-Date.parse(r.savedAt))/86400000-1)<.01);assert.equal(r.reviewCount,0);
  const p=plain(w.record5());assert.equal(p.cases8['pc-parts'].predict,'未保存的修改不会写进原文件。');assert.equal(p.version,9);
 });
 check('Due reviews are linked on home and lesson pagination follows the complete learning order',()=>{
  w.eval('UI4.cases8["pc-parts"].reviewAt=new Date(Date.now()-1000).toISOString()');w.nav4('home');assert.equal(d.querySelector('.review-due8 [data-lesson]').dataset.lesson,'pc-parts');w.nav4('lesson','pc-parts');assert.equal(d.querySelector('.lesson-pagination7 [data-lesson]').dataset.lesson,w.eval('CURRICULUM8.lessonOrder[1]'));
 });
 check('Integrated help, references, learning route and new controls emit no runtime exceptions',()=>{for(const view of['help','sources','path','courses','lab'])w.nav4(view);assert.deepEqual(errors,[]);});
 dom.window.close();const failed=checks.filter(x=>!x.passed);fs.mkdirSync(path.join(root,'dev-notes'),{recursive:true});fs.writeFileSync(path.join(root,'dev-notes/interface-v8-results.json'),JSON.stringify({passed:!failed.length,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),checks,errors},null,2));if(failed.length)process.exitCode=1;console.log(`${checks.length-failed.length}/${checks.length} passed`);
})().catch(e=>{console.error(e);process.exitCode=1;});


