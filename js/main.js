'use strict';
// ▓▓▓ SECTION:MAIN — Canvas setup, global state, selector init, newBattle, resize, event listeners ▓▓▓

const canvas=document.getElementById('gc'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
let W=1,H=1,spheres=[],particles=[],projectiles=[],afterimages=[],noiseTraps=[],slowZones=[],thornPatches=[],skeletons=[],dmgNums=[],bloodSplats=[],miasmaClouds=[],paused=false,winDone=false,lastTime=0,animId;
let gameMode='1v1';
(function(){
 window._mkSel=function(defaultKey){
  const sel=document.createElement('select');
  Object.keys(DEF).forEach(k=>{
   const o=document.createElement('option');
   o.value=k;o.textContent=DEF[k].label;
   if(k===defaultKey)o.selected=true;
   sel.appendChild(o);
  });
  sel.addEventListener('change',newBattle);
  return sel;
 };
 window.setMode=function(m){
  gameMode=m;
  document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('active'));
  document.querySelector(`.mtab[onclick*="${m}"]`).classList.add('active');
  document.getElementById('card').className='mode-1v1';
  document.getElementById('stats').style.display='grid';
  document.getElementById('abilitybar').style.display='flex';
  document.getElementById('t-vs').textContent=' VS ';
  buildSelRow();
  newBattle();
 };
 window.buildSelRow=function(){
  const row=document.getElementById('sel-row');
  row.innerHTML='';
  const wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:6px;align-items:center;';
  const sg1=document.createElement('div');sg1.className='sg';
  const lb1=document.createElement('span');lb1.className='sl';lb1.style.color='#ff7755';lb1.textContent='RED';
  const s1=_mkSel('knight');s1.id='sel-0';s1.style.color='#ff9977';
  sg1.append(lb1,s1);
  const vs=document.createElement('span');vs.className='sl';vs.style.cssText='color:#fff;font-size:7px;';vs.textContent='VS';
  const sg2=document.createElement('div');sg2.className='sg';
  const lb2=document.createElement('span');lb2.className='sl';lb2.style.color='#88bbdd';lb2.textContent='BLUE';
  const s2=_mkSel('samurai');s2.id='sel-1';
  sg2.append(lb2,s2);
  wrap.append(sg1,vs,sg2);row.appendChild(wrap);
 };
 buildSelRow();
})();
// ▓▓▓ END:DATA ▓▓▓

function newBattle(){
 cancelAnimationFrame(animId);
 document.getElementById('winner').classList.remove('show');
 winDone=false;paused=false;
 document.getElementById('pbtn').textContent='⏸ PAUSE';
 spheres=[];particles=[];projectiles=[];afterimages=[];noiseTraps=[];slowZones=[];thornPatches=[];skeletons=[];dmgNums=[];bloodSplats=[];miasmaClouds=[];
 if(typeof _preloadConfiguredAudio==='function')_preloadConfiguredAudio();
 resize();
 function dvdVel(key){
  let a=Math.random()*Math.PI*2;
  while(Math.abs(((a%(Math.PI/2))+(Math.PI/2))%(Math.PI/2)-(Math.PI/4))<0.22)a+=0.28;
  const d=DEF[key];const rawSpd=d.spd*(1.0+Math.random()*0.25);
  return{vx:Math.cos(a)*rawSpd,vy:Math.sin(a)*rawSpd};
 }
 document.getElementById('stats').style.display='grid';
 document.getElementById('abilitybar').style.display='flex';
 const rk=document.getElementById('sel-0').value;
 const bk=document.getElementById('sel-1').value;
 fillStats(rk,'r');fillStats(bk,'b');
 document.getElementById('t-red').textContent=DEF[rk].label;
 document.getElementById('t-blue').textContent=DEF[bk].label;
 document.getElementById('t-vs').textContent=' VS ';
 const v0=dvdVel(rk),v1=dvdVel(bk);
 const rd=Math.min(W,H)*(DEF[rk].mass>=20?0.115:0.095);
 const bd=Math.min(W,H)*(DEF[bk].mass>=20?0.115:0.095);
 spheres.push(new Sphere(rk,0,rd*2+Math.random()*(W/2-rd*3),rd*2+Math.random()*(H-rd*4),v0.vx,v0.vy));
 spheres.push(new Sphere(bk,1,W/2+bd+Math.random()*(W/2-bd*3),bd*2+Math.random()*(H-bd*4),v1.vx,v1.vy));
 lastTime=performance.now();animId=requestAnimationFrame(loop);
}
function togglePause(){paused=!paused;document.getElementById('pbtn').textContent=paused?'▶ RESUME':'⏸ PAUSE';if(!paused)lastTime=performance.now();}
function resize(){
 const rect=canvas.getBoundingClientRect();
 W=canvas.width=Math.max(1,Math.floor(rect.width));
 H=canvas.height=Math.max(1,Math.floor(rect.height));
 ctx.imageSmoothingEnabled=false;
}
if(window.ResizeObserver){
 new ResizeObserver(()=>{resize();}).observe(document.getElementById('arena-border'));
}
window.addEventListener('orientationchange',()=>setTimeout(()=>{resize();},150));
window.addEventListener('load',()=>{resize();});
