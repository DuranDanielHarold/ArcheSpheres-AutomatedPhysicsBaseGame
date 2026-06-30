'use strict';
// ▓▓▓ MODULE: ui/start-screen.js — extracted from former js/ui.js ▓▓▓
// Start screen rendering and cached sphere icon generation.

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
