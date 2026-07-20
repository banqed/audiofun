const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const js = html.match(/<script>([\s\S]*)<\/script>/)[1];

// ---- proxy element stub ----
const els = new Map();
function mkEl(id){
  const store = {};
  const el = new Proxy(store, {
    get(t,k){
      if (typeof k === 'symbol') return undefined;
      if (k in t) return t[k];
      if (k==='classList') return {toggle(){},add(){},remove(){},contains:()=>false};
      if (k==='style') return new Proxy({},{get:(s,sk)=> (sk==='setProperty'||sk==='removeProperty')?()=>{}: '', set:()=>true});
      if (k==='dataset') return t.__ds || (t.__ds = {});
      if (k==='options') return [];
      if (k==='children') return [];
      if (k==='value') return '0';
      if (k==='textContent'||k==='innerHTML'||k==='title'||k==='disabled') return '';
      if (['addEventListener','removeEventListener','appendChild','dispatchEvent','setPointerCapture','click','blur','focus','preventDefault','stopPropagation'].includes(k)) return ()=>{};
      if (k==='querySelector') return ()=>mkEl();
      if (k==='closest') return ()=>mkEl();
      if (k==='insertBefore') return ()=>{};
      if (k==='querySelectorAll') return ()=>[mkEl(),mkEl(),mkEl(),mkEl()];
      if (k==='getBoundingClientRect') return ()=>({left:0,top:0,width:100,height:100});
      if (k==='style') return t.__style || (t.__style = new Proxy({setProperty:()=>{},removeProperty:()=>{}},{get:(s,sk)=> sk in s ? s[sk] : '', set:(s,sk,sv)=>{s[sk]=sv;return true;}}));
      if (k==='getContext') return ()=>new Proxy({},{get:(t2,k2)=> k2==='canvas'?el:()=>{}, set:()=>true});
      return undefined;
    },
    set(t,k,v){ t[k]=v; return true; }
  });
  if (id) els.set(id, el);
  return el;
}
// pre-register all HTML ids
[...html.matchAll(/id="([^"]+)"/g)].forEach(m=>mkEl(m[1]));

// ---- audio stubs ----
function param(){ return {value:0, setValueAtTime(){}, linearRampToValueAtTime(){}, setTargetAtTime(){}, connect(){}}; }
function audioNode(){
  return new Proxy({}, {get(t,k){
    if (typeof k==='symbol') return undefined;
    if (k in t) return t[k];
    if (['gain','pan','frequency','playbackRate','delayTime','threshold','knee','ratio','attack','release','Q','reduction'].includes(k)) return t[k]=param();
    if (k==='parameters') return {get:()=>param()};
    if (k==='stream') return {};
    if (k==='buffer'||k==='curve'||k==='type'||k==='oversample'||k==='loop'||k==='channelCount') return t[k];
    if (['connect','disconnect','start','stop'].includes(k)) return ()=>{};
    return undefined;
  }, set(t,k,v){t[k]=v; return true;}});
}
function audioBuffer(len=48000, ch=2, sr=48000){
  const chans = Array.from({length:ch},()=>new Float32Array(len));
  return {length:len, duration:len/sr, sampleRate:sr, numberOfChannels:ch, getChannelData:i=>chans[Math.min(i,ch-1)]};
}
class FakeCtx {
  constructor(){ this.currentTime=0; this.sampleRate=48000; this.destination=audioNode(); this.audioWorklet={addModule:async()=>{}}; }
  resume(){ return Promise.resolve(); }
  decodeAudioData(){ return Promise.resolve(audioBuffer()); }
  createBuffer(ch,len,sr){ return audioBuffer(len,ch,sr); }
  startRendering(){ return Promise.resolve(audioBuffer()); }
}
['createGain','createDynamicsCompressor','createStereoPanner','createBiquadFilter','createDelay','createConvolver','createWaveShaper','createChannelMerger','createChannelSplitter','createAnalyser','createOscillator','createBufferSource','createMediaStreamSource','createMediaStreamDestination'].forEach(m=>{
  FakeCtx.prototype[m] = function(){ return audioNode(); };
});

const errors = [];
const sandbox = {
  window: {AudioContext: FakeCtx, addEventListener:()=>{}, webkitAudioContext: FakeCtx},
  document: {
    getElementById: id => els.get(id) || mkEl(id),
    querySelectorAll: ()=>[],
    documentElement: mkEl(),
    createElement: ()=>mkEl(),
    addEventListener: ()=>{},
    body: mkEl('__body'),
  },
  navigator: { mediaDevices:{getDisplayMedia:()=>{},getUserMedia:()=>{}}, storage:{persist:async()=>true, estimate:async()=>({usage:0})} },
  AudioWorkletNode: class { constructor(){ return audioNode(); } },
  OfflineAudioContext: FakeCtx,
  MediaRecorder: Object.assign(class{}, {isTypeSupported:()=>true}),
  MediaStream: class {},
  URL: {createObjectURL:()=>'blob:x', revokeObjectURL(){}},
  Blob: class { constructor(){this.size=1;} },
  FileReader: class {},
  requestAnimationFrame: ()=>1, cancelAnimationFrame(){}, 
  setInterval: ()=>1, clearInterval(){}, setTimeout:(f)=>1, clearTimeout(){},
  performance: {now:()=>0},
  devicePixelRatio: 1,
  indexedDB: undefined,
  console,
  Math, JSON, Object, Array, Float32Array, Uint8Array, ArrayBuffer, DataView, Promise, Map, WeakMap, Set, parseFloat, parseInt, isNaN, String, Number, Boolean, Date, atob:()=>'', btoa:()=>'',
  confirm: ()=>true, alert(){},
};
sandbox.window.webkitAudioContext = FakeCtx;
sandbox.globalThis = sandbox;

const vm = require('vm');
try {
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox, {timeout: 5000});
  console.log('IIFE completed without throwing.');
} catch(e) {
  console.log('IIFE THREW:', e.message);
  console.log(e.stack.split('\n').slice(0,4).join('\n'));
}
process.on('unhandledRejection', r => console.log('UNHANDLED REJECTION:', r && r.message || r));
setTimeout(()=>{}, 100);
