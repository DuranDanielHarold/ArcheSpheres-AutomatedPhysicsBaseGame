'use strict';
// Player-facing post-match battle report presentation.

function formatReportDuration(seconds){
 const total=Math.max(0,Math.floor(seconds||0));
 const m=Math.floor(total/60),s=total%60;
 return `${m}:${String(s).padStart(2,'0')}`;
}
function formatReportPct(value){return `${Math.round((value||0)*100)}%`;}
function battleReportEndReason(reason){
 if(reason==='elimination')return 'Finished by elimination';
 if(reason==='timeout_hp_pct_tiebreak')return 'Resolved by Sudden Death';
 if(reason==='timeout_hp_tie')return 'Resolved on time-out: HP tie';
 if(reason==='double_ko')return 'Resolved by double KO';
 if(reason==='timeout_red_dead'||reason==='timeout_blue_dead')return 'Resolved on time-out';
 return 'Resolved after battle';
}
function reportBar(label,value,col){
 const pct=Math.min(100,Math.max(0,Math.round((value||0)*100)));
 return `<div class="dbar-wrap"><div class="dbar-labels"><span class="dbar-label">${label}</span><span class="dbar-val">${pct}%</span></div><div class="dbar"><div class="dbar-fill" style="width:${pct}%;background:${col}"></div></div></div>`;
}
function reportRow(label,value){return `<div class="sr">${label}&nbsp; <span>${value}</span></div>`;}
function renderReportSide(key,side,teamClass,col){
 const d=DEF[key]||{label:key||'—'};
 const ranged=!!d.rangedSphere;
 return `<div class="sc battle-report-side">
  <div class="battle-report-head">
   <img src="${getSphereIcon(key,44)}" width="44" height="44" alt="" style="image-rendering:pixelated;">
   <div>
    <div class="sn ${teamClass}" style="color:${col}">${d.label}</div>
    <div class="battle-report-section">DAMAGE</div>
   </div>
  </div>
  ${reportRow('TOTAL DMG',side.dmgDealt)}
  ${reportBar('BASE',side.baseDmgPct,'#aa8822')}
  ${reportBar('ABILITY',side.abilityDmgPct,'#8844cc')}
  ${reportBar('PASSIVE',side.passiveDmgPct,'#44aa66')}
  ${reportBar('DOT',side.dotDmgPct,'#aa4444')}
  ${reportBar('PROJECTILE',side.projectileDmgPct,'#22aaaa')}
  <div class="battle-report-section">TRIGGERS</div>
  ${reportRow('ABILITY',`${side.abilityUses} / ${formatReportPct(side.abilityHitRate)}`)}
  ${reportRow('PASSIVE',side.passiveTriggers)}
  ${reportRow('MELEE HIT',formatReportPct(side.meleeHitRate))}
  ${ranged?reportRow('PROJECTILES',`${side.projectilesFired} / ${formatReportPct(side.projectileHitRate)}`):''}
  <div class="battle-report-section">ROTATION</div>
  ${reportRow('PEAK',side.rotationPeak)}
  ${reportRow('AVG',side.rotationAvg)}
 </div>`;
}
function openBattleReport(){
 const report=window._lastMatchReport;
 if(!report)return;
 if(typeof injectPickerStyles==='function')injectPickerStyles();
 const old=document.getElementById('battle-report');if(old)old.remove();
 const br=document.createElement('div');br.id='battle-report';
 br.innerHTML=`
  <div id="battle-report-header">
   <button id="battle-report-back">◀ BACK</button>
   <div id="battle-report-title">BATTLE REPORT</div>
  </div>
  <div id="battle-report-summary">
   <div>${battleReportEndReason(report.endReason)}</div>
   <div>TIME&nbsp; <span>${formatReportDuration(report.duration)}</span></div>
  </div>
  <div id="battle-report-body">
   ${renderReportSide(report.redKey,report.red,'r','#ff5533')}
   <div class="sdiv"></div>
   ${renderReportSide(report.blueKey,report.blue,'b','#88aacc')}
  </div>`;
 document.body.appendChild(br);
 document.getElementById('battle-report-back').onclick=ev=>{ev.stopPropagation();br.remove();};
}
function injectBattleReportStyles(){
 if(document.getElementById('battle-report-styles'))return;
 const st=document.createElement('style');st.id='battle-report-styles';
 st.textContent=`
 #battle-report{position:fixed;inset:0;background:#0d1520;z-index:120;display:flex;flex-direction:column;overflow:hidden;padding:max(0px,env(safe-area-inset-top)) max(0px,env(safe-area-inset-right)) max(0px,env(safe-area-inset-bottom)) max(0px,env(safe-area-inset-left));}
 #battle-report-header{background:#111a2e;border-bottom:2px solid #8a6000;padding:6px 10px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
 #battle-report-back{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:6px 10px;cursor:pointer;white-space:nowrap;}
 #battle-report-back:hover{background:#243060;}
 #battle-report-title{font-family:'Press Start 2P',monospace;font-size:clamp(8px,2vw,13px);color:var(--goldl);text-shadow:2px 2px 0 #000;letter-spacing:1px;}
 #battle-report-summary{background:#0a1018;border-bottom:2px solid #1e2e45;padding:8px 10px;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;font-family:'VT323',monospace;font-size:clamp(11px,2.1vw,15px);color:#ccddf0;}
 #battle-report-summary span{color:var(--goldl);}
 #battle-report-body{flex:1;min-height:0;overflow-y:auto;background:var(--navy);padding:10px;display:grid;grid-template-columns:minmax(0,1fr) 4px minmax(0,1fr);gap:8px;}
 .battle-report-side{gap:5px;min-width:0;}
 .battle-report-head{display:flex;align-items:center;gap:8px;margin-bottom:4px;min-width:0;}
 .battle-report-head .sn{font-family:'Press Start 2P',monospace;font-size:clamp(5px,1.4vw,8px);line-height:1.35;}
 .battle-report-section{font-family:'Press Start 2P',monospace;font-size:clamp(5px,1.1vw,7px);color:#ccddf0;margin:6px 0 3px;text-shadow:1px 1px 0 #000;}
 #battle-report .sr{font-size:clamp(9px,1.8vw,12px);}
 @media (orientation:landscape) and (hover:none) and (pointer:coarse) and (max-height:500px){#battle-report-header{padding:4px 6px;}#battle-report-summary{padding:4px 6px;gap:8px;font-size:clamp(10px,3.4dvh,13px);}#battle-report-body{padding:6px;gap:6px;grid-template-columns:minmax(0,1fr) 4px minmax(0,1fr);}.battle-report-head img{width:30px;height:30px;}.battle-report-section{margin:4px 0 2px;}}
 @media(max-width:560px){#battle-report-body{grid-template-columns:1fr;}.battle-report-side{border-bottom:2px dashed #8a6000;padding-bottom:8px;}#battle-report-body>.sdiv{display:none;}}
 `;
 document.head.appendChild(st);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectBattleReportStyles);else injectBattleReportStyles();
