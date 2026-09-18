'use strict';
// Live-match Sudden Death timer, warning UI, and timeout tiebreaking.

let _stallWarningShown=false,_stallDamagePerSecond=null;

function computeStallRampDps(matchSpheres){return Math.max(0,...matchSpheres.map(s=>s.maxHp||0))/STALL_CONFIG.rampDurationSeconds;}
function applyStallRampDamage(matchSpheres,damageThisTick){
 for(const s of matchSpheres){if(!s.alive||s.dying||s.isReplica)continue;s.hp=Math.max(0,s.hp-damageThisTick);s.hitFlash=1;if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;s._killedBySuddenDeath=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}}
}
function resolveStallTimeoutWinner(matchSpheres){
 const red=matchSpheres.find(s=>s.faction===0&&!s.isReplica)||matchSpheres.find(s=>s.faction===0),blue=matchSpheres.find(s=>s.faction===1&&!s.isReplica)||matchSpheres.find(s=>s.faction===1);
 const redAlive=!!(red&&red.alive&&!red.dying),blueAlive=!!(blue&&blue.alive&&!blue.dying);
 if(redAlive&&!blueAlive)return{winner:red,endReason:'timeout_blue_dead'};if(blueAlive&&!redAlive)return{winner:blue,endReason:'timeout_red_dead'};if(!redAlive&&!blueAlive)return{winner:null,endReason:'double_ko'};
 const redPct=red.maxHp>0?red.hp/red.maxHp:0,bluePct=blue.maxHp>0?blue.hp/blue.maxHp:0,diff=redPct-bluePct;
 if(Math.abs(diff)<0.01)return{winner:null,endReason:'timeout_hp_tie'};return{winner:diff>0?red:blue,endReason:'timeout_hp_pct_tiebreak'};
}


function resetStallState(){
 _stallWarningShown=false;
 _stallDamagePerSecond=null;
 const arena=document.getElementById('arena-border');
 if(arena)arena.classList.remove('sudden-death-active');
 const banner=document.getElementById('sudden-death-banner');
 if(banner)banner.classList.remove('show');
}

function ensureStallStyles(){
 if(document.getElementById('stall-resolution-styles'))return;
 const st=document.createElement('style');st.id='stall-resolution-styles';
 st.textContent=`
 #sudden-death-banner{position:absolute;left:50%;top:10%;transform:translate(-50%,-8px);z-index:25;
  pointer-events:none;opacity:0;font-family:'Press Start 2P',monospace;font-size:clamp(8px,2.7vw,18px);
  color:var(--goldl);background:rgba(10,12,22,.78);border:3px solid var(--gold);
  padding:10px 14px;text-shadow:0 0 18px #c8920a,3px 3px 0 #000;
  box-shadow:0 0 24px rgba(200,40,20,.7),3px 3px 0 #000;letter-spacing:1px;}
 #sudden-death-banner.show{animation:suddenDeathBanner 3.3s ease-in-out forwards;}
 @keyframes suddenDeathBanner{0%{opacity:0;transform:translate(-50%,-8px) scale(.96);}12%{opacity:1;transform:translate(-50%,0) scale(1);}88%{opacity:1;transform:translate(-50%,0) scale(1);}100%{opacity:0;transform:translate(-50%,-8px) scale(.96);}}
 #arena-border.sudden-death-active{animation:suddenDeathPulse 1.1s ease-in-out infinite;}
 @keyframes suddenDeathPulse{0%,100%{box-shadow:inset 0 0 0 4px var(--gold),inset 0 0 0 8px var(--goldl),0 0 0 2px var(--goldsh),0 0 0 rgba(160,0,0,0);}50%{box-shadow:inset 0 0 0 4px #c8920a,inset 0 0 0 8px #ff6644,0 0 0 2px #7a0000,0 0 18px rgba(255,40,20,.85);}}
 `;
 document.head.appendChild(st);
}

function showStallWarningBanner(){
 ensureStallStyles();
 let banner=document.getElementById('sudden-death-banner');
 if(!banner){
  const arena=document.getElementById('arena-border');
  if(!arena)return;
  banner=document.createElement('div');banner.id='sudden-death-banner';banner.textContent='⚠ SUDDEN DEATH';
  arena.appendChild(banner);
 }
 banner.classList.remove('show');void banner.offsetWidth;banner.classList.add('show');
}

function updateStallState(dt){
 window.matchTime=(window.matchTime||0)+dt;
 const warnAt=STALL_CONFIG.stallThresholdSeconds-STALL_CONFIG.warnLeadSeconds;
 if(!_stallWarningShown&&window.matchTime>=warnAt){_stallWarningShown=true;showStallWarningBanner();}
 if(window.matchTime<STALL_CONFIG.stallThresholdSeconds)return;
 ensureStallStyles();
 const arena=document.getElementById('arena-border');if(arena)arena.classList.add('sudden-death-active');
 if(_stallDamagePerSecond===null)_stallDamagePerSecond=computeStallRampDps(spheres);
 applyStallRampDamage(spheres,_stallDamagePerSecond*dt);
}

function checkMatchTimeout(){if((window.matchTime||0)<STALL_CONFIG.hardTimeoutSeconds)return null;return resolveStallTimeoutWinner(spheres);}
