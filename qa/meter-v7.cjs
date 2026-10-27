const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),checks=[];
const ctx=vm.createContext({T:(_zh,en)=>en,result4:id=>({delegated:id})});
vm.runInContext(fs.readFileSync(path.join(root,'src/meter-v6.js'),'utf8'),ctx);
const fresh=(change={})=>Object.assign({p:{v:5,r:330},mode:'voltage',jack:'voltage',range:'auto',on:true,fuse:true,probes:{red:'plus',black:'minus'}},change);
const read=s=>ctx.result4('meter',s),pass=s=>{checks.push(s);console.log('PASS '+s);};

let s=fresh();assert.equal(read(s).read,'5.00 V');s.probes={red:'minus',black:'plus'};assert.equal(read(s).read,'-5.00 V');s.on=false;assert.equal(read(s).read,'0.00 V');assert.equal(s.current,0);assert.equal(s.output,0);
s=fresh({p:{v:1,r:330},probes:{red:'anode',black:'minus'}});assert.equal(read(s).read,'1.00 V');assert.equal(s.current,0);
pass('Source output off gives 0 V; reversing voltage leads changes sign; sub-threshold LED voltage is not falsely zero');

for(const mode of ['resistance','continuity']){
 s=fresh({mode,probes:{red:'plus',black:'plus'}});assert.equal(read(s).status,'power-off');
 s.on=false;s.jack='current';assert.equal(read(s).status,'jack');
}
s=fresh({mode:'current',on:false,probes:{red:'plus',black:'plus'}});assert.equal(read(s).status,'jack');
pass('Same-node probe contact cannot bypass power-off or jack preconditions');

s=fresh({mode:'current',jack:'current',range:'200mA',on:false,probes:{red:'series',black:'minus'}});
assert.equal(read(s).read,'0.00 mA');assert.equal(s.fuse,true);s.on=true;
assert.equal(read(s).read,'9.09 mA');assert.ok(Math.abs(s.current-3/330)<1e-12);
s.probes={red:'minus',black:'series'};assert.equal(read(s).read,'-9.09 mA');assert.equal(s.fuse,true);
pass('Power-off setup followed by series current gives 9.09 mA; reversing current probes gives -9.09 mA');

s=fresh({mode:'current',jack:'current',range:'10A',on:false,probes:{red:'series',black:'minus'}});
assert.equal(read(s).status,'jack');assert.equal(s.jack,'current');assert.equal(s.range,'10A');
s.jack='10a';s.on=true;assert.equal(read(s).read,'0.009 A');
s.range='auto';assert.equal(read(s).status,'range');assert.equal(s.jack,'10a');
s.range='200mA';assert.equal(read(s).status,'range');
pass('Function, range and input are independent; mismatches remain visible instead of moving leads automatically');

s=fresh({mode:'current',jack:'current',range:'200mA'});assert.equal(read(s).status,'fuse');assert.equal(s.fuse,false);
s.probes={red:'series',black:'minus'};assert.equal(read(s).status,'fuse');assert.equal(s.current,0);
s.probes={red:'plus',black:'plus'};assert.equal(read(s).status,'fuse');
s.mode='voltage';s.jack='voltage';s.range='auto';s.probes={red:'plus',black:'minus'};assert.equal(read(s).read,'5.00 V');assert.ok(s.current>0);assert.equal(s.fuse,false);
pass('A source short opens current protection persistently; the independent V input and original branch still work');

s=fresh({mode:'voltage',jack:'current'});assert.equal(read(s).status,'fuse');assert.equal(s.fuse,false);
s=fresh({mode:'current',jack:'current',probes:{red:'anode',black:'minus'}});assert.equal(read(s).status,'unsafe');assert.equal(s.fuse,true);
pass('Current jack across a source trips even with the wrong dial; other parallel miswirings are rejected without falsely promising fuse operation');

s=fresh({mode:'current',jack:'current',range:'200mA',p:{v:5,r:10},probes:{red:'series',black:'minus'}});
assert.equal(read(s).status,'overrange');assert.equal(read(s).read,'OL');assert.equal(s.fuse,true);
s=fresh({range:'2'});assert.equal(read(s).status,'overrange');s.probes={red:'minus',black:'plus'};assert.equal(read(s).read,'OL');
s=fresh({mode:'resistance',on:false,range:'2k',p:{v:5,r:2200},probes:{red:'plus',black:'anode'}});
assert.equal(read(s).status,'overrange');s.range='20k';assert.equal(read(s).read,'2200 Ω');
pass('Manual voltage, current and resistance overrange checks use absolute values and the correct units');

s=fresh({mode:'resistance',on:false,probes:{red:'plus',black:'anode'}});
assert.equal(read(s).read,'330 Ω');s.p.r=0;assert.equal(read(s).read,'0.00 Ω');
s.mode='continuity';s.p.r=29;assert.match(read(s).read,/BEEP/);s.p.r=30;assert.match(read(s).read,/SILENT/);
s.p.r=330;assert.equal(read(s).read,'330 Ω · SILENT');assert.ok(!read(s).read.includes('OPEN'));
s.probes={red:'plus',black:'minus'};assert.equal(read(s).read,'OL · SILENT');
pass('Continuity distinguishes 330 ohm silent paths from open/unsupported paths; 30 ohms is not a universal physical threshold');

s=fresh({mode:'current',jack:'current',probes:{red:'series',black:'minus'},p:{v:5,r:0}});
assert.equal(read(s).status,'unsafe');assert.ok(Number.isFinite(s.current));
s=fresh({probes:{red:'unknown',black:'minus'}});assert.equal(read(s).status,'wiring');
s=fresh({p:{v:Infinity,r:330}});assert.equal(read(s).status,'wiring');
assert.equal(ctx.result4('wave',{}).delegated,'wave');
pass('Unsupported/invalid circuit inputs fail explicitly; other workbenches keep their own result paths');

const devices=fs.readFileSync(path.join(root,'src/devices-v5.js'),'utf8').split(/\r?\n/);
const rovers={},motion=vm.createContext({sim4:id=>rovers[id]||(rovers[id]={p:{},t:0}),advance4:()=>{}});
vm.runInContext(devices.find(l=>l.startsWith('const _sim5='))+'\n'+devices.find(l=>l.startsWith('const _advance5=')),motion);
let rover=motion.sim4('rover');
for(let i=0;i<100;i++)motion.advance4('rover',rover,.01);
assert.ok(Math.abs(rover.pose.x-.2)<1e-10);assert.ok(Math.abs(rover.wheelLeft-4)<1e-10);assert.ok(Math.abs(rover.wheelRight-4)<1e-10);
rover.p.left=-.2;rover.p.right=.2;const wl=rover.wheelLeft,wr=rover.wheelRight;
for(let i=0;i<100;i++)motion.advance4('rover',rover,.01);
assert.ok(Math.abs(rover.wheelLeft-wl+4)<1e-10);assert.ok(Math.abs(rover.wheelRight-wr-4)<1e-10);
pass('Wheel angles integrate simulation time and individual wheel speeds, including opposite rotations on a spin turn');

let ros=motion.sim4('ros');ros.connected=false;
for(let i=0;i<100;i++)motion.advance4('ros',ros,.01);
assert.equal(ros.pose.x,0);assert.equal(ros.wheelLeft,0);assert.equal(ros.wheelRight,0);assert.equal(ros.stale,true);
ros.connected=true;for(let i=0;i<20;i++)motion.advance4('ros',ros,.01);assert.ok(ros.messages>0);assert.ok(ros.pose.x>0);
ros.connected=false;for(let i=0;i<60;i++)motion.advance4('ros',ros,.01);
assert.equal(ros.velocity,0);assert.equal(ros.angular,0);const stoppedL=ros.wheelLeft,stoppedR=ros.wheelRight;
for(let i=0;i<20;i++)motion.advance4('ros',ros,.01);
assert.equal(ros.wheelLeft,stoppedL);assert.equal(ros.wheelRight,stoppedR);
pass('ROS waits for the first received command and freezes both wheel angles after command timeout');

const result={passed:true,checks,scope:'Pure source-model regression; no browser or hardware validation'};
fs.mkdirSync(path.join(root,'dev-notes'),{recursive:true});
fs.writeFileSync(path.join(root,'dev-notes/meter-v7-results.json'),JSON.stringify(result,null,2));
console.log('ALL PASSED '+checks.length);
