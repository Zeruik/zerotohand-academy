// Standalone v8 practice tests: pure teaching kernels plus DOM interactions.
// This does not run a real shell, compiler or browser/GPU.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/practice-v8.js'),'utf8');
const checks=[],reportPath=path.join(root,'dev-notes/practice-v8-results.json');
const context=vm.createContext({UI4:{lang:'en'},T:(_z,e)=>e});vm.runInContext(source,context);const p=context.PRACTICE8;
const json=x=>JSON.parse(JSON.stringify(x));
const check=(name,fn)=>{fn();checks.push({name,passed:true});console.log('PASS '+name);};
const commands=(s,lines)=>lines.forEach(line=>{const r=p.executeTerminal(s,line);assert.equal(r.ok,true,line+': '+r.text);});
const repaired={distance:'int distance = speed * seconds;\nprintf("%d\\n", distance);',integer:'int milliamps = (supply - led) * 1000 / resistance;\nprintf("%d\\n", milliamps);',branch:'int alarm = 0;\nif (temperature >= 60) { alarm = 1; } else { alarm = 0; }\nprintf("%d\\n", alarm);',loop:'int i = 1; int total = 0;\nwhile (i <= n) { total = total + i; i = i + 1; }\nprintf("%d\\n", total);'};

(async()=>{
 check('Both command dialects complete four scenario goals with quoted and relative paths',()=>{
  for(const mode of ['linux','cmd']){
   const location=mode==='cmd'?'cd':'pwd',list=mode==='cmd'?'dir':'ls',read=mode==='cmd'?'type':'cat',copy=mode==='cmd'?'copy':'cp';
   let s=p.createTerminal(mode);assert.equal(p.terminalPassed(s,'locate'),false);commands(s,[location,list,read+' readme.txt']);assert.equal(p.terminalPassed(s,'locate'),true);
   s=p.createTerminal(mode);commands(s,['mkdir "robot notes"','cd "robot notes"',location]);assert.equal(p.terminalPassed(s,'quoted'),true);
   s=p.createTerminal(mode);commands(s,['mkdir "robot notes"',copy+' "lesson data/sensor.txt" "robot notes/sensor-copy.txt"',read+' "robot notes/sensor-copy.txt"']);assert.equal(p.terminalPassed(s,'copy'),true);assert.ok(s.nodes.has('/practice/lesson data/sensor.txt'));
   s=p.createTerminal(mode);commands(s,['mkdir run1','cd run1','echo verified > result.txt',read+' result.txt','cd ..']);assert.equal(p.terminalPassed(s,'relative'),true);assert.equal(p.terminalPassed(s,'unknown'),false);
  }
 });
 check('Virtual root traversal, destructive commands, command chains and real disk paths are refused without mutation',()=>{
  for(const mode of ['linux','cmd'])for(const line of ['cd ..','cd /','cd /practice/../../private','cd C:\\Users\\other','rm readme.txt','del readme.txt','format C:','sudo ls','powershell','node anything.js','echo hello && rm readme.txt','echo hello | cat','cat < readme.txt','mkdir ../../../outside']){
   const s=p.createTerminal(mode),before=JSON.stringify([...s.nodes]);const r=p.executeTerminal(s,line);assert.equal(r.ok,false,line);assert.equal(s.cwd,'/practice');assert.equal(JSON.stringify([...s.nodes]),before,line);
  }
 });
 check('Command quoting errors, missing paths, file-vs-directory and dialect differences are explained',()=>{
  let s=p.createTerminal();for(const line of ['cd "robot notes','cd missing','cd readme.txt','mkdir a b','cp readme.txt readme.txt','cat "lesson data"','dir','LS','echo hello >','echo x > a > b','echo x >> readme.txt extra'])assert.equal(p.executeTerminal(s,line).ok,false,line);
  commands(s,['mkdir "Mixed Case"']);assert.equal(p.executeTerminal(s,'cd "mixed case"').ok,false);commands(s,['cd "Mixed Case"']);
  s=p.createTerminal('cmd');commands(s,['mkdir "Mixed Case"','cd "MIXED CASE"','cd C:\\practice','type "lesson data\\sensor.txt"']);assert.equal(p.executeTerminal(s,'pwd').ok,false);
 });
 check('Echo and file copy modify only the bounded in-memory tree and reject overwrites',()=>{
  const s=p.createTerminal();commands(s,['echo "a > b" > one.txt','echo tail >> one.txt','cp one.txt two.txt']);assert.equal(s.nodes.get('/practice/one.txt').text,'a > b\ntail\n');assert.equal(s.nodes.get('/practice/two.txt').text,s.nodes.get('/practice/one.txt').text);assert.equal(p.executeTerminal(s,'cp one.txt two.txt').ok,false);commands(s,['echo changed > two.txt']);assert.equal(s.nodes.get('/practice/one.txt').text,'a > b\ntail\n');assert.equal(p.createTerminal().nodes.has('/practice/one.txt'),false);
 });
 check('Each C starter exposes a failed case and each repaired program passes three distinct test inputs',()=>{
  for(const task of p.cTasks){assert.ok(task.cases.some(c=>{const r=p.runC(task.code,c.input);return !r.ok||r.output!==c.expected;}),task.id);for(const c of task.cases){const r=p.runC(repaired[task.id],c.input);assert.equal(r.ok,true,r.error);assert.equal(r.output,c.expected,task.id);assert.ok(r.trace.length>1);assert.equal(r.trace.at(-1).output,r.output);}}
 });
 check('C arithmetic uses precedence, truncation, signed remainder and short-circuit evaluation',()=>{
  for(const [expression,result] of [['2+3*4',14],['(2+3)*4',20],['-7/3',-2],['-7%3',-1],['0 && (1/0)',0],['1 || (1/0)',1],['!(3<2)',1]]){const r=p.runC('int result = '+expression+'; printf("%d", result);');assert.equal(r.ok,true,r.error);assert.equal(r.output,String(result));}
 });
 check('C scope, syntax, uninitialized variables, signed overflow and division by zero are rejected',()=>{
  for(const code of ['#include <stdio.h>','int main() { return 0; }','float a = 1;','int a[2];','int a = 1.2;','int a = 08;','int a;','x = 2;','int a = 1/0;','int a = 2147483647 + 1;','int a = 1; a++;','for (;;) {}','int a = 1; if (1) { int a = a; }','if (1) { int a = 2; } printf("%d", a);','printf("%s", 1);','printf("%d %d", 1);','printf("ok", 1);','int x = 1; if (x = 2) { x = 3; }','int x = 0; system("bad");']){const r=p.runC(code);assert.equal(r.ok,false,code);assert.ok(r.error.length>10,code);}
  const r=p.runC('int total = 0; int i = 0; while (i < 3) { int local = i; total = total + local; i = i + 1; } printf("%d", total);');assert.equal(r.ok,true,r.error);assert.equal(r.output,'3');assert.equal(r.variables.local,undefined);
 });
 check('An infinite C loop stops at the teaching step limit and does not continue running',()=>{
  const r=p.runC('int x = 0; while (1) { x = x + 1; }');assert.equal(r.ok,false);assert.equal(r.trace.length,400);assert.match(r.error,/400-step/);
 });
 check('Progress sanitization keeps only known tasks and bounded text, never virtual files or histories',()=>{
  const clean=p.sanitize({terminal:{completed:['locate','locate','bad'],drafts:{locate:{prediction:'x'.repeat(5000),explanation:'reason',mode:'hacked',history:['private'],files:{secret:1}},bad:{code:'secret'}}},c:{completed:['loop'],drafts:{loop:{code:'x'.repeat(9000),prediction:12,explanation:'fine'}}},secret:'no'});assert.deepEqual(json(clean.terminal.completed),['locate']);assert.equal(clean.terminal.drafts.locate.prediction.length,1200);assert.equal(clean.terminal.drafts.locate.mode,undefined);assert.equal(clean.terminal.drafts.locate.history,undefined);assert.equal(clean.terminal.drafts.bad,undefined);assert.equal(clean.c.drafts.loop.code.length,8000);assert.equal(clean.secret,undefined);
 });
 check('Lesson entries target the relevant exercise and Windows entries select CMD',()=>{
  assert.match(p.attachLesson('win-paths'),/data-practice8-task="quoted"/);assert.match(p.attachLesson('win-cmd'),/data-practice8-mode="cmd"/);assert.match(p.attachLesson('linux-files'),/data-practice8-mode="linux"/);assert.match(p.attachLesson('c-conditions'),/data-practice8-task="branch"/);assert.match(p.attachLesson('c-loops'),/data-practice8-task="loop"/);assert.equal(p.attachLesson('c-pointers'),'');
 });

 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><body><button id="entry" data-practice8="terminal">open</button><script>var UI4={lang:"en"};var saves=0;function T(z,e){return UI4.lang==="en"?e:z;}function save4(){saves++;}function nav4(v,id){window.lastLesson=id;}'+source.replace(/<\/script/gi,'<\\/script')+'</script>',{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};}});
 const w=dom.window,d=w.document,api=w.PRACTICE8;
 const input=(selector,value)=>{const el=d.querySelector(selector);assert.ok(el,selector);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));};
 const click=selector=>{const el=d.querySelector(selector);assert.ok(el,selector);el.focus();el.click();};
 const command=line=>{input('[name=command]',line);d.querySelector('[data-p8-command-form]').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};
 check('Dialog keyboard entry, prediction gating and a complete terminal task work through DOM controls',()=>{
  d.querySelector('#entry').focus();click('#entry');assert.ok(d.querySelector('dialog[open]'));assert.equal(d.activeElement.dataset.p8Prediction,'');command('pwd');assert.match(d.querySelector('[data-p8-notice]').textContent,/prediction/i);assert.equal(d.querySelectorAll('.practice8-command').length,0);
  input('[data-p8-prediction]','I expect /practice; reading will not change location.');commands(api.createTerminal(),['pwd']);command('pwd');command('ls');command('cat readme.txt');input('[data-p8-explanation]','Listing and reading retain the current directory.');click('[data-p8-check]');assert.ok(w.UI4.practice8.terminal.completed.includes('locate'));assert.match(d.querySelector('[data-p8-notice]').textContent,/Recorded/);assert.equal(d.activeElement.hasAttribute('data-p8-check'),true);
  click('[data-p8-close]');assert.equal(d.querySelector('dialog'),null);assert.equal(d.activeElement.id,'entry');
 });
 check('C DOM stepping, edited-code invalidation, tests and completion use the current source',()=>{
  api.open('c','loop');input('[data-p8-prediction]','The starter omits n; including n gives 6.');input('[data-p8-code]',repaired.loop);click('[data-p8-run]');assert.match(d.querySelector('.practice8-step').textContent,/Step 1/);click('[data-p8-step]');assert.match(d.querySelector('.practice8-step').textContent,/Step 2/);click('[data-p8-finish]');assert.equal(d.querySelector('.practice8-output').textContent,'6\n');
  input('[data-p8-code]',p.cTasks.find(t=>t.id==='loop').code);assert.equal(d.querySelector('.practice8-state-grid').hidden,true);assert.equal(d.querySelector('[data-p8-step]').disabled,true);click('[data-p8-tests]');assert.ok(d.querySelector('.practice8-tests .fail'));
  input('[data-p8-code]',repaired.loop);input('[data-p8-explanation]','Including n fixes the boundary; incrementing i terminates the loop.');click('[data-p8-check]');assert.equal(d.querySelectorAll('.practice8-tests .pass').length,3);assert.ok(w.UI4.practice8.c.completed.includes('loop'));assert.equal(w.UI4.practice8.c.drafts.loop.code,repaired.loop);click('[data-p8-starter]');assert.equal(d.querySelector('[data-p8-code]').value,p.cTasks.find(t=>t.id==='loop').code);assert.equal(d.querySelector('[data-p8-explanation]').value,'Including n fixes the boundary; incrementing i terminates the loop.');click('[data-p8-close]');
 });
 check('HTML is escaped, bilingual UI is complete, persisted state has no terminal history and dialogs close with Escape',()=>{
  api.open('terminal','locate');input('[data-p8-prediction]','<img src=x onerror=bad> prediction');command('echo "<img src=x>"');assert.equal(d.querySelector('.practice8 img'),null);assert.match(d.querySelector('[role=log]').textContent,/<img src=x>/);assert.equal(w.UI4.practice8.terminal.drafts.locate.history,undefined);assert.equal(w.UI4.practice8.terminal.drafts.locate.nodes,undefined);assert.ok(w.saves>0);
  for(const kind of ['terminal','c']){const wrapper=d.createElement('div');wrapper.innerHTML=api.render(kind);assert.equal(/[\u3400-\u9fff]/.test(wrapper.textContent),false,kind+' English leakage');}
  w.UI4.lang='zh';const wrapper=d.createElement('div');wrapper.innerHTML=api.render('c');assert.match(wrapper.textContent,/不是 C 编译器/);d.querySelector('dialog').dispatchEvent(new w.Event('cancel',{cancelable:true}));assert.equal(d.querySelector('dialog'),null);
 });
 check('Standalone practice DOM emits no unhandled runtime errors',()=>assert.deepEqual(errors,[]));dom.window.close();
 fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({passed:true,checks,scope:'Pure virtual command/C statement kernels and standalone JSDOM interaction. No real shell/compiler, GPU rendering or native installation was tested.'},null,2));console.log('ALL PASSED '+checks.length);
})().catch(e=>{fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({passed:false,checks,error:e.stack},null,2));console.error(e);process.exitCode=1;});
