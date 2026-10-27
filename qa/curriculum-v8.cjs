'use strict';
// Content acceptance only. No browser, firmware, ROS or hardware is executed.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={};
const code='const BASE_COURSES='+read('src/base-courses.json')+';\n'+
 ['src/labs.js','src/content.js','src/learning-v4.js'].map(read).join('\n')+
 '\nconst originalIdsQA8=LESSONS.map(l=>l.id);\n'+read('src/curriculum-v8.js')+
 '\nthis.data={LESSONS,EN_LESSONS,DEEP_LESSONS,LESSON_GUIDE7,WORKED_EXAMPLES7,LESSON_REFERENCES7,CASE_TASKS8,CURRICULUM8,NEW_LESSON_IDS8,LESSON_ROUTE,originalIdsQA8};';
vm.runInNewContext(code,context,{timeout:10000,filename:'curriculum-content-bundle.js'});
const d=context.data,ids=d.LESSONS.map(l=>l.id),map=new Map(d.LESSONS.map(l=>[l.id,l]));
const pair=(v,label)=>{
 assert.ok(Array.isArray(v)&&v.length===2,label+' bilingual pair');
 assert.ok(v.every(t=>typeof t==='string'&&t.trim().length>0),label+' nonempty');
 assert.ok(!/[\u4e00-\u9fff]/.test(v[1]),label+' English contains CJK');
 assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v.join('')),label+' control character');
};
assert.equal(ids.length,93);assert.equal(new Set(ids).size,93);
assert.equal(d.originalIdsQA8.length,45);assert.equal(d.NEW_LESSON_IDS8.length,48);
assert.equal(new Set(d.NEW_LESSON_IDS8).size,48);
for(const id of d.originalIdsQA8)assert.ok(map.has(id),'preserved old ID '+id);
assert.equal(d.LESSON_ROUTE.length,12,'original electrical branch preserved');
let deepCount=0,zhChars=0,enWords=0;
for(const id of d.NEW_LESSON_IDS8){
 const l=map.get(id),deep=d.DEEP_LESSONS[id],guide=d.LESSON_GUIDE7[id],task=d.CASE_TASKS8[id];
 assert.ok(deep&&deep.length>=4,'deep minimum '+id);
 const unique=new Set();
 for(const [i,s] of deep.entries()){
  assert.equal(s.length,4,'section tuple '+id+'/'+i);pair([s[0],s[1]],id+' title');pair([s[2],s[3]],id+' text');
  assert.ok(s[2].length>=40&&s[3].length>=80,'substantive paragraph '+id+'/'+i);
  unique.add(s[2]);deepCount++;zhChars+=s[2].length;enWords+=s[3].split(/\s+/).length;
 }
 assert.equal(unique.size,deep.length,'no repeated paragraph '+id);
 for(const f of ['goal','practice','question','answer','labNote','misconception'])pair(guide[f],id+'/'+f);
 pair(d.WORKED_EXAMPLES7[id],id+' example');
 assert.equal(l.example,d.WORKED_EXAMPLES7[id][0]);assert.equal(d.EN_LESSONS[id].example,d.WORKED_EXAMPLES7[id][1]);
 for(const f of ['scenario','predict','explain','transfer'])pair(task[f],id+' task '+f);
 for(const f of ['steps','evidence','rubric']){assert.ok(task[f].length>0,id+' '+f);task[f].forEach((p,i)=>pair(p,id+' '+f+i));}
 assert.ok(task.steps.length>=3,id+' operations/explanation/transfer');
 assert.equal(task.reviewDays.join(','),'1,7,30',id+' review spacing');
 assert.ok(d.LESSON_REFERENCES7[id]?.length>0,id+' source reference');
 for(const ref of d.LESSON_REFERENCES7[id]){pair(ref.title,id+' ref');const url=new URL(ref.url);assert.equal(url.protocol,'https:');}
}
const visiting=new Set(),done=new Set();
function visit(id){assert.ok(map.has(id),'unknown prerequisite '+id);if(done.has(id))return;assert.ok(!visiting.has(id),'cycle '+id);visiting.add(id);for(const pre of map.get(id).prereq||[])visit(pre);visiting.delete(id);done.add(id);}
ids.forEach(visit);
const c=d.CURRICULUM8;assert.equal(c.schedule.length,96);assert.equal(c.weeks,96);
assert.equal(c.hoursPerWeek.join(','),'4,6');assert.equal(c.lessonOrder.length,93);assert.equal(new Set(c.lessonOrder).size,93);
const firstWeek=new Map(),covered=new Set();
for(const [i,w] of c.schedule.entries()){
 assert.equal(w.week,i+1,'continuous week numbering');assert.ok(['lesson','practice','review','project'].includes(w.kind));
 for(const f of ['title','task','pass'])pair(w[f],'week '+w.week+' '+f);
 assert.ok(w.lessonIds.length>0,'week lessons '+w.week);
 for(const id of [...w.lessonIds,...w.reviewLessonIds])assert.ok(map.has(id),'week '+w.week+' unknown lesson '+id);
 assert.ok(w.lessonIds.includes(w.primaryLessonId));
 assert.equal(w.authoredLesson,w.kind==='lesson','honest chapter flag '+w.week);
 assert.ok(w.evidence.length>0,'week evidence');w.evidence.forEach(p=>pair(p,'week evidence'));
 const stage=c.stages.find(s=>s.id===w.stage);assert.ok(stage&&w.week>=stage.weeks[0]&&w.week<=stage.weeks[1]);
 for(const id of w.lessonIds){covered.add(id);if(!firstWeek.has(id))firstWeek.set(id,w.week);}
}
for(const id of ids){
 assert.ok(covered.has(id),'lesson absent from plan '+id);
 for(const pre of map.get(id).prereq||[]){
  assert.ok(firstWeek.get(pre)<=firstWeek.get(id),'scheduled prerequisite later: '+id+' needs '+pre);
  assert.ok(c.lessonOrder.indexOf(pre)<c.lessonOrder.indexOf(id),'navigation prerequisite '+id+' -> '+pre);
 }
}
assert.equal(c.schedule.filter(w=>w.authoredLesson).length,48);
assert.equal(c.schedule.filter(w=>!w.authoredLesson).length,48);
assert.equal(covered.size,93);
const near=(name,a,b,t=0.01)=>assert.ok(Math.abs(a-b)<=t,name+' arithmetic');
near('LED mA',3/330*1000,9.09);near('resized LED',6/680*1000,8.82);
near('power input',2.5/.85,2.94);near('power loss',2.5/.85-2.5,.44);
near('vehicle weight',1.6*9.81,15.70);near('per motor hover',1.6*9.81/4,3.92);
near('thrust weight',24/(1.6*9.81),1.53);near('right angle',Math.PI/2,1.571,.001);
assert.equal((0xA5|1<<3)&~(1<<2),0xA9);assert.equal([1,2,3].reduce((a,b)=>a+b,0)/3,2);
const lessonText=d.NEW_LESSON_IDS8.map(id=>JSON.stringify({deep:d.DEEP_LESSONS[id],guide:d.LESSON_GUIDE7[id],task:d.CASE_TASKS8[id]})).join('\n');
assert.ok(!lessonText.includes('18关节')&&!lessonText.includes('18-joint'),'do not combine Go2 and UR5 DOFs');
assert.ok(d.DEEP_LESSONS['ros2-quadruped'][0][2].includes('12')&&d.DEEP_LESSONS['ros2-quadruped'][0][2].includes('6'));
console.log(JSON.stringify({status:'passed',totalLessons:ids.length,preservedLegacy:45,newLessons:48,newDeepSections:deepCount,newChineseDeepCharacters:zhChars,newEnglishDeepWords:enWords,weeks:96,authoredLessonWeeks:48,practiceReviewProjectWeeks:48,coveredLessons:covered.size,prerequisiteCycles:0,scheduledPrerequisiteViolations:0,modelLessonCount:d.NEW_LESSON_IDS8.filter(id=>d.LESSON_GUIDE7[id].labMode==='simulation').length,boundary:'Content structure, schedule and arithmetic only; not browser, compiler, ROS, flight or hardware execution.'},null,2));
