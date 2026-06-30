'use strict';
// ▓▓▓ MODULE: ui/battle-launch.js — extracted from former js/ui.js ▓▓▓
// Battle launch handoff and countdown overlay.

function launchBattle(){
 gameMode='1v1';
 document.getElementById('card').className='mode-1v1';
 buildSelRow();
 Object.entries(pendingSelections).forEach(([idx,key])=>{
  const sel=document.getElementById(`sel-${idx}`);if(sel)sel.value=key;
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
function showCountdown(n,onDone){
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
  if(r<=0){ov.classList.remove('show');numEl.textContent='FIGHT!';numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
   setTimeout(()=>{numEl.textContent='';lblEl.textContent='GET READY';ov.classList.remove('show');onDone();},600);return;}
  numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
  numEl.textContent=r;
  lblEl.textContent=r===1?'LAST CHANCE':'GET READY';
  countdownTimer=setTimeout(()=>tick(r-1),1000);
 }
 tick(n);
}
window.addEventListener('load',()=>setTimeout(showStartScreen,80));
// ▓▓▓ END:UI ▓▓▓
