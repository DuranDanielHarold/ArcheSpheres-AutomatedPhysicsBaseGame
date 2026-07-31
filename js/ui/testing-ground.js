'use strict';
// ▓▓▓ MODULE: ui/testing-ground.js — testing sandbox controls and live telemetry ▓▓▓
// Dedicated two-sphere sandbox helpers layered on top of the shared picker and live loop.

const TESTING_GROUND_STATS=[
 {key:'hp',label:'HP'},{key:'arm',label:'ARM'},{key:'magDef',label:'MDEF'},
 {key:'dmg',label:'DMG'},{key:'spd',label:'SPD'},{key:'om',label:'SPIN'},{key:'reach',label:'REACH'}
];
const TESTING_GROUND_ARENAS={small:{label:'SMALL',width:'min(340px,100vw)'},default:{label:'DEFAULT',width:''},large:{label:'LARGE',width:'min(560px,100vw)'}};
let testingGroundOptions={seed:'',speed:1,arena:'default',overrides:{0:{},1:{}}};
let _testingOriginalRandom=null;
let _testingLastKeys=null;

function isTestingGround(){return gameMode==='testing';}
function getTestingGroundSpeed(){return isTestingGround()?Number(testingGroundOptions.speed||1):1;}
function testingSeedValue(){const n=Number(testingGroundOptions.seed);return Number.isFinite(n)?(n>>>0):null;}
function restoreTestingRandom(){if(_testingOriginalRandom){Math.random=_testingOriginalRandom;_testingOriginalRandom=null;}}
function applyTestingRandom(){restoreTestingRandom();const seed=testingSeedValue();if(seed===null)return;_testingOriginalRandom=Math.random;const gen=(window.mulberry32||mulberry32)(seed);Math.random=gen;}
function resetTestingOptions(){testingGroundOptions={seed:'',speed:1,arena:'default',overrides:{0:{},1:{}}};}
function applyTestingArenaPreset(){const card=document.getElementById('card');if(!card)return;if(isTestingGround()){const preset=TESTING_GROUND_ARENAS[testingGroundOptions.arena]||TESTING_GROUND_ARENAS.default;card.style.width=preset.width||'';}else card.style.width='';resize();}
function readTestingOverrides(slotId,key){const side=testingGroundOptions.overrides[slotId]||(testingGroundOptions.overrides[slotId]={});TESTING_GROUND_STATS.forEach(st=>{const el=document.getElementById(`tg-${slotId}-${st.key}`);if(!el)return;const v=Number(el.value);if(Number.isFinite(v)&&el.value!=='')side[st.key]=v;else delete side[st.key];});if(key&&DEF[key])TESTING_GROUND_STATS.forEach(st=>{if(side[st.key]===DEF[key][st.key])delete side[st.key];});}
function renderTestingGroundPickerPanel(){
 const hdr=document.getElementById('picker-header');if(!hdr)return;
 let panel=document.getElementById('testing-ground-picker');if(panel)panel.remove();
 panel=document.createElement('div');panel.id='testing-ground-picker';
 const slots=pickerSlots||[];
 panel.innerHTML=`<div class="tg-section"><label>SEED <input id="tg-seed" type="number" step="1" value="${testingGroundOptions.seed}"></label><label>ARENA <select id="tg-arena">${Object.entries(TESTING_GROUND_ARENAS).map(([k,v])=>`<option value="${k}" ${testingGroundOptions.arena===k?'selected':''}>${v.label}</option>`).join('')}</select></label></div><div class="tg-overrides"></div>`;
 hdr.appendChild(panel);
 document.getElementById('tg-seed').oninput=e=>{testingGroundOptions.seed=e.target.value;};
 document.getElementById('tg-arena').onchange=e=>{testingGroundOptions.arena=e.target.value;};
 const overrides=panel.querySelector('.tg-overrides');
 slots.forEach(slot=>{
  const key=pendingSelections[slot.id],d=DEF[key];
  const box=document.createElement('div');box.className='tg-side';
  box.innerHTML=`<div class="tg-side-title" style="color:${slot.color}">${slot.label} ${d.label}</div>`+TESTING_GROUND_STATS.map(st=>`<label>${st.label}<input id="tg-${slot.id}-${st.key}" type="number" step="0.1" placeholder="${d[st.key]}" value="${testingGroundOptions.overrides[slot.id]?.[st.key]??''}"></label>`).join('');
  TESTING_GROUND_STATS.forEach(st=>setTimeout(()=>{const el=document.getElementById(`tg-${slot.id}-${st.key}`);if(el)el.oninput=()=>readTestingOverrides(slot.id,key);},0));
  overrides.appendChild(box);
 });
}
function applyTestingGroundOverrides(){for(const s of spheres){const ov=testingGroundOptions.overrides[s.faction];if(ov&&Object.keys(ov).length){s.d=Object.assign({},s.d,ov);if(ov.hp!==undefined){s.hp=ov.hp;s.maxHp=ov.hp;s.hpBarDisplayHp=ov.hp;s.hpBarLastHp=ov.hp;s.hpBarDamageGhostHp=ov.hp;s.hpBarHealTargetHp=ov.hp;}if(ov.spd!==undefined){const m=Math.hypot(s.vx,s.vy)||1;s.vx=s.vx/m*ov.spd;s.vy=s.vy/m*ov.spd;s.targetSpd=ov.spd;s.baseSpd=ov.spd;}}}}
function launchTestingGround(){
 _testingLastKeys=(pickerSlots||[]).map(slot=>({slot,key:pendingSelections[slot.id]}));
 buildSelRow();
 Object.entries(pendingSelections).forEach(([idx,key])=>{const sel=document.getElementById(`sel-${idx}`);if(sel)sel.value=key;});
 document.getElementById('card').className='mode-testing';
 const ps=document.getElementById('picker-screen');if(ps)ps.remove();const ss=document.getElementById('start-screen');if(ss)ss.style.display='none';
 document.getElementById('mode-row').style.display='none';document.getElementById('sel-row').style.display='none';document.getElementById('card').style.display='flex';document.getElementById('controls').style.display='flex';
 startTestingGroundBattle();
}
function startTestingGroundBattle(){applyTestingArenaPreset();applyTestingRandom();try{newBattle();applyTestingGroundOverrides();}catch(e){restoreTestingRandom();throw e;}paused=false;document.getElementById('pbtn').textContent='PAUSE';ensureTestingGroundControls();renderTestingTelemetry();}
function restartTestingGround(){if(_testingLastKeys){pendingSelections={};_testingLastKeys.forEach(p=>{pendingSelections[p.slot.id]=p.key;});}startTestingGroundBattle();}
function leaveTestingGround(){restoreTestingRandom();applyTestingArenaPreset();window.randomModeActive=false;showStartScreen();}
function testingFrameStep(){if(!isTestingGround())return;if(!paused)togglePause();stepGameFrame(1/60);renderTestingTelemetry();}
function ensureTestingGroundControls(){
 let wrap=document.getElementById('testing-controls');if(!wrap){wrap=document.createElement('span');wrap.id='testing-controls';document.getElementById('controls').prepend(wrap);}wrap.style.display=isTestingGround()?'inline-flex':'none';
 wrap.innerHTML='<button class="pbtn" onclick="restartTestingGround()">RESTART</button><button class="pbtn" onclick="testingFrameStep()">STEP</button><label class="avol">SPD <select id="tg-speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><button class="pbtn new" onclick="leaveTestingGround()">EXIT TEST</button>';
 const sel=document.getElementById('tg-speed');sel.value=String(testingGroundOptions.speed);sel.onchange=e=>{testingGroundOptions.speed=Number(e.target.value)||1;};
}
function renderTestingTelemetry(){
 if(!isTestingGround())return;
 let panel=document.getElementById('testing-telemetry');if(!panel){panel=document.createElement('div');panel.id='testing-telemetry';document.getElementById('arena-border').appendChild(panel);} 
 if(!window._liveCombatTracker){panel.innerHTML='<div class="battle-report-section">NO TELEMETRY</div>';return;}
 window._liveCombatTracker.onMatchEnd(window.matchTime||0);
 const summary=window._liveCombatTracker.getSummary();
 panel.innerHTML=`<div class="battle-report-section">LIVE TELEMETRY ${formatReportDuration(window.matchTime||0)}</div><div class="tg-report-grid">${renderReportSide(window._liveCombatTracker.redKey,summary.red,'r','#ff5533')}${renderReportSide(window._liveCombatTracker.blueKey,summary.blue,'b','#88aacc')}</div>`;
}
window.isTestingGround=isTestingGround;window.getTestingGroundSpeed=getTestingGroundSpeed;window.renderTestingGroundPickerPanel=renderTestingGroundPickerPanel;window.launchTestingGround=launchTestingGround;window.restartTestingGround=restartTestingGround;window.testingFrameStep=testingFrameStep;window.leaveTestingGround=leaveTestingGround;window.renderTestingTelemetry=renderTestingTelemetry;window.restoreTestingRandom=restoreTestingRandom;window.resetTestingOptions=resetTestingOptions;
