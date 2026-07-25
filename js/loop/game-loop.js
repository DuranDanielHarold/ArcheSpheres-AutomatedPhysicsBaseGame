'use strict';
// ▓▓▓ MODULE: loop/game-loop.js — extracted from former js/engine.js ▓▓▓
// Main animation loop and winner/rematch overlay flow.

function loop(ts){
 animId=requestAnimationFrame(loop);
 if(paused){lastTime=ts;return;}
 const dt=Math.min((ts-lastTime)/1000,.05);lastTime=ts;
 for(const s of spheres)s.update(dt);
 for(const p of projectiles)p.update(dt);
 resolveAll();
 updateParticles(dt);
 updateDmgNums(dt);
 updateBloodSplats(dt);
 updateAbBar();
 slowZones=slowZones.filter(z=>{z.update(dt);return z.life>0;});
 thornPatches=thornPatches.filter(p=>{p.update(dt);return p.life>0;});
 miasmaClouds=miasmaClouds.filter(m=>{m.update(dt);return m.life>0;});
 afterimages=afterimages.filter(a=>{a.update(dt);return a.alive;});
  noiseTraps=noiseTraps.filter(n=>{n.update(dt);return n.alive;});
  skeletons=skeletons.filter(sk=>{sk.update(dt);return sk.alive;});
  projectiles=projectiles.filter(p=>p.alive);
  spheres=spheres.filter(s=>!s.isReplica||s.alive||s.dyingT<=0.8);
  updateStallState(dt);
  checkEliminationWin();
  const timeoutResult=checkMatchTimeout();
  if(timeoutResult)concludeMatch(timeoutResult.winner,timeoutResult.endReason);
 drawBg();
 drawBloodSplats();
 for(const z of slowZones)z.draw();
 for(const p of thornPatches)p.draw();
 for(const m of miasmaClouds)m.draw();
 for(const a of afterimages)a.draw();
 for(const n of noiseTraps)n.draw();
 drawParticles();
 for(const sk of skeletons)sk.draw();
 for(const p of projectiles)p.draw();
 for(const s of spheres)if(s.dying)s.draw();
 for(const s of spheres)if(!s.dying&&s.alive)s.draw();
 drawDmgNums();
}
function concludeMatch(winner,endReason){
 if(winDone)return;
 winDone=true;
 showWinner(winner);
}
function checkEliminationWin(){
 if(winDone)return;
 const alive=spheres.filter(s=>s.alive&&!s.dying);
 const factions=[...new Set(alive.map(s=>s.faction))];
 if(factions.length<2&&spheres.length>=2){
  const winnerFaction=factions[0];
  const winner=winnerFaction===undefined?null:(alive.find(s=>s.faction===winnerFaction&&!s.isReplica)||alive.find(s=>s.faction===winnerFaction)||null);
  concludeMatch(winner,'elimination');
 }
}
function showWinner(w){
 const ov=document.getElementById('winner'),wt=document.getElementById('wt'),ws=document.getElementById('ws');
 if(!w)wt.innerHTML=`<span style="color:#ffcc44">DRAW!</span><br><span style="color:#aac;font-size:.75em">ALL FELL</span>`;
 else{
  const col=w.faction===0?'#ff6633':'#88aaff';
  const team=gameMode==='2v2'?(w.faction===0?'TEAM RED':'TEAM BLUE'):w.d.label.toUpperCase();
  wt.innerHTML=`<span style="color:${col}">${team}</span><br><span style="color:#ffcc44;font-size:.8em">WINS!</span>`;
 }
 if(ws)ws.innerHTML='<div style="font-size:.75em">TAP — REMATCH</div><div style="font-size:.55em;color:#5a6a80;margin-top:3px">LONG PRESS — REPICK</div>';
 ov.classList.add('show');
 let pressTimer=null;
 const cleanup=()=>{ov.removeEventListener('mousedown',onDown);ov.removeEventListener('touchstart',onDown);ov.removeEventListener('mouseup',onUp);ov.removeEventListener('touchend',onUp);};
 const onDown=()=>{pressTimer=setTimeout(()=>{cleanup();window.randomModeActive=false;ov.classList.remove('show');window.startPicker(gameMode);},600);};
 const onUp=()=>{if(pressTimer){clearTimeout(pressTimer);pressTimer=null;cleanup();ov.classList.remove('show');if(window.randomModeActive&&typeof window.startRandomBattle==='function')window.startRandomBattle();else launchBattle();}};
 ov.addEventListener('mousedown',onDown);ov.addEventListener('touchstart',onDown);
 ov.addEventListener('mouseup',onUp,{once:true});ov.addEventListener('touchend',onUp,{once:true});
}
