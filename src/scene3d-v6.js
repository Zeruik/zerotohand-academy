import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createTeachingBuilders } from './scene3d-v7-builders.js';
import { createMakingBuilders8 } from './making-scenes-v8.js';
import { createRobotBuilders8 } from './robotics-v8.js';

(() => {
  const stages = new Map();
  let renderer = null;
  let active = null;
  let renderFrame = 0;
  let controls = null;
  const reduced = () => {const preference=window.ProfileStore9?.getSettings?.().motion||'system';return preference==='reduced'||preference==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches;};

  const mat = (color, metalness = 0.06, roughness = 0.38, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
  const rounded = (w, h, d, r = 0.08, color = '#fff') => {const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,5,Math.min(r,w/3,h/3,d/3)),mat(color));m.castShadow=true;m.receiveShadow=true;return m;};
  function mesh(geo, material, parent, x=0,y=0,z=0) {
    const o = new THREE.Mesh(geo, material); o.position.set(x,y,z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
  }
  function cyl(r1,r2,h,color,parent,x=0,y=0,z=0,segments=32) {
    return mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat(color,.26,.31),parent,x,y,z);
  }
  function sphere(r,color,parent,x=0,y=0,z=0,segments=24) {
    return mesh(new THREE.SphereGeometry(r,segments,Math.max(12,segments/2)),mat(color,.18,.27),parent,x,y,z);
  }
  function textTexture(text, options={}) {
    const c=document.createElement('canvas'); c.width=1024; c.height=256;
    const ctx=c.getContext('2d');
    if(!ctx)return new THREE.CanvasTexture(c);
    ctx.fillStyle=options.bg||'#213546'; ctx.fillRect(0,0,c.width,c.height);
    if(options.gloss&&typeof ctx.createLinearGradient==='function'){const g=ctx.createLinearGradient(0,0,0,c.height);if(g?.addColorStop){g.addColorStop(0,'#ffffff16');g.addColorStop(.5,'#ffffff00');g.addColorStop(1,'#00000022');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);}}
    ctx.fillStyle=options.color||'#c9f2cf'; ctx.font=`600 ${options.font||112}px "Segoe UI", "Microsoft YaHei", sans-serif`;ctx.textBaseline='middle';ctx.textAlign=options.align||'center';ctx.fillText(String(text),options.align==='left'?32:c.width/2,c.height/2,950);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;
  }
  function label(text,w,h,parent,x,y,z,{bg='#213546',color='#c9f2cf',font=100}={}) {
    const texture=textTexture(text,{bg,color,font,gloss:true});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));m.position.set(x,y,z);parent.add(m);
    return {mesh:m,texture,text,update(v){if(v===this.text)return;this.text=v;this.texture.dispose();this.texture=textTexture(v,{bg,color,font,gloss:true});m.material.map=this.texture;m.material.needsUpdate=true;}};
  }
  function line(points,color='#53728c',width=.018,parent,opacity=1) {
    const curve=new THREE.CatmullRomCurve3(points.map(p=>Array.isArray(p)?new THREE.Vector3(...p):p));
    return mesh(new THREE.TubeGeometry(curve,Math.max(20,points.length*6),width,8,false),new THREE.MeshStandardMaterial({color,roughness:.4,metalness:.12,transparent:opacity<1,opacity}),parent);
  }
  function straight(a,b,r,color,parent) {
    const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va),o=mesh(new THREE.CylinderGeometry(r,r,d.length(),20),mat(color,.36,.3),parent);
    o.position.copy(va.add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;
  }
  function sceneBase(id) {
    const scene=new THREE.Scene();scene.background=new THREE.Color('#eef0f2');scene.fog=new THREE.Fog('#eef0f2',12,24);
    const hemi=new THREE.HemisphereLight('#fffaf2','#8496a5',1.65);scene.add(hemi);
    const key=new THREE.DirectionalLight('#fff2dc',2.6);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.bias=-.0002;scene.add(key);
    const fill=new THREE.DirectionalLight('#c7ddf5',1.1);fill.position.set(5,5,-5);scene.add(fill);
    const rim=new THREE.PointLight('#f5c894',38,18,2);rim.position.set(2.8,4.8,3.5);scene.add(rim);
    const floor=mesh(new THREE.PlaneGeometry(15,12),mat('#e7e2d9',.06,.88),scene,0,-.035,0);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;
    const grid=new THREE.GridHelper(12,24,'#b7c2ca','#d5d7d7');grid.position.y=-.022;grid.material.transparent=true;grid.material.opacity=.23;scene.add(grid);
    const pedestal=mesh(new THREE.CylinderGeometry(4.1,4.1,.12,96),mat('#f8f7f4',.22,.28),scene,0,.04,0);pedestal.castShadow=false;
    const rimRing=mesh(new THREE.TorusGeometry(4.04,.025,12,96),mat('#d4b18a',.6,.25),scene,0,.107,0);rimRing.rotation.x=Math.PI/2;
    return {id,scene,refs:{},time:0,drag:null,signature:'',target:new THREE.Vector3(0,.9,0),camera:new THREE.PerspectiveCamera(36,1,.1,80),saved:null};
  }
  function bench(parent,x,z,w,d,top='#faf8f4') {
    const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
    mesh(new RoundedBoxGeometry(w,.14,d,4,.08),mat('#e0dbd2',.12,.5),g,0,.19,0);
    mesh(new RoundedBoxGeometry(w-.12,.12,d-.12,4,.06),mat(top,.08,.45),g,0,.28,0);
    return g;
  }
  function addPost(parent,x,y,z,color,tag) {
    const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
    cyl(.10,.12,.12,'#232f3b',g,0,0,0);cyl(.075,.075,.06,color,g,0,.085,0);cyl(.025,.025,.01,'#273442',g,0,.12,0);
    if(tag)g.userData.tag=tag;return g;
  }
  function buildMeter(stage) {
    const {scene,refs}=stage;bench(scene,0,0,7.3,4.35,'#faf8f5');
    const matYellow=mat('#e7ae2e',.17,.28),matRubber=mat('#262e37',.04,.63),matSilver=mat('#bdc8cd',.74,.23),matBoard=mat('#d9e5d3',.03,.82),matCopper=mat('#b97445',.68,.3);
    const body=new THREE.Group();body.position.set(-2.05,1.43,.18);scene.add(body);refs.body=body;
    mesh(new RoundedBoxGeometry(1.56,2.42,.34,10,.14),matRubber,body,0,-.04,0);
    mesh(new RoundedBoxGeometry(1.42,2.28,.34,10,.13),matYellow,body,0,0,.05);
    mesh(new RoundedBoxGeometry(1.18,.55,.035,5,.07),mat('#263746',.05,.33),body,0,.62,.232);
    mesh(new RoundedBoxGeometry(1.04,.39,.018,4,.03),mat('#cbd9ba',.02,.28,{emissive:'#344632',emissiveIntensity:.13}),body,0,.62,.257);
    refs.lcd=label('0.00 V',.96,.25,body,0,.62,.271,{bg:'#cbd9ba',color:'#25392c',font:126});
    label('ZTH   DIGITAL MULTIMETER',1.02,.11,body,0,.94,.239,{bg:'#263746',color:'#eef0e9',font:53});
    const dial=new THREE.Group();dial.position.set(0,-.19,.255);body.add(dial);refs.dial=dial;
    cyl(.37,.37,.05,'#d4c398',dial,0,0,0,48).rotation.x=Math.PI/2;
    cyl(.31,.34,.13,'#303946',dial,0,0,.07,48).rotation.x=Math.PI/2;
    mesh(new RoundedBoxGeometry(.16,.52,.13,4,.045),mat('#39434b',.12,.4),dial,0,0,.15);
    const pointer=mesh(new RoundedBoxGeometry(.035,.13,.018,2,.008),mat('#fff6df',.1,.4),dial,0,.17,.224);refs.pointer=pointer;
    const dialLabels=[['OFF',0,.56],['V⎓',.40,.37],['A⎓',.40,-.37],['Ω',-.40,-.37],[')))',-.40,.37]];
    for(const [t,x,y] of dialLabels)label(t,.26,.13,body,x,-.18+y,.285,{bg:'#e1a52b',color:'#28313b',font:200});
    for(let i=0;i<28;i++){const a=i/28*Math.PI*1.78-.87,x=Math.sin(a)*.49,y=-.19+Math.cos(a)*.49;mesh(new THREE.BoxGeometry(.018,.085,.018),mat(i%4===0?'#f2e5bf':'#786444'),body,x,y,.268).rotation.z=-a;}
    const plugX=[-.54,-.18,.18,.54];refs.jacks={};
    [['mA','#d64c49'],['COM','#273442'],['VΩ','#d64c49'],['10A','#d64c49']].forEach(([t,c],i)=>{const p=addPost(body,plugX[i],-.94,.23,c,t);p.rotation.x=Math.PI/2;refs.jacks[t]=p;label(t,.26,.12,body,plugX[i],-1.095,.285,{bg:'#e1a52b',color:'#28313b',font:180});});
    for(const x of [-.72,.72])for(let i=0;i<5;i++)mesh(new THREE.BoxGeometry(.045,.11,.14),matRubber,body,x,.2-i*.18,.1);
    const board=new THREE.Group();board.position.set(.78,.39,.0);scene.add(board);refs.board=board;
    mesh(new RoundedBoxGeometry(2.7,.17,1.75,5,.075),matBoard,board,0,0,0);
    for(let r=0;r<5;r++)for(let c=0;c<14;c++)mesh(new THREE.CylinderGeometry(.025,.025,.009,12),mat('#83917e'),board,-1.18+c*.18,.09,-.50+r*.22);
    const posts={};
    const terminalSpecs={plus:[-.88,.16,.51,'#d34e4c','V+'],anode:[.92,.16,.51,'#cf514a','LED+'],minus:[.93,.16,-.52,'#293743','GND'],series:[-.88,.16,-.52,'#d54b49','I / SERIES']};
    for(const [k,[x,y,z,c,t]] of Object.entries(terminalSpecs)){const p=addPost(board,x,y,z,c,k);posts[k]=p;label(t,.45,.09,board,x,y+.12,z+.085,{bg:'#d9e5d3',color:'#324451',font:57});}
    refs.posts=posts;
    straight([-.54,.18,.50],[.34,.18,.50],.036,'#a7693e',board);
    const resistor=mesh(new RoundedBoxGeometry(.42,.15,.19,4,.05),mat('#dbc19e'),board,-.10,.20,.50);
    refs.bands=[];for(const [i,c] of ['#de7a37','#de7a37','#7c4c33','#b8994d'].entries())refs.bands.push(mesh(new THREE.BoxGeometry(.025,.154,.194),mat(c),board,-.24+i*.09,.20,.50));
    refs.rLabel=label('330 Ω',.65,.14,board,-.1,.45,.53,{bg:'#d9e5d3',color:'#324451',font:95});
    line([[.92,.13,.51],[.92,.13,.18],[.92,.13,-.22],[-.88,.13,-.22],[-.88,.13,-.52]],'#9f7e45',.028,board);
    refs.returnJumper=line([[-.88,.16,-.52],[0,.18,-.52],[.93,.16,-.52]],'#4e7775',.03,board);
    const supply=rounded(1.08,.66,.55,.08,'#6b8797');supply.position.set(.75,.70,-1.28);scene.add(supply);refs.supplyLabel=label('DC 5.0 V',.90,.22,scene,.75,.79,-.995,{bg:'#29473f',color:'#aee4bf',font:105});
    line([[.42,.52,-1.0],[.15,.48,-.92],[-.15,.52,.51]],'#c65b51',.025,scene);
    line([[1.1,.52,-1.0],[1.75,.49,-.92],[1.71,.55,-.52]],'#354b58',.025,scene);
    for(const a of [-.25,.25]){straight([-.10+a,.20,.50],[-.10+a*.7,.25,.50],.023,'#8d553a',board);}
    const led=sphere(.13,'#dfc85f',board,.92,.35,-.01,32);led.material=new THREE.MeshPhysicalMaterial({color:'#ffdc6b',emissive:'#ffb82f',emissiveIntensity:.15,roughness:.22,metalness:.05,transmission:.12});refs.led=led;
    const leadGroups={};
    for(const type of ['red','black']){const g=new THREE.Group();scene.add(g);leadGroups[type]=g;}
    refs.leads=leadGroups;
    function redrawLeads(s){
      const key=`${s.probes?.red||'plus'}:${s.probes?.black||'minus'}:${s.jack}`;if(stage.signature===key)return;stage.signature=key;
      for(const t of ['red','black']){
        const g=leadGroups[t];while(g.children.length){const c=g.children.pop();g.remove(c);c.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});}
        const isRed=t==='red',jack=isRed?(s.jack==='current'?'mA':s.jack==='10a'?'10A':'VΩ'):'COM';body.updateMatrixWorld(true);board.updateMatrixWorld(true);const jp=refs.jacks[jack].getWorldPosition(new THREE.Vector3());
        const destKey=s.probes?.[t]|| (isRed?'plus':'minus'),dest=posts[destKey].getWorldPosition(new THREE.Vector3()),color=isRed?'#d94b4b':'#222e3d';
        const start=jp.clone().add(new THREE.Vector3(0,-.03,.12)),end=dest.clone().add(new THREE.Vector3(0,.15,0));
        const mid1=start.clone().lerp(end,.31);mid1.y=.48;mid1.z+=isRed?.7:1.0;const mid2=start.clone().lerp(end,.69);mid2.y=.48;mid2.z+=isRed?.6:.9;
        const curve=new THREE.CatmullRomCurve3([start,mid1,mid2,end]);mesh(new THREE.TubeGeometry(curve,56,.027,10,false),mat(color,.04,.4),g);
        const probe=new THREE.Group();probe.position.copy(end);g.add(probe);probe.userData.probe=t;probe.userData.port=destKey;
        const h=mesh(new THREE.CylinderGeometry(.06,.09,.44,24),mat(isRed?'#d94b4b':'#28323d',.06,.43),probe,0,.25,0);h.rotation.x=.16;
        for(let i=0;i<4;i++)mesh(new THREE.TorusGeometry(.061,.009,8,24),mat(isRed?'#f1a09a':'#84909c'),probe,0,.11+i*.085,0);
        straight([0,-.03,0],[0,-.14,0],.022,'#d5d9dc',probe);
        sphere(.025,'#e7edf0',probe,0,-.15,0,16);
      }
    }
    refs.update=s=>{
      const r=window.result4?.('meter',s)||{read:'0.00 V'};refs.result=r;redrawLeads(s);const current=Number(s.current||0),on=s.on&&current>0,voltage=Number(s.p.v??5);
      refs.led.material.emissiveIntensity=on&&current>0?1.8:.08;refs.led.scale.setScalar(on&&current>0?1.08:1);
      refs.returnJumper.visible=!s.seriesOpen;refs.supplyLabel.update(s.on?`DC ${voltage.toFixed(1)} V`:'OUTPUT OFF');refs.rLabel.update(`${s.p.r??330} Ω`);
      {const colors=['#30343b','#80543a','#c84f43','#db873b','#d7b54d','#6c9672','#577fb0','#9a77ab','#969999','#e4e1d7'],r=Number(s.p.r||330),exp=Math.max(0,Math.floor(Math.log10(r))-1),digits=Math.round(r/10**exp);refs.bands[0].material.color.set(colors[Math.floor(digits/10)%10]);refs.bands[1].material.color.set(colors[digits%10]);refs.bands[2].material.color.set(colors[exp]);}
      const modes={voltage:-.82,current:-2.32,resistance:2.32,continuity:.82};refs.dial.rotation.z=modes[s.mode]??0;
      refs.lcd.update(({fuse:'FUSE',jack:'JACK',range:'RANGE','power-off':'POWER OFF',unsafe:'CHECK',wiring:'LEADS',overrange:'OL'}[r.status])||r.read);
      return voltage;
    };
  }
  const teachingBuilders=createTeachingBuilders({THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench,addPost,models:Models,gray:gray4,range:pose=>range5(pose)});
  Object.assign(teachingBuilders,createMakingBuilders8({THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench,addPost}));
  Object.assign(teachingBuilders,createRobotBuilders8({THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench,addPost}));
  if(window.Components10)Object.assign(teachingBuilders,window.Components10.createBuilders({THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench,addPost}));
  if(window.Wiring10)Object.assign(teachingBuilders,window.Wiring10.createBuilders({THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench,addPost}));
  function buildGeneric(stage,id){
    stage.modelKind=id;
    if(id==='meter'){buildMeter(stage);stage.camera.position.set(2.7,2.8,6.6);stage.target.set(-.3,1.05,.2);stage.camera.lookAt(stage.target);return;}
    if(teachingBuilders[id])return teachingBuilders[id](stage);
    throw new Error('No teaching model for '+id);
  }
  function createPreview(id,s=window.sim4?.(id)){
    const stage=sceneBase(id);buildGeneric(stage,id);stage.update=state=>stage.refs.update?.(state);
    if(stage.camera.position.length()<1){stage.camera.position.set(4.9,3.8,5.4);stage.camera.lookAt(stage.target);}
    stage.camera.updateProjectionMatrix();stage.state=s;if(s){window.result4?.(id,s);stage.update?.(s);}return stage;
  }
  const thumbnailCache=new Map();let thumbnailUnsupported=false,thumbnailJob8=null;
  function prepareGallery(){
    // A navigation replaces the previous queue before any detached slots can receive images.
    thumbnailJob8?.cancel();
    const slots=[...document.querySelectorAll('.equipment-art5,[data-model-preview7]')];
    if(!slots.length||thumbnailUnsupported)return;
    const identify=slot=>slot.dataset.modelPreview7||slot.closest('[data-lab]')?.dataset.lab;
    const show=(slot,id)=>{if(!slot.isConnected||identify(slot)!==id)return;const img=document.createElement('img');img.src=thumbnailCache.get(id);img.alt=T(LAB4[id][0]+'的三维模型',LAB4[id][1]+' 3D model');img.width=480;img.height=290;slot.replaceChildren(img);slot.removeAttribute('aria-busy');};
    const byModel=new Map();for(const slot of slots){const id=identify(slot);if(!id||!LAB4[id])continue;if(thumbnailCache.has(id)){show(slot,id);continue;}if(!byModel.has(id))byModel.set(id,[]);byModel.get(id).push(slot);slot.setAttribute('aria-busy','true');}
    if(!byModel.size)return;
    const queue=[...byModel],job={renderer:null,frame:0,cancelled:false,cancel(){if(this.cancelled)return;this.cancelled=true;if(this.frame)cancelAnimationFrame(this.frame);this.renderer?.dispose();this.renderer?.forceContextLoss();this.renderer=null;for(const group of byModel.values())for(const slot of group)slot.removeAttribute('aria-busy');if(thumbnailJob8===this)thumbnailJob8=null;}};thumbnailJob8=job;
    const disposeScene=stage=>{const materials=new Set(),geometries=new Set(),textures=new Set();stage.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);if(m.map)textures.add(m.map);}});textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());};
    const next=()=>{
      job.frame=0;if(job.cancelled||thumbnailJob8!==job)return;
      const item=queue.shift();if(!item){job.cancel();return;}const [id,candidates]=item,live=candidates.filter(slot=>slot.isConnected&&identify(slot)===id);
      if(live.length){let stage=null;try{
        if(!job.renderer){const r=job.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});r.setSize(480,290,false);r.setPixelRatio(1);r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFShadowMap;}
        const s=JSON.parse(JSON.stringify(window.sim4(id)));if(id==='rc')s.y=3.2;
        if(id==='drone')Object.assign(s,{motionMode9:'bench',assembled:['frame','esc','fc','motors','receiver','gnss','battery'],props:true,on:false,activeMotor:-1,motorAngles:[0,0,0,0],p:{...s.p,explode:0,roll:0,pitch:0,yaw:0}});
        stage=createPreview(id,s);stage.camera.aspect=480/290;stage.camera.updateProjectionMatrix();stage.scene.updateMatrixWorld(true);job.renderer.render(stage.scene,stage.camera);thumbnailCache.set(id,job.renderer.domElement.toDataURL('image/png'));for(const slot of live)show(slot,id);
      }catch{thumbnailUnsupported=true;job.cancel();return;}finally{if(stage)disposeScene(stage);}}
      // One model per frame gives input and navigation a turn between expensive mesh uploads.
      if(queue.length)job.frame=requestAnimationFrame(next);else job.cancel();
    };
    job.frame=requestAnimationFrame(next);
  }
  function makeRenderer(shell){
    if(renderer)return renderer;
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.domElement.className='scene3d-canvas6';renderer.domElement.setAttribute('aria-label',T('可旋转和缩放的三维实验模型','Interactive three-dimensional lab model'));
    return renderer;
  }
  function meterPanel(s){
    const modes=[['voltage',T('直流电压 V⎓','DC voltage V⎓')],['current',T('直流电流 A⎓','DC current A⎓')],['resistance',T('电阻 Ω（断电测）','Resistance Ω (power off)')],['continuity',T('通断蜂鸣 )))','Continuity beep )))')]];
    const range=rangeOptions(s.mode,s.range);
    return `<div class="meter-modegroup6"><span>${T('1 · 功能 / 档位','1 · FUNCTION / MODE')}</span>${modes.map(([v,label])=>`<button type="button" data-meter-mode6="${v}" aria-pressed="${s.mode===v}">${label}</button>`).join('')}</div><label class="meter-range6">${T('2 · 量程','2 · RANGE')}<select data-setting="range" aria-label="${T('量程','Measurement range')}">${range.map(([v,l])=>`<option value="${v}" ${s.range===v?'selected':''}>${l}</option>`).join('')}</select></label><div class="meter-safety6"><b>${T('档位与插孔独立','DIAL AND JACK ARE INDEPENDENT')}</b><small>${T('改变功能或量程后，仍须单独确认插孔。移动表笔前先关闭模拟电源。','After changing function or range, check the jack separately. Turn off the simulated supply before moving leads.')}</small></div>`;
  }
  function rangeOptions(mode,current){
    const options=mode==='current'?[['auto',T('自动量程','Auto range')],['200mA','200 mA'],['10A','10 A']]:mode==='resistance'?[['auto',T('自动量程','Auto range')],['2k','2 kΩ'],['20k','20 kΩ'],['200k','200 kΩ']]:mode==='continuity'?[['auto',T('自动量程','Auto range')]]:[['auto',T('自动量程','Auto range')],['2','2 V'],['20','20 V'],['200','200 V'],['600','600 V']];
    if(current&&!options.some(x=>x[0]===current))options.unshift([current,current+T(' · 请重选量程',' · choose a valid range')]);return options;
  }
  function upgradeMeter(s){
    const mode=document.querySelector('[data-setting="mode"]'),params=document.querySelector('.parameters4[data-meter-controls6]')||document.querySelector('.parameters4');
    if(mode){if(mode.dataset.scene3dModes6!=='yes'){mode.innerHTML=[['voltage',T('直流电压 V⎓','DC voltage V⎓')],['current',T('直流电流 A⎓','DC current A⎓')],['resistance',T('电阻 Ω（断电测）','Resistance Ω (power off)')],['continuity',T('通断蜂鸣 )))','Continuity beep )))')]].map(([v,l])=>`<option value="${v}">${l}</option>`).join('');mode.dataset.scene3dModes6='yes';const l=mode.closest('label');if(l)l.firstChild.textContent=T('功能 / 档位','Function / mode');}mode.value=s.mode;}
    const jack=params?.querySelector('[data-setting="jack"]');if(jack&&!jack.querySelector('option[value="10a"]'))jack.insertAdjacentHTML('beforeend',`<option value="10a">10 A · ${T('大电流','high current')}</option>`);if(jack)jack.value=s.jack;
    let toolbar=document.querySelector('.meter-toolbar6');if(!toolbar&&params){toolbar=document.createElement('div');toolbar.className='meter-toolbar6';params.before(toolbar);}
    if(toolbar){if(!toolbar.querySelector('[data-meter-mode6]'))toolbar.innerHTML=meterPanel(s);toolbar.querySelectorAll('[data-meter-mode6]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.meterMode6===s.mode)));const r=toolbar.querySelector('[data-setting="range"]');if(r){if(r.dataset.optionsMode!==s.mode){r.innerHTML=rangeOptions(s.mode,s.range).map(([v,l])=>`<option value="${v}">${l}</option>`).join('');r.dataset.optionsMode=s.mode;}r.value=s.range||'auto';}}
    if(params&&!params.querySelector('[data-probe6]')){const posts=[['plus','电源 V+','Source V+'],['anode','电阻后 / LED+','After R / LED+'],['series','I / 支路回流','I / branch return'],['minus','GND / 电源COM','GND / source COM']];for(const [kind,zh,en]of [['red','红笔测试点','Red probe point'],['black','黑笔测试点','Black probe point']]){const l=document.createElement('label');l.className='probe-select7';l.innerHTML=`${T(zh,en)}<select data-probe6="${kind}" aria-label="${T(zh,en)}">${posts.map(([v,z,e])=>`<option value="${v}">${T(z,e)}</option>`).join('')}</select>`;params.append(l);}}
    params?.querySelectorAll('[data-probe6]').forEach(el=>{el.value=s.probes?.[el.dataset.probe6]||'minus';});
    let readout=document.querySelector('.meter-connection6');if(!readout){readout=document.createElement('div');readout.className='meter-connection6';document.querySelector('.measure4')?.after(readout);}
    if(readout)readout.innerHTML=`<span>${s.on?T('电源已开启','SUPPLY ON'):T('电源已关闭','SUPPLY OFF')}</span><span>${T('黑笔 · COM','BLACK · COM')}</span><span>${T('红笔 · ','RED · ')}${s.jack==='current'?'mA':s.jack==='10a'?'10A':'VΩ'}</span><span>${s.mode==='current'?T('断电 → 断开支路 → 串入表','POWER OFF → OPEN BRANCH → INSERT METER'):s.mode==='resistance'||s.mode==='continuity'?T('先断电并释放电容','POWER OFF AND DISCHARGE CAPACITORS'):T('并联跨接被测节点','CONNECT IN PARALLEL')}</span>`;
    const meterRead=document.querySelector('#measure4');if(meterRead)meterRead.dataset.severity=s.meterSeverity||'ok';
    {const transport=document.querySelector('.bench4[data-bench="meter"] .transport4');if(transport){let power=transport.querySelector('[data-meter-power6]');if(!power){power=document.createElement('button');power.type='button';power.dataset.sim='toggle';power.dataset.meterPower6='yes';transport.append(power);}power.textContent=s.on?T('关闭模拟电源','Turn simulated supply off'):T('开启模拟电源','Turn simulated supply on');power.setAttribute('aria-pressed',String(!!s.on));}}
  }
  function mount(shell,id,s){
    if(active&&controls)active.saved={position:active.camera.position.clone(),target:controls.target.clone()};
    shell.querySelector('.scene3d-stage6')?.remove();
    const wrap=document.createElement('div');wrap.className='scene3d-stage6';wrap.dataset.scene3d=id;wrap.innerHTML=`<div class="scene3d-hud6"><span><i></i> ${T('实时三维实验','LIVE 3D LAB')}</span><button type="button" data-view-reset6>${T('重置视角','Reset view')}</button><button type="button" data-view-orbit6 aria-pressed="false">${T('环绕开始','Start orbit')}</button><button type="button" data-view-orbit-pause9>${T('环绕暂停','Pause orbit')}</button><button type="button" data-view-orbit-stop9>${T('环绕停止复位','Stop & reset orbit')}</button><small>${T('拖动旋转 · 滚轮缩放','Drag to orbit · wheel to zoom')}</small></div>`;
    shell.querySelector('.device-scene5')?.remove();shell.classList.remove('modeled5','fallback-canvas7');shell.classList.add('modeled6');shell.append(wrap);
    let stage=stages.get(id);if(!stage){stage=sceneBase(id);buildGeneric(stage,id);stage.update=state=>stage.refs.update?.(state);stages.set(id,stage);}
    try {
      const r=makeRenderer(shell);r.domElement.setAttribute('aria-label',T('可旋转和缩放的三维实验模型','Interactive three-dimensional lab model'));wrap.prepend(r.domElement);
      if(controls){controls.dispose();controls=null;}
      stage.camera.aspect=Math.max(.5,wrap.clientWidth/Math.max(1,wrap.clientHeight));stage.camera.updateProjectionMatrix();
      if(!stage.home){if(stage.camera.position.length()<1)stage.camera.position.set(4,3.6,7.5);stage.camera.lookAt(stage.target);stage.home={position:stage.camera.position.clone(),target:stage.target.clone()};}
      controls=new OrbitControls(stage.camera,r.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=.65;controls.maxDistance=18;controls.maxPolarAngle=Math.PI*.49;controls.target.copy(stage.target);controls.autoRotate=false;controls.autoRotateSpeed=.34;controls.update();
      if(stage.saved){stage.camera.position.copy(stage.saved.position);controls.target.copy(stage.saved.target);controls.update();stage.saved=null;}
      controls.addEventListener('start',()=>{stage.orbit=false;stage.orbitRunning9=false;controls.autoRotate=false;controls._userInteracted=true;syncOrbit9(stage);});
      active=stage;stage.state=s;stage.shell=shell;stage.wrap=wrap;stage.lastMode=s.mode;
      r.setSize(wrap.clientWidth||900,wrap.clientHeight||460,false);
      installCanvasEvents(r.domElement);
      wrap.querySelector('[data-view-reset6]').onclick=()=>motionControl9('stop');
      wrap.querySelector('[data-view-orbit6]').onclick=()=>{stage.orbit=true;motionControl9('start');};
      wrap.querySelector('[data-view-orbit-pause9]').onclick=()=>motionControl9('pause');
      wrap.querySelector('[data-view-orbit-stop9]').onclick=()=>motionControl9('stop');syncOrbit9(stage);
      resize(stage);stage.update?.(s);drawLoop();
      if(id==='meter')upgradeMeter(s);
    }catch(err){
      renderer=null;if(controls){controls.dispose();controls=null;}wrap.classList.add('scene3d-fallback6');active=stage;stage.state=s;stage.shell=shell;stage.wrap=wrap;
      if(typeof DEVICE5!=='undefined'&&DEVICE5[id]){const fallback=document.createElement('div');fallback.className='device-scene5';fallback.innerHTML=window.sceneSVG5?.(id,s)||'';wrap.insertBefore(fallback,wrap.querySelector('.scene3d-hud6'));window.wireScene5?.(fallback,id,s);}else shell.classList.add('fallback-canvas7');
      wrap.querySelector('.scene3d-hud6>span').textContent=T('兼容实验视图','COMPATIBLE LAB VIEW');wrap.querySelector('[data-view-orbit6]')?.remove();wrap.querySelector('[data-view-orbit-pause9]')?.remove();wrap.querySelector('[data-view-orbit-stop9]')?.remove();wrap.querySelector('[data-view-reset6]')?.remove();
      wrap.querySelector('.scene3d-hud6 small').textContent=T('未检测到 WebGL 2，已切换兼容模型；更新显卡驱动可启用3D。','WebGL 2 unavailable; using a compatible model. Update graphics drivers to enable 3D.');
    }
  }
  const eventCanvases=new WeakSet();
  function installCanvasEvents(canvas){
    if(eventCanvases.has(canvas))return;eventCanvases.add(canvas);const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let dragging=null,down=null;
    const cast=e=>{const r=canvas.getBoundingClientRect();pointer.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(pointer,active.camera);return ray;};
    canvas.addEventListener('pointerdown',e=>{if(!active)return;const r=cast(e),s=active.state;
      if(active.refs.markers8){const hits=r.intersectObjects(Object.values(active.refs.markers8).filter(marker=>marker.visible),false);if(hits.length){const name=hits[0].object.userData.robotJoint8;if(name){s.selectedJoint=name;s.showAxes=true;window.paint4?.(active.id,s);let selected=null;document.querySelectorAll('[data-joint8]').forEach(input=>{const yes=input.dataset.joint8===name,row=input.closest('label');row?.classList.toggle('selected-joint8',yes);if(row){row.style.outline=yes?'2px solid var(--accent, #cc793d)':'';row.style.outlineOffset=yes?'4px':'';if(yes)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');}if(yes)selected=input;});selected?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:reduced()?'auto':'smooth'});selected?.focus?.({preventScroll:true});e.preventDefault();e.stopImmediatePropagation();return;}}}
      if(active.refs.holes8){const hits=r.intersectObjects(Object.values(active.refs.holes8),true);if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.hole8)obj=obj.parent;if(obj){const key=s.nextPoint8==='holeB'?'holeB':'holeA';s[key]=obj.userData.hole8;s.nextPoint8=key==='holeA'?'holeB':'holeA';window.paint4?.(active.id,s);e.preventDefault();e.stopImmediatePropagation();return;}}}
      if(active.id==='meter'){
        const hits=r.intersectObjects(active.refs.dial.children,true);if(hits.length){const modes=['voltage','current','resistance','continuity'],i=modes.indexOf(s.mode);setMode(modes[(i+1)%modes.length]);e.stopImmediatePropagation();e.preventDefault();return;}
        for(const [name,obj] of Object.entries(active.refs.jacks)){if(r.intersectObject(obj,true).length){if(name!=='COM')setJack(name==='mA'?'current':name==='10A'?'10a':'voltage');e.stopImmediatePropagation();e.preventDefault();return;}}
        const roots=[['red',active.refs.leads.red],['black',active.refs.leads.black]];for(const [kind,obj] of roots){if(r.intersectObject(obj,true).length){dragging=kind;down={x:e.clientX,y:e.clientY,old:s.probes[kind]};if(controls)controls.enabled=false;canvas.setPointerCapture?.(e.pointerId);e.stopImmediatePropagation();e.preventDefault();return;}}
      }
      if(active.id==='robot'&&r.intersectObject(active.refs.target,true).length){dragging='robot-target';if(controls)controls.enabled=false;canvas.setPointerCapture?.(e.pointerId);e.stopImmediatePropagation();e.preventDefault();}
    },true);
    canvas.addEventListener('pointermove',e=>{if(!dragging||!active)return;cast(e);const point=new THREE.Vector3(),s=active.state;if(dragging==='robot-target'){if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.39),point)){s.p.x=Math.round(Math.max(-220,Math.min(220,point.x/.012)));s.p.y=Math.round(Math.max(-120,Math.min(220,-point.z/.012)));document.querySelectorAll('[data-param]').forEach(el=>{el.value=s.p[el.dataset.param];});window.updateValues4?.();window.paint4?.('robot',s);}return;}if(active.id!=='meter'||!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.55),point))return;const posts=active.refs.posts;let best=null,d=.7;for(const [k,g] of Object.entries(posts)){const q=g.getWorldPosition(new THREE.Vector3()),dist=Math.hypot(q.x-point.x,q.z-point.z);if(dist<d){d=dist;best=k;}}if(best){s.probes[dragging]=best;window.paint4?.('meter',s);}},true);
    const end=e=>{if(!dragging)return;if(controls)controls.enabled=true;dragging=null;down=null;};canvas.addEventListener('pointerup',end,true);canvas.addEventListener('pointercancel',end,true);
  }
  function resize(stage){if(!renderer||!stage?.wrap)return;const w=stage.wrap.clientWidth||900,h=stage.wrap.clientHeight||460;renderer.setSize(w,h,false);stage.camera.aspect=w/h;if(stage.home&&!controls?._userInteracted){const offset=stage.home.position.clone().sub(stage.home.target).multiplyScalar(Math.max(1,1.45/(w/h)));stage.camera.position.copy(stage.home.target).add(offset);stage.camera.lookAt(stage.home.target);}stage.camera.updateProjectionMatrix();}
  let loopStarted=false;
  function drawLoop(){if(loopStarted)return;loopStarted=true;const tick=()=>{if(active&&renderer&&active.wrap?.isConnected&&!document.hidden){if(controls){controls.autoRotate=!!active.orbit&&!!active.orbitRunning9;controls.update();}active.update?.(active.state);renderer.render(active.scene,active.camera);}renderFrame=requestAnimationFrame(tick);};renderFrame=requestAnimationFrame(tick);}
  function syncOrbit9(stage){stage.wrap?.querySelector('[data-view-orbit6]')?.setAttribute('aria-pressed',String(!!stage.orbitRunning9));const pause=stage.wrap?.querySelector('[data-view-orbit-pause9]');if(pause)pause.disabled=!stage.orbitRunning9;}
  function motionControl9(action){if(!active)return;const stage=active;if(action==='start'){if(stage.orbit)stage.orbitRunning9=true;}else{stage.orbitRunning9=false;if(controls){controls.autoRotate=false;const position=stage.camera.position.clone(),target=controls.target.clone(),damping=controls.enableDamping;controls.enableDamping=false;controls.update();stage.camera.position.copy(position);controls.target.copy(target);controls.update();controls.enableDamping=damping;}if(action==='stop'){stage.orbit=false;stage.saved=null;if(stage.home){stage.camera.position.copy(stage.home.position);stage.target.copy(stage.home.target);if(controls){controls._userInteracted=false;controls.target.copy(stage.home.target);controls.update();resize(stage);}else stage.camera.lookAt(stage.target);}}}syncOrbit9(stage);}
  function setMode(mode){if(!active||active.id!=='meter')return;const s=active.state;s.mode=mode;const modeEl=document.querySelector('[data-setting="mode"]');if(modeEl)modeEl.value=mode;upgradeMeter(s);window.paint4?.('meter',s);}
  function setJack(jack){if(!active||active.id!=='meter')return;const s=active.state;s.jack=jack;const el=document.querySelector('[data-setting="jack"]');if(el)el.value=jack;upgradeMeter(s);window.paint4?.('meter',s);}
  function install(){
    const priorPaint=window.paint4,priorRender=window.render4;
    window.paint4=function(id,s){priorPaint(id,s);const shell=document.querySelector('.bench-canvas4');if(!shell)return;let wrap=shell.querySelector('.scene3d-stage6');if(!wrap||wrap.dataset.scene3d!==id)mount(shell,id,s);else if(active){active.state=s;active.update?.(s);if(wrap.classList.contains('scene3d-fallback6')){const fallback=wrap.querySelector('.device-scene5');if(fallback)fallback.innerHTML=window.sceneSVG5?.(id,s)||'';}if(id==='meter')upgradeMeter(s);}};
    window.render4=function(){priorRender();let bench=document.querySelector('[data-bench]');if(bench&&bench.dataset.bench==='meter')upgradeMeter(window.sim4('meter'));prepareGallery();};
    window.workbench4=(()=>{const old=window.workbench4;return function(id,embedded){return old(id,embedded);};})();
    document.addEventListener('click',e=>{const b=e.target.closest('[data-meter-mode6]');if(b){setMode(b.dataset.meterMode6);}});
    document.addEventListener('change',e=>{if(active?.id!=='meter'||e.target.dataset.setting!=='place')return;const s=active.state;s.probes={red:e.target.value==='series'?'series':e.target.value==='led'?'anode':'plus',black:'minus'};s.place=e.target.value;},true);
    document.addEventListener('change',e=>{if(active?.id!=='meter')return;const s=active.state;if(e.target.dataset.probe6){s.probes[e.target.dataset.probe6]=e.target.value;window.paint4?.('meter',s);return;}if(e.target.dataset.setting==='range'){s.range=e.target.value;upgradeMeter(s);window.paint4?.('meter',s);}else if(e.target.dataset.setting==='mode'){setMode(e.target.value);}else if(e.target.dataset.setting==='jack'){setJack(e.target.value);}});
    window.addEventListener('resize',()=>resize(active));
  }
  function focusView(kind){
    if(!active||!controls)return;const stage=active;stage.orbit=false;stage.orbitRunning9=false;controls.autoRotate=false;controls._userInteracted=true;syncOrbit9(stage);
    let view=stage.focusViews8?.[kind];
    if(kind==='whole'){controls._userInteracted=false;stage.camera.position.copy(stage.home.position);controls.target.copy(stage.home.target);controls.update();resize(stage);return;}
    if(!view&&stage.id==='meter')view=kind==='panel'?{position:[-2.05,1.48,4.55],target:[-2.05,1.43,.4]}:{position:[.9,3.4,3.3],target:[.7,.65,.2]};
    if(!view){const target=stage.home.target.clone(),offset=stage.home.position.clone().sub(target).multiplyScalar(kind==='panel'?.58:.72);view={position:target.clone().add(offset).toArray(),target:target.toArray()};}
    stage.camera.position.set(...view.position);controls.target.set(...view.target);controls.update();stage.wrap.querySelector('[data-view-orbit6]')?.setAttribute('aria-pressed','false');
  }
  window.SCENE3D6={THREE,OrbitControls,stages,install,mount,prepareGallery,focusView,motionControl9,resize:()=>resize(active),get active(){return active;},rangeOptions,createPreview};
})();
