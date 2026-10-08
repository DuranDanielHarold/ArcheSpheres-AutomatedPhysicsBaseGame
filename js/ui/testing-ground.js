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
let _testingTelemetryCollapsed=true;
let _testingTelemetryLastRender=0;
const TESTING_TELEMETRY_RENDER_INTERVAL_MS=175;

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
function startTestingGroundBattle(){
 if(_testingDiagnosticRunning)return;
 applyTestingArenaPreset();applyTestingRandom();
 try{newBattle();applyTestingGroundOverrides();if(typeof updateBattleHud==='function')updateBattleHud();}
 catch(e){restoreTestingRandom();throw e;}
 paused=false;document.getElementById('pbtn').textContent='PAUSE';ensureTestingGroundControls();ensureTestingGroundDiagnostic();testingDiagnosticPrepareForLaunch();renderTestingTelemetry(true);
}
function restartTestingGround(){if(_testingDiagnosticRunning)return;if(_testingLastKeys){pendingSelections={};_testingLastKeys.forEach(p=>{pendingSelections[p.slot.id]=p.key;});}startTestingGroundBattle();}
function leaveTestingGround(){if(_testingDiagnosticRunning)return;restoreTestingRandom();applyTestingArenaPreset();window.randomModeActive=false;hideTestingGroundDiagnostic();showStartScreen();}
function testingFrameStep(){if(_testingDiagnosticRunning)return;if(!isTestingGround())return;if(!paused)togglePause();stepGameFrame(1/60);renderTestingTelemetry(true);}
function ensureTestingGroundControls(){
 let wrap=document.getElementById('testing-controls');if(!wrap){wrap=document.createElement('span');wrap.id='testing-controls';document.getElementById('controls').prepend(wrap);}wrap.style.display=isTestingGround()?'inline-flex':'none';
 wrap.innerHTML='<button class="pbtn" onclick="restartTestingGround()">RESTART</button><button class="pbtn" onclick="testingFrameStep()">STEP</button><label class="avol">SPD <select id="tg-speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><button class="pbtn new" onclick="leaveTestingGround()">EXIT TEST</button><button class="pbtn balance" id="tg-diagnostic-toggle" onclick="toggleTestingGroundDiagnostic()">BALANCE DIAGNOSTIC</button>';
 const sel=document.getElementById('tg-speed');sel.value=String(testingGroundOptions.speed);sel.onchange=e=>{testingGroundOptions.speed=Number(e.target.value)||1;};
}
const TESTING_DIAGNOSTIC_ARENAS={
 current:{label:'CURRENT',w:null,h:null},
 phone:{label:'PHONE',w:400,h:700},
 square:{label:'SQUARE',w:800,h:800},
 laptop:{label:'LAPTOP',w:1280,h:720}
};
let _testingDiagnosticExpanded=false;
let _testingDiagnosticRunning=false;
const _testingNativeRandom=Math.random;
const _testingNativeSetTimeout=window.setTimeout;
function testingDiagnosticClassDefaults(){
 const keys=(_testingLastKeys||[]).map(p=>p&&p.key).filter(Boolean);
 const unique=Object.keys(DEF).filter(k=>keys.includes(k));
 const fallback=Object.keys(DEF).filter(k=>!unique.includes(k));
 return unique.concat(fallback).slice(0,2);
}
function testingDiagnosticArenaSize(name){
 const p=TESTING_DIAGNOSTIC_ARENAS[name]||TESTING_DIAGNOSTIC_ARENAS.current;
 return p.w&&p.h?{w:p.w,h:p.h}:undefined;
}
function testingDiagnosticSetExpanded(expanded){
 _testingDiagnosticExpanded=!!expanded;
 const panel=document.getElementById('testing-diagnostic');
 if(panel)panel.hidden=!_testingDiagnosticExpanded;
}
function toggleTestingGroundDiagnostic(){testingDiagnosticSetExpanded(!_testingDiagnosticExpanded);}
function setTestingDiagnosticUiLocked(locked){
 const selectors=['#testing-controls button','#testing-controls select','#pbtn','#controls > button.pbtn.new','#balance-btn','#testing-telemetry .tg-telemetry-toggle','#testing-diagnostic button','#testing-diagnostic select','#testing-diagnostic input'];
 document.querySelectorAll(selectors.join(',')).forEach(el=>{el.disabled=!!locked;});
}
function hideTestingGroundDiagnostic(){
 _testingDiagnosticExpanded=false;
 const panel=document.getElementById('testing-diagnostic');
 if(panel)panel.hidden=true;
 setTestingDiagnosticUiLocked(false);
}
function testingDiagnosticPrepareForLaunch(){
 const panel=document.getElementById('testing-diagnostic');
 if(!panel||!isTestingGround())return;
 panel.hidden=true;
 _testingDiagnosticExpanded=false;
 const a=document.getElementById('tg-diagnostic-a'),b=document.getElementById('tg-diagnostic-b');
 const defaults=testingDiagnosticClassDefaults();
 if(a)a.value=defaults[0]||Object.keys(DEF)[0]||'';
 if(b)b.value=defaults[1]||Object.keys(DEF).find(k=>k!==a?.value)||'';
 const status=document.getElementById('tg-diagnostic-status');if(status)status.textContent='ready';
 setTestingDiagnosticUiLocked(false);
}
function ensureTestingGroundDiagnostic(){
 let panel=document.getElementById('testing-diagnostic');
 if(!panel){
  panel=document.createElement('div');
  panel.id='testing-diagnostic';
  panel.hidden=true;
  panel.innerHTML='<div class="tg-diagnostic-head"><span>BALANCE DIAGNOSTIC</span><button class="pbtn new" id="tg-diagnostic-close" type="button">CLOSE</button></div><div class="tg-diagnostic-form"><label>CLASS A <select id="tg-diagnostic-a"></select></label><label>CLASS B <select id="tg-diagnostic-b"></select></label><div class="tg-diagnostic-games"><span>GAMES</span><button type="button" data-games="5">5</button><button type="button" data-games="10">10</button><button type="button" data-games="25">25</button><input id="tg-diagnostic-games" type="number" min="1" max="200" step="1" value="10"></div><label>SEED <input id="tg-diagnostic-seed" type="number" step="1" value="1337"></label><label>ARENA <select id="tg-diagnostic-arena"></select></label><button class="pbtn balance" id="tg-diagnostic-run" type="button">RUN</button><span id="tg-diagnostic-status">ready</span></div><div class="tg-diagnostic-note">Uses base class stats. Test Ground stat overrides are not applied. Sphere radius is viewport-based and does not change with arena size.</div>';
  document.body.appendChild(panel);
  document.getElementById('tg-diagnostic-close').onclick=()=>testingDiagnosticSetExpanded(false);
  const a=document.getElementById('tg-diagnostic-a'),b=document.getElementById('tg-diagnostic-b'),arena=document.getElementById('tg-diagnostic-arena');
  Object.keys(DEF).forEach(key=>{const label=DEF[key]?.label||key;a.add(new Option(label,key));b.add(new Option(label,key));});
  Object.entries(TESTING_DIAGNOSTIC_ARENAS).forEach(([key,p])=>arena.add(new Option(p.label,key)));
  const defaults=testingDiagnosticClassDefaults();
  a.value=defaults[0]||Object.keys(DEF)[0]||'';
  b.value=defaults[1]||Object.keys(DEF).find(k=>k!==a.value)||'';
  arena.value='current';
  panel.querySelectorAll('[data-games]').forEach(btn=>btn.onclick=()=>{document.getElementById('tg-diagnostic-games').value=btn.dataset.games;});
  document.getElementById('tg-diagnostic-run').onclick=runTestingGroundDiagnostic;
 }
}
function testingDiagnosticCsvEscape(value){
 const text=value===undefined||value===null?'':String(value);
 return /[",\n\r]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;
}
function testingDiagnosticDownload(filename,mime,text){
 const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function testingDiagnosticClassRow(row){
 const keys=['key','winRate','decisiveWinRate','avgDuration','avgMeleeHitRate','avgMeleeAttemptDistance','avgReachStatAtAttempt','reachUtilizationRatio','avgDmgDealt','eliminationWinRate','suddenDeathWinRate','tiebreakWinRate','drawRate'];
 return Object.fromEntries(keys.map(k=>[k,row?.[k]??null]));
}
function testingDiagnosticResultRow(r,arenaPreset,arenaW,arenaH,index){
 return{game:index+1,seed:r.seed,redKey:r.redKey,blueKey:r.blueKey,winnerKey:r.winnerKey,winnerFaction:r.winnerFaction,duration:r.duration,redHp:r.redHp,blueHp:r.blueHp,endReason:r.endReason,redMeleeHitRate:r.red?.meleeHitRate??null,blueMeleeHitRate:r.blue?.meleeHitRate??null,redAvgMeleeAttemptDistance:r.red?.avgMeleeAttemptDistance??null,blueAvgMeleeAttemptDistance:r.blue?.avgMeleeAttemptDistance??null,redAvgReachStatAtAttempt:r.red?.avgReachStatAtAttempt??null,blueAvgReachStatAtAttempt:r.blue?.avgReachStatAtAttempt??null,arenaPreset,arenaW,arenaH};
}
function testingDiagnosticCsv(rows){
 const headers=['game','seed','redKey','blueKey','winnerKey','winnerFaction','duration','redHp','blueHp','endReason','redMeleeHitRate','blueMeleeHitRate','redAvgMeleeAttemptDistance','blueAvgMeleeAttemptDistance','redAvgReachStatAtAttempt','blueAvgReachStatAtAttempt','arenaPreset','arenaW','arenaH'];
 return[headers.join(','),...rows.map(row=>headers.map(k=>testingDiagnosticCsvEscape(row[k])).join(','))].join('\n');
}
async function runTestingGroundDiagnostic(){
 if(_testingDiagnosticRunning)return;
 if(!isTestingGround())return;
 ensureTestingGroundDiagnostic();
 const status=document.getElementById('tg-diagnostic-status'),run=document.getElementById('tg-diagnostic-run');
 const a=document.getElementById('tg-diagnostic-a').value,b=document.getElementById('tg-diagnostic-b').value;
 if(a===b){status.textContent='select two different classes';return;}
 const games=Math.max(1,Math.min(200,Math.floor(Number(document.getElementById('tg-diagnostic-games').value)||10)));
 const seed=Number(document.getElementById('tg-diagnostic-seed').value);
 const arenaPreset=document.getElementById('tg-diagnostic-arena').value;
 const arenaSize=testingDiagnosticArenaSize(arenaPreset);
 document.getElementById('tg-diagnostic-games').value=games;
 if(!Number.isFinite(seed)){status.textContent='failed — see console';console.error(new Error('Invalid diagnostic seed'));return;}
 const savedRandom=Math.random;
 const savedSetTimeout=window.setTimeout;
 _testingDiagnosticRunning=true;
 setTestingDiagnosticUiLocked(true);
 if(!paused)togglePause();
 restoreTestingRandom();
 try{
  const report=await window.runBalanceBaseline({keys:[a,b],targetMatches:games,seed,roundsPerPair:1,minutes:30,dt:1/20,chunkSize:5,noVisuals:true,exportJson:false,exportCsv:false,maxRetainedResults:games,arenaSize,progress:p=>{status.textContent='running '+p.count+'/'+games+'...';}});
  const results=report.results||[];
  const matchup=report.matchups.find(m=>(m.a===a&&m.b===b)||(m.a===b&&m.b===a))||null;
  const classRows=report.classes.filter(row=>row.key===a||row.key===b).map(testingDiagnosticClassRow);
  const geometry={W:arenaSize?.w??W,H:arenaSize?.h??H,sphereRadius:spheres.find(s=>!s.isReplica)?.radius??spheres[0]?.radius??null,innerWidth:window.innerWidth,innerHeight:window.innerHeight,devicePixelRatio:window.devicePixelRatio||1,arenaPreset};
  if(!matchup||classRows.length!==2)throw new Error('Diagnostic report did not contain the requested matchup/class rows');
  const generatedAt=new Date().toISOString(),stamp=generatedAt.replace(/[:.]/g,'-');
  const payload={schemaVersion:1,type:'test-ground-balance-diagnostic',generatedAt,classes:[a,b],games,seed,arenaPreset,geometry,matchup,classRows,results};
  const rows=results.map((r,i)=>testingDiagnosticResultRow(r,arenaPreset,geometry.W,geometry.H,i));
  const baseName='test-ground-diagnostic-'+a+'-vs-'+b+'-'+arenaPreset+'-seed'+seed+'-'+stamp;
  testingDiagnosticDownload(baseName+'.json','application/json',JSON.stringify(payload,null,2));
  testingDiagnosticDownload(baseName+'.csv','text/csv;charset=utf-8',testingDiagnosticCsv(rows));
  status.textContent='done — '+games+' games';
 }catch(err){
  console.error(err);status.textContent='failed — see console';
 }finally{
  window._arenaSizeLocked=false;
  _testingDiagnosticRunning=false;
  if(Math.random!==_testingNativeRandom)Math.random=_testingNativeRandom;
  if(window.setTimeout!==_testingNativeSetTimeout)window.setTimeout=_testingNativeSetTimeout;
  try{
   setTestingDiagnosticUiLocked(false);
   resize();
   restartTestingGround();
  }catch(err){
   console.error(err);
   status.textContent='failed — see console';
   try{cancelAnimationFrame(animId);lastTime=performance.now();paused=false;animId=requestAnimationFrame(loop);}catch(fallbackErr){console.error(fallbackErr);}
  }
 }
}

function setTestingTelemetryCollapsed(collapsed){
 _testingTelemetryCollapsed=!!collapsed;
 renderTestingTelemetry(true);
}
function toggleTestingTelemetry(){if(_testingDiagnosticRunning)return;setTestingTelemetryCollapsed(!_testingTelemetryCollapsed);}
function renderTestingTelemetry(force){
 if(!isTestingGround())return;
 const now=typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
 if(!force&&now-_testingTelemetryLastRender<TESTING_TELEMETRY_RENDER_INTERVAL_MS)return;
 _testingTelemetryLastRender=now;
 let panel=document.getElementById('testing-telemetry');if(!panel){panel=document.createElement('div');panel.id='testing-telemetry';document.getElementById('arena-border').appendChild(panel);}
 panel.classList.toggle('collapsed',_testingTelemetryCollapsed);
 const buttonText=_testingTelemetryCollapsed?'SHOW':'HIDE';
 const header='<button class="tg-telemetry-toggle"'+(_testingDiagnosticRunning?' disabled':'')+' onclick="toggleTestingTelemetry()">'+buttonText+' TELEMETRY</button>';
 if(_testingTelemetryCollapsed){panel.innerHTML=header;return;}
 if(!window._liveCombatTracker){panel.innerHTML=header+'<div class="battle-report-section">NO TELEMETRY</div>';return;}
 window._liveCombatTracker.onMatchEnd(window.matchTime||0);
 const summary=window._liveCombatTracker.getSummary();
 panel.innerHTML=`${header}<div class="battle-report-section">LIVE TELEMETRY ${formatReportDuration(window.matchTime||0)}</div><div class="tg-report-grid">${renderReportSide(window._liveCombatTracker.redKey,summary.red,'r','#ff5533')}${renderReportSide(window._liveCombatTracker.blueKey,summary.blue,'b','#88aacc')}</div>`;
}
window.isTestingGround=isTestingGround;window.getTestingGroundSpeed=getTestingGroundSpeed;window.renderTestingGroundPickerPanel=renderTestingGroundPickerPanel;window.launchTestingGround=launchTestingGround;window.restartTestingGround=restartTestingGround;window.testingFrameStep=testingFrameStep;window.leaveTestingGround=leaveTestingGround;window.renderTestingTelemetry=renderTestingTelemetry;window.toggleTestingTelemetry=toggleTestingTelemetry;window.setTestingTelemetryCollapsed=setTestingTelemetryCollapsed;window.restoreTestingRandom=restoreTestingRandom;window.resetTestingOptions=resetTestingOptions;window.runTestingGroundDiagnostic=runTestingGroundDiagnostic;window.toggleTestingGroundDiagnostic=toggleTestingGroundDiagnostic;
