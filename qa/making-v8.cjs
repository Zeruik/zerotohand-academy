// In-memory source build + real DOM actions + production Three.js preview builders.
// It does not write the distributable HTML or claim GPU/physical-hardware verification.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),checks=[],errors=[],out=path.join(root,'dev-notes/making-v8-results.json');
const near=(a,b,e=1e-7)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=e,`${a} != ${b}`);
const plain=x=>JSON.parse(JSON.stringify(x));
(async()=>{
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const sources=['models.js','labs.js','advanced.js','content.js','stories.js','learning-v4.js','curriculum-v8.js','experience-v4.js','devices-v5.js','meter-v6.js','profiles-v5.js','experience-v7.js','practice-v8.js','experience-v8.js'];
 const read=f=>fs.readFileSync(path.join(root,f),'utf8');
 let bundle=require('./desktop-runtime/node_modules/esbuild').buildSync({entryPoints:[path.join(root,'src/scene3d-v6.js')],nodePaths:[path.join(root,'qa/desktop-runtime/node_modules')],bundle:true,write:false,format:'iife',target:'es2020',legalComments:'inline'}).outputFiles[0].text;
 // Test-only exposure installs the unchanged production event handler despite the deliberately unavailable GPU.
 assert.ok(bundle.includes('window.SCENE3D6 = {'));bundle=bundle.replace('window.SCENE3D6 = {','window.__installPointerTest8 = (stage,canvas) => { active=stage; installCanvasEvents(canvas); }; window.SCENE3D6 = {');
 const script='"use strict";const BRAND_LOGO8="";const BASE_COURSES='+read('src/base-courses.json')+';\n'+sources.map(f=>read('src/'+f)).join('\n')+'\n'+bundle+'\n'+read('src/init-v5.js');
 const html=read('src/template.html').replace('/*__CSS__*/','').replace('/*__SCRIPT__*/',()=>script.replace(/<\/script/gi,'<\\/script'));
 const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type==='unhandled exception')errors.push(e.message);});
 const dom=new JSDOM(html,{url:'https://offline.test',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};
  Object.defineProperty(w,'crypto',{value:crypto.webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  w.HTMLCanvasElement.prototype.getContext=function(kind){if(kind!=='2d')return null;return new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{if(a.some(x=>typeof x==='number'&&!Number.isFinite(x)))throw Error('Non-finite canvas '+k);if(k==='measureText')return{width:String(a[0]).length*10};},set:(o,k,v)=>(o[k]=v,true)});};
  w.HTMLCanvasElement.prototype.setPointerCapture=()=>{};w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:900,height:460});
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 }});
 const w=dom.window,d=w.document,THREE=w.SCENE3D6?.THREE;
 await w.ProfileStore9?.ready;await new Promise(resolve=>setTimeout(resolve,0));
 const check=(name,fn)=>{try{fn();checks.push({name,passed:true});console.log('PASS '+name);}catch(e){checks.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.message);}};
 const fresh=id=>{w.eval(`delete SIM4[${JSON.stringify(id)}]`);w.nav4('lab',id);return w.sim4(id);};
 const click=selector=>{const el=d.querySelector(selector);assert.ok(el,'Control exists '+selector);el.click();assert.equal(errors.length,0,errors.join('\n'));};
 const choose=(point,value)=>{const el=d.querySelector(`[data-wire-point8=${point}]`);assert.ok(el);el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));};
 const preview=(id,s)=>w.SCENE3D6.createPreview(id,s),stages={};
 const assemble=()=>{const s=fresh('drone');for(const id of ['esc','fc','motors','receiver','gnss','battery'])click(`[data-drone-part8=${id}]`);click('[data-drone8=orientation]');return s;};
 const allMotors=s=>{click('[data-drone8=power]');assert.equal(s.on,true);for(let i=0;i<4;i++){click(`[data-drone-motor8="${i}"]`);w.advance4('drone',s,1.01);}assert.deepEqual(plain(s.motorTested).sort(),[0,1,2,3]);};

 check('Three new workbenches construct through the real production createPreview and label API',()=>{
  assert.ok(THREE);for(const id of ['breadboard','perfboard','drone']){const s=fresh(id),st=stages[id]=preview(id,s);assert.ok(st.camera.isPerspectiveCamera);st.update(s);let count=0;st.scene.traverse(o=>{if(o.isMesh)count++;const a=o.geometry?.attributes.position?.array;if(a)for(const n of a)assert.ok(Number.isFinite(n));});assert.ok(count>40);assert.ok(d.querySelector('#measure4').textContent.trim());assert.equal(errors.length,0,errors.join('\n'));}
 });
 check('Breadboard five-hole groups, center gap and both rail breaks have the correct topology',()=>{
  const s=fresh('breadboard'),net=(a,b)=>w.WIRING8.connected(s,a).has(b);assert.equal(w.WIRING8.nodes().length,120);
  assert.equal(net('A1','E1'),true);assert.equal(net('F1','J1'),true);for(const [a,b]of [['E1','F1'],['A1','A2'],['P5','P6'],['N5','N6'],['P1','N1'],['P1','A1']])assert.equal(net(a,b),false,`${a}/${b}`);
  for(const p of ['P','N']){assert.equal(net(p+'1',p+'5'),true);assert.equal(net(p+'6',p+'10'),true);}assert.deepEqual([...w.WIRING8.connected(s,'A1')].sort(),['A1','B1','C1','D1','E1']);
 });
 check('Actual wire controls merge nets transitively, reject duplicate/self wires and undo one operation',()=>{
  const s=fresh('breadboard');choose('holeA','E1');choose('holeB','F1');click('[data-wire8=connect]');assert.equal(w.WIRING8.connected(s,'A1').has('J1'),true);click('[data-wire8=connect]');assert.equal(s.wires.length,1);
  choose('holeA','P5');choose('holeB','P6');click('[data-wire8=connect]');choose('holeA','P1');choose('holeB','A1');click('[data-wire8=connect]');assert.equal(w.WIRING8.connected(s,'P10').size,20);assert.equal(w.WIRING8.connected(s,'P10').has('N1'),false);
  click('[data-wire8=undo]');assert.equal(w.WIRING8.connected(s,'P10').has('A1'),false);assert.equal(w.WIRING8.connected(s,'P10').size,10);choose('holeA','A1');choose('holeB','A1');const n=s.wires.length;click('[data-wire8=connect]');assert.equal(s.wires.length,n);
 });
 check('Perfboard pads start isolated and only explicit jumpers create transitive connections',()=>{
  const s=fresh('perfboard');assert.equal(w.WIRING8.nodes(true).length,100);for(const node of w.WIRING8.nodes(true))assert.deepEqual([...w.WIRING8.connected(s,node)],[node]);
  choose('holeA','A1');choose('holeB','B1');click('[data-wire8=connect]');choose('holeA','B1');choose('holeB','J10');click('[data-wire8=connect]');assert.deepEqual([...w.WIRING8.connected(s,'A1')].sort(),['A1','B1','J10']);assert.equal(w.WIRING8.connected(s,'A1').has('E1'),false);click('[data-wire8=undo]');assert.equal(w.WIRING8.connected(s,'A1').has('J10'),false);
 });
 check('Every visible hole matches an electrical node; highlights, x-ray strips and wires follow state',()=>{
  for(const id of ['breadboard','perfboard']){const s=fresh(id),st=preview(id,s);assert.deepEqual(Object.keys(st.refs.holes8).sort(),[...w.WIRING8.nodes(id==='perfboard')].sort());for(const [key,g]of Object.entries(st.refs.holes8))assert.equal(g.userData.hole8,key);
   const opaqueVersion=st.refs.base8.material.version;s.holeA='A1';s.holeB='J10';s.xray=true;s.wires=[['A1','B2']];st.update(s);assert.equal(st.refs.base8.material.opacity,.25);assert.ok(st.refs.base8.material.version>opaqueVersion,'Transparency must invalidate the opaque GPU program');const transparentVersion=st.refs.base8.material.version;st.update(s);assert.equal(st.refs.base8.material.version,transparentVersion,'Repeated redraw must not rebuild shaders');assert.ok(st.refs.strips8.every(x=>x.visible));assert.ok(st.refs.wires8.children.length>0);const net=w.WIRING8.connected(s,s.holeA);for(const [key,g]of Object.entries(st.refs.holes8))assert.equal(g.userData.halo8.visible,net.has(key)||key===s.holeB);
   s.wires=[];s.xray=false;st.update(s);assert.equal(st.refs.wires8.children.length,0);assert.equal(st.refs.base8.material.opacity,1);assert.ok(st.refs.strips8.every(x=>!x.visible));
  }
 });
 check('Drone power and motor gates reject incomplete assembly, unknown orientation and fitted props',()=>{
  let s=fresh('drone');click('[data-drone8=power]');assert.equal(s.on,false);click('[data-drone-motor8="0"]');assert.equal(s.activeMotor,-1);
  s=assemble();click('[data-drone-motor8="0"]');assert.equal(s.activeMotor,-1,'Assembly does not silently supply power');click('[data-drone8=power]');assert.equal(s.on,true);click('[data-drone-motor8="0"]');assert.equal(s.activeMotor,0);click('[data-drone8=props]');assert.equal(s.props,true);assert.equal(s.activeMotor,-1);assert.equal(s.on,false);click('[data-drone8=power]');assert.equal(s.on,false);click('[data-drone-motor8="1"]');assert.equal(s.activeMotor,-1);
 });
 check('Each motor requires elapsed time, rotates alone in its stated direction and stops on power removal',()=>{
  const s=assemble();click('[data-drone8=power]');for(let i=0;i<4;i++){const before=plain(s.motorAngles);click(`[data-drone-motor8="${i}"]`);w.advance4('drone',s,.4);assert.equal(s.motorTested.includes(i),false);w.advance4('drone',s,.61);assert.equal(s.motorTested.includes(i),true);for(let j=0;j<4;j++)near(s.motorAngles[j]-before[j],j===i?(i%2?-1:1)*1.01*12:0);}
  click('[data-drone8=power]');assert.equal(s.on,false);const before=plain(s.motorAngles);w.advance4('drone',s,1);assert.deepEqual(plain(s.motorAngles),before);assert.equal(s.activeMotor,-1);
 });
 check('Link-loss evidence requires a running motor and all four completed tests, then cuts simulated power',()=>{
  let s=assemble();allMotors(s);click('[data-drone8=stop]');click('[data-drone8=loss]');assert.equal(s.failsafe,false,'Already stopped motors do not prove link-loss stopping');assert.equal(s.on,false);
  s=assemble();allMotors(s);assert.ok(s.activeMotor>=0);click('[data-drone8=loss]');assert.equal(s.failsafe,true);assert.equal(s.linkLost,true);assert.equal(s.on,false);assert.equal(s.activeMotor,-1);const before=plain(s.motorAngles);w.advance4('drone',s,.5);assert.deepEqual(plain(s.motorAngles),before);
  click('[data-drone8=power]');click('[data-drone-motor8="0"]');assert.equal(s.failsafe,false,'New motor check invalidates the previous link-loss result');
 });
 check('Assembly, controller orientation and propeller changes always cut simulated power and reset evidence',()=>{
  for(const selector of ['[data-drone-part8=receiver]','[data-drone8=orientation]','[data-drone8=props]']){const s=assemble();allMotors(s);s.failsafe=true;click(selector);assert.equal(s.on,false);assert.equal(s.activeMotor,-1);assert.equal(s.failsafe,false);const before=plain(s.motorAngles);w.advance4('drone',s,.5);assert.deepEqual(plain(s.motorAngles),before);}
 });
 check('Drone rendered parts, propellers, power display, attitude axes and pause read the same state',()=>{
  const s=assemble(),st=preview('drone',s);st.update(s);assert.ok(Object.values(st.refs.parts8).every(x=>x.visible));assert.ok(st.refs.props8.every(x=>!x.visible));assert.match(st.refs.status8.text,/SIMULATED POWER OFF/);
  s.on=true;s.activeMotor=2;s.motorAngles=[.1,.2,.3,.4];s.p.roll=30;s.p.pitch=20;s.p.yaw=10;const before=JSON.stringify(s);for(let i=0;i<20;i++)st.update(s);assert.equal(JSON.stringify(s),before);s.motorAngles.forEach((a,i)=>near(st.refs.rotors8[i].rotation.y,a));near(st.refs.assembly8.rotation.x,20*Math.PI/180);near(st.refs.assembly8.rotation.y,10*Math.PI/180);near(st.refs.assembly8.rotation.z,-30*Math.PI/180);assert.match(st.refs.status8.text,/SIMULATED POWER ON/);
  s.on=false;s.activeMotor=-1;s.props=true;s.assembled=s.assembled.filter(x=>x!=='receiver');st.update(s);assert.equal(st.refs.parts8.receiver.visible,false);assert.ok(st.refs.props8.every(x=>x.visible));assert.match(st.refs.status8.text,/TEST LOCKED.*SIMULATED POWER OFF/);
 });
 check('Real raycast pointer events select robot joint markers, reveal axes and focus the matching slider',()=>{
  for(const id of ['go2','ur5']){const s=fresh(id),st=w.SCENE3D6.active,canvas=d.querySelector('.bench4 canvas');s.showSkeleton=true;s.showAxes=false;st.update(s);st.scene.updateMatrixWorld(true);st.camera.updateMatrixWorld(true);w.__installPointerTest8(st,canvas);let found=null;const ray=new THREE.Raycaster();
   for(const [name,marker]of Object.entries(st.refs.markers8)){if(name===s.selectedJoint)continue;const ndc=marker.getWorldPosition(new THREE.Vector3()).project(st.camera);if(Math.abs(ndc.x)>1||Math.abs(ndc.y)>1||ndc.z>1)continue;ray.setFromCamera(new THREE.Vector2(ndc.x,ndc.y),st.camera);const hits=ray.intersectObjects(Object.values(st.refs.markers8).filter(x=>x.visible),false);if(hits[0]?.object===marker){found={name,ndc};break;}}
   assert.ok(found,'A distinct visible joint marker can be selected');const before=plain(s.joints);canvas.dispatchEvent(new w.MouseEvent('pointerdown',{bubbles:true,cancelable:true,clientX:(found.ndc.x+1)*450,clientY:(1-found.ndc.y)*230}));assert.equal(s.selectedJoint,found.name);assert.equal(s.showAxes,true);assert.equal(st.refs.axes8[found.name].visible,true);assert.deepEqual(plain(s.joints),before,'Selecting a joint does not rotate it');const input=d.querySelector(`[data-joint8="${found.name}"]`);assert.equal(d.activeElement,input);assert.equal(input.closest('label').getAttribute('aria-current'),'true');assert.ok(input.closest('label').style.outline);assert.equal(errors.length,0,errors.join('\n'));
  }
 });
 const report={passed:checks.every(x=>x.passed)&&errors.length===0,checks,errors,sourceHashes:Object.fromEntries(['src/experience-v8.js','src/making-scenes-v8.js','src/scene3d-v6.js'].map(f=>[f,crypto.createHash('sha256').update(read(f)).digest('hex')])),scope:'In-memory current source build. Actual DOM controls and production scene3d-v6 createPreview with real Three.js objects. Canvas/GPU are stubbed: no visual rendering or physical hardware certification.'};
 fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2));dom.window.close();if(!report.passed)process.exitCode=1;console.log(`${checks.filter(x=>x.passed).length}/${checks.length} PASSED`);
})().catch(e=>{fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify({passed:false,checks,error:e.stack},null,2));console.error(e);process.exitCode=1;});
