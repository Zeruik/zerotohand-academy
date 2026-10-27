// Full generated-document numerical and DOM regression. This does not claim GPU/visual acceptance.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),reportPath=path.join(root,'dev-notes/quality-v8-results.json');
const checks=[],errors=[];
const near=(actual,expected,tolerance=1e-6,message='')=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,`${message}: ${actual} != ${expected}`);
const plain=value=>JSON.parse(JSON.stringify(value));

(async()=>{
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const html=fs.readFileSync(path.join(root,'ZeroToHand-Engineering-Academy.html'),'utf8');
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://offline.test',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  Object.defineProperty(w,'crypto',{value:crypto.webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};
  w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.HTMLCanvasElement.prototype.setPointerCapture=()=>{};
  w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:900,height:460});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>{
   if(a.some(x=>typeof x==='number'&&!Number.isFinite(x)))throw Error('Non-finite canvas argument '+k);
   if(k==='measureText')return {width:String(a[0]).length*10};
  },set:(o,k,v)=>(o[k]=v,true)});};
 }});
 const w=dom.window,d=w.document,THREE=w.SCENE3D6?.THREE;
 await w.ProfileStore9?.ready; await new Promise(resolve=>setTimeout(resolve,0));
 function check(name,fn){try{fn();checks.push({name,passed:true});console.log('PASS '+name);}catch(e){checks.push({name,passed:false,error:e.stack});console.error('FAIL '+name+'\n'+e.message);}}
 function fresh(id){w.eval(`delete SIM4[${JSON.stringify(id)}]`);const s=w.sim4(id);w.fields4(id,s);return s;}
 function preview(id,s=fresh(id)){w.result4(id,s);return w.SCENE3D6.createPreview(id,s);}
 function change(selector,value){const el=d.querySelector(selector);assert.ok(el,'Control exists: '+selector);el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));return el;}
 const Models=w.eval('Models'),gray=w.eval('gray4'),ids=Array.from(w.eval('Object.keys(LAB4)'));
 const expected={meter:['jacks','dial','lcd'],circuit:['supply','r','led','dots'],fault:['supply','r','led','dots'],power:['vdisp','idisp','state'],rc:['charge','capLabel','rLabel','vcLabel','curveGeo'],wave:['traceGeo','scale','sample'],bits:['traceGeo','byte','bit'],robot:['wrist','elbow','target','links'],rover:['bot','wheels','rangeRay'],ros:['bot','wheels','rangeRay','packet','rosStatus'],pwm:['rotor','speed','history'],pid:['rotor','speed','history'],thermal:['setpoint','jointLabel','joint'],vision:['pixels','info'],cpu:['pc','instruction','leds'],analog:['reading','ideal','rm'],stencil:['paste','stencil','readout'],reflow:['chart','board','info'],pcb:['traces','info'],rl:['token','path','status']};
 Object.assign(expected,{breadboard:['board8','holes8','strips8','wires8'],perfboard:['board8','holes8','wires8'],drone:['parts8','rotors8','props8','assembly8','status8'],go2:['robot8','config8','links8','joints8','axes8','markers8'],ur5:['robot8','config8','links8','joints8','axes8','markers8']});

 Object.assign(expected,{components3d:['models10','cuts10','anchors10','networks10'],mosfet:['branches10'],bjt:['branches10'],connections:['update']});
 check('All 29 workbenches use their intended 3D equipment and finite mesh geometry',()=>{
  assert.deepEqual(ids.slice().sort(),Object.keys(expected).sort());
  for(const id of ids){const st=preview(id);for(const key of expected[id])assert.ok(st.refs[key],`${id} must contain ${key}`);
   if(id==='connections')for(const x of [-1.9,1.9])assert.ok(st.scene.children.some(object=>object.isGroup&&object.position.x===x&&object.position.y===.53),'The wiring bench contains both separately modeled boards');
   assert.ok(st.camera.isPerspectiveCamera);let meshes=0;st.scene.traverse(o=>{if(o.isMesh)meshes++;const a=o.geometry?.attributes.position?.array;if(a)for(const n of a)assert.ok(Number.isFinite(n),`${id}: finite vertices`);});assert.ok(meshes>=8,`${id} actual mesh count`);
   st.scene.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(st.scene),size=box.getSize(new THREE.Vector3());for(const n of size.toArray())assert.ok(Number.isFinite(n)&&n>.1,`${id}: solid nonzero bounds`);
  }
 });

 check('Every workbench route has finite measured output and an accessible 3D fallback',()=>{
  for(const id of ids){w.nav4('lab',id);assert.equal(d.querySelector('[data-bench]')?.dataset.bench,id);assert.ok(d.querySelector('.scene3d-stage6'),id+' scene container');assert.ok(d.querySelector('.scene3d-fallback6'),id+' fallback');const text=d.querySelector('#measure4')?.textContent;assert.ok(text?.trim(),id+' reading');assert.doesNotMatch(text,/NaN|undefined|Infinity/,id+' finite result');assert.ok(d.querySelector('#explain4')?.textContent.trim(),id+' explanation');}
 });

 check('Meter DOM controls keep function, range, jack and exact probe endpoints independent',()=>{
  fresh('meter');w.nav4('lab','meter');const s=w.sim4('meter');d.querySelector('[data-meter-power6]').click();assert.equal(s.on,false);
  d.querySelector('[data-meter-mode6=current]').click();assert.equal(s.jack,'voltage');assert.equal(w.result4('meter',s).status,'jack');
  change('.meter-toolbar6 [data-setting=range]','10A');assert.equal(s.jack,'voltage');change('[data-setting=jack]','current');assert.equal(s.range,'10A');assert.equal(w.result4('meter',s).status,'jack');
  change('[data-setting=jack]','10a');change('[data-probe6=red]','series');change('[data-probe6=black]','minus');assert.equal(s.fuse,true);
  d.querySelector('[data-meter-power6]').click();assert.equal(w.result4('meter',s).read,'0.009 A');
  change('[data-probe6=red]','minus');change('[data-probe6=black]','series');assert.equal(w.result4('meter',s).read,'-0.009 A');
  s.on=false;w.paint4('meter',s);near(w.result4('meter',s).value,0,0,'Disabled source current');
  d.querySelector('[data-meter-mode6=voltage]').click();assert.equal(s.range,'10A');assert.equal(s.jack,'10a');change('[data-setting=jack]','voltage');assert.equal(s.range,'10A');assert.equal(w.result4('meter',s).status,'range');
 });

 check('Meter full-page wrapper preserves safety checks and blown fuse state before zero shortcuts',()=>{
  const s=fresh('meter');s.on=true;s.mode='resistance';s.probes={red:'plus',black:'plus'};assert.equal(w.result4('meter',s).status,'power-off');
  s.on=false;s.jack='current';assert.equal(w.result4('meter',s).status,'jack');
  s.mode='current';s.range='200mA';s.on=true;s.probes={red:'plus',black:'minus'};assert.equal(w.result4('meter',s).status,'fuse');assert.equal(s.fuse,false);
  s.probes={red:'series',black:'minus'};assert.equal(w.result4('meter',s).status,'fuse');
  s.mode='voltage';s.range='20';s.jack='voltage';s.probes={red:'plus',black:'minus'};assert.equal(w.result4('meter',s).read,'5.00 V');
  const st=preview('meter',s);st.update(s);assert.equal(s.fuse,false);assert.match(st.refs.lcd.text,/5\.00 V/);
 });

 check('Meter sub-threshold node voltage, polarity and silent finite resistance remain correct',()=>{
  const s=fresh('meter');s.p.v=1;s.probes={red:'anode',black:'minus'};assert.equal(w.result4('meter',s).read,'1.00 V');assert.equal(s.current,0);
  s.probes={red:'minus',black:'anode'};assert.equal(w.result4('meter',s).read,'-1.00 V');s.on=false;assert.equal(w.result4('meter',s).read,'0.00 V');
  s.mode='continuity';s.probes={red:'plus',black:'anode'};s.p.r=330;const r=w.result4('meter',s);assert.match(r.read,/330 Ω/);assert.match(r.read,/不蜂鸣|SILENT/);assert.doesNotMatch(r.read,/开路|OPEN/);
 });

 check('Supply CV, CC, zero limit and output-off agree with the actual display',()=>{
  const s=fresh('power');s.p.v=1;s.p.limit=20;let r=w.result4('power',s);near(s.output,1);near(s.current,0);assert.equal(s.powerMode,'CV');const st=preview('power',s);assert.equal(st.refs.vdisp.text,'1.00 V');assert.match(st.refs.state.text,/CV/);
  s.p.limit=0;r=w.result4('power',s);st.update(s);assert.equal(s.powerMode,'CV');assert.match(st.refs.state.text,/CV/);
  s.p.v=5;s.p.r=330;s.p.limit=5;r=w.result4('power',s);st.update(s);near(s.current,.005);near(s.output,3.65);assert.equal(s.powerMode,'CC');assert.match(st.refs.state.text,/CC/);
  s.p.limit=0;w.result4('power',s);near(s.output,0);near(s.current,0);assert.equal(s.powerMode,'CC');
  s.on=false;r=w.result4('power',s);st.update(s);assert.equal(s.powerMode,'OFF');assert.equal(st.refs.vdisp.text,'0.00 V');assert.equal(st.refs.idisp.text,'0.00 mA');assert.match(st.refs.state.text,/OFF/);assert.match(r.why,/0 V/);
 });

 check('Scope free-run trace uses the same phase, frequency and amplitude as its numeric signal',()=>{
  const s=fresh('wave');Object.assign(s.p,{freq:1.25,amp:1.5,timebase:.1,voltsdiv:1});s.phase=.17;s.trigger='free';const st=preview('wave',s),a=st.refs.traceGeo.attributes.position;
  for(const i of [0,70,150,299]){const expectedValue=s.p.amp*Math.sin(2*Math.PI*(s.phase-s.p.freq*(1-i/299)));near(a.getY(i),1.55+expectedValue/8*1.38,1e-6,'Scope sample '+i);}
  near((a.getY(299)-1.55)/1.38*8,w.result4('wave',s).value,2e-6);const y=a.getY(299);s.p.voltsdiv=2;st.update(s);near(a.getY(299)-1.55,(y-1.55)/2);
  s.p.timebase=.2;st.update(s);assert.match(st.refs.scale.text,/0\.2 s\/div/);near(a.getY(0),1.55+s.p.amp*Math.sin(2*Math.PI*(s.phase-2*s.p.freq))/16*1.38);
  assert.doesNotMatch(w.result4('wave',s).why,/相位圆|phase circle/i);
 });

 check('Rising trigger locks the frame to a positive zero crossing without altering the source phase',()=>{
  const s=fresh('wave');Object.assign(s.p,{freq:1,amp:1,timebase:.1,voltsdiv:1});s.trigger='rising';s.phase=.31;const st=preview('wave',s),a=st.refs.traceGeo.attributes.position;
  near(a.getY(0),1.55);assert.ok(a.getY(1)>a.getY(0));const before=Array.from(a.array);s.phase=.77;st.update(s);assert.deepEqual(Array.from(a.array),before);near(s.phase,.77);
 });

 check('UART 8N1 geometry displays the selected byte LSB-first with start and stop levels',()=>{
  const s=fresh('bits');s.p.byte=0x41;s.t=0;const st=preview('bits',s),a=st.refs.traceGeo.attributes.position;const bits=[0,1,0,0,0,0,0,1,0,1];assert.equal(st.refs.traceGeo.drawRange.count,22);
  bits.forEach((b,i)=>{near(a.getY(1+2*i),b?1.82:1.27);near(a.getY(2+2*i),b?1.82:1.27);});const before=Array.from(a.array);s.p.byte=0;st.update(s);assert.notDeepEqual(Array.from(a.array),before);assert.match(st.refs.byte.text,/0x00/);
  s.p.rate=10;s.t=.9;st.update(s);assert.match(st.refs.bit.text,/STOP = 1/);
 });

 check('SCARA elbow, wrist and target agree with forward kinematics in the horizontal plane',()=>{
  const s=fresh('robot');s.a=.37;s.b=.82;s.p.x=90;s.p.y=110;const st=preview('robot',s),q=Models.fk({l1:110,l2:110,j1:s.a*180/Math.PI,j2:s.b*180/Math.PI}),scale=st.refs.modelScale;
  near(st.refs.elbow.position.x,q.x1*scale);near(st.refs.elbow.position.z,-q.y1*scale);near(st.refs.wrist.position.x,q.x*scale);near(st.refs.wrist.position.z,-q.y*scale);near(st.refs.wrist.position.y,0);
  near(st.refs.target.position.x,90*scale);near(st.refs.target.position.z,-110*scale);near(st.refs.target.position.y,.39);
  const before=st.refs.wrist.position.toArray();s.p.x=-100;s.p.y=40;st.update(s);assert.deepEqual(st.refs.wrist.position.toArray(),before,'target edits must not teleport actual end effector');near(st.refs.target.position.x,-100*scale);
  w.advance4('robot',s,.05);st.update(s);assert.notDeepEqual(st.refs.wrist.position.toArray(),before);const held=[s.a,s.b];s.p.x=250;s.p.y=250;w.advance4('robot',s,.05);assert.deepEqual([s.a,s.b],held,'unreachable target holds actual joint angles');
 });

 check('Differential drive wheel displacement and true range ray share the actual odometry',()=>{
  const s=fresh('rover');Object.assign(s.p,{left:.1,right:.3,track:.4});s.pose={x:0,y:0,a:0};w.advance4('rover',s,.1);near(s.wheelLeft,.2);near(s.wheelRight,.6);near(s.angular,.5);near(s.velocity,.2);
  const st=preview('rover',s),scale=st.refs.roomScale;near(st.refs.bot.position.x,s.pose.x*scale);near(st.refs.bot.position.z,-s.pose.y*scale);
  st.refs.wheels.forEach(({obj,side})=>near(obj.rotation.y,side==='left'?s.wheelLeft:s.wheelRight));const a=st.refs.rangeRay.geo.attributes.position,dist=w.range5(s.pose);near(a.getX(1),(s.pose.x+Math.cos(s.pose.a)*dist)*scale);near(a.getZ(1),-(s.pose.y+Math.sin(s.pose.a)*dist)*scale);
  const before=[s.wheelLeft,s.wheelRight,...st.refs.wheels.map(q=>q.obj.rotation.y)];for(let i=0;i<100;i++)st.update(s);assert.deepEqual([s.wheelLeft,s.wheelRight,...st.refs.wheels.map(q=>q.obj.rotation.y)],before,'render updates never advance wheels');
 });

 check('ROS disconnected before first message and timed-out commands stop wheels and packets',()=>{
  const s=fresh('ros');s.connected=false;w.advance4('ros',s,.1);near(s.velocity,0);near(s.wheelLeft,0);assert.equal(s.stale,true);const st=preview('ros',s);assert.equal(st.refs.packet.visible,false);
  s.connected=true;w.advance4('ros',s,.1);assert.ok(s.messages>0);assert.ok(s.velocity>0);st.update(s);assert.equal(st.refs.packet.visible,true);
  s.connected=false;w.advance4('ros',s,.6);assert.equal(s.stale,true);near(s.velocity,0);const angles=[s.wheelLeft,s.wheelRight];w.advance4('ros',s,.1);st.update(s);assert.deepEqual([s.wheelLeft,s.wheelRight],angles);assert.equal(st.refs.packet.visible,false);assert.match(st.refs.rosStatus.text,/TIMEOUT|STOP/);
 });

 check('PWM and PID motor shafts advance only with model time and freeze during redraw',()=>{
  for(const id of ['pwm','pid']){const s=fresh(id);s.run=false;
   if(id==='pwm'){for(const duty of [0,50,100]){s.p.duty=duty;const result=w.result4(id,s);assert.ok(result.read.startsWith('Vavg = '+(duty*.05).toFixed(2)+' V'));assert.ok(result.formula.includes(duty+'/100'),'Percentage duty is divided by 100 in the displayed calculation');}s.p.duty=50;}
   const st=preview(id,s);const initial=s.motorAngle7||0;for(let i=0;i<20;i++)w.advance4(id,s,.05);assert.ok(Number.isFinite(s.motorAngle7)&&s.motorAngle7!==initial,id+' motor angle integrated');st.update(s);near(st.refs.rotor.rotation.x,s.motorAngle7);const before=s.motorAngle7;for(let i=0;i<100;i++)st.update(s);near(s.motorAngle7,before);near(st.refs.rotor.rotation.x,before);}
 });

 check('Thermal instrument separates source setpoint and actual joint temperature',()=>{
  const s=fresh('thermal');s.p.temp=350;s.y=25;const st=preview('thermal',s);assert.equal(st.refs.setpoint.text,'SET 350 °C');assert.equal(st.refs.jointLabel.text,'JOINT 25.0 °C');
  s.y=170;st.update(s);assert.equal(st.refs.setpoint.text,'SET 350 °C');assert.equal(st.refs.jointLabel.text,'JOINT 170.0 °C');s.on=false;st.update(s);near(st.refs.tip.material.emissiveIntensity,0);
 });

 check('Vision count uses all 9600 source pixels while 384 mesh pixels sample the same threshold mask',()=>{
  const s=fresh('vision'),st=preview('vision',s);assert.equal(st.refs.pixels.length,384);let previous=9601;
  for(const threshold of [0,100,128,200,255]){s.p.threshold=threshold;w.result4('vision',s);st.update(s);let count=0;for(let y=0;y<80;y++)for(let x=0;x<120;x++)if(gray(x,y)>threshold)count++;assert.equal(s.count,count);assert.ok(count<=previous);previous=count;
   for(const {pixel,x,y}of st.refs.pixels){assert.equal(x%5,2);assert.equal(y%5,2);assert.equal(pixel.material.color.getHexString(),gray(x,y)>threshold?'e5c586':'284454');}assert.match(st.refs.info.text,new RegExp(count+' / 9600'));
  }
 });

 check('RC capacitance, resistance, charge level and trace track selected values and actual history',()=>{
  const s=fresh('rc');s.p.r=20;s.p.c=220;s.y=2.5;s.history=[[0,0],[1,1],[2,2.5]];const st=preview('rc',s);assert.equal(st.refs.capLabel.text,'220 μF');assert.equal(st.refs.rLabel.text,'20 kΩ');assert.equal(st.refs.vcLabel.text,'Vc 2.50 V');assert.equal(st.refs.tau.text,'τ = 4.40 s');near(st.refs.charge.scale.y,.5);assert.equal(st.refs.curveGeo.drawRange.count,3);near(st.refs.curveGeo.attributes.position.getY(2),.76+.5*.92);
  s.on=false;w.advance4('rc',s,.1);assert.ok(s.y<2.5);st.update(s);assert.equal(st.refs.sourceDisplay.text,'DISCHARGE');assert.equal(st.refs.capLabel.text,'220 μF');
 });

 check('Analog loading display uses kΩ conversion consistently',()=>{
  const s=fresh('analog');Object.assign(s.p,{v:5,r:1000,rm:1000});const st=preview('analog',s);assert.equal(st.refs.reading.text,'1.667 V');assert.equal(st.refs.ideal.text,'IDEAL 2.500 V');s.p.rm=10000;st.update(s);assert.equal(st.refs.reading.text,'2.381 V');assert.match(st.refs.rm.text,/10000 kΩ/);
 });

 check('CPU physical LEDs, register panel and instruction label follow executed machine state',()=>{
  const s=fresh('cpu');s.cpu.program=['MOV R0, 5','STORE R0, 0','HALT'];const st=preview('cpu',s);Models.cpuStep(s.cpu);st.update(s);assert.match(st.refs.pc.text,/PC 1 · R0 5 · MEM\[0\] 0/);st.refs.leds.forEach((led,i)=>near(led.material.emissiveIntensity,(5>>i)&1?.65:0));Models.cpuStep(s.cpu);Models.cpuStep(s.cpu);st.update(s);assert.match(st.refs.pc.text,/MEM\[0\] 5/);assert.match(st.refs.instruction.text,/HALT/);
 });

 check('Stencil geometry changes both aperture and thickness; paste volume scales in three dimensions',()=>{
  const s=fresh('stencil');s.p.aperture=.6;s.p.thickness=.12;const st=preview('stencil',s),before=st.refs.stencil;near(st.refs.paste.scale.x,.72);near(st.refs.paste.scale.y,.096);near(st.refs.paste.scale.z,.72);
  s.p.aperture=1;s.p.thickness=.2;st.update(s);assert.notEqual(st.refs.stencil,before);near(st.refs.paste.scale.x,1.2);near(st.refs.paste.scale.y,.16);assert.match(st.refs.readout.text,/AR 1.25/);assert.equal(st.refs.stencil.geometry.parameters.shapes.holes.length,1);
 });

 check('Reflow TAL means total time above 217 °C and contradictory inputs are explicitly rejected',()=>{
  const s=fresh('reflow');s.p.peak=235;s.p.dwell=50;const r=w.result4('reflow',s);assert.equal(s.reflowInconsistent7,false);assert.match(r.why,/不是通用|not universal/i);const st=preview('reflow',s),a=st.refs.chart.geo.attributes.position;let peak=0;for(let i=0;i<st.refs.chart.geo.drawRange.count;i++)peak=Math.max(peak,(a.getY(i)-1.02)/.84*300);near(peak,235,1e-4);
  const duration=90+s.p.dwell+45,time=i=>(a.getX(i)+1.77)/3.54*duration;near(time(6)-time(3),50,1e-4,'TAL crossing interval');
  for(const [peak,tal]of [[217,1],[200,50],[235,0]]){s.p.peak=peak;s.p.dwell=tal;const r=w.result4('reflow',s);st.update(s);assert.equal(s.reflowInconsistent7,true);assert.match(r.read,/输入矛盾|INCONSISTENT/);assert.equal(st.refs.chart.obj.visible,false);assert.match(st.refs.info.text,/INVALID/);}
  s.p.peak=200;s.p.dwell=0;w.result4('reflow',s);st.update(s);assert.equal(s.reflowInconsistent7,false);assert.equal(st.refs.chart.obj.visible,true);
 });

 check('PCB mesh spacing represents the entered edge-to-edge clearance',()=>{
  const s=fresh('pcb');s.p.width=.3;s.p.clearance=.25;const st=preview('pcb',s),[a,b]=st.refs.traces;near(a.scale.z,.3*.65);near(b.position.z-a.position.z-(a.scale.z+b.scale.z)/2,.25*.65);s.p.width=.7;s.p.clearance=.1;st.update(s);near(b.position.z-a.position.z-(a.scale.z+b.scale.z)/2,.1*.65);assert.match(st.refs.info.text,/WIDTH 0.70 mm · GAP 0.10 mm/);
 });

 check('RL token and path follow the trained grid policy without passing through obstacle cells',()=>{
  const s=fresh('rl');s.rl=Models.qlearn(200,.5,.2,7);const st=preview('rl',s);assert.ok(s.rl.path.length>1);for(const n of s.rl.path)assert.ok(![7,12,17].includes(n)&&n>=0&&n<25);assert.equal(st.refs.path.geo.drawRange.count,s.rl.path.length);s.t=.5;st.update(s);const n=s.rl.path[1];near(st.refs.token.position.x,(n%5-2)*.78);near(st.refs.token.position.z,(Math.floor(n/5)-2)*.78);
 });

 check('Circuit and fault light state derive from actual branch current',()=>{
  for(const id of ['circuit','fault']){const s=fresh(id);s.p.v=5;s.p.r=330;w.result4(id,s);const st=preview(id,s);assert.ok(s.current>0);assert.ok(st.refs.led.material.emissiveIntensity>0);s.on=false;w.result4(id,s);st.update(s);near(st.refs.led.material.emissiveIntensity,0);assert.ok(st.refs.dots.every(dot=>!dot.visible));}
 });

 check('Repeated scene redraws do not advance any workbench simulation while paused',()=>{
  const snapshot=s=>plain(Object.fromEntries(['t','phase','a','b','y','pose','history','trail','cpu','wheelLeft','wheelRight','motorAngle7','joints','selectedJoint','motorAngles','activeMotor','assembled','on','props','wires','holeA','holeB','motorTested','failsafe'].filter(k=>s[k]!==undefined).map(k=>[k,s[k]])));
  for(const id of ids){const s=fresh(id);s.run=false;const st=preview(id,s),before=snapshot(s);for(let i=0;i<12;i++)st.update(s);assert.deepEqual(snapshot(s),before,id+' redraw cannot alter physical state');}
 });

 check('Official robot controls, limits, presets and real rendered joints agree in the generated document',()=>{
  for(const id of ['go2','ur5']){const s=fresh(id);w.nav4('lab',id);if(id==='go2'&&w.Motion9)w.Motion9.setMode(id,'pose');const cfg=w.ROBOT_CONFIG8[id],joint=cfg.joints.at(-1),input=d.querySelector(`[data-joint8="${joint.name}"]`);assert.ok(input);near(+input.min,joint.lower);near(+input.max,joint.upper);const value=(joint.lower+joint.upper)/2;input.value=String(value);input.dispatchEvent(new w.Event('input',{bubbles:true}));near(s.joints[joint.name],value);assert.equal(s.run,false);assert.equal(s.selectedJoint,joint.name);
   const st=preview(id,s);st.update(s);near(st.refs.actualJoints8[joint.name],value);assert.equal(st.refs.axes8[joint.name].visible,true);assert.ok(st.focusViews8.panel&&st.focusViews8.wiring);
   for(const pose of cfg.presets){d.querySelector(`[data-robot-preset8="${pose.id}"]`).click();assert.equal(s.preset,pose.id);assert.equal(s.run,false);assert.deepEqual(plain(s.joints),plain(w.RobotKinematics8.normalize(id,pose.joints)));}
   s.run=true;const before=plain(s.joints);w.advance4(id,s,.5);assert.notDeepEqual(plain(s.joints),before);st.update(s);const fk=w.RobotKinematics8.forward(id,s.joints);for(const name of cfg.endpoints)assert.deepEqual(plain(st.refs.endpoints8[name]),plain(fk[name].position));
  }
 });

 check('Board routes show exact connectivity and include keyboard-accessible controls',()=>{
  for(const id of ['breadboard','perfboard']){const s=fresh(id);w.nav4('lab',id);assert.ok(d.querySelector('[data-wire-point8=holeA]'));assert.ok(d.querySelector('[data-wire-point8=holeB]'));assert.ok(d.querySelector('[data-wire8=connect]'));const st=preview(id,s);assert.equal(Object.keys(st.refs.holes8).length,id==='breadboard'?120:100);assert.equal(w.WIRING8.connected(s,'A1').has('E1'),id==='breadboard');assert.equal(w.WIRING8.connected(s,'P5').has('P6'),false);}
 });

 check('Drone generated-document controls and model enforce the simulated power gate',()=>{
  const s=fresh('drone');w.nav4('lab','drone');d.querySelector('[data-drone8=power]').click();assert.equal(s.on,false);d.querySelector('[data-drone-motor8="0"]').click();assert.equal(s.activeMotor,-1);for(const id of ['esc','fc','motors','receiver','gnss','battery'])d.querySelector(`[data-drone-part8=${id}]`).click();d.querySelector('[data-drone8=orientation]').click();d.querySelector('[data-drone8=power]').click();assert.equal(s.on,true);d.querySelector('[data-drone-motor8="0"]').click();w.advance4('drone',s,1.01);assert.ok(s.motorAngles[0]>0);const st=preview('drone',s);assert.match(st.refs.status8.text,/SIMULATED POWER ON/);d.querySelector('[data-drone8=props]').click();assert.equal(s.activeMotor,-1);assert.equal(s.on,false);st.update(s);assert.match(st.refs.status8.text,/TEST LOCKED.*SIMULATED POWER OFF/);
 });

 check('No runtime exceptions occur during generated-document navigation and model updates',()=>assert.deepEqual(errors,[]));
 const report={passed:checks.every(x=>x.passed),generatedHtmlSha256:crypto.createHash('sha256').update(html).digest('hex'),deviceModels:ids.length,checks,method:'Generated HTML executed in JSDOM; real Three.js mesh and state math inspected. No GPU rendering, physical hardware or installation guarantee is implied.'};
 fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2));dom.window.close();
 console.log(`${checks.filter(x=>x.passed).length}/${checks.length} passed`);if(!report.passed)process.exitCode=1;
})().catch(e=>{fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify({passed:false,checks,fatal:e.stack},null,2));console.error(e);process.exitCode=1;});

