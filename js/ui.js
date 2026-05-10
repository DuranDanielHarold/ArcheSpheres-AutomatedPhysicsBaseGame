'use strict';
// ▓▓▓ SECTION:UI — Picker, start screen, CLASS_ROLE, CLASS_DESC, countdown ▓▓▓
let pendingSelections={};
let pickerSlot=null;
let pickerDetailMode=false;
let countdownTimer=null;
function makeSphereIcon(key,size=48){
 const d=DEF[key];
 const cv=document.createElement('canvas');cv.width=size;cv.height=size;
 const c=cv.getContext('2d');
 const cx=size/2,cy=size/2,r=size*0.42;
 c.beginPath();c.arc(cx,cy,r+size*0.06,0,Math.PI*2);
 c.fillStyle=d.out||'#000';c.fill();
 const bg=c.createRadialGradient(cx-r*0.28,cy-r*0.28,r*0.05,cx,cy,r);
 bg.addColorStop(0,d.rim);bg.addColorStop(0.55,d.color);bg.addColorStop(1,d.dark);
 c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=bg;c.fill();
 const hi=c.createRadialGradient(cx-r*0.3,cy-r*0.32,0,cx-r*0.18,cy-r*0.18,r*0.45);
 hi.addColorStop(0,'rgba(255,255,255,0.55)');hi.addColorStop(1,'rgba(255,255,255,0)');
 c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=hi;c.fill();
 c.beginPath();c.arc(cx+r*0.62,cy,r*0.18,0,Math.PI*2);
 c.fillStyle=d.wcol||d.rim;c.fill();
 c.strokeStyle=d.wdrk||d.dark;c.lineWidth=1;c.stroke();
 return cv.toDataURL();
}
const _sphereIconCache={};
function getSphereIcon(key,size=44){
 const k=key+'_'+size;
 if(!_sphereIconCache[k])_sphereIconCache[k]=makeSphereIcon(key,size);
 return _sphereIconCache[k];
}
function injectPickerStyles(){
 if(document.getElementById('ss-styles'))return;
 const st=document.createElement('style');st.id='ss-styles';
 st.textContent=`
 .ss-mbtn{font-family:'Press Start 2P',monospace;font-size:clamp(7px,2vw,11px);
  background:#1a2340;color:#e8b430;border:2px solid #8a6000;
  padding:12px 32px;cursor:pointer;letter-spacing:1px;
  box-shadow:4px 4px 0 #000;min-width:200px;text-align:left;}
 .ss-mbtn:hover{background:#243060;border-color:#e8b430;}
 .ss-mbtn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #000;}
 #picker-screen{position:fixed;inset:0;background:#0d1520;z-index:99;display:flex;flex-direction:column;overflow:hidden;}
 #picker-header{background:#111a2e;border-bottom:2px solid #8a6000;padding:6px 10px;display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap;}
 #picker-slots{display:flex;gap:4px;align-items:center;flex:1;overflow-x:auto;min-width:0;}
 .pslot{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1.1vw,6px);
  padding:4px 6px;border:2px solid #2a3a55;background:#111a2e;color:#4a6080;
  cursor:pointer;min-width:52px;text-align:center;}
 .pslot.active{border-color:#e8b430;color:#e8b430;background:#1e2a40;}
 .pslot-label{font-size:clamp(4px,0.9vw,5px);display:block;margin-bottom:1px;}
 .pslot-name{font-size:clamp(4px,1vw,6px);}
 .pslot.filled .pslot-name{color:#88cc44;}
 #picker-body{flex:1;display:flex;overflow:hidden;min-height:0;}
 #picker-grid{flex:1;overflow-y:auto;padding:8px;display:grid;
  grid-template-columns:repeat(auto-fill,minmax(clamp(80px,16vw,120px),1fr));gap:6px;align-content:start;}
 .pcard{background:#111a2e;border:2px solid #1e2e45;cursor:pointer;padding:8px 6px;
  display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;}
 .pcard:hover{border-color:#8a6000;background:#182030;}
 .pcard.selected{border-color:#e8b430;background:#1c2840;}
 .pcard-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;}
 .pcard-name{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);color:#ccddf0;text-align:center;}
 .pcard-role{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);padding:1px 4px;}
 .pcard-ab{font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#7080a0;text-align:center;line-height:1.2;}
 .pcard-stats{display:flex;gap:5px;margin-top:2px;}
 .pstat{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;text-align:center;}
 .pstat span{display:block;}
 #picker-detail{width:clamp(160px,26vw,240px);background:#0a1018;border-left:2px solid #1e2e45;
  overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
 #picker-detail.hidden{display:none;}
 .dbar-wrap{margin-bottom:4px;}
 .dbar-labels{display:flex;justify-content:space-between;}
 .dbar-label{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;}
 .dbar-val{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#ccddf0;}
 .dbar{height:4px;background:#1a2340;margin-top:2px;}
 .dbar-fill{height:100%;}
 .dstat-row{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a2340;}
 #detail-toggle{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:4px 8px;cursor:pointer;white-space:nowrap;}
 #detail-toggle.on{border-color:#e8b430;color:#e8b430;}
 #picker-launch{font-family:'Press Start 2P',monospace;font-size:clamp(5px,1.4vw,8px);
  background:#2a5010;color:#88cc44;border:2px solid #1a3008;padding:8px 16px;
  cursor:pointer;box-shadow:3px 3px 0 #000;letter-spacing:.5px;white-space:nowrap;}
 #picker-launch:hover{background:#3a6818;}
 #picker-launch:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #000;}
 #picker-back{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:6px 10px;cursor:pointer;white-space:nowrap;}
 #picker-back:hover{background:#243060;}
 #countdown-overlay{position:absolute;inset:0;background:rgba(0,0,0,.72);
  display:none;align-items:center;justify-content:center;z-index:30;flex-direction:column;gap:6px;}
 #countdown-overlay.show{display:flex;}
 #countdown-num{font-family:'Press Start 2P',monospace;font-size:clamp(48px,14vw,90px);
  color:#e8b430;text-shadow:0 0 24px #c8920a,4px 4px 0 #000;}
 #countdown-label{font-family:'VT323',monospace;font-size:clamp(14px,3.5vw,22px);color:#ccddf0;letter-spacing:3px;}
 @keyframes cdpop{0%{transform:scale(1.6);opacity:.4;}60%{transform:scale(0.95);}100%{transform:scale(1);opacity:1;}}
 .cd-pop{animation:cdpop .5s ease-out forwards;}
 `;
 document.head.appendChild(st);
}
function showStartScreen(){
 injectPickerStyles();
 document.getElementById('mode-row').style.display='none';
 document.getElementById('sel-row').style.display='none';
 document.getElementById('card').style.display='none';
 document.getElementById('controls').style.display='none';
 let ss=document.getElementById('start-screen');
 if(ss){ss.style.display='flex';return;}
 ss=document.createElement('div');ss.id='start-screen';
 ss.style.cssText='position:fixed;inset:0;background:#0d1520;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;gap:0;overflow:hidden;';
 const bgC=document.createElement('canvas');
 bgC.id='ss-bg';bgC.style.cssText='position:absolute;inset:0;width:100%;height:100%;opacity:.15;pointer-events:none;';
 ss.appendChild(bgC);
 const inner=document.createElement('div');
 inner.style.cssText='position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:26px;padding:20px;';
 inner.innerHTML=`
  <div style="text-align:center;">
   <div style="font-family:'Press Start 2P',monospace;font-size:clamp(20px,5.5vw,42px);color:#e8b430;text-shadow:0 0 30px #c8920a,3px 3px 0 #000;letter-spacing:2px;line-height:1.4;">MEDIEVAL<br>SPHERES</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(13px,2.8vw,20px);color:#4a6080;margin-top:5px;letter-spacing:4px;">SELECT BATTLE MODE</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;">
   <button class="ss-mbtn" onclick="window.startPicker('1v1')">⚔&nbsp;&nbsp;1 V 1</button>
  </div>`;
 ss.appendChild(inner);
 document.body.appendChild(ss);
 const bgCtx=bgC.getContext('2d');let bgT=0;
 function animBg(){
  if(!ss.isConnected||ss.style.display==='none')return;
  bgC.width=window.innerWidth;bgC.height=window.innerHeight;
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  const gs=55;bgCtx.lineWidth=1;
  for(let x=0;x<bgC.width+gs;x+=gs){
   bgCtx.globalAlpha=0.25+0.12*Math.sin(bgT*0.8+x*0.018);
   bgCtx.strokeStyle='#e8b430';bgCtx.beginPath();bgCtx.moveTo(x,0);bgCtx.lineTo(x,bgC.height);bgCtx.stroke();
  }
  for(let y=0;y<bgC.height+gs;y+=gs){
   bgCtx.globalAlpha=0.25+0.12*Math.sin(bgT*0.8+y*0.018);
   bgCtx.strokeStyle='#e8b430';bgCtx.beginPath();bgCtx.moveTo(0,y);bgCtx.lineTo(bgC.width,y);bgCtx.stroke();
  }
  for(let i=0;i<7;i++){
   const bx=bgC.width*(0.08+0.13*i)+Math.sin(bgT*0.35+i)*35;
   const by=bgC.height*(0.18+0.1*i)+Math.cos(bgT*0.28+i*1.4)*45;
   const br=18+i*9;
   bgCtx.globalAlpha=0.06+0.04*Math.sin(bgT*0.9+i);
   bgCtx.beginPath();bgCtx.arc(bx,by,br,0,Math.PI*2);
   bgCtx.fillStyle='#e8b430';bgCtx.fill();
  }
  bgT+=0.016;requestAnimationFrame(animBg);
 }
 animBg();
}
window.startPicker=function(mode){
 pickerDetailMode=false;pendingSelections={};
 const ss=document.getElementById('start-screen');if(ss)ss.style.display='none';
 const old=document.getElementById('picker-screen');if(old)old.remove();
 const defaults=['knight','samurai','barbarian','paladin','wizard','ranger','viking','rogue'];
 const slots=[{id:0,label:'RED',color:'#ff7755'},{id:1,label:'BLUE',color:'#88bbdd'}];
 slots.forEach((s,i)=>{pendingSelections[s.id]=defaults[i%defaults.length];});
 pickerSlot=slots[0].id;
 const ps=document.createElement('div');ps.id='picker-screen';
 const hdr=document.createElement('div');hdr.id='picker-header';
 const backBtn=document.createElement('button');backBtn.id='picker-back';backBtn.textContent='◀ BACK';
 backBtn.onclick=()=>{ps.remove();showStartScreen();};hdr.appendChild(backBtn);
 const slotRow=document.createElement('div');slotRow.id='picker-slots';
 slots.forEach(s=>{
  const btn=document.createElement('div');
  btn.className='pslot'+(s.id===pickerSlot?' active':'')+' filled';
  btn.dataset.slotId=s.id;
  btn.innerHTML=`<span class="pslot-label" style="color:${s.color}">${s.label}</span><span class="pslot-name">${DEF[pendingSelections[s.id]].label}</span>`;
  btn.onclick=()=>selectSlot(s.id);
  slotRow.appendChild(btn);
 });
 hdr.appendChild(slotRow);
 const detToggle=document.createElement('button');detToggle.id='detail-toggle';detToggle.textContent='📋 DETAILS';
 detToggle.onclick=()=>{
  pickerDetailMode=!pickerDetailMode;
  detToggle.classList.toggle('on',pickerDetailMode);
  document.getElementById('picker-detail').classList.toggle('hidden',!pickerDetailMode);
  renderPickerGrid();
 };
 hdr.appendChild(detToggle);
 const launchBtn=document.createElement('button');launchBtn.id='picker-launch';launchBtn.textContent='▶ FIGHT!';
 launchBtn.onclick=launchBattle;hdr.appendChild(launchBtn);
 ps.appendChild(hdr);
 const body=document.createElement('div');body.id='picker-body';
 const grid=document.createElement('div');grid.id='picker-grid';body.appendChild(grid);
 const detail=document.createElement('div');detail.id='picker-detail';detail.classList.add('hidden');body.appendChild(detail);
 ps.appendChild(body);
 document.body.appendChild(ps);
 renderPickerGrid();
 renderDetailPanel(pendingSelections[pickerSlot]);
};
function selectSlot(id){
 pickerSlot=id;
 document.querySelectorAll('.pslot').forEach(b=>b.classList.toggle('active',+b.dataset.slotId===id));
 renderPickerGrid();
 renderDetailPanel(pendingSelections[id]);
}
function statBar(label,val,max,col){
 const pct=Math.min(100,Math.round((val/max)*100));
 const disp=(typeof val==='number'&&val%1!==0)?val.toFixed(1):val;
 return `<div class="dbar-wrap"><div class="dbar-labels"><span class="dbar-label">${label}</span><span class="dbar-val">${disp}</span></div><div class="dbar"><div class="dbar-fill" style="width:${pct}%;background:${col}"></div></div></div>`;
}
function renderPickerGrid(){
 const grid=document.getElementById('picker-grid');if(!grid)return;
 grid.innerHTML='';
 const curKey=pendingSelections[pickerSlot];
 Object.entries(DEF).forEach(([key,d])=>{
  const card=document.createElement('div');
  card.className='pcard'+(key===curKey?' selected':'');
  const role=CLASS_ROLE[key]||'FIGHTER';
  const rolec=ROLE_COLOR[role]||'#6080a8';
  const isRanged=RANGED_KEYS.has(key);
  const iconImg=`<img src="${getSphereIcon(key,40)}" width="40" height="40" style="image-rendering:pixelated;">`;
  if(pickerDetailMode){
   card.innerHTML=`
    <div style="width:100%;display:flex;align-items:center;gap:5px;margin-bottom:3px;">
     ${iconImg}
     <div><div class="pcard-name">${d.label}</div>
     <span class="pcard-role" style="color:${rolec};background:${rolec}22">${role}</span></div>
    </div>
    <div style="width:100%">
     ${statBar('HP',d.hp,900,'#aa4444')}
     ${statBar('ARM',d.arm,280,'#4466aa')}
     ${statBar('MDEF',d.magDef,100,'#8844cc')}
     ${statBar('DMG',d.dmg,10,'#aa8822')}
     ${statBar('SPD',d.spd,255,'#44aa66')}
     ${statBar('SPIN',d.om,13,'#aa44aa')}
     ${statBar('REACH',d.reach,5,'#22aaaa')}
    </div>
    <div style="width:100%;border-top:1px solid #1e2e45;padding-top:3px;margin-top:2px;">
     <div style="font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#e8b430;">${d.weapon}</div>
     <div style="font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#cc88ff;">${d.ab}</div>
     ${isRanged?'<div style="font-family:\'VT323\',monospace;font-size:clamp(7px,1.4vw,10px);color:#2a8a8a;">◎ RANGED</div>':''}
    </div>`;
  } else {
   card.innerHTML=`
    <div class="pcard-icon">${iconImg}</div>
    <div class="pcard-name">${d.label}</div>
    <span class="pcard-role" style="color:${rolec};background:${rolec}22">${role}</span>
    <div class="pcard-ab">${d.ab}</div>
    <div class="pcard-stats">
     <div class="pstat">HP<span style="color:#cc5555">${d.hp}</span></div>
     <div class="pstat">ARM<span style="color:#5577cc">${d.arm}</span></div>
     <div class="pstat">DMG<span style="color:#cc9922">${d.dmg.toFixed(1)}</span></div>
    </div>`;
  }
  card.onclick=()=>{
   pendingSelections[pickerSlot]=key;
   const slotBtn=document.querySelector(`[data-slot-id="${pickerSlot}"] .pslot-name`);
   if(slotBtn)slotBtn.textContent=d.label;
   renderPickerGrid();
   renderDetailPanel(key);
   const allSlots=[...document.querySelectorAll('.pslot')].map(b=>+b.dataset.slotId);
   const cur=allSlots.indexOf(pickerSlot);
   if(cur<allSlots.length-1)selectSlot(allSlots[cur+1]);
  };
  grid.appendChild(card);
 });
}
function renderDetailPanel(key){
 const panel=document.getElementById('picker-detail');if(!panel)return;
 const d=DEF[key];
 const role=CLASS_ROLE[key]||'FIGHTER';
 const rolec=ROLE_COLOR[role]||'#6080a8';
 const isRanged=RANGED_KEYS.has(key);
 const desc=CLASS_DESC[key]||{ability:'—',passive:'—'};
 const iconSrc=getSphereIcon(key,52);
 panel.innerHTML=`
  <div style="text-align:center;padding-bottom:8px;border-bottom:1px solid #1e2e45;">
   <img src="${iconSrc}" width="52" height="52" style="image-rendering:pixelated;">
   <div style="font-family:'Press Start 2P',monospace;font-size:clamp(6px,1.3vw,8px);color:#ccddf0;margin:4px 0;">${d.label}</div>
   <span class="pcard-role" style="color:${rolec};background:${rolec}22;font-size:clamp(10px,2vw,13px);">${role}</span>
   ${isRanged?'<div style="font-family:\'VT323\',monospace;font-size:clamp(9px,1.8vw,12px);color:#2a8a8a;margin-top:2px;">◎ RANGED</div>':''}
  </div>
  <div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#e8b430;margin-bottom:2px;">WEAPON</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(10px,2vw,13px);color:#ccddf0;">${d.weapon}</div>
  </div>
  <div style="border:1px solid #2a1e50;background:#0e0820;padding:6px;border-radius:2px;">
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#cc88ff;margin-bottom:3px;">⚡ ABILITY</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#b0a0d0;line-height:1.35;">${desc.ability}</div>
  </div>
  <div style="border:1px solid #1a2e1a;background:#080e08;padding:6px;border-radius:2px;">
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#88cc88;margin-bottom:3px;">◈ PASSIVE</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#90b090;line-height:1.35;">${desc.passive}</div>
  </div>
  <div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#e8b430;margin-bottom:4px;">STATS</div>
   ${statBar('HP',d.hp,900,'#aa4444')}
   ${statBar('ARMOR',d.arm,280,'#4466aa')}
   ${statBar('MAGIC DEF',d.magDef,100,'#8844cc')}
   ${statBar('DAMAGE',d.dmg,10,'#aa8822')}
   ${statBar('SPEED',d.spd,255,'#44aa66')}
   ${statBar('SPIN ω',d.om,13,'#aa44aa')}
   ${statBar('REACH',d.reach,5,'#22aaaa')}
   ${statBar('MASS',d.mass,22,'#666688')}
   <div class="dstat-row"><span class="dbar-label">RESTITUTION</span><span class="dbar-val">${d.rest.toFixed(2)}</span></div>
  </div>`;
}
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
