const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),checks=[];
const near=(a,b,eps=1e-8)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=eps,`${a} != ${b}`);
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const pass=(name,run)=>{run();checks.push(name);console.log('PASS '+name);};
const output=path.join(root,'dev-notes/robotics-v8-results.json');
(async()=>{
 const esbuild=require('./desktop-runtime/node_modules/esbuild');
 const result=esbuild.buildSync({entryPoints:[path.join(root,'src/robotics-v8.js')],bundle:true,platform:'node',format:'cjs',write:false,legalComments:'inline'}).outputFiles[0].text;
 const box={exports:{}},context=vm.createContext({module:box,exports:box.exports,atob,console,Uint8Array,Uint16Array,Uint32Array,Int8Array,Float32Array});vm.runInContext(result,context);
 const {ROBOT_CONFIG8:configs,createRobotState8,normalizedJoints8,setRobotJoint8,applyRobotPreset8,sampleRobotPose8,forwardKinematics8,createRobotBuilders8}=box.exports;
 const {JSDOM}=await import('./dom-runtime/node_modules/jsdom/lib/api.js'),THREE=await import('./desktop-runtime/node_modules/three/build/three.module.js');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/robots-v8/manifest.json'),'utf8'));
 const xmlDocs=Object.fromEntries(Object.keys(configs).map(id=>[id,new JSDOM(fs.readFileSync(path.join(root,'assets/robots-v8',id,'robot.urdf'),'utf8'),{contentType:'application/xml'}).window.document]));
 const plain=value=>JSON.parse(JSON.stringify(value));
 const vector=(element,name,defaultValue)=>element?.getAttribute(name)?.split(/\s+/).map(Number)||defaultValue;
 pass('Official source revisions, BSD licenses and visual-mesh inventory are retained',()=>{
  assert.deepEqual(Object.keys(configs).sort(),['go2','ur5']);
  for(const [id,c]of Object.entries(configs)){const entry=manifest.models[id];assert.equal(c.commit,entry.commit);assert.match(c.commit,/^[a-f0-9]{40}$/);assert.equal(entry.license,'BSD-3-Clause');
   assert.equal(hash(path.join(root,'assets/robots-v8',id,'robot.urdf')),entry.urdfSha256);const license=fs.readFileSync(path.join(root,'assets/robots-v8',id,'LICENSE-BSD-3-Clause.txt'),'utf8');assert.equal(c.licenseText,license);assert.match(license,/Redistribution and use/);assert.match(license,/Neither the name/);assert.match(license,/AS IS/);assert.equal(entry.geometry,'official visual DAE meshes, indexed and quantized; not collision proxies');
   assert.equal(entry.meshFiles.length,7);assert.ok(entry.meshFiles.every(m=>m.file.endsWith('.dae')&&m.sourceBytes>0&&/^[a-f0-9]{64}$/.test(m.sourceSha256)));
  }
  assert.match(configs.go2.source,/github\.com\/unitreerobotics\/unitree_ros/);assert.match(configs.ur5.source,/github\.com\/UniversalRobots\/Universal_Robots_ROS2_Description/);
  const go2pkg=fs.readFileSync(path.join(root,'assets/robots-v8/go2/package.upstream.xml'),'utf8');assert.match(go2pkg,/<license>BSD<\/license>/);
  const ur5Readme=fs.readFileSync(path.join(root,'assets/robots-v8/ur5/README.upstream.md'),'utf8');assert.match(ur5Readme,/All other content is licensed under the BSD-3-Clause license/);
 });
 pass('All joint names, parents, origins, axes and limits exactly match the retained URDF',()=>{
  for(const [id,c]of Object.entries(configs)){const doc=xmlDocs[id],joints=Array.from(doc.querySelectorAll('robot > joint'));assert.equal(c.jointTree.length,joints.length);assert.equal(c.linkNames.length,doc.querySelectorAll('robot > link').length);
   for(const e of joints){const j=c.jointTree.find(x=>x.name===e.getAttribute('name'));assert.ok(j);assert.equal(j.type,e.getAttribute('type'));assert.equal(j.parent,e.querySelector('parent').getAttribute('link'));assert.equal(j.child,e.querySelector('child').getAttribute('link'));
    assert.deepEqual(plain(j.xyz),vector(e.querySelector('origin'),'xyz',[0,0,0]));assert.deepEqual(plain(j.rpy),vector(e.querySelector('origin'),'rpy',[0,0,0]));assert.deepEqual(plain(j.axis),vector(e.querySelector('axis'),'xyz',[1,0,0]));
    if(j.type==='revolute'){const lim=e.querySelector('limit');near(j.lower,Number(lim.getAttribute('lower')));near(j.upper,Number(lim.getAttribute('upper')));assert.ok(j.upper>j.lower);near(Math.hypot(...j.axis),1);}
   }
   assert.equal(c.joints.length,id==='go2'?12:6);const reached=new Set([c.root]);for(let n=0;n<c.jointTree.length;n++)for(const j of c.jointTree)if(reached.has(j.parent))reached.add(j.child);assert.equal(reached.size,c.linkNames.length);
  }
 });
 pass('Joint controls clamp each physical limit, reject invalid commands and reset exactly',()=>{
  for(const [id,c]of Object.entries(configs)){const s=createRobotState8(id),start=plain(s.joints);
   for(const j of c.joints){near(setRobotJoint8(id,s,j.name,j.min-2),j.min);near(setRobotJoint8(id,s,j.name,j.max+2),j.max);assert.throws(()=>setRobotJoint8(id,s,j.name,NaN));}
   assert.throws(()=>setRobotJoint8(id,s,'missing_joint',0));applyRobotPreset8(id,s);assert.deepEqual(plain(s.joints),start);assert.equal(s.run,false);assert.equal(s.t,0);
   for(const p of c.presets){applyRobotPreset8(id,s,p.id);for(const j of c.joints)assert.ok(s.joints[j.name]>=j.min&&s.joints[j.name]<=j.max);}
   for(let phase=0;phase<10;phase+=.13){const q=sampleRobotPose8(id,phase);for(const j of c.joints)assert.ok(Number.isFinite(q[j.name])&&q[j.name]>=j.min&&q[j.name]<=j.max);}
  }
 });
 pass('Go2 forward kinematics agrees with an independently calculated symmetric leg pose',()=>{
  const q=Object.fromEntries(configs.go2.joints.map(j=>[j.name,j.name.includes('thigh')?.8:j.name.includes('calf')?-1.6:0]));const fk=forwardKinematics8('go2',q);
  for(const leg of ['FL','FR','RL','RR']){const p=fk[leg+'_foot'].position;near(p[0],leg.startsWith('F')?.1934:-.1934);near(p[1],leg.endsWith('L')?.142:-.142);near(p[2],-2*.213*Math.cos(.8));}
 });
 const builders=createRobotBuilders8({THREE,bench(){},label(text){return {text,update(v){this.text=v;}};}});
 const build=id=>{const stage={scene:new THREE.Scene(),refs:{},target:new THREE.Vector3(),camera:new THREE.PerspectiveCamera(38,1,.01,100)};builders[id](stage);return stage;};
 const stages={};
 pass('Real indexed Three.js visual meshes decode within size, normal and geometry bounds',()=>{
  assert.ok(fs.statSync(path.join(root,'src/robot-assets-v8.js')).size<15*1024*1024);assert.equal(manifest.totalTriangles,292530);
  for(const id of Object.keys(configs)){const st=stages[id]=build(id);let meshes=0,triangles=0;const seen=new Set();
   st.refs.robot8.traverse(o=>{if(!o.isMesh||!o.userData.robotAsset8)return;meshes++;const geometry=o.geometry;if(seen.has(geometry))return;seen.add(geometry);const pos=geometry.attributes.position,norm=geometry.attributes.normal,index=geometry.index;
    for(const n of pos.array)assert.ok(Number.isFinite(n));for(const n of index.array)assert.ok(n>=0&&n<pos.count);for(let i=0;i<norm.count;i+=Math.max(1,Math.floor(norm.count/300)))near(Math.hypot(norm.getX(i),norm.getY(i),norm.getZ(i)),1,.013);
    assert.ok(Array.isArray(o.material)&&o.material.length>0);assert.ok(geometry.groups.length>0);let covered=0;for(const group of geometry.groups){assert.equal(group.start,covered);assert.ok(group.count>0&&group.count%3===0);assert.ok(group.materialIndex>=0&&group.materialIndex<o.material.length);covered+=group.count;}assert.equal(covered,index.count,'Every triangle has a valid material group');
    triangles+=index.count/3;assert.ok(geometry.boundingSphere.radius>0&&Number.isFinite(geometry.boundingSphere.radius));
   });
   assert.ok(meshes>(id==='go2'?12:6));assert.equal(triangles,manifest.models[id].meshFiles.reduce((sum,file)=>sum+file.triangles,0));const bounds=new THREE.Box3().setFromObject(st.refs.robot8),size=bounds.getSize(new THREE.Vector3());assert.ok(size.x>.5&&size.y>.5&&size.z>.5);assert.ok(Math.max(...size.toArray())<12,'No millimetre/metre scaling error');
  }
 });
 pass('Every rendered link agrees with numerical FK through all presets and boundary angles',()=>{
  const world=new THREE.Vector3();
  for(const [id,c]of Object.entries(configs)){const st=stages[id],s=createRobotState8(id);
   const poses=[...c.presets.map(p=>p.joints),Object.fromEntries(c.joints.map((j,i)=>[j.name,i%2?j.min:j.max]))];
   for(const q of poses){s.joints=normalizedJoints8(id,q);st.refs.update(s);const fk=forwardKinematics8(id,s.joints);st.scene.updateMatrixWorld(true);
    for(const name of c.linkNames){st.refs.links8[name].getWorldPosition(world);st.refs.robot8.worldToLocal(world);for(let k=0;k<3;k++)near(world.toArray()[k],fk[name].position[k],2e-7);}
    for(const name of c.endpoints)assert.deepEqual(plain(st.refs.endpoints8[name]),plain(fk[name].position));
   }
  }
 });
 pass('Moving a joint moves its descendants but leaves an unrelated branch unchanged',()=>{
  const st=stages.go2,s=createRobotState8('go2');st.refs.update(s);const before=plain(st.refs.endpoints8);setRobotJoint8('go2',s,'FL_thigh_joint',1.15);st.refs.update(s);
  assert.notDeepEqual(plain(st.refs.endpoints8.FL_foot),before.FL_foot);for(const leg of ['FR','RL','RR'])assert.deepEqual(plain(st.refs.endpoints8[leg+'_foot']),before[leg+'_foot']);
  const arm=stages.ur5,a=createRobotState8('ur5');arm.refs.update(a);const p=plain(arm.refs.endpoints8.tool0);setRobotJoint8('ur5',a,'elbow_joint',1.1);arm.refs.update(a);assert.notDeepEqual(plain(arm.refs.endpoints8.tool0),p);
 });
 pass('Selection axes and repeated redraws never integrate simulation state',()=>{
  for(const [id,st]of Object.entries(stages)){const s=createRobotState8(id);s.selectedJoint=configs[id].joints.at(-1).name;s.showAxes=true;const before=JSON.stringify(s);for(let i=0;i<30;i++)st.refs.update(s);assert.equal(JSON.stringify(s),before);
   for(const [name,axis]of Object.entries(st.refs.axes8))assert.equal(axis.visible,name===s.selectedJoint);s.showAxes=false;st.refs.update(s);assert.ok(Object.values(st.refs.axes8).every(x=>!x.visible));
  }
 });
 pass('Geometry and kinematic module require no runtime network, loaders or absolute machine paths',()=>{
  for(const file of ['src/robotics-v8.js','src/robot-assets-v8.js']){const text=fs.readFileSync(path.join(root,file),'utf8');assert.doesNotMatch(text,/\b(?:fetch|XMLHttpRequest|loadAsync)\s*\(/);assert.doesNotMatch(text,/[A-Z]:[\\/](?:Users|Codex|Engineering)[\\/]/);}
  assert.match(result,/BSD 3-Clause License/);assert.match(result,/HangZhou YuShu/);assert.match(configs.ur5.scope[1],/Not calibrated/);assert.match(configs.go2.scope[1],/no forces, balance, collisions/);
 });
 const report={passed:true,checks,models:Object.fromEntries(Object.entries(configs).map(([id,c])=>[id,{joints:c.joints.length,links:c.linkNames.length,commit:c.commit,license:c.license}])),assetBytes:fs.statSync(path.join(root,'src/robot-assets-v8.js')).size,scope:'Source-module numerical, retained-URDF, geometry and license/provenance regression using real Three.js objects. Does not establish rendered appearance, dynamics, collision safety or physical robot calibration.'};
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log('ALL PASSED '+checks.length);
})().catch(e=>{fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({passed:false,checks,error:e.stack},null,2));console.error(e);process.exitCode=1;});
