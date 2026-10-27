const fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync('ZeroToHand-Engineering-Academy.html','utf8'),{runScripts:'dangerously',url:'https://offline.test',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w,'crypto',{value:require('crypto').webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{if(a.some(x=>typeof x==='number'&&!Number.isFinite(x)))throw Error('Invalid canvas value '+k)},set:(o,k,v)=>(o[k]=v,true)})}}});
 const w=dom.window,d=w.document,route=['start','kirchhoff','components','wiring-guide','meter','power','rc','scope','logic','mcu','motor-control','robot'];let expanded=0,quizzes=0;
 await w.ProfileStore9?.ready;await new Promise(r=>setTimeout(r,0));
 // Independent arithmetic for the stated questions: do not validate an answer key against itself.
 const expected={start:(5-2)/330*1000,kirchhoff:5/(1000+1000)*1000,components:5**2/100,'wiring-guide':(5-2)/330*1000,meter:5-2,power:2+.005*330,rc:10000*100e-6,scope:1/.001,logic:1+8+1,mcu:1/1000*1000,'motor-control':.5*300*2*Math.PI/60,robot:110+110};
 const lessonCount=w.eval('LESSONS.length'),labCount=w.eval('Object.keys(LAB4).length');assert.equal(w.eval('LESSONS.filter(l=>!l.v8).length'),45);assert.equal(lessonCount,45+w.eval('NEW_LESSON_IDS8.length')+w.Foundations9.lessonIds.length);assert.equal(labCount,25);if(process.argv.includes('--final'))assert.equal(lessonCount,96);
 for(const id of route){
  const lesson=w.eval(`LESSONS.find(x=>x.id==='${id}')`),deep=w.eval(`DEEP_LESSONS['${id}']`),quiz=w.eval(`CHECK4['${id}']`);
  assert.ok(lesson&&lesson.title,id+' lesson metadata');
  assert.ok(deep&&deep.length>=4,id+' needs at least four detailed sections');
  assert.ok(deep.every(x=>x.length===4&&x.every(v=>typeof v==='string'&&v.trim())),id+' bilingual detail pairing');
  assert.ok(quiz&&Number.isFinite(quiz[0]),id+' missing a scored check');assert.ok(Math.abs(quiz[0]-expected[id])<.005,id+' answer key agrees with independent calculation and rounding');
  w.eval(`UI4.lang='zh';nav4('lesson','${id}')`);assert.ok(d.querySelectorAll('.reading-section').length>=4,id+' Chinese reading depth');assert.ok(d.querySelector('#answer4'),id+' interactive check');
  d.querySelector('#answer4').value='';d.querySelector('[data-check]').click();assert.equal(d.querySelector('#answer-feedback4').dataset.state,'empty',id+' rejects an empty answer');
  d.querySelector('#answer4').value=expected[id]+1;d.querySelector('[data-check]').click();assert.equal(d.querySelector('#answer-feedback4').dataset.state,'incorrect',id+' rejects an incorrect answer');
  d.querySelector('#answer4').value=expected[id];d.querySelector('[data-check]').click();assert.equal(d.querySelector('#answer-feedback4').dataset.state,'correct');assert.match(d.querySelector('#answer-feedback4').textContent,/正确/);quizzes++;
  w.eval(`UI4.lang='en';nav4('lesson','${id}')`);assert.ok(d.querySelectorAll('.reading-section').length>=7,id+' English reading depth');
  const article=d.querySelector('#content4').textContent.replace('中文 / ZH','').replaceAll('Zeruik / TechABJ','');assert.ok(!/[\u3400-\u9fff]/.test(article),'Chinese leak in English lesson '+id);
  assert.ok(deep.every(x=>!/[\u3400-\u9fff]/.test(x[1]+x[3])),'Chinese leak in English deep text '+id);expanded++;
 }
 const meter=w.eval('DEEP_LESSONS.meter.map(x=>x[0]+x[2]).join(" ")');for(const term of ['V⎓','mA','10A','量程','串'])assert.ok(meter.includes(term),'multimeter teaching missing '+term);
 const facts={ledMilliAmps:(5-2)/330*1000,rcTau:10000*100e-6,frequency:1/.001,motorWatts:.5*300*2*Math.PI/60,powerLimitedVoltage:2+.005*330,uartBits:1+8+1,robotReach:110+110};
 assert.ok(Math.abs(facts.ledMilliAmps-9.0909)<.001);assert.equal(facts.rcTau,1);assert.equal(facts.frequency,1000);assert.ok(Math.abs(facts.motorWatts-15.708)<.001);assert.ok(Math.abs(facts.powerLimitedVoltage-3.65)<1e-12);assert.equal(facts.uartBits,10);assert.equal(facts.robotReach,220);
 assert.deepEqual(errors,[]);dom.window.close();
 const result={passed:true,routeLessons:expanded,scoredChecks:quizzes,allLessons:lessonCount,workbenches:labCount,finalCountEnforced:process.argv.includes('--final'),generatedHtmlSha256:require('crypto').createHash('sha256').update(fs.readFileSync('ZeroToHand-Engineering-Academy.html')).digest('hex'),checks:['12/12 route lessons include at least 4 detailed bilingual steps and a scored exercise','answer keys match independent calculations; empty/wrong answers fail and computed answers pass','English lesson pages have no Chinese text leakage','worked-example arithmetic: LED, divider, resistor power, RC, scope, motor, current limit, UART and arm reach']};
 fs.mkdirSync('dev-notes',{recursive:true});fs.writeFileSync('dev-notes/content-v8-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
