/* Teaching DMM: one validated result path. s.on is source output enable.
 * series is the LED-side return test point; minus is supply COM.
 * The current-input fuse is separate from the V/ohms measurement path.
 */
const MeterModel7 = {
 voltageRanges:{'2':2,'20':20,'200':200,'600':600},
 resistanceRanges:{'2k':2000,'20k':20000,'200k':200000},
 measure(s){
  const p=s.p||(s.p={}),probes=s.probes||(s.probes={red:'plus',black:'minus'});
  const mode=s.mode||'voltage',jack=s.jack||'voltage',range=s.range||'auto';
  const volts=Number(p.v??5),ohms=Number(p.r??330),powered=!!s.on;
  const pair=[probes.red,probes.black].sort().join(':'),same=probes.red===probes.black;
  const series=pair==='minus:series',resistor=pair==='anode:plus';
  const sourcePair=pair==='minus:plus'||pair==='plus:series',currentJack=jack==='current'||jack==='10a';
  const known=['plus','anode','minus','series'];
  if(s.fuse===undefined)s.fuse=true;
  s.place=series?'series':pair==='anode:minus'?'led':'source';
  s.seriesOpen=series;s.output=powered&&Number.isFinite(volts)?volts:0;s.current=0;s.led=0;
  let formula='I = max(0, Vs − 2 V) / R';
  const done=(read,why,status='ok',severity='ok',value=null)=>{
   s.meterStatus=status;s.meterSeverity=severity;
   return {read,why,formula,value,status,severity,valid:status==='ok'};
  };
  const fuseResult=()=>done(T('保险丝断开','Fuse open'),
   T('电流输入保护已断，不能把零读数当成“没有电流”。先关闭输出、移开表笔并修正接线，再复位实验。真实仪表须按说明书检查并使用指定保险丝。',
     'The current-input protection is open; a zero display would not prove that no current exists. Turn output off, remove the leads, correct the wiring, then reset. Follow the real meter manual and use its specified fuse.'),'fuse','danger');
  if(!Number.isFinite(volts)||volts<0||!Number.isFinite(ohms)||ohms<0||!known.includes(probes.red)||!known.includes(probes.black)){
   return done(T('检查电路参数或测试点','CHECK CIRCUIT / TEST POINTS'),
    T('电压和电阻必须是有限非负数，两根表笔必须使用已定义的测试点。',
      'Voltage and resistance must be finite non-negative values and both probes must use defined test points.'),'wiring','warning');
  }
  // The jack selects a low-resistance path even if the dial is wrong.
  // Immediate classroom trip; fuse I²t, arcing and source impedance are omitted.
  const sourceShort=powered&&volts>0&&currentJack&&!same&&sourcePair&&s.fuse;
  if(sourceShort)s.fuse=false;
  const returnClosed=!series||(currentJack&&s.fuse);
  if(powered&&returnClosed&&ohms>0)s.current=Math.max(0,(volts-2)/ohms);
  if(powered&&returnClosed)s.led=Math.min(volts,2);
  formula+='; Pᵣ = '+(s.current*s.current*ohms).toFixed(3)+' W';
  // Preconditions always precede the same-node shortcut.
  if((mode==='resistance'||mode==='continuity')&&powered){
   return done(T('先断开电源再测 Ω / 通断','DISCONNECT POWER BEFORE Ω / CONTINUITY'),
    T('先关闭实验电源输出。真实电路还要断开外部电源并确认储能已释放；两笔接在同一点也不能绕过这一步。',
      'Turn the experiment supply output off first. On real equipment, disconnect external power and verify stored energy is discharged. Touching both probes to one point does not bypass this prerequisite.'),'power-off','danger');
  }
  if(sourceShort)return fuseResult();
  if(mode==='current'&&!currentJack){
   return done(T('红笔请插入 mA 或 10A','MOVE RED LEAD TO mA OR 10A'),
    T('功能、量程和插孔是独立选择。先断电，按预期电流选择输入，再断开回路并串入仪表。',
      'Function, range and jack are independent choices. Power off, choose the rated current input, then open the circuit and insert the meter in series.'),'jack','warning');
  }
  if(mode!=='current'&&jack!=='voltage'){
   return done(T('本档位请用 VΩ 插孔','USE VΩ FOR THIS MODE'),
    T('电压、电阻和通断使用 VΩ 与 COM。先断电再移插孔；旋钮切换不会替你移动表笔。',
      'Voltage, resistance and continuity use VΩ and COM. Turn power off before moving a lead. Turning the dial does not move a plug.'),'jack','warning');
  }
  if(powered&&ohms===0)return done(T('检查限流电阻','CHECK CURRENT-LIMITING RESISTOR'),
   T('此固定压降LED模型需要非零限流电阻，不能预测直接跨接电源时的故障电流。',
     'The fixed-drop LED model requires a nonzero limiting resistor and cannot predict fault current for a direct source connection.'),'unsafe','danger');
  if(mode==='current'){
   if(!s.fuse)return fuseResult();
   if(jack==='10a'&&range!=='10A')return done(T('10A 插孔请选择10A量程','SELECT 10A RANGE'),
    T('10A插孔与当前量程不匹配。先断电，再独立确认功能、10A量程和串联接线。',
      'The 10 A jack and selected range do not match. Power off and separately check function, 10 A range and series connection.'),'range','warning');
   if(jack==='current'&&range==='10A')return done(T('10A量程请换到10A插孔','MOVE RED LEAD TO 10A JACK'),
    T('选10A量程不会改变mA插孔的额定值。先断电再换孔；小电流也可保留mA插孔并选择200mA量程。',
      'Selecting 10 A does not change the mA jack rating. Power off before moving the lead. For small current, the mA jack and 200 mA range are also suitable.'),'jack','warning');
   if(!['auto','200mA','10A'].includes(range))return done(T('请选择电流量程','SELECT A CURRENT RANGE'),
    T('量程必须对应当前被测量。','The range must match the measured quantity.'),'range','warning');
   if(!series)return done(T('请断电并串入支路','POWER OFF AND CONNECT IN SERIES'),
    T('当前接法不是打开回路后的串联测量。关闭输出，在I端与COM回流端之间串入仪表。本台不求解这些错误并联接线的故障电流；其它并联误接不一定熔断保险丝，不能以“保险丝没断”判断安全。',
      'This is not a series measurement through an opened branch. Power off and insert the meter between I and the COM return. This bench does not solve fault current for these invalid parallel connections; an intact fuse does not prove a safe connection.'),powered?'unsafe':'wiring',powered?'danger':'warning');
   const amperes=s.current*(probes.red==='series'?1:-1),limit=jack==='10a'?10:.2;
   if(Math.abs(amperes)>limit)return done('OL',
    T('电流超出量程。先关闭输出，再核对插孔、保险丝额定值与量程；不要带电拔插。本模型不模拟保险丝熔断时间曲线。',
      'Current exceeds the range. Turn output off before checking the jack, fuse rating and range; never move live leads. Fuse trip-time curves are not simulated.'),'overrange','danger');
   return done(jack==='10a'?amperes.toFixed(3)+' A':(amperes*1000).toFixed(2)+' mA',
    T('电流从I端经红笔、仪表和黑笔COM返回。交换两笔会反号。测完先断电，再把红笔移回VΩ；10A输入的连续测量时间须查具体说明书。',
      'Current flows from I through red, the meter and black COM to return. Reversing probes changes the sign. After measuring, power off and move red to VΩ. Check the actual manual for 10 A duration limits.'),'ok','ok',amperes);
  }
  if(mode==='voltage'){
   if(range!=='auto'&&!Object.hasOwn(this.voltageRanges,range))return done(T('请选择电压量程','SELECT A VOLTAGE RANGE'),
    T('选择自动或能够容纳预期电压的手动量程。','Choose auto or a manual range that contains the expected voltage.'),'range','warning');
   if(series)return done(T('回路断点 · 请检查接线','OPEN RETURN · CHECK CONNECTION'),
    T('回流支路已打开。高阻电压输入不能替代导线；恢复支路后并联测量。',
      'The return branch is open. A high-impedance voltage input cannot replace a wire. Restore the branch, then measure in parallel.'),'wiring','warning');
   const nodes={plus:s.output,anode:s.led,minus:0,series:0},reading=nodes[probes.red]-nodes[probes.black];
   const limit=range==='auto'?Infinity:this.voltageRanges[range];
   if(Math.abs(reading)>limit)return done('OL',
    T('电压超过手动量程，请增大量程；OL不等于元件损坏。',
      'Voltage exceeds the manual range; increase the range. OL does not prove component damage.'),'overrange','warning');
   return done(reading.toFixed(2)+' V',
    T('读数=红笔节点电压−黑笔节点电压。两笔交换会反号。本台理想电源关闭时输出0V；真实电源可能有残余电荷，须实测确认。',
      'The reading is red-node voltage minus black-node voltage. Reversing leads changes the sign. This ideal source outputs 0 V when disabled; a real source may retain charge, so verify by measurement.'),'ok','ok',reading);
  }
  if(mode==='resistance'||mode==='continuity'){
   const reading=same?0:resistor?ohms:Infinity;
   if(mode==='continuity'){
    if(range!=='auto')return done(T('通断档请选自动','SELECT AUTO FOR CONTINUITY'),
     T('本教学表通断档使用固定条件，蜂鸣阈值为30Ω。',
       'This teaching meter uses fixed continuity conditions and a 30 ohm threshold.'),'range','warning');
    if(!Number.isFinite(reading))return done(T('OL · 不蜂鸣','OL · SILENT'),
     T('这对测试点不是本模型中已知的纯电阻通路。无蜂鸣本身不能证明完全开路。',
       'This pair is not a known purely resistive path in the model. Silence alone does not prove a completely open circuit.'),'ok','info');
    const beep=reading<30;
    return done(reading.toFixed(reading===0?2:0)+' Ω · '+(beep?T('蜂鸣','BEEP'):T('不蜂鸣','SILENT')),
     T('本表低于30Ω才蜂鸣。较大的有限电阻会显示阻值但不蜂鸣，不能叫作开路；实际阈值依型号而异。',
       'This meter beeps below 30 ohms. A larger finite resistance is displayed silently and is not an open circuit. Real thresholds depend on the meter.'),'ok','ok',reading);
   }
   if(range!=='auto'&&!Object.hasOwn(this.resistanceRanges,range))return done(T('请选择电阻量程','SELECT A RESISTANCE RANGE'),
    T('选择自动或对应Ω/kΩ的量程。','Choose auto or the appropriate ohm/kilohm range.'),'range','warning');
   const limit=range==='auto'?Infinity:this.resistanceRanges[range];
   if(!Number.isFinite(reading))return done('OL',
    T('本模型只对电阻两端和同一节点提供纯电阻读数。跨LED测试不等于测量固定电阻。',
      'This model provides resistance readings across the resistor or at the same node. A nonlinear LED path is not a fixed resistor.'),'ok','info');
   if(reading>limit)return done('OL',T('阻值超过量程，请增大量程。','Resistance exceeds the range; choose a higher range.'),'overrange','warning');
   return done(reading.toFixed(reading===0?2:0)+' Ω',
    T('电源已关闭。本模型忽略表笔电阻和并联泄漏；真实电路须释放储能并检查并联通路。',
      'Supply output is off. Lead resistance and parallel leakage are omitted here; discharge stored energy and check parallel paths on real circuits.'),'ok','ok',reading);
  }
  return done(T('请选择测量功能','SELECT A MEASUREMENT FUNCTION'),
   T('支持直流电压、直流电流、电阻和通断。','Choose DC voltage, DC current, resistance or continuity.'),'mode','warning');
 }
};
const _resultMeter6=result4;
result4=function(id,s){return id==='meter'?MeterModel7.measure(s):_resultMeter6(id,s);};
