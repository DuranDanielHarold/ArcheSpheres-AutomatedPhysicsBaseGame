'use strict';
let royaleState=null;
let royaleHudClock=0;
function royaleShuffle(list){
 for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=list[i];list[i]=list[j];list[j]=t;}
 return list;
}
function royaleLivingRoster(){
 let count=0;for(let i=0;i<spheres.length;i++){const s=spheres[i];if(!s.isReplica&&s.alive&&!s.dying)count++;}
 return count;
}
function royaleNextEvent(){
 if(!royaleState.eventBag.length)royaleState.eventBag=royaleShuffle(ROYALE_EVENT_IDS.slice());
 return royaleState.eventBag.pop();
}
function royaleEnterEvent(){
 royaleState.currentEventId=royaleNextEvent();
 royaleState.eventSequence.push(royaleState.currentEventId);
 const entry=ROYALE_EVENT_REGISTRY[royaleState.currentEventId];
 if(entry&&typeof entry.start==='function')entry.start(royaleState);
}
function royaleEndEvent(){
 const entry=ROYALE_EVENT_REGISTRY[royaleState.currentEventId];
 if(entry&&typeof entry.end==='function')entry.end(royaleState);
}
function royaleStartCalm(){
 royaleState.state='CALM';royaleState.stateTimer=ROYALE_CONFIG.calm;
}
function updateRoyale(dt){
 if(!royaleState||winDone)return;
 window.matchTime=(window.matchTime||0)+dt;
 for(let i=0;i<spheres.length;i++){
  const s=spheres[i];
  if(s._royaleObstacleCooldown>0)s._royaleObstacleCooldown=Math.max(0,s._royaleObstacleCooldown-dt);
 }
 if(royaleState.state==='CALM'){
  royaleState.stateTimer-=dt;
  if(royaleState.stateTimer<=0){royaleState.state='WARNING';royaleState.stateTimer=ROYALE_CONFIG.warning;planNextZone();}
 }else if(royaleState.state==='WARNING'){
  royaleState.stateTimer-=dt;
  if(royaleState.stateTimer<=0){royaleState.state='EVENT';royaleState.stateTimer=ROYALE_CONFIG.event;royaleEnterEvent();}
 }else if(royaleState.state==='EVENT'){
  const entry=ROYALE_EVENT_REGISTRY[royaleState.currentEventId];
  if(entry&&typeof entry.update==='function')entry.update(dt,royaleState);
  royaleState.stateTimer-=dt;
  if(royaleState.stateTimer<=0){royaleEndEvent();royaleState.state='SHRINK';royaleState.stateTimer=ROYALE_CONFIG.shrink;}
 }else if(royaleState.state==='SHRINK'){
  royaleState.stateTimer-=dt;
  if(royaleState.stateTimer<=0){
   finishRoyaleZone();
   if(royaleState.phase>=ROYALE_CONFIG.phases){royaleState.state='FINAL';royaleState.finalTimer=ROYALE_CONFIG.finalTimeout;royaleState.stateTimer=royaleState.finalTimer;}
   else{royaleState.phase++;royaleStartCalm();}
  }
 }else if(royaleState.state==='FINAL'){
  royaleState.finalTimer-=dt;royaleState.stateTimer=royaleState.finalTimer;
  if(royaleState.finalTimer<=0){
   let best=null,bestPct=-Infinity,tied=false;
   for(let i=0;i<spheres.length;i++){
    const s=spheres[i];if(s.isReplica||!s.alive||s.dying)continue;
    const pct=s.maxHp>0?s.hp/s.maxHp:0;
    if(pct>bestPct+1e-9){best=s;bestPct=pct;tied=false;}
    else if(Math.abs(pct-bestPct)<=1e-9)tied=true;
   }
   concludeMatch(best&&!tied?best:null,best&&!tied?'royale_timeout_hp':'royale_timeout_tie');
  }
 }
 updateZone(dt);
 resolveRoyaleObstacles();
 resolveRoyaleBounds();
 killRoyaleProjectilesOnObstacles();
 royaleHudClock+=dt;
 if(royaleHudClock>=0.125){royaleHudClock=0;updateRoyaleHud(true);}
}
function drawRoyaleFrame(stage){
 if(stage==='obstacles'){drawRoyaleObstacles();return;}
 if(stage==='markers'){
  for(let i=0;i<spheres.length;i++){
   const s=spheres[i];if(s.isReplica||!s.alive||s.dying)continue;
   const faction=ROYALE_FACTION_COLORS[s.faction];if(!faction)continue;
   ctx.save();ctx.strokeStyle=faction.color;ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(s.x,s.y,s.radius+5,0,Math.PI*2);ctx.stroke();
   ctx.fillStyle=faction.color;ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.textBaseline='top';
   ctx.fillText(String(s.faction+1),s.x,s.y+s.radius+8);ctx.restore();
  }
  const event=ROYALE_EVENT_REGISTRY[royaleState?.currentEventId];
  if(royaleState?.state==='EVENT'&&event&&typeof event.draw==='function')event.draw(royaleState);
 }
}
function updateRoyaleHud(force){
 if(!royaleState)return;
 const border=document.getElementById('arena-border');if(!border)return;
 let hud=document.getElementById('royale-hud');
 if(!hud){hud=document.createElement('div');hud.id='royale-hud';border.appendChild(hud);}
 if(!force&&royaleHudClock<0.125)return;
 const eventId=royaleState.currentEventId;
 const eventLabel=eventId?(ROYALE_EVENT_LABELS[eventId]||eventId):'—';
 let shrinkIn=royaleState.stateTimer;
 if(royaleState.state==='CALM')shrinkIn+=ROYALE_CONFIG.warning+ROYALE_CONFIG.event;
 else if(royaleState.state==='WARNING')shrinkIn+=ROYALE_CONFIG.event;
 const timeText=royaleState.state==='SHRINK'?'SHRINKING '+Math.max(0,royaleState.stateTimer).toFixed(1)+'s':
  (royaleState.state==='FINAL'?'FINAL '+Math.max(0,royaleState.finalTimer).toFixed(1)+'s':'SHRINK IN '+Math.max(0,shrinkIn).toFixed(1)+'s');
 let html='<div class="royale-hud-top"><span>PHASE '+royaleState.phase+'/'+ROYALE_CONFIG.phases+' - '+royaleState.state+' - '+eventLabel+' - '+timeText+'</span><span>'+royaleLivingRoster()+' REMAINING</span></div><div class="royale-hud-roster">';
 for(let i=0;i<ROYALE_CONFIG.count;i++){
  let s=null;for(let j=0;j<spheres.length;j++){if(!spheres[j].isReplica&&spheres[j].faction===i){s=spheres[j];break;}}
  if(!s)continue;
  const dead=!s.alive||s.dying,pct=s.maxHp>0?Math.max(0,Math.min(100,s.hp/s.maxHp*100)):0;
  const color=ROYALE_FACTION_COLORS[i].color;
  html+='<div class="royale-chip'+(dead?' dead':'')+'"><img src="'+getSphereIcon(s.key,24)+'" alt=""><div><div class="royale-chip-name">'+s.d.label+'</div><div class="royale-chip-hp"><i style="width:'+pct+'%;background:'+color+'"></i></div></div></div>';
 }
 hud.innerHTML=html+'</div>';
}
function startRoyale(){
 gameMode='royale';window.randomModeActive=false;
 if(typeof restoreTestingRandom==='function')restoreTestingRandom();
 const start=document.getElementById('start-screen');if(start)start.style.display='none';
 const picker=document.getElementById('picker-screen');if(picker)picker.remove();
 document.getElementById('mode-row').style.display='none';
 document.getElementById('sel-row').style.display='none';
 const card=document.getElementById('card');card.style.display='flex';card.className='mode-royale';
 document.getElementById('controls').style.display='flex';
 newRoyaleBattle();
 paused=true;
 showCountdown(3,()=>{paused=false;lastTime=performance.now();});
}
function newRoyaleBattle(){
 if(typeof restoreTestingRandom==='function')restoreTestingRandom();
 cancelAnimationFrame(animId);
 document.getElementById('winner').classList.remove('show');
 winDone=false;paused=true;window.matchTime=0;resetStallState();
 spheres=[];particles=[];projectiles=[];afterimages=[];noiseTraps=[];slowZones=[];thornPatches=[];skeletons=[];dmgNums=[];bloodSplats=[];miasmaClouds=[];
 if(typeof _burialMoundSeq!=='undefined')_burialMoundSeq=0;
 resetRoyaleObstacles();resetRoyaleZone();resize();
 window._liveCombatTracker=null;window._lastMatchReport=null;
 document.getElementById('pbtn').textContent='PAUSE';
 const keys=royaleShuffle(Object.keys(DEF).slice()).slice(0,ROYALE_CONFIG.count);
 const speedScale=Math.max(1,Math.min(ROYALE_CONFIG.speedScaleMax,W/ROYALE_CONFIG.speedScaleRef));
 const offset=Math.random()*Math.PI*2;
 const spawnPoints=[];
 for(let i=0;i<keys.length;i++){
  const key=keys[i];
  let a=Math.random()*Math.PI*2;
  while(Math.abs(((a%(Math.PI/2))+(Math.PI/2))%(Math.PI/2)-(Math.PI/4))<0.22)a+=0.28;
  const raw=DEF[key].spd*(1.0+Math.random()*0.25);
  const vx=Math.cos(a)*raw*speedScale,vy=Math.sin(a)*raw*speedScale;
  const slotAngle=offset+(i/ROYALE_CONFIG.count)*Math.PI*2;
  const x=W*.5+Math.cos(slotAngle)*W*.32;
  const y=H*.5+Math.sin(slotAngle)*H*.30;
  const s=new Sphere(key,i,x,y,vx,vy,undefined,{radiusFraction:ROYALE_CONFIG.radiusHeightFraction});
  s._royaleObstacleCooldown=0;
  spheres.push(s);spawnPoints.push({x:x,y:y,r:s.radius});
 }
 let largestRadius=0;for(let i=0;i<spheres.length;i++)largestRadius=Math.max(largestRadius,spheres[i].radius);
 initRoyaleObstacles(spawnPoints,largestRadius);
 initRoyaleZone(largestRadius);
 const eventBag=royaleShuffle(ROYALE_EVENT_IDS.slice());
 royaleState={phase:1,state:'CALM',stateTimer:ROYALE_CONFIG.calm,currentEventId:null,
  eventBag:eventBag,eventSequence:[],finalTimer:0};
 console.log('[Royale] next 10 shuffle-bag events:',eventBag.slice().reverse().slice(0,ROYALE_CONFIG.phases));
 console.log('[Royale] unique classes:',keys.slice());
 if(typeof _preloadConfiguredAudio==='function')_preloadConfiguredAudio(keys);
 if(typeof _syncArenaBgm==='function')_syncArenaBgm();
 updateRoyaleHud(true);
 lastTime=performance.now();animId=requestAnimationFrame(loop);
}
window.startRoyale=startRoyale;
window.newRoyaleBattle=newRoyaleBattle;
window.royaleDebug={
 state:()=>royaleState?{phase:royaleState.phase,state:royaleState.state,stateTimer:royaleState.stateTimer,
  currentEventId:royaleState.currentEventId,eventSequence:royaleState.eventSequence.slice(),
  bounds:royaleZone?Object.assign({},royaleZone.bounds):null,finalTimer:royaleState.finalTimer}:null,
 skipPhase:()=>{if(royaleState){royaleState.stateTimer=0;updateRoyale(0);}},
 forceEvent:id=>{if(royaleState&&ROYALE_EVENT_IDS.includes(id))royaleState.currentEventId=id;}
};
