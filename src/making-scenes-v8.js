export function createMakingBuilders8(h) {
  const {THREE,mesh,mat,rounded,cyl,sphere,label,line,straight,bench}=h;
  const views=(st,pos,target=[0,.7,0])=>{st.target.set(...target);st.camera.position.set(...pos);st.camera.lookAt(st.target);};
  function board(st,perf=false){
    const {scene,refs}=st;bench(scene,0,0,6.7,4.9);const group=new THREE.Group();group.position.y=.56;scene.add(group);refs.board8=group;
    const base=rounded(5.15,.20,3.3,.1,perf?'#557e6c':'#e9e7d9');group.add(base);refs.base8=base;
    const holes={},pads={},strips=[];const rows=10;
    for(let r=1;r<=rows;r++)for(let c=0;c<10;c++){
      const x=perf?-1.665+c*.37:-1.86+c*.37+(c>=5?.38:0),z=-1.26+(r-1)*.28,id=String.fromCharCode(65+c)+r;
      const g=new THREE.Group();g.position.set(x,.108,z);g.userData.hole8=id;group.add(g);holes[id]=g;
      if(perf){const ring=mesh(new THREE.TorusGeometry(.065,.018,8,20),mat('#d6a65b',.65,.3),g);ring.rotation.x=Math.PI/2;pads[id]=ring;}
      cyl(.038,.038,.012,'#293c40',g,0,.007,0,12);
      const halo=mesh(new THREE.TorusGeometry(.08,.012,8,18),mat('#46a7a0',.15,.4),g);halo.rotation.x=Math.PI/2;halo.position.y=.023;halo.visible=false;g.userData.halo8=halo;
    }
    for(let r=1;r<=rows;r++){
      const z=-1.26+(r-1)*.28;
      if(!perf)for(let side=0;side<2;side++){const bar=mesh(new THREE.BoxGeometry(1.57,.035,.13),mat('#b99c66',.65,.32),group,-1.12+side*2.23,-.015,z);strips.push(bar);}
      const t=label(String(r),.14,.13,group,-2.44,.12,z,{bg:perf?'#557e6c':'#e9e7d9',color:perf?'#f1e6cb':'#354b4c',font:190});t.mesh.rotation.x=-Math.PI/2;
    }
    if(!perf){
      const slot=mesh(new THREE.BoxGeometry(.20,.011,3.05),mat('#c5c8be'),group,.015,.106,0);
      for(const [side,color]of [[-1,'#bd644d'],[1,'#42879a']])for(let half=0;half<2;half++){
        const x=side*2.17,z=half? .77:-.77;const bar=mesh(new THREE.BoxGeometry(.12,.025,1.35),mat(color),group,x,-.01,z);strips.push(bar);
        for(let n=0;n<5;n++){const id=`${side<0?'P':'N'}${half*5+n+1}`,g=new THREE.Group();g.position.set(x,.108,-1.26+(half*5+n)*.28);g.userData.hole8=id;group.add(g);cyl(.036,.036,.012,'#293c40',g,0,.007,0,12);holes[id]=g;const halo=mesh(new THREE.TorusGeometry(.075,.012,8,16),mat('#f1b04d'),g);halo.rotation.x=Math.PI/2;halo.position.y=.02;halo.visible=false;g.userData.halo8=halo;}
      }
    }
    for(let c=0;c<10;c++){const x=perf?-1.665+c*.37:-1.86+c*.37+(c>=5?.38:0),t=label(String.fromCharCode(65+c),.17,.15,group,x,.12,-1.52,{bg:perf?'#557e6c':'#e9e7d9',color:perf?'#f1e6cb':'#334b4b',font:190});t.mesh.rotation.x=-Math.PI/2;}
    if(!perf)for(const [id,x,color]of [['P',-2.17,'#a34e37'],['N',2.17,'#326c87']]){const t=label(id,.22,.16,group,x,.125,-1.52,{bg:'#e9e7d9',color,font:190});t.mesh.rotation.x=-Math.PI/2;}
    const leadGroup=new THREE.Group();group.add(leadGroup);refs.wires8=leadGroup;refs.holes8=holes;refs.strips8=strips;
    refs.legend8=label(perf?'ISOLATED COPPER PADS':'5-HOLE STRIPS · SPLIT RAILS',3.9,.22,scene,0,1.03,-1.85,{bg:'#35505b',color:'#f4e6bd'});
    let signature='';
    refs.update=s=>{
      const selected=s.holeA||'A1',connected=window.WIRING8?.connected?.(s,selected)||new Set([selected]);
      for(const [id,g]of Object.entries(holes)){g.userData.halo8.visible=s.showNets!==false&&connected.has(id)||id===s.holeB;g.userData.halo8.material.color.set(id===s.holeB?'#da8b42':'#39a59a');}
      if(base.material.transparent!==!!s.xray){base.material.transparent=!!s.xray;base.material.needsUpdate=true;}
      base.material.opacity=s.xray?.25:1;base.material.depthWrite=!s.xray;
      strips.forEach(o=>{o.visible=!!s.xray;});
      const next=JSON.stringify(s.wires||[]);if(signature!==next){signature=next;while(leadGroup.children.length){const o=leadGroup.children[0];leadGroup.remove(o);o.traverse(q=>{q.geometry?.dispose();if(q.material)q.material.dispose();});}
        for(const [i,pair]of(s.wires||[]).entries()){const a=holes[pair[0]]?.position,b=holes[pair[1]]?.position;if(!a||!b)continue;const mid=a.clone().add(b).multiplyScalar(.5);mid.y=.30+Math.min(.45,a.distanceTo(b)*.15);line([[a.x,.13,a.z],[a.x,.28,a.z],[mid.x,mid.y,mid.z],[b.x,.28,b.z],[b.x,.13,b.z]],['#d67c51','#4d91a6','#9a9164','#566c76'][i%4],.025,leadGroup);if(perf)for(const p of[a,b])sphere(.065,'#b8c3c0',leadGroup,p.x,.14,p.z,14);}
      }
    };views(st,[3.0,4.5,5.4],[0,.55,0]);st.focusViews8={panel:{position:[.2,5.5,.6],target:[0,.55,0]},wiring:{position:[1.3,3,3.5],target:[0,.6,0]}};
  }
  function drone(st){
    const {scene,refs}=st;bench(scene,0,0,6.5,4.9);const assembly=new THREE.Group();scene.add(assembly);const parts={};
    const part=(key,obj,position)=>{obj.position.set(...position);assembly.add(obj);obj.userData.home8=obj.position.clone();parts[key]=obj;return obj;};
    const frame=new THREE.Group();part('frame',frame,[0,.68,0]);for(let i=0;i<2;i++){const arm=rounded(3.5,.13,.23,.04,'#3f5056');arm.rotation.y=(i?-.25:.25)*Math.PI;frame.add(arm);}const plate=rounded(1.05,.12,1.2,.08,'#657d7c');frame.add(plate);
    const fc=new THREE.Group();part('fc',fc,[0,.91,0]);fc.add(rounded(.64,.13,.76,.03,'#6d9b7a'));const chip=rounded(.23,.04,.23,.02,'#293b43');chip.position.y=.09;fc.add(chip);const arrow=mesh(new THREE.ConeGeometry(.07,.30,3),mat('#f0d389'),fc,0,.11,-.21);arrow.rotation.x=-Math.PI/2;
    const esc=new THREE.Group();part('esc',esc,[0,.79,0]);esc.add(rounded(.81,.08,.86,.02,'#7f8d98'));
    const battery=new THREE.Group();part('battery',battery,[0,1.18,.02]);battery.add(rounded(.62,.30,1.08,.055,'#ac7654'));label('BATTERY',.52,.15,battery,0,.08,.55,{bg:'#ac7654',color:'#fff4df'});
    const rx=new THREE.Group();part('receiver',rx,[-.73,.83,.24]);rx.add(rounded(.28,.11,.45,.04,'#2e5867'));straight([0,.1,0],[0,.55,.10],.012,'#2b3d45',rx);
    const gps=new THREE.Group();part('gnss',gps,[.70,1.2,.20]);cyl(.015,.015,.4,'#344b55',gps,0,-.16,0);cyl(.17,.17,.07,'#e9e5d6',gps,0,.06,0,32);
    const motors=new THREE.Group();part('motors',motors,[0,.79,0]);refs.rotors8=[];refs.props8=[];
    const positions=[[-1.23,-1.23],[1.23,-1.23],[1.23,1.23],[-1.23,1.23]];
    positions.forEach(([x,z],i)=>{cyl(.21,.23,.24,'#537887',motors,x,.08,z,36);const rotor=new THREE.Group();rotor.position.set(x,.23,z);motors.add(rotor);for(let j=0;j<4;j++){const bar=mesh(new THREE.BoxGeometry(.02,.02,.30),mat('#d3b067'),rotor);bar.rotation.y=j*Math.PI/4;}const prop=rounded(.95,.025,.09,.02,'#556a70');prop.position.y=.035;rotor.add(prop);refs.props8.push(prop);refs.rotors8.push(rotor);const n=label(`M${i+1} ${i%2?'CW':'CCW'}`,.68,.16,motors,x,.50,z,{bg:'#35535a',color:'#e4ebd7'});});
    const status=label('ASSEMBLY · SIMULATED POWER OFF',3.5,.23,scene,0,1.65,-1.8,{bg:'#35535a',color:'#f5dca0'});refs.status8=status;refs.parts8=parts;refs.assembly8=assembly;
    refs.update=s=>{const flight=s.motionMode9==='flight'&&s.flight9;for(const [i,[key,obj]]of Object.entries(parts).entries()){obj.visible=!!flight||!!s.assembled?.includes(key);obj.position.copy(obj.userData.home8);if(key!=='frame'&&!flight)obj.position.y+=(s.p.explode||0)*(i*.25+.15);}
      // The controller arrow points along -Z: roll about forward (-Z), pitch about right (+X), yaw about up (+Y).
      assembly.position.set(flight?flight.x:0,flight?flight.y:0,flight?flight.z:0);assembly.rotation.set(flight?flight.pitch:(s.p.pitch||0)*Math.PI/180,flight?flight.yaw:(s.p.yaw||0)*Math.PI/180,flight?-flight.roll:-(s.p.roll||0)*Math.PI/180);refs.props8.forEach(p=>p.visible=!!flight||!!s.props);refs.rotors8.forEach((r,i)=>r.rotation.y=flight?flight.rotors[i]:(s.motorAngles?.[i]||0));const power=s.on?'SIMULATED POWER ON':'SIMULATED POWER OFF';status.update(flight?`FLIGHT TEACHING DEMO · ${flight.y.toFixed(2)} m`:s.activeMotor>=0&&s.on?`M${s.activeMotor+1} · ${power} · NO PROPS`:s.props?`PROPELLERS FITTED · TEST LOCKED · ${power}`:`ASSEMBLED ${s.assembled?.length||0}/7 · ${power}`);};
    views(st,[4.4,4.4,6.4],[0,.9,0]);st.focusViews8={panel:{position:[1.1,3,2.9],target:[0,.9,0]},wiring:{position:[3.3,2.0,4.0],target:[0,.85,0]}};
  }
  return {breadboard:st=>board(st,false),perfboard:st=>board(st,true),drone};
}
