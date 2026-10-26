'use strict';
// Audio state and playback. Web Audio is preferred except on file://; HTMLAudio is the local-file fallback.

const _audioPoolCache = new Map();
const _audioStorageKey = 'archeSpheresAudioState';
const _audioBuffers = new Map(); // path -> Promise<AudioBuffer> while loading, then AudioBuffer
const _audioFailedPaths = new Set();
const _activeAudioVoices = new Set();
let _audioWebBackend = typeof window !== 'undefined'
  && !!(window.AudioContext || window.webkitAudioContext)
  && typeof location !== 'undefined'
  && location.protocol !== 'file:';
let _audioContext = null;
let _audioGraph = null;
let _audioVoiceSerial = 0;
let _audioSimulationTime = 0;
let _bgmAudio = null;
let _bgmRetryArmed = false;
let _webBgmSource = null;
let _webBgmOffset = 0;
let _webBgmStartedAt = 0;
let _webBgmPath = null;
let _audioState = {
 masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
 sfxVolume: AUDIO_SETTINGS_DEFAULTS.sfxVolume,
 bgmVolume: AUDIO_SETTINGS_DEFAULTS.bgmVolume,
 muted: AUDIO_SETTINGS_DEFAULTS.muted,
};

const _newAudioStats = () => ({
 played: 0,
 dropped: { cooldown: 0, priority: 0, cap: 0, notLoaded: 0, contextSuspended: 0, playRejected: 0 },
 peakActiveVoices: 0,
});
window._audioStats = window._audioStats || _newAudioStats();

function _audioStatsDrop(reason) {
 const stats = window._audioStats || (window._audioStats = _newAudioStats());
 if (typeof stats.dropped[reason] !== 'number') stats.dropped[reason] = 0;
 stats.dropped[reason]++;
}
function _audioStatsPlayed() {
 const stats = window._audioStats || (window._audioStats = _newAudioStats());
 stats.played++;
 stats.peakActiveVoices = Math.max(stats.peakActiveVoices, _activeAudioVoices.size);
}
window.audioStats = function() {
 if (window._balanceNoVisuals) return;
 const stats = window._audioStats || _newAudioStats();
 console.table([
  { metric: 'played', count: stats.played },
  { metric: 'peak active voices', count: stats.peakActiveVoices },
  ...Object.entries(stats.dropped).map(([reason, count]) => ({ metric: 'dropped: ' + reason, count })),
 ]);
 return stats;
};

function _saveAudioState(){
 try{localStorage.setItem(_audioStorageKey,JSON.stringify(_audioState));}catch(_err){}
}
function _loadAudioState(){
 try{
  const raw=localStorage.getItem(_audioStorageKey);
  if(!raw)return;
  const parsed=JSON.parse(raw);
  if(typeof parsed.masterVolume==='number')_audioState.masterVolume=Math.max(0,Math.min(1,parsed.masterVolume));
  if(typeof parsed.sfxVolume==='number')_audioState.sfxVolume=Math.max(0,Math.min(1,parsed.sfxVolume));
  if(typeof parsed.bgmVolume==='number')_audioState.bgmVolume=Math.max(0,Math.min(1,parsed.bgmVolume));
  if(typeof parsed.muted==='boolean')_audioState.muted=parsed.muted;
 }catch(_err){}
}
function _audioNow(){
 return _audioContext ? _audioContext.currentTime : _audioSimulationTime;
}
function _advanceAudioClock(dt){
 if(window._balanceNoVisuals)return;
 if(Number.isFinite(dt)&&dt>0)_audioSimulationTime+=dt;
}
function _getAudioTuning(key, slot){
 return (AUDIO_TUNING[key]&&AUDIO_TUNING[key][slot])
  || (AUDIO_TUNING.default&&AUDIO_TUNING.default[slot])
  || {volume:0.65,rate:1,minInterval:0};
}
function _resolveAudioVolume(key, slot, channel='sfx'){
 if(channel==='bgm')return (AUDIO_TUNING.arena?.bgm?.volume ?? 0.45);
 return _getAudioTuning(key,slot).volume;
}
function _ensureAudioGraph(){
 if(window._balanceNoVisuals||!_audioWebBackend)return null;
 if(_audioContext&&_audioGraph)return _audioGraph;
 const Context=window.AudioContext||window.webkitAudioContext;
 try{
  _audioContext=new Context({latencyHint:'interactive'});
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(_err){}
  const sfxBus=_audioContext.createGain();
  const bgmBus=_audioContext.createGain();
  const masterGain=_audioContext.createGain();
  const compressor=_audioContext.createDynamicsCompressor();
  compressor.threshold.value=-14;
  compressor.knee.value=12;
  compressor.ratio.value=2.5;
  compressor.attack.value=0.004;
  compressor.release.value=0.22;
  sfxBus.connect(masterGain);
  bgmBus.connect(masterGain);
  masterGain.connect(compressor);
  compressor.connect(_audioContext.destination);
  _audioGraph={sfxBus,bgmBus,masterGain,compressor};
  _applyAudioGains(false);
  _audioContext.addEventListener('statechange',()=>{
   if(window._balanceNoVisuals)return;
   if(_audioContext&&_audioContext.state==='interrupted')_resumeAudioContext();
  });
  return _audioGraph;
 }catch(error){
  console.warn('[Audio] Web Audio initialization failed; using HTMLAudio fallback.',error);
  _audioContext=null;
  _audioGraph=null;
  _audioWebBackend=false;
  return null;
 }
}
function _applyGain(gainNode, value, smooth=true){
 if(!gainNode||!_audioContext)return;
 const now=_audioContext.currentTime;
 try{
  gainNode.gain.cancelScheduledValues(now);
  if(smooth)gainNode.gain.setTargetAtTime(value,now,0.025);
  else gainNode.gain.setValueAtTime(value,now);
 }catch(_err){gainNode.gain.value=value;}
}
function _applyAudioGains(smooth=true){
 if(window._balanceNoVisuals)return;
 const graph=_audioGraph||_ensureAudioGraph();
 if(!graph)return;
 _applyGain(graph.masterGain,_audioState.muted?0:_audioState.masterVolume,smooth);
 _applyGain(graph.sfxBus,_audioState.sfxVolume,smooth);
 _applyGain(graph.bgmBus,_audioState.bgmVolume,smooth);
}
function _resumeAudioContext(){
 if(window._balanceNoVisuals||!_audioWebBackend)return;
 const graph=_ensureAudioGraph();
 if(!graph||!_audioContext)return;
 if(_audioContext.state==='suspended'||_audioContext.state==='interrupted'){
  try{
   const attempt=_audioContext.resume();
   if(attempt&&typeof attempt.catch==='function')attempt.catch(error=>{
    if(window._audioDebug===true)console.warn('[Audio] AudioContext resume rejected.',error);
   });
  }catch(error){if(window._audioDebug===true)console.warn('[Audio] AudioContext resume failed.',error);}
 }
}
function _updateAudioUi(){
 const muteBtn=document.getElementById('mute-btn');
 const sfxSlider=document.getElementById('sfx-vol');
 const bgmSlider=document.getElementById('bgm-vol');
 if(muteBtn)muteBtn.textContent=_audioState.muted?'SOUND OFF':'SOUND ON';
 if(sfxSlider)sfxSlider.value=Math.round(_audioState.sfxVolume*100);
 if(bgmSlider)bgmSlider.value=Math.round(_audioState.bgmVolume*100);
}
function _audioDebugBgmEvent(eventName, details){
 if(window._audioDebug!==true)return;
 console.debug('[Audio BGM]',eventName,{
  paused:typeof paused!=='undefined'?paused:null,
  gameMode:typeof gameMode!=='undefined'?gameMode:null,
  'document.hidden':document.hidden,
  muted:_audioState.muted,
  volume:_audioState.bgmVolume,
  matchTime:window.matchTime,
  backend:_audioWebBackend?'webaudio':'htmlaudio',
  ...details
 });
}
function _armBgmGestureRetry(){
 if(_bgmRetryArmed)return;
 _bgmRetryArmed=true;
 const retry=()=>{
  document.removeEventListener('pointerdown',retry);
  document.removeEventListener('touchend',retry);
  _bgmRetryArmed=false;
  _resumeAudioContext();
  _syncArenaBgm();
 };
 document.addEventListener('pointerdown',retry,{once:true});
 document.addEventListener('touchend',retry,{once:true});
}
function _decodeAudioData(ctx, arrayBuffer){
 return new Promise((resolve,reject)=>{
  let settled=false;
  const ok=buffer=>{if(!settled){settled=true;resolve(buffer);}};
  const fail=error=>{if(!settled){settled=true;reject(error||new Error('decodeAudioData failed'));}};
  try{
   const result=ctx.decodeAudioData(arrayBuffer.slice(0),ok,fail);
   if(result&&typeof result.then==='function')result.then(ok,fail);
  }catch(error){fail(error);}
 });
}
function _ensureAudioBuffer(path){
 if(window._balanceNoVisuals||!path||!_audioWebBackend)return Promise.resolve(null);
 const existing=_audioBuffers.get(path);
 if(existing instanceof AudioBuffer)return Promise.resolve(existing);
 if(existing&&typeof existing.then==='function')return existing;
 if(_audioFailedPaths.has(path))return Promise.resolve(null);
 const graph=_ensureAudioGraph();
 if(!graph||!_audioContext)return Promise.resolve(null);
 const loading=fetch(path).then(response=>{
  if(!response.ok)throw new Error('HTTP '+response.status+' while fetching '+path);
  return response.arrayBuffer();
 }).then(data=>_decodeAudioData(_audioContext,data)).then(buffer=>{
  _audioBuffers.set(path,buffer);
  return buffer;
 }).catch(error=>{
  _audioBuffers.set(path,null);
  if(!_audioFailedPaths.has(path)){
   _audioFailedPaths.add(path);
   console.warn('[Audio] Failed to load audio path:',path,error);
  }
  return null;
 });
 _audioBuffers.set(path,loading);
 return loading;
}
function _primeAudioPath(path, poolSize=1){
 if(window._balanceNoVisuals||!path)return;
 if(_audioWebBackend){_ensureAudioBuffer(path);return;}
 poolSize=Math.min(4,Math.max(0,poolSize));
 let pool=_audioPoolCache.get(path);
 if(!pool){pool=[];_audioPoolCache.set(path,pool);}
 while(pool.length<poolSize){
  const clip=new Audio(path);
  clip.preload='auto';
  clip.load();
  pool.push(clip);
 }
}
function _preloadConfiguredAudio(keys=[]){
 if(window._balanceNoVisuals)return;
 if(typeof SPHERE_AUDIO==='undefined'||typeof ARENA_AUDIO==='undefined')return;
 const selected=Array.isArray(keys)?keys:[];
 for(const key of selected){
  const slots=SPHERE_AUDIO[key];
  if(!slots)continue;
  for(const path of Object.values(slots))_primeAudioPath(path,2);
 }
 if(ARENA_AUDIO.bgm)_primeAudioPath(ARENA_AUDIO.bgm,1);
}
function _voiceCounts(slot){
 let total=0,slotCount=0;
 for(const voice of _activeAudioVoices){
  total++;
  if(voice.slot===slot)slotCount++;
 }
 return {total,slotCount};
}
function _removeVoice(voice){
 if(!voice||!_activeAudioVoices.has(voice))return;
 _activeAudioVoices.delete(voice);
 if(voice.source){
  try{voice.source.disconnect();}catch(_err){}
  try{voice.gainNode.disconnect();}catch(_err){}
 }
}
function _stealVoice(voice){
 if(!voice)return;
 if(voice.source&&_audioContext){
  const now=_audioContext.currentTime;
  try{
   const param=voice.gainNode.gain;
   param.cancelScheduledValues(now);
   param.setValueAtTime(param.value,now);
   param.linearRampToValueAtTime(0,now+0.012);
   voice.source.stop(now+0.013);
  }catch(_err){try{voice.source.stop();}catch(_ignored){}}
 }else if(voice.element){
  // HTMLAudio is the file:// fallback; stop immediately because element volume
  // is not a reliable fade control on iOS.
  try{voice.element.pause();voice.element.currentTime=0;}catch(_err){}
  _removeVoice(voice);
 }
}
function _admitVoice(slot, priority){
 const limits=AUDIO_VOICE_LIMITS;
 const counts=_voiceCounts(slot);
 const slotLimit=(limits.perSlot&&limits.perSlot[slot])||limits.total;
 if(counts.total<limits.total&&counts.slotCount<slotLimit)return true;
 let candidates=[..._activeAudioVoices].filter(v=>v.priority<priority);
 if(counts.total>=limits.total){
  candidates.sort((a,b)=>a.priority-b.priority||a.serial-b.serial);
 }else{
  candidates=candidates.filter(v=>v.slot===slot).sort((a,b)=>a.priority-b.priority||a.serial-b.serial);
 }
 const victim=candidates[0];
 if(!victim){
  _audioStatsDrop(counts.total>=limits.total?'priority':'cap');
  return false;
 }
 _stealVoice(victim);
 return true;
}
function _playAudioPath(path, volume=0.65, key='', slot='damage'){
 if(window._balanceNoVisuals)return;
 if(!path||volume<=0)return;
 const tuning=_getAudioTuning(key,slot);
 const now=_audioNow();
 const gateKey=key+':'+slot;
 if(!_playAudioPath.cooldowns)_playAudioPath.cooldowns=new Map();
 const last=_playAudioPath.cooldowns.get(gateKey);
 if(tuning.minInterval>0&&last!==undefined&&now-last<tuning.minInterval){
  _audioStatsDrop('cooldown');
  return;
 }
 let buffer=null;
 if(_audioWebBackend){
  const candidate=_audioBuffers.get(path);
  if(candidate instanceof AudioBuffer)buffer=candidate;
  else{
   _audioStatsDrop('notLoaded');
   _ensureAudioBuffer(path);
   return; // Never queue the sound that arrived before decode completed.
  }
 }else{
  let pool=_audioPoolCache.get(path);
  if(!pool||!pool.length){
   _primeAudioPath(path,2);
   pool=_audioPoolCache.get(path);
  }
  if(!pool||!pool.length){
   _audioStatsDrop('notLoaded');
   return;
  }
 }
 if(_audioWebBackend&&_audioContext&&_audioContext.state!=='running'){
  _audioStatsDrop('contextSuspended');
  _resumeAudioContext();
  return;
 }
 const priority=AUDIO_PRIORITY[slot]||0;
 if(!_admitVoice(slot,priority))return;
 const voice={key,slot,priority,serial:++_audioVoiceSerial,source:null,gainNode:null,element:null};
 if(_audioWebBackend){
  try{
   const source=_audioContext.createBufferSource();
   const gainNode=_audioContext.createGain();
   source.buffer=buffer;
   source.loop=false;
   source.playbackRate.value=Number.isFinite(tuning.rate)&&tuning.rate>0?tuning.rate:1;
   gainNode.gain.value=Math.max(0,Math.min(1,volume));
   source.connect(gainNode);
   gainNode.connect(_audioGraph.sfxBus);
   voice.source=source;voice.gainNode=gainNode;
   source.onended=()=>_removeVoice(voice);
   _activeAudioVoices.add(voice);
   source.start(0);
   _playAudioPath.cooldowns.set(gateKey,now);
   _audioStatsPlayed();
  }catch(error){
   _removeVoice(voice);
   _audioStatsDrop('playRejected');
   console.warn('[Audio] Web Audio playback failed:',path,error);
  }
  return;
 }
 let pool=_audioPoolCache.get(path);
 let clip=pool.find(a=>a.paused||a.ended);
 if(!clip&&pool.length<4){
  clip=new Audio(path);clip.preload='auto';clip.load();pool.push(clip);
 }
 if(!clip){
  _audioStatsDrop('cap');
  return;
 }
 voice.element=clip;
 _activeAudioVoices.add(voice);
 const ended=()=>_removeVoice(voice);
 clip.addEventListener('ended',ended,{once:true});
 try{clip.currentTime=0;}catch(_err){}
 clip.volume=Math.max(0,Math.min(1,volume));
 let attempt;
 try{attempt=clip.play();}catch(error){
  _removeVoice(voice);_audioStatsDrop('playRejected');
  console.warn('[Audio] HTMLAudio playback failed:',path,error);return;
 }
 _playAudioPath.cooldowns.set(gateKey,now);
 if(attempt&&typeof attempt.then==='function'){
  attempt.then(()=>_audioStatsPlayed()).catch(error=>{
   _removeVoice(voice);_audioStatsDrop('playRejected');
   console.warn('[Audio] HTMLAudio play() rejected:',path,error);
  });
 }else _audioStatsPlayed();
}
function _playSphereAudio(key, slot, volume){
 if(window._balanceNoVisuals)return;
 if(typeof SPHERE_AUDIO==='undefined'||!SPHERE_AUDIO[key])return;
 const path=SPHERE_AUDIO[key][slot];
 const finalVolume=typeof volume==='number'?volume:_resolveAudioVolume(key,slot,'sfx');
 _playAudioPath(path,finalVolume,key,slot);
}
function _playSphereAudioScaled(key,slot,scale=1){
 if(window._balanceNoVisuals)return;
 if(typeof SPHERE_AUDIO==='undefined'||!SPHERE_AUDIO[key])return;
 const path=SPHERE_AUDIO[key][slot];
 const base=_resolveAudioVolume(key,slot,'sfx');
 const finalVolume=Math.max(0,Math.min(1,base*(Number.isFinite(scale)?scale:0)));
 _playAudioPath(path,finalVolume,key,slot);
}
function _pauseWebBgm(reset=false){
 if(!_audioContext)return;
 if(_webBgmSource){
  if(_webBgmPath&&_audioBuffers.get(_webBgmPath) instanceof AudioBuffer){
   const duration=_audioBuffers.get(_webBgmPath).duration;
   if(duration>0)_webBgmOffset=reset?0:(_webBgmOffset+_audioContext.currentTime-_webBgmStartedAt)%duration;
  }
  const source=_webBgmSource;
  _webBgmSource=null;
  source.onended=null;
  try{source.stop();}catch(_err){}
  try{source.disconnect();}catch(_err){}
 }
 if(reset)_webBgmOffset=0;
}
function _startWebBgm(path, buffer){
 if(window._balanceNoVisuals||!_audioContext||!_audioGraph||_audioContext.state!=='running')return;
 if(_webBgmSource&&_webBgmPath===path)return;
 _pauseWebBgm(false);
 _webBgmPath=path;
 const source=_audioContext.createBufferSource();
 source.buffer=buffer;
 source.loop=true;
 source.connect(_audioGraph.bgmBus);
 const offset=buffer.duration>0?(_webBgmOffset%buffer.duration):0;
 source.start(0,offset);
 _webBgmStartedAt=_audioContext.currentTime;
 _webBgmSource=source;
 _audioDebugBgmEvent('play',{path,offset});
 source.onended=()=>{if(_webBgmSource===source)_webBgmSource=null;};
}
function _syncArenaBgm(forceRestart=false){
 if(window._balanceNoVisuals)return;
 const path=ARENA_AUDIO?.bgm;
 const startScreen=document.getElementById('start-screen');
 if((startScreen&&startScreen.style.display!=='none')||gameMode==='testing'||window._testingDiagnosticRunning){
  if(_audioWebBackend)_pauseWebBgm(false);else if(_bgmAudio)_bgmAudio.pause();
  return;
 }
 if(!path){
  if(_audioWebBackend){_pauseWebBgm(true);_webBgmPath=null;}
  else if(_bgmAudio){_bgmAudio.pause();_bgmAudio=null;}
  return;
 }
 const shouldPause=paused||document.hidden||gameMode==='testing'||window._testingDiagnosticRunning||_audioState.muted||_audioState.bgmVolume<=0;
 if(_audioWebBackend){
  _ensureAudioGraph();
  _applyAudioGains();
  if(forceRestart)_webBgmOffset=0;
  if(shouldPause){_pauseWebBgm(false);return;}
  const existing=_audioBuffers.get(path);
  if(existing instanceof AudioBuffer){
   if(!_audioContext||_audioContext.state!=='running'){
    _audioStatsDrop('contextSuspended');_resumeAudioContext();return;
   }
   _startWebBgm(path,existing);
  }else{
   _ensureAudioBuffer(path).then(buffer=>{if(buffer&&!window._balanceNoVisuals)_syncArenaBgm();});
  }
  return;
 }
 if(!_bgmAudio||_bgmAudio.src.indexOf(path)===-1){
  if(_bgmAudio)_bgmAudio.pause();
  _bgmAudio=new Audio(path);
  _bgmAudio.preload='auto';_bgmAudio.loop=true;
  for(const eventName of ['pause','play','ended','stalled','waiting']){
   _bgmAudio.addEventListener(eventName,()=>_audioDebugBgmEvent(eventName,{readyState:_bgmAudio&&_bgmAudio.readyState}));
  }
  _bgmAudio.load();
 }
 _bgmAudio.volume=_audioState.muted?0:Math.max(0,Math.min(1,_audioState.masterVolume*_audioState.bgmVolume*_resolveAudioVolume('arena','bgm','bgm')));
 if(shouldPause||_bgmAudio.volume<=0){_bgmAudio.pause();return;}
 if(forceRestart){try{_bgmAudio.currentTime=0;}catch(_err){}}
 if(_bgmAudio.paused){
  try{
   const attempt=_bgmAudio.play();
   if(attempt&&typeof attempt.catch==='function')attempt.catch(error=>{
    _audioStatsDrop('playRejected');_audioDebugBgmEvent('play-rejected',{error:String(error)});
    console.warn('[Audio] BGM play() rejected.',error);_armBgmGestureRetry();
   });
  }catch(error){
   _audioStatsDrop('playRejected');_audioDebugBgmEvent('play-rejected',{error:String(error)});
   console.warn('[Audio] BGM play() failed.',error);_armBgmGestureRetry();
  }
 }
}
window.stopArenaBgm=function(){
 if(window._balanceNoVisuals)return;
 if(_audioWebBackend)_pauseWebBgm(true);
 else if(_bgmAudio){_bgmAudio.pause();try{_bgmAudio.currentTime=0;}catch(_err){}}
};
document.addEventListener('visibilitychange',()=>{
 if(window._balanceNoVisuals)return;
 if(document.hidden){
  if(_audioWebBackend)_pauseWebBgm(false);else if(_bgmAudio)_bgmAudio.pause();
 }else{
  _resumeAudioContext();
  if(typeof _syncArenaBgm==='function')_syncArenaBgm();
 }
});
for(const gesture of ['pointerdown','touchend','click','keydown']){
 document.addEventListener(gesture,()=>{
  if(window._balanceNoVisuals)return;
  _resumeAudioContext();
 },{passive:true});
}
window.toggleAudioMute=function(){
 if(window._balanceNoVisuals)return;
 _audioState.muted=!_audioState.muted;
 _saveAudioState();_updateAudioUi();_applyAudioGains();_syncArenaBgm();
};
window.setAudioVolume=function(channel, value){
 if(window._balanceNoVisuals)return;
 const normalized=Math.max(0,Math.min(1,Number(value)/100));
 if(channel==='sfx')_audioState.sfxVolume=normalized;
 if(channel==='bgm')_audioState.bgmVolume=normalized;
 _saveAudioState();_updateAudioUi();_applyAudioGains();_syncArenaBgm();
};
window.initAudioUi=function(){
 if(window._balanceNoVisuals)return;
 _loadAudioState();_updateAudioUi();_applyAudioGains(false);
};
