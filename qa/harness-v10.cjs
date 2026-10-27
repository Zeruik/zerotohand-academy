'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const plain=value=>JSON.parse(JSON.stringify(value));
async function load({hash='#home',storage={},adapter,beforeParse}={}){
 const {JSDOM,VirtualConsole}=await import('./dom-runtime/node_modules/jsdom/lib/api.js');
 const html=fs.readFileSync(path.join(root,'ZeroToHand-Engineering-Academy.html'),'utf8'),errors=[],frames=new Map();let frameId=0;
 const vc=new VirtualConsole();vc.on('jsdomError',error=>errors.push(error.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://offline.test/'+hash,pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  Object.defineProperty(w,'crypto',{value:crypto.webcrypto});w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
  w.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};w.cancelAnimationFrame=id=>frames.delete(id);
  w.HTMLCanvasElement.prototype.setPointerCapture=()=>{};w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:900,height:420});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get:(object,key)=>key in object?object[key]:(...args)=>{if(args.some(value=>typeof value==='number'&&!Number.isFinite(value)))throw Error('Invalid canvas number '+String(key));},set:(object,key,value)=>(object[key]=value,true)});};
  for(const [key,value]of Object.entries(storage))w.localStorage.setItem(key,value);
  if(adapter)w.zthDesktop9=adapter;
  if(beforeParse)beforeParse(w);
 }});
 await dom.window.ProfileStore9?.ready;await delay(0);
 return{dom,w:dom.window,d:dom.window.document,errors,frames,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),tick(time){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback(time));},close(){dom.window.close();}};
}
module.exports={load,plain,delay,root};

