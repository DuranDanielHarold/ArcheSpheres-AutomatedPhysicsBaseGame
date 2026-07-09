'use strict';
// SECTION:MAIN - Canvas setup, global state, selector init, newBattle, resize, event listeners

const canvas=document.getElementById('gc'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
let W=1,H=1,spheres=[],particles=[],projectiles=[],afterimages=[],noiseTraps=[],slowZones=[],thornPatches=[],skeletons=[],dmgNums=[],bloodSplats=[],miasmaClouds=[],paused=false,winDone=false,lastTime=0,animId;
let gameMode='1v1';
(function(){
 const ROLE_ORDER=['TANK','FIGHTER','ASSASSIN','MAGE','MARKSMAN','SUPPORT'];
 function slotDefaults(){return gameMode==='2v2'?['knight','viking','samurai','ranger']:['knight','samurai'];}
 window.getBattleSlots=function(mode=gameMode){return mode==='2v2'?
  [{id:0,label:'RED 1',team:'RED',faction:0,color:'#ff7755'},{id:1,label:'RED 2',team:'RED',faction:0,color:'#ff9977'},{id:2,label:'BLUE 1',team:'BLUE',faction:1,color:'#88bbdd'},{id:3,label:'BLUE 2',team:'BLUE',faction:1,color:'#a8d4ff'}]:
  [{id:0,label:'RED',team:'RED',faction:0,color:'#ff7755'},{id:1,label:'BLUE',team:'BLUE',faction:1,color:'#88bbdd'}];};
 window._mkSel=function(defaultKey){
  const wrap=document.createElement('span');wrap.className='sel-chip';
  const img=document.createElement('img');img.className='sel-icon';img.width=24;img.height=24;img.alt='';
  const sel=document.createElement('select');
  const keysByRole={};Object.keys(DEF).forEach(k=>{const r=CLASS_ROLE[k]||'FIGHTER';(keysByRole[r]||(keysByRole[r]=[])).push(k);});
  ROLE_ORDER.forEach(r=>{if(!keysByRole[r])return;const og=document.createElement('optgroup');og.label=r;keysByRole[r].sort((a,b)=>DEF[a].label.localeCompare(DEF[b].label)).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=DEF[k].label;if(k===defaultKey)o.selected=true;og.appendChild(o);});sel.appendChild(og);});
  function syncIcon(){img.src=getSphereIcon(sel.value,24);img.title=DEF[sel.value].label;}
  sel.addEventListener('change',()=>{syncIcon();newBattle();});
  wrap.append(img,sel);setTimeout(syncIcon,0);return wrap;
 };
 window.setMode=function(m){
  gameMode=m;window.randomModeActive=false;
  document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('active'));
  const tab=document.querySelector(`.mtab[onclick*=\"${m}\"]`);if(tab)tab.classList.add('active');
  document.getElementById('card').className=`mode-${m}`;
  document.getElementById('stats').style.display='grid';
  document.getElementById('abilitybar').style.display='flex';
  document.getElementById('t-vs').textContent=' VS ';
  buildSelRow();newBattle();
 };
 window.buildSelRow=function(){
  const row=document.getElementById('sel-row');row.innerHTML='';
  const wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;';
  const defs=slotDefaults(),slots=getBattleSlots(gameMode);
  slots.forEach((slot,i)=>{
   if(i>0&&slot.faction!==slots[i-1].faction){const vs=document.createElement('span');vs.className='sl';vs.style.cssText='color:#fff;font-size:7px;';vs.textContent='VS';wrap.appendChild(vs);}
   const sg=document.createElement('div');sg.className='sg team-'+slot.faction;
   const lb=document.createElement('span');lb.className='sl';lb.style.color=slot.color;lb.textContent=slot.label;
   const chip=_mkSel(defs[i%defs.length]);const sel=chip.querySelector('select');sel.id=`sel-${slot.id}`;sel.style.color=slot.color;
   sg.append(lb,chip);wrap.appendChild(sg);
  });row.appendChild(wrap);
 };
 buildSelRow();
})();

function newBattle(){
 cancelAnimationFrame(animId);
 document.getElementById('winner').classList.remove('show');
 winDone=false;paused=false;
 document.getElementById('pbtn').textContent='PAUSE';
 spheres=[];particles=[];projectiles=[];afterimages=[];noiseTraps=[];slowZones=[];thornPatches=[];skeletons=[];dmgNums=[];bloodSplats=[];miasmaClouds=[];
 if(typeof _burialMoundSeq!=='undefined')_burialMoundSeq=0;
 if(typeof _preloadConfiguredAudio==='function')_preloadConfiguredAudio();
 if(typeof _syncArenaBgm==='function')_syncArenaBgm();
 resize();
 function dvdVel(key){
  let a=Math.random()*Math.PI*2;
  while(Math.abs(((a%(Math.PI/2))+(Math.PI/2))%(Math.PI/2)-(Math.PI/4))<0.22)a+=0.28;
  const d=DEF[key];const rawSpd=d.spd*(1.0+Math.random()*0.25);
  return{vx:Math.cos(a)*rawSpd,vy:Math.sin(a)*rawSpd};
 }
 document.getElementById('stats').style.display='grid';
 document.getElementById('abilitybar').style.display='flex';
 const slots=getBattleSlots(gameMode),picked=slots.map(slot=>({slot,key:(document.getElementById(`sel-${slot.id}`)||{}).value||Object.keys(DEF)[slot.id%Object.keys(DEF).length]}));
 const red=picked.filter(p=>p.slot.faction===0),blue=picked.filter(p=>p.slot.faction===1);
 fillStats(red[0].key,'r');fillStats(blue[0].key,'b');
 document.getElementById('t-red').textContent=gameMode==='2v2'?'TEAM RED':DEF[red[0].key].label;
 document.getElementById('t-blue').textContent=gameMode==='2v2'?'TEAM BLUE':DEF[blue[0].key].label;
 document.getElementById('t-vs').textContent=' VS ';
 const yFor=(idx,count,r)=>count===1?r*2+Math.random()*(H-r*4):(H*(idx+1)/(count+1))+((Math.random()-.5)*Math.min(80,H*.12));
 picked.forEach(p=>{
  const v=dvdVel(p.key),r=Math.min(W,H)*(DEF[p.key].mass>=20?0.115:0.095),teamCount=p.slot.faction===0?red.length:blue.length,teamIdx=(p.slot.faction===0?red:blue).findIndex(q=>q.slot.id===p.slot.id);
  const x=p.slot.faction===0?r*2+Math.random()*(W*.34-r*3):W*.66+r+Math.random()*(W*.34-r*3);
  const y=Math.max(r*2,Math.min(H-r*2,yFor(teamIdx,teamCount,r)));
  spheres.push(new Sphere(p.key,p.slot.faction,x,y,v.vx,v.vy));
 });
 lastTime=performance.now();animId=requestAnimationFrame(loop);
}


function togglePause(){paused=!paused;document.getElementById('pbtn').textContent=paused?'RESUME':'PAUSE';if(!paused)lastTime=performance.now();}

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
window.addEventListener('load',()=>{resize();if(typeof initAudioUi==='function')initAudioUi();});
