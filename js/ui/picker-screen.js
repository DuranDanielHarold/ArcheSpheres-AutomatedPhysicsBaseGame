'use strict';
// ▓▓▓ MODULE: ui/picker-screen.js — extracted from former js/ui.js ▓▓▓
// Class picker state, slot selection, card grid, stat bars, and detail panel.

let pendingSelections={};
let pickerSlot=null;
let pickerDetailMode=false;
let countdownTimer=null;
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
