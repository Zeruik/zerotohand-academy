'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const {load,root}=require('./harness-v10.cjs');
const checks=[],routes=['path','home','courses','lab','atlas','tools','projects','notes','sources'];let app;
function check(name,run){run();checks.push({name,passed:true});console.log('PASS '+name);}
(async()=>{
 app=await load();const {w,d}=app;
 const buttons=()=>[...d.querySelectorAll('.sidebar4 nav>button[data-go]')];
 function selected(route){const all=buttons(),visual=all.filter(button=>button.classList.contains('selected')),accessible=all.filter(button=>button.getAttribute('aria-current')==='page');assert.equal(all.length,9);assert.deepEqual(all.map(button=>button.dataset.go).sort(),routes.slice().sort());assert.equal(all.filter(button=>button.classList.contains('active')).length,0,'Legacy active classes must not survive');assert.deepEqual(visual.map(button=>button.dataset.go),route?[route]:[]);assert.deepEqual(accessible.map(button=>button.dataset.go),route?[route]:[]);for(const button of all)if(button.dataset.go!==route)assert.equal(button.hasAttribute('aria-current'),false,'Inactive buttons have no current-page attribute');}
 function footer(){const main=d.querySelector('.shell4>main'),all=d.querySelectorAll('.footer4');assert.equal(all.length,1);assert.equal(all[0].parentElement,main,'Footer belongs to the independently scrolling main content');}
 check('Both languages give exactly one selected/current sidebar destination on all nine routes',()=>{
  for(const lang of ['zh','en']){if(w.eval('UI4.lang')!==lang)d.querySelector('[data-client="language"]').click();for(const route of routes){d.querySelector(`.sidebar4 nav>button[data-go="${route}"]`).click();assert.equal(w.eval('UI4.view'),route);assert.equal(d.documentElement.lang,lang==='zh'?'zh-CN':'en');selected(route);footer();}}
 });
 check('Long-term learning never leaves the 02 Lessons item highlighted, including after language changes',()=>{
  d.querySelector('.sidebar4 [data-go="courses"]').click();d.querySelector('.sidebar4 [data-go="path"]').click();selected('path');const courses=d.querySelector('.sidebar4 [data-go="courses"]');assert.equal(courses.querySelector('i,span').textContent,'02');assert.equal(courses.classList.contains('selected'),false);d.querySelector('[data-client="language"]').click();selected('path');footer();
 });
 check('Lesson pages map to Lessons; Help has no unrelated selected sidebar destination',()=>{
  for(const lang of ['zh','en']){if(w.eval('UI4.lang')!==lang)d.querySelector('[data-client="language"]').click();w.nav4('lesson','pc-parts');selected('courses');footer();w.nav4('lesson','esp32-arduino-ota');selected('courses');footer();d.querySelector('.header-actions4 [data-go="help"]').click();assert.equal(w.eval('UI4.view'),'help');selected(null);footer();}
 });
 check('Return to top scrolls only main content and preserves the sidebar position',()=>{
  const main=d.querySelector('.shell4>main'),sidebar=d.querySelector('.sidebar4'),calls=[];let windowCalls=0;main.scrollTop=900;sidebar.scrollTop=137;d.body.scrollTop=41;w.scrollTo=()=>windowCalls++;main.scrollTo=function(options){calls.push({target:this,top:options.top,behavior:options.behavior});this.scrollTop=options.top;};
  d.querySelector('[data-companion10="top"]').click();assert.equal(main.scrollTop,0);assert.equal(sidebar.scrollTop,137);assert.equal(d.body.scrollTop,41);assert.equal(windowCalls,0);assert.equal(calls.length,1);assert.equal(calls[0].target,main);assert.equal(calls[0].top,0);assert.equal(calls[0].behavior,'smooth');
 });
 check('Return to top honors reduced motion and has a main-scrollTop fallback',()=>{
  const main=d.querySelector('.shell4>main'),sidebar=d.querySelector('.sidebar4');let behavior;w.matchMedia=query=>({matches:query.includes('prefers-reduced-motion')});main.scrollTop=730;main.scrollTo=function(options){behavior=options.behavior;this.scrollTop=options.top;};d.querySelector('[data-companion10="top"]').click();assert.equal(behavior,'auto');assert.equal(main.scrollTop,0);assert.equal(sidebar.scrollTop,137);main.scrollTop=420;main.scrollTo=undefined;d.querySelector('[data-companion10="top"]').click();assert.equal(main.scrollTop,0);assert.equal(sidebar.scrollTop,137);
 });
 check('The targeted navigation and shell behavior checks produce no uncaught DOM errors',()=>assert.deepEqual(app.errors,[]));
})().then(()=>finish()).catch(error=>finish(error));
function finish(error){app?.close();fs.mkdirSync(path.join(root,'dev-notes'),{recursive:true});fs.writeFileSync(path.join(root,'dev-notes/navigation-shell-v10-results.json'),JSON.stringify({passed:!error,htmlSha256:app?.htmlSha256,checks,error:error?.stack,scope:'Targeted generated-HTML DOM behavior: Chinese/English sidebar single selection, lesson/help mapping, footer ownership and main-only return-to-top, including reduced motion and fallback. CSS geometry and actual independent scrolling require separate real-browser verification.'},null,2));if(error){console.error(error);process.exitCode=1;}else console.log('ALL PASSED '+checks.length);}
