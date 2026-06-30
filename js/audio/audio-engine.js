'use strict';
// ▓▓▓ MODULE: audio/audio-engine.js — extracted from former js/engine.js ▓▓▓
// Audio state, preloading, playback, BGM, mute, and volume UI helpers.

const _audioPoolCache = new Map();
const _audioStorageKey = 'archeSpheresAudioState';
let _bgmAudio = null;
let _audioState = {
 masterVolume: AUDIO_SETTINGS_DEFAULTS.masterVolume,
 sfxVolume: AUDIO_SETTINGS_DEFAULTS.sfxVolume,
 bgmVolume: AUDIO_SETTINGS_DEFAULTS.bgmVolume,
 muted: AUDIO_SETTINGS_DEFAULTS.muted,
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

function _resolveAudioVolume(key, slot, channel='sfx'){
 const bucket=channel==='bgm' ? (AUDIO_VOLUMES.arena||{}) : (AUDIO_VOLUMES[key]||{});
 const base=(bucket[slot] ?? AUDIO_VOLUMES.default?.[slot] ?? 0.65);
 const channelVolume=channel==='bgm' ? _audioState.bgmVolume : _audioState.sfxVolume;
 if(_audioState.muted)return 0;
 return Math.max(0,Math.min(1,base*_audioState.masterVolume*channelVolume));
}

function _updateAudioUi(){
 const muteBtn=document.getElementById('mute-btn');
 const sfxSlider=document.getElementById('sfx-vol');
 const bgmSlider=document.getElementById('bgm-vol');
 if(muteBtn)muteBtn.textContent=_audioState.muted?'SOUND OFF':'SOUND ON';
 if(sfxSlider)sfxSlider.value=Math.round(_audioState.sfxVolume*100);
 if(bgmSlider)bgmSlider.value=Math.round(_audioState.bgmVolume*100);
}

function _syncArenaBgm(forceRestart=false){
 const path=ARENA_AUDIO?.bgm;
 if(!path){
  if(_bgmAudio){_bgmAudio.pause();_bgmAudio=null;}
  return;
 }
 if(!_bgmAudio||_bgmAudio.src.indexOf(path)===-1){
  if(_bgmAudio)_bgmAudio.pause();
  _bgmAudio=new Audio(path);
  _bgmAudio.preload='auto';
  _bgmAudio.loop=true;
  _bgmAudio.load();
 }
 _bgmAudio.volume=_resolveAudioVolume('arena','bgm','bgm');
 if(_audioState.muted||_bgmAudio.volume<=0){
  _bgmAudio.pause();
  return;
 }
 if(forceRestart){
  try{_bgmAudio.currentTime=0;}catch(_err){}
 }
 if(_bgmAudio.paused){
  const playAttempt=_bgmAudio.play();
  if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{});
 }
}

function _primeAudioPath(path, poolSize=1){
 if(!path)return;
 let pool=_audioPoolCache.get(path);
 if(!pool){
  pool=[];
  _audioPoolCache.set(path,pool);
 }
 while(pool.length<poolSize){
  const clip=new Audio(path);
  clip.preload='auto';
  clip.load();
  pool.push(clip);
 }
}

function _preloadConfiguredAudio(){
 if(typeof SPHERE_AUDIO==='undefined'||typeof ARENA_AUDIO==='undefined')return;
 for(const slots of Object.values(SPHERE_AUDIO)){
  if(!slots)continue;
  for(const path of Object.values(slots))_primeAudioPath(path,2);
 }
 for(const path of Object.values(ARENA_AUDIO))_primeAudioPath(path,1);
}

function _playAudioPath(path, volume=0.65){
 if(!path)return;
 if(volume<=0)return;
 let pool=_audioPoolCache.get(path);
 if(!pool){
  _primeAudioPath(path,2);
  pool=_audioPoolCache.get(path);
 }
 let clip=pool.find(a=>a.paused||a.ended);
 if(!clip){
  clip=new Audio(path);
  clip.preload='auto';
  clip.load();
  pool.push(clip);
 }
 try{clip.currentTime=0;}catch(_err){}
 clip.volume=volume;
 const playAttempt=clip.play();
 if(playAttempt&&typeof playAttempt.catch==='function')playAttempt.catch(()=>{});
}

function _playSphereAudio(key, slot, volume){
 if(!SPHERE_AUDIO||!SPHERE_AUDIO[key])return;
 const path=SPHERE_AUDIO[key][slot];
 const finalVolume=typeof volume==='number'?volume:_resolveAudioVolume(key,slot,'sfx');
 _playAudioPath(path,finalVolume);
}

window.toggleAudioMute=function(){
 _audioState.muted=!_audioState.muted;
 _saveAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

window.setAudioVolume=function(channel, value){
 const normalized=Math.max(0,Math.min(1,Number(value)/100));
 if(channel==='sfx')_audioState.sfxVolume=normalized;
 if(channel==='bgm')_audioState.bgmVolume=normalized;
 _saveAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

window.initAudioUi=function(){
 _loadAudioState();
 _updateAudioUi();
 _syncArenaBgm();
};

