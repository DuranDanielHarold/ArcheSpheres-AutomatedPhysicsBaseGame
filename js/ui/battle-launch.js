'use strict';
// ▓▓▓ MODULE: ui/battle-launch.js — extracted from former js/ui.js ▓▓▓
// Battle launch handoff and countdown overlay.

function launchBattle(){
 if(gameMode==='testing'&&typeof launchTestingGround==='function'){launchTestingGround();return;}
 if(typeof restoreTestingRandom==='function')restoreTestingRandom();
 document.getElementById('card').className=`mode-${gameMode}`;
 buildSelRow();
 Object.entries(pendingSelections).forEach(([idx,key])=>{
  const sel=document.getElementById(`sel-${idx}`);if(sel){sel.value=key;const img=sel.parentElement&&sel.parentElement.querySelector('.sel-icon');if(img)img.src=getSphereIcon(key,24);}
 });
 const ps=document.getElementById('picker-screen');if(ps)ps.remove();
 const ss=document.getElementById('start-screen');if(ss)ss.style.display='none';
 document.getElementById('mode-row').style.display='flex';
 document.getElementById('sel-row').style.display='flex';
 document.getElementById('card').style.display='flex';
 document.getElementById('controls').style.display='flex';
 newBattle();
 paused=true;
 showCountdown(3,()=>{paused=false;lastTime=performance.now();});
}
let countdownTimer=null;
let countdownRunId=0;
function showCountdown(n,onDone){
 const runId=++countdownRunId;
 if(countdownTimer!==null){clearTimeout(countdownTimer);countdownTimer=null;}
 window._battleCountdownActive=true;
 paused=true;
 let ov=document.getElementById('countdown-overlay');
 if(!ov){
  ov=document.createElement('div');ov.id='countdown-overlay';
  ov.innerHTML='<div id="countdown-num"></div><div id="countdown-label">GET READY</div>';
  document.getElementById('arena-border').appendChild(ov);
 }
 ov.classList.add('show');
 const numEl=document.getElementById('countdown-num');
 const lblEl=document.getElementById('countdown-label');
 function tick(r){
  if(runId!==countdownRunId)return;
  if(r<=0){ov.classList.remove('show');numEl.textContent='FIGHT!';numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
   countdownTimer=setTimeout(()=>{if(runId!==countdownRunId)return;countdownTimer=null;numEl.textContent='';lblEl.textContent='GET READY';ov.classList.remove('show');window._battleCountdownActive=false;onDone();},600);return;}
  numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
  numEl.textContent=r;
  lblEl.textContent=r===1?'LAST CHANCE':'GET READY';
  countdownTimer=setTimeout(()=>{countdownTimer=null;tick(r-1);},1000);
 }
 tick(n);
}
window.addEventListener('load',()=>setTimeout(showStartScreen,80));
// ▓▓▓ END:UI ▓▓▓
