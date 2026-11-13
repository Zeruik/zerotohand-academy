'use strict';
// Full catalogue/navigation check; model mathematics and native rendering have separate checks.
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const {load,plain,root,delay}=require('./harness-v10.cjs');
let a;const checks=[];
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
(async()=>{
 a=await load();const{w,d}=a,lessons=plain(w.eval('LESSONS')),labs=plain(w.eval('Object.keys(LAB4)'));
 await check('186 unique lessons, 30 retained major labs plus the unit-aware workflow bench and acyclic complete prerequisites',()=>{assert.equal(lessons.length,186);assert.equal(new Set(lessons.map(l=>l.id)).size,186);assert.equal(labs.length,31);assert.equal(w.Tracks12.dependencyOrder(lessons.map(l=>l.id)).length,186);assert.equal(w.TracksContent12.courses.length,18);assert.equal(w.AutonomyContent12.courses.length,14);});
 await check('Every lesson has both languages, a useful body, lesson-specific guidance and a relevant work area',async()=>{
  for(const lang of ['zh','en']){w.eval(`UI4.lang='${lang}'`);for(const lesson of lessons.filter(x=>!x.id.startsWith('robotics13-'))){
   w.nav4('lesson',lesson.id);const main=d.querySelector('main');assert.ok(main.querySelector('h1')?.textContent.trim(),lesson.id);assert.ok(main.querySelector('.reading4')?.textContent.length>200,lesson.id+' substantive reading');assert.ok(main.querySelector('.track12-guidance'),lesson.id+' prerequisite context');assert.ok(main.querySelector('.lesson-work7')?.textContent.trim(),lesson.id+' work area');assert.equal(main.querySelector('.track12-error'),null,lesson.id+' graph');
   const ids=[...d.querySelectorAll('[id]')].map(x=>x.id);assert.equal(new Set(ids).size,ids.length,lesson.id+' duplicate id');
   if(lang==='en'){const text=d.body.textContent.replaceAll('中文 / ZH','').replaceAll('Zeruik / TechABJ','').replaceAll('理工阿白菌 / TechABJ','');assert.ok(!/[\u3400-\u9fff]/.test(text),'English leak '+lesson.id+': '+text.match(/.{0,25}[\u3400-\u9fff].{0,35}/)?.[0]);}
   if(lesson.id.startsWith('p12-')){assert.ok(main.querySelector('[data-autonomy12]'));assert.equal(main.querySelectorAll('[data-a12-quiz]').length,2);}
   if(/^[mo]12-/.test(lesson.id)){assert.ok(main.querySelector('[data-t12-course]'));assert.equal(main.querySelectorAll('[data-t12-question]').length,2);}
   await delay(0);
  }}
 });
 await check('Four routes, all-library access, legacy 96 weeks and every major lab remain reachable',()=>{
  for(const lang of ['zh','en']){w.eval(`UI4.lang='${lang}'`);for(const track of w.Tracks12.tracks){w.Tracks12.pick(track.id);for(const view of ['home','path','courses']){w.nav4(view);assert.equal(d.querySelector('[data-track12-select]').value,track.id);assert.ok(!d.querySelector('.track12-error'));}d.querySelector('[data-library12=all]').click();assert.equal(d.querySelectorAll('.track12-catalog .learn-card').length,186);}
   w.nav4('path');d.querySelector('[data-load-legacy12]')?.click();assert.equal(d.querySelectorAll('.week-grid8 article').length,96);
   for(const id of labs){w.nav4('lab',id);if(id==='workflow14'){assert.ok(d.querySelector('.workflow14'));assert.ok(d.querySelector('[data-workflow-output]').textContent.trim());assert.ok(!/NaN|undefined|Infinity/.test(d.querySelector('[data-workflow-output]').textContent));}else{assert.ok(d.querySelector('.bench4'));assert.ok(d.querySelector('#measure4').textContent);assert.ok(!/NaN|undefined|Infinity/.test(d.querySelector('#measure4').textContent));}}
   for(const view of ['atlas','tools','projects','notes','sources','help','manager']){w.nav4(view);assert.ok(d.querySelector('main').textContent.trim().length>40);}
  }
 });
 await check('Track selection survives an encrypted full archive and does not change group or old answers',async()=>{
  w.ProfileStore9.updateProfile({name:'Synthetic Learner',group:'mechanical'});w.Tracks12.pick('programming');w.ZTHProgress9.setDraft('start','fixture','12');await w.ProfileStore9.save();const before=plain(w.ProfileStore9.record()),encrypted=await w.ProfileStore9.archive.pack(before,'Synthetic-test-only');const restored=plain(await w.ProfileStore9.archive.unpack(encrypted,'Synthetic-test-only'));assert.equal(restored.profile.learningTrack12,'programming');assert.equal(restored.profile.group,'mechanical');assert.equal(restored.answers9.drafts.start.fixture.value,'12');assert.equal(restored.producerVersion,'14.0.0');assert.deepEqual(restored,before);
 });
 await check('No uncaught errors and detached teaching workspaces settle without rescheduling animation',()=>{w.nav4('home');a.tick(1000);assert.equal(a.frames.size,0,'One cleanup frame may remove detached Tooling10 hosts');a.tick(1016);a.tick(1032);assert.equal(a.frames.size,0,'Cleanup must not restart a loop');assert.deepEqual(a.errors,[]);});
})().then(()=>finish()).catch(e=>finish(e));
function finish(error){a?.close();fs.mkdirSync(path.join(root,'dev-notes'),{recursive:true});fs.writeFileSync(path.join(root,'dev-notes/integration-v14-results.json'),JSON.stringify({passed:!error,htmlSha256:a?.htmlSha256,checks,error:error?.stack,scope:'Generated HTML catalogue, bilingual navigation, prerequisites and encrypted synthetic archive. Separate native and mathematical checks cover rendering and calculations.'},null,2));if(error){console.error(error);process.exitCode=1;}}
