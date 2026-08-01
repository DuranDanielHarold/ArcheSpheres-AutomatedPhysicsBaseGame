'use strict';
// ▓▓▓ MODULE: hud/hud.js — extracted from former js/engine.js ▓▓▓
// Per-sphere match HUD card rendering helpers.

function _hudRoster(faction){return spheres.filter(s=>s.faction===faction&&!s.isReplica);}
function _hudAbilityState(s){
 const thresh=getStackDisplayThreshold(s.key);
 const stackValue=s.key==='sheriff'?s.sheriffHitCount:s.stacks;
 const pct=Math.min(1,stackValue/thresh);
 return{thresh,stackValue,pct,color:pct>=1?'#ff4400':pct>=0.6?`hsl(${30+pct*30},95%,55%)`:'#e8b430'};
}
function _hudStatColors(s){
 const base=DEF[s.key],hpPct=s.hp/s.maxHp;
 return{
  hp:hpPct<0.30?'#ff4444':hpPct<0.55?'#ffaa22':'#44ee66',
  dmg:s.lowHpBuffApplied?'#ff8800':s.d.dmg>base.dmg*1.005?'#ffdd44':'#ccddf0',
  arm:s.lowHpBuffApplied?'#ff8800':Math.abs(s.d.arm-base.arm)>1?'#ffdd44':'#ccddf0',
  mdef:s.d.magDef<base.magDef-0.5?'#cc88ff':s.d.magDef>base.magDef*1.005?'#ffdd44':'#ccddf0',
  om:s.lowHpBuffApplied?'#ff8800':Math.abs(s.omegaCur)>s.d.om*1.05?'#ffdd44':'#ccddf0'
 };
}
function _hudStatusBadges(s){return typeof s._collectStatusEffectBadges==='function'?s._collectStatusEffectBadges():[];}
function _hudCardHtml(s,side,slot){
 const d=s.d,colors=_hudStatColors(s),ability=_hudAbilityState(s),stackShown=Math.min(ability.stackValue,ability.thresh);
 const stackColor=ability.stackValue>=ability.thresh?'#ff4400':ability.stackValue>0?'#e8b430':'#556677';
 const out=!s.alive||s.dying;
 const badges=_hudStatusBadges(s).map(b=>`<span class="hud-badge" style="border-color:${b.color};color:${b.color}">${b.label}</span>`).join('')||'<span class="hud-badge empty">CLEAR</span>';
 return `<div class="hud-card ${side} ${out?'out':''}" data-faction="${s.faction}" data-slot="${slot}">
  <div class="hud-card-head"><span class="sn ${side}">${d.weapon}</span>${out?'<span class="hud-out-tag">OUT</span>':''}</div>
  <div class="hud-rows">
   <div class="sr">HP&nbsp;&nbsp; <span style="color:${colors.hp}">${Math.ceil(s.hp)}/${s.maxHp}</span></div>
   <div class="sr">DMG&nbsp; <span style="color:${colors.dmg}">${d.dmg.toFixed(1)}</span></div>
   <div class="sr">ARM&nbsp; <span style="color:${colors.arm}">${d.arm}</span></div>
   <div class="sr">MDEF <span style="color:${colors.mdef}">${d.magDef}</span></div>
   <div class="sr">&omega;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:${colors.om}">${Math.abs(s.omegaCur).toFixed(1)}</span></div>
   <div class="sr">STKS <span style="color:${stackColor}">${stackShown}/${ability.thresh}</span></div>
  </div>
  <div class="hud-badges">${badges}</div>
  <div class="hud-ability-name ${side}">${d.ab}</div>
  <div class="hud-gauge"><div class="hud-gauge-fill" style="width:${ability.pct*100}%;background:${ability.color}"></div></div>
 </div>`;
}
function updateBattleHud(){
 const stats=document.getElementById('stats');if(!stats)return;
 const red=_hudRoster(0),blue=_hudRoster(1);
 stats.innerHTML=`<div class="hud-team red">${red.map((s,i)=>_hudCardHtml(s,'r',i)).join('')}</div><div class="sdiv"></div><div class="hud-team blue">${blue.map((s,i)=>_hudCardHtml(s,'b',i)).join('')}</div>`;
}
