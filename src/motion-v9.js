/* Explicit teaching motion. State owns time; drawing never advances an experiment. */
(() => {
  const TAU=Math.PI*2,clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),copy=x=>JSON.parse(JSON.stringify(x));
  const modes={go2:['walk','pose'],drone:['bench','flight']};
  const initialWalk=()=>({phase:0,distance:0,x:0,y:0,heading:0,height:.30,contacts:{FL:true,FR:true,RL:true,RR:true}});
  const initialFlight=()=>({elapsed:0,phase:0,x:0,y:0,z:0,roll:0,pitch:0,yaw:0,rotors:[0,0,0,0]});
  const setting=()=>window.ProfileStore9?.getSettings?.().motion||'system';
  const systemMotion9=matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=()=>setting()==='reduced'||setting()==='system'&&systemMotion9.matches;
  Object.assign(FIELD4,{cadence9:['步频','Gait frequency','Hz'],stride9:['步幅','Stride length','m'],lift9:['抬脚高度','Foot lift','m'],altitude9:['演示高度','Demo altitude','m'],speed9:['路径播放速度','Path playback speed','×']});
  function walkPose(s){
    const step=clamp(Number(s.p.stride9)||.10,.04,.14),lift=clamp(Number(s.p.lift9)||.045,.01,.07),height=.30,period=s.walk9.phase,duty=.60,q={},contacts={};
    for(const leg of ['FL','FR','RL','RR']){const phase=((period+(['FL','RR'].includes(leg)?0:.5))%1+1)%1;let x,z=-height;contacts[leg]=phase<duty;
      if(phase<duty)x=step*(.5-phase/duty);else{const u=(phase-duty)/(1-duty),ease=u*u*(3-2*u);x=step*(-.5+ease);z+=lift*Math.sin(Math.PI*u);}
      const l=.213,knee=-Math.acos(clamp((x*x+z*z-2*l*l)/(2*l*l),-1,1)),hip=Math.atan2(-x,-z)-Math.atan2(l*Math.sin(knee),l+l*Math.cos(knee));
      q[leg+'_hip_joint']=0;q[leg+'_thigh_joint']=hip;q[leg+'_calf_joint']=knee;
    }
    s.walk9.height=height;s.walk9.contacts=contacts;s.joints=window.RobotKinematics8.normalize('go2',q);s.preset='walk';
  }
  function initialize(id,s){if(s.motionReady9)return s;s.motionReady9=true;s.run=false;s.stopped9=true;
    if(id==='go2'){s.motionMode9='walk';Object.assign(s.p,{cadence9:1.1,stride9:.10,lift9:.045});s.walk9=initialWalk();walkPose(s);}
    if(id==='drone'){s.motionMode9='bench';Object.assign(s.p,{altitude9:1.2,speed9:1});s.flight9=initialFlight();}
    return s;
  }
  const priorSim=sim4;sim4=function(id){return initialize(id,priorSim(id));};
  const priorHero=rcPreviewState7;rcPreviewState7=function(){return initialize('rc',priorHero());};
  const priorAdvance=advance4;advance4=function(id,s,dt){
    if(!Number.isFinite(dt)||dt<=0)return;
    if(id==='go2'&&s.motionMode9==='walk'){
      s.t+=dt;const hz=clamp(Number(s.p.cadence9)||1.1,.4,1.8),stride=clamp(Number(s.p.stride9)||.10,.04,.14),r=.27;
      s.walk9.phase+=dt*hz;s.walk9.distance+=dt*stride*hz/.60;s.walk9.heading=s.walk9.distance/r;s.walk9.x=r*Math.sin(s.walk9.heading);s.walk9.y=r*(1-Math.cos(s.walk9.heading));walkPose(s);return;
    }
    if(id==='drone'&&s.motionMode9==='flight'){
      s.t+=dt;const f=s.flight9;f.elapsed+=dt;f.phase+=dt*clamp(Number(s.p.speed9)||1,.3,1.5)*.65;const a=clamp(f.elapsed/2,0,1),rise=a*a*(3-2*a),cruise=clamp((f.elapsed-2)/2,0,1),blend=cruise*cruise*(3-2*cruise),phase=f.phase-1.3;
      f.x=.65*Math.sin(phase)*blend;f.z=.45*Math.sin(2*phase)*blend;f.y=clamp(Number(s.p.altitude9)||1.2,.5,1.8)*rise+.04*Math.sin(2*phase)*blend;f.roll=.09*Math.sin(phase)*blend;f.pitch=.07*Math.cos(2*phase)*blend;f.yaw=.22*Math.sin(phase)*blend;
      f.rotors=f.rotors.map((v,i)=>(v+(i%2?-1:1)*dt*45)%TAU);return;
    }
    priorAdvance(id,s,dt);
  };
  const button=(action,hero=false)=>`<button type="button" data-motion9="${action}" ${hero?'data-motion-hero9="true"':''}>${action==='start'?T('开始','Start'):action==='pause'?T('暂停','Pause'):T('停止并复位','Stop & reset')}</button>`;
  const controls=hero=>`<span class="motion-controls9" role="group" aria-label="${T('动画控制','Animation controls')}">${button('start',hero)}${button('pause',hero)}${button('stop',hero)}</span>`;
  const priorWorkbench=workbench4;workbench4=function(id,embedded){return priorWorkbench(id,embedded).replace('<div class="transport4">','<div class="transport4">'+controls(false)).replace('<button data-sim="play"','<button hidden data-sim="play"').replace('<button data-sim="reset"','<button hidden data-sim="reset"');};
  const priorHome=home4;home4=function(){return priorHome().replace('<button data-hero-act7="play"',controls(true)+'<button hidden data-hero-act7="play"').replace('<button data-hero-act7="reset"','<button hidden data-hero-act7="reset"');};
  const modeButtons=(id,s)=>`<div class="motion-modes9" role="group" aria-label="${T('教学模式','Teaching mode')}">${modes[id].map(mode=>`<button data-motion-mode9="${mode}" aria-pressed="${s.motionMode9===mode}">${id==='go2'?(mode==='walk'?T('行走演示','Walking demo'):T('关节与姿态','Joints & poses')):(mode==='flight'?T('飞行教学演示','Flight teaching demo'):T('装配与无桨台架','Assembly & prop-free bench'))}</button>`).join('')}</div>`;
  const priorFields=fields4;fields4=function(id,s){
    if(id==='go2'){const head=modeButtons(id,s);if(s.motionMode9==='walk')return head+`<p class="motion-note9">${T('12个真实URDF关节跟随足端轨迹，机身沿示意圆路移动。步态和接触标记由运动学给定，没有计算力矩、平衡、摩擦或真实落足控制。','The 12 URDF joints follow foot trajectories while the body moves along a circular teaching path. Gait/contact markers are prescribed kinematically: no torque, balance, friction or physical foot-contact control.')}</p>`+parameter7('cadence9',s,1.1,.4,1.8,.1)+parameter7('stride9',s,.10,.04,.14,.01)+parameter7('lift9',s,.045,.01,.07,.005)+`<p class="console-hint7">${T('暂停保留当前姿态；停止回到起点和初始落足相位。切换“关节与姿态”可手动调整各关节。','Pause holds the current pose; Stop returns to the start and initial foot phase. Switch to Joints & poses to adjust each joint manually.')}</p>`;return head+priorFields(id,s);}
    if(id==='drone'){const head=modeButtons(id,s);if(s.motionMode9==='flight')return head+`<p class="motion-note9">${T('独立教学动画：完整飞机按给定路径起飞、移动和转动旋翼；不是气动力、飞控或真实飞机仿真。这里的完整装配与桨叶只属于演示，不会通过台架检查，也不会给台架供电。','A separate teaching animation: a complete aircraft rises and follows a prescribed path with moving rotors. This is not aerodynamics, a flight controller or a physical-aircraft simulation. Its assembly and propellers do not complete bench checks or supply bench power.')}</p>`+parameter7('altitude9',s,1.2,.5,1.8,.1)+parameter7('speed9',s,1,.3,1.5,.1)+`<p class="console-hint7">${T('点击开始起飞；暂停悬停在当前演示位置；停止回到地面起点，旋翼归零。','Start the takeoff; Pause holds the current demonstration pose; Stop returns to the ground start and resets all rotors.')}</p>`;return head+priorFields(id,s);}
    return priorFields(id,s);
  };
  function syncControls(s,hero=false){const area=hero?document.querySelector('.hero-controls7'):document.querySelector('.transport4');if(!area)return;area.querySelectorAll('[data-motion9]').forEach(b=>{b.disabled=b.dataset.motion9==='start'?s.run:b.dataset.motion9==='pause'?!s.run:false;});const scope=hero?document.querySelector('.hero-model7'):document.querySelector('.bench-canvas4');scope?.setAttribute('data-motion-running9',String(!!s.run));}
  const priorPaint=paint4;paint4=function(id,s){priorPaint(id,s);syncControls(s);let read=null,why=null;
    if(id==='go2'&&s.motionMode9==='walk'){read=`${T('行走运动学演示','Kinematic walking demo')} · ${T('路程','Distance')} ${s.walk9.distance.toFixed(2)} m · ${T('落足','Stance')} ${Object.values(s.walk9.contacts).filter(Boolean).length}/4`;why=T('关节位置由足端轨迹逆解得到；圆路位移是给定动画，不能据此判断真实机器狗能稳定行走。','Joint positions come from foot-trajectory inverse kinematics. Circular displacement is prescribed animation and does not establish stable physical walking.');}
    if(id==='drone'&&s.motionMode9==='flight'){read=`${T('飞行教学演示','Flight teaching demo')} · ${T('高度','Height')} ${s.flight9.y.toFixed(2)} m · X ${s.flight9.x.toFixed(2)} · Z ${s.flight9.z.toFixed(2)}`;why=T('位姿与旋翼角度由同一演示时间更新。暂停冻结全部运动，停止恢复起点；本页未求解升力或飞控闭环。','Pose and rotor angles use the same demonstration time. Pause freezes every motion and Stop restores the start; lift and flight-control feedback are not solved.');}
    if(read){const measure=document.querySelector('#measure4'),explain=document.querySelector('#explain4'),canvas=document.querySelector('.bench4 canvas');if(measure)measure.textContent=read;if(explain)explain.innerHTML=`<strong>${T('教学模型范围','Teaching model scope')}</strong><p>${E(why)}</p>`;if(canvas)canvas.dataset.read=read;}
  };
  const priorRefreshHero=refreshHero7;refreshHero7=function(shell){priorRefreshHero(shell);if(shell?.isConnected)syncControls(rcPreviewState7(),true);};
  function resetState(id,s,mode=s.motionMode9){delete SIM4[id];const fresh=sim4(id);if(modes[id]?.includes(mode))fresh.motionMode9=mode;if(id==='go2'&&mode==='pose'){fresh.joints=window.RobotKinematics8.normalize(id,window.ROBOT_CONFIG8[id].defaultPose);fresh.preset=window.ROBOT_CONFIG8[id].defaultPreset;}fields4(id,fresh);for(const key of Object.keys(s))delete s[key];Object.assign(s,fresh,{run:false,stopped9:true});SIM4[id]=s;return s;}
  function action(id,verb,{hero=false,render=true}={}){const s=hero?rcPreviewState7():sim4(id);
    if(verb==='start'){s.run=true;s.stopped9=false;}if(verb==='pause')s.run=false;
    if(verb==='stop'){if(hero){const fresh=initialize('rc',storyInitial('rc'));for(const key of Object.keys(s))delete s[key];Object.assign(s,fresh,{run:false,stopped9:true});}else resetState(id,s);last4=0;}
    window.SCENE3D6?.motionControl9?.(verb);if(render){if(hero)refreshHero7(document.querySelector('.hero-model7'));else if(verb==='stop')render4();else paint4(id,s);}return s;
  }
  function setMode(id,mode){if(!modes[id]?.includes(mode))throw Error('Unknown teaching mode');const s=sim4(id);resetState(id,s,mode);window.SCENE3D6?.motionControl9?.('stop');render4();return s;}
  function pauseAll(){window.Tooling10?.pause?.();for(const s of Object.values(SIM4))s.run=false;if(heroState7)heroState7.run=false;window.Foundations9?.pause?.();window.SCENE3D6?.motionControl9?.('pause');if(active4)syncControls(sim4(active4));if(document.querySelector('.hero-model7'))refreshHero7(document.querySelector('.hero-model7'));}
  window.addEventListener('click',e=>{const b=e.target.closest('[data-motion9],[data-motion-mode9],[data-hero-act7="reset"],[data-hero-act7="charge"],[data-hero-act7="discharge"],[data-sim="reset"],[data-drone8="stop"]');if(!b)return;
    if(b.dataset.heroAct7==='charge'||b.dataset.heroAct7==='discharge'){const s=rcPreviewState7();s.on=b.dataset.heroAct7==='charge';refreshHero7(document.querySelector('.hero-model7'));}
    else if(b.dataset.drone8==='stop'&&active4==='drone'){const s=sim4('drone');s.run=false;s.activeMotor=-1;s.on=false;s.motorAngles=[0,0,0,0];s.motorTestTime=0;window.SCENE3D6?.motionControl9?.('pause');refreshControls8('drone',s);}
    else if(b.dataset.motionMode9){if(active4)setMode(active4,b.dataset.motionMode9);}else{const hero=b.hasAttribute('data-motion-hero9')||b.dataset.heroAct7==='reset',id=hero?'rc':active4;if(id)action(id,b.dataset.motion9||'stop',{hero});}e.preventDefault();e.stopImmediatePropagation();},true);
  const priorNav=nav4;nav4=function(view,id){pauseAll();return priorNav(view,id);};
  window.addEventListener('zth-settings9',e=>{if(e.detail?.motion==='reduced'||e.detail?.motion==='system'&&systemMotion9.matches)pauseAll();document.documentElement.dataset.motionPreference9=e.detail?.motion||setting();});
  systemMotion9.addEventListener?.('change',e=>{if(setting()==='system'&&e.matches)pauseAll();});
  document.documentElement.dataset.motionPreference9=setting();
  window.Motion9={action,setMode,pauseAll,resetState,walkPose,initialWalk,initialFlight,reduced,initialize};
})();
