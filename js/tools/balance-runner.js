'use strict';
// Browser-console balance automation for repeatable baseline batches.
// Usage: await runBalanceBaseline({minutes:120, roundsPerPair:3, includeMirrors:false})

(function(){
 const DEFAULTS={
  minutes:10,
  roundsPerPair:2,
  maxMatchSeconds:90,
  dt:1/30,
  seed:1337,
  includeMirrors:false,
  chunkSize:25,
  targetMatches:0,
  targetGamesPerClass:0,
  noVisuals:true,
  progress:null,
  exportJson:true,
  exportCsv:true,
 };
 const pendingBalanceTimeouts=new Set();
 function clearPendingBalanceTimeouts(){
  for(const id of pendingBalanceTimeouts)clearTimeout(id);
  pendingBalanceTimeouts.clear();
 }
 function installBalanceTimeoutTracker(){
  const originalSetTimeout=window.setTimeout,originalClearTimeout=window.clearTimeout;
  window.setTimeout=function(fn,delay,...args){
   const id=originalSetTimeout(function(...cbArgs){
    pendingBalanceTimeouts.delete(id);
    fn(...cbArgs);
   },delay,...args);
   pendingBalanceTimeouts.add(id);
   return id;
  };
  window.clearTimeout=function(id){
   pendingBalanceTimeouts.delete(id);
   return originalClearTimeout(id);
  };
  return function restoreBalanceTimeoutTracker(){
   window.setTimeout=originalSetTimeout;
   window.clearTimeout=originalClearTimeout;
   clearPendingBalanceTimeouts();
  };
 }
 function mulberry32(seed){
  let t=seed>>>0;
  return function(){
   t+=0x6D2B79F5;
   let r=Math.imul(t^(t>>>15),1|t);
   r^=r+Math.imul(r^(r>>>7),61|r);
   return ((r^(r>>>14))>>>0)/4294967296;
  };
 }
 function resetArenaForBalance(redKey,blueKey,rng){
  cancelAnimationFrame(animId);
  clearPendingBalanceTimeouts();
  winDone=false;paused=true;
  spheres=[];particles=[];projectiles=[];afterimages=[];noiseTraps=[];slowZones=[];thornPatches=[];skeletons=[];dmgNums=[];bloodSplats=[];miasmaClouds=[];
  if(typeof _burialMoundSeq!=='undefined')_burialMoundSeq=0;
  resize();
  if(W<10||H<10){W=720;H=420;canvas.width=W;canvas.height=H;}
  function dvdVel(key){
   let a=rng()*Math.PI*2;
   while(Math.abs(((a%(Math.PI/2))+(Math.PI/2))%(Math.PI/2)-(Math.PI/4))<0.22)a+=0.28;
   const d=DEF[key],rawSpd=d.spd*(1.0+rng()*0.25);
   return{vx:Math.cos(a)*rawSpd,vy:Math.sin(a)*rawSpd};
  }
  const v0=dvdVel(redKey),v1=dvdVel(blueKey);
  const rd=Math.min(W,H)*(DEF[redKey].mass>=20?0.115:0.095);
  const bd=Math.min(W,H)*(DEF[blueKey].mass>=20?0.115:0.095);
  spheres.push(new Sphere(redKey,0,rd*2+rng()*(W/2-rd*3),rd*2+rng()*(H-rd*4),v0.vx,v0.vy));
  spheres.push(new Sphere(blueKey,1,W/2+bd+rng()*(W/2-bd*3),bd*2+rng()*(H-bd*4),v1.vx,v1.vy));
 }
 function stepBalance(dt){
  for(const s of spheres)s.update(dt);
  for(const p of projectiles)p.update(dt);
  resolveAll();
  if(!window._balanceNoVisuals){updateParticles(dt);updateDmgNums(dt);updateBloodSplats(dt);updateAbBar();}
  slowZones=slowZones.filter(z=>{z.update(dt);return z.life>0;});
  thornPatches=thornPatches.filter(p=>{p.update(dt);return p.life>0;});
  miasmaClouds=miasmaClouds.filter(m=>{m.update(dt);return m.life>0;});
  afterimages=afterimages.filter(a=>{a.update(dt);return a.alive;});
  noiseTraps=noiseTraps.filter(n=>{n.update(dt);return n.alive;});
  skeletons=skeletons.filter(sk=>{sk.update(dt);return sk.alive;});
  projectiles=projectiles.filter(p=>p.alive);
  if(window._balanceNoVisuals){particles=[];dmgNums=[];bloodSplats=[];}
  spheres=spheres.filter(s=>!s.isReplica||s.alive||s.dyingT<=0.8);
 }
 function primaryForFaction(faction){
  return spheres.find(s=>s.faction===faction&&!s.isReplica)||spheres.find(s=>s.faction===faction)||null;
 }
 function livingPrimaryFactions(){
  const alive=spheres.filter(s=>s.alive&&!s.dying),factions=[...new Set(alive.map(s=>s.faction))];
  return{alive,factions};
 }
 function resolveWinnerFromLivingFactions(alive,factions){
  if(factions.length>=2||spheres.length<2)return null;
  return alive.find(s=>s.faction===factions[0]&&!s.isReplica)||alive.find(s=>s.faction===factions[0])||null;
 }
 function resolveTimeoutWinner(){
  // The browser game itself does not declare a draw just because a fixed
  // analysis budget elapsed. Treat maxMatchSeconds as a simulation cutoff:
  // award the side with the higher remaining HP percentage and only record a
  // true draw for double KOs or practically tied HP at the cutoff.
  const red=primaryForFaction(0),blue=primaryForFaction(1);
  const redAlive=!!(red&&red.alive&&!red.dying),blueAlive=!!(blue&&blue.alive&&!blue.dying);
  if(redAlive&&!blueAlive)return{winner:red,reason:'timeout_blue_dead'};
  if(blueAlive&&!redAlive)return{winner:blue,reason:'timeout_red_dead'};
  if(!redAlive&&!blueAlive)return{winner:null,reason:'double_ko'};
  const redPct=red.maxHp>0?red.hp/red.maxHp:0,bluePct=blue.maxHp>0?blue.hp/blue.maxHp:0;
  const diff=redPct-bluePct;
  if(Math.abs(diff)<0.01)return{winner:null,reason:'timeout_hp_tie'};
  return{winner:diff>0?red:blue,reason:'timeout_hp_pct_tiebreak',redHpPct:+redPct.toFixed(4),blueHpPct:+bluePct.toFixed(4)};
 }
 function pct(n){return +(n*100).toFixed(1);}
 function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
 function patchMagnitude(score){const a=Math.abs(score);return a>=30?'large':a>=20?'medium':'small';}
 function roleStatWeights(role){
  const weights={
   TANK:{hp:.35,arm:.30,magDef:.15,dmg:.10,spd:.10},
   FIGHTER:{dmg:.30,spd:.20,hp:.20,arm:.15,reach:.15},
   ASSASSIN:{spd:.30,dmg:.25,hp:.15,rest:.15,reach:.15},
   MAGE:{dmg:.35,reach:.20,magDef:.15,hp:.15,spd:.15},
   MARKSMAN:{reach:.30,dmg:.30,spd:.20,hp:.10,rest:.10},
   SUPPORT:{hp:.25,magDef:.20,arm:.15,dmg:.15,abilityUptime:.15,spd:.10}
  };
  return Object.assign({},weights[role]||weights.FIGHTER);
 }
 function weightedStatAdjustment(score,confidence,role,avgHpMargin,drawRate,action){
  if(action!=='NERF'&&action!=='BUFF')return{totalAdjustmentPct:0,statAdjustments:''};
  const direction=action==='NERF'?-1:1,weights=roleStatWeights(role);
  const marginPressure=clamp(Math.abs(avgHpMargin)/200,0,.45);
  const drawPressure=clamp(drawRate,.0,.35);
  if((action==='NERF'&&avgHpMargin>40)||(action==='BUFF'&&avgHpMargin<-40)){
   if(weights.hp)weights.hp+=marginPressure*.45;
   if(weights.arm)weights.arm+=marginPressure*.30;
   if(weights.magDef)weights.magDef+=marginPressure*.20;
  }else if((action==='NERF'&&avgHpMargin<40)||(action==='BUFF'&&avgHpMargin>-40)){
   if(weights.dmg)weights.dmg+=marginPressure*.30;
   if(weights.reach)weights.reach+=marginPressure*.20;
   if(weights.spd)weights.spd+=marginPressure*.15;
  }
  if(drawPressure>0){
   if(action==='NERF'){if(weights.hp)weights.hp+=drawPressure*.25;if(weights.arm)weights.arm+=drawPressure*.20;if(weights.magDef)weights.magDef+=drawPressure*.20;}
   else{if(weights.dmg)weights.dmg+=drawPressure*.25;if(weights.reach)weights.reach+=drawPressure*.20;}
  }
  const totalWeight=Object.values(weights).reduce((a,b)=>a+b,0)||1;
  const totalPct=+(clamp(Math.abs(score)*0.20,2,10)*confidence).toFixed(1);
  const parts=Object.entries(weights).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([stat,w])=>`${stat} ${(direction*totalPct*w/totalWeight).toFixed(1)}%`);
  return{totalAdjustmentPct:direction*totalPct,statAdjustments:parts.join('; ')};
 }
 function patchTargets(key,action,row,drawRate,avgHpMargin){
  if(action==='WATCH'||action==='NEEDS_MORE_DATA')return '';
  const d=DEF[key],role=typeof CLASS_ROLE!=='undefined'?CLASS_ROLE[key]:'';
  const defensive=d.hp>=500||d.arm>=130||avgHpMargin>80;
  const evasive=d.spd>=260||d.rest>=0.80;
  const damage=d.dmg>=5||d.reach>=3.6;
  if(action==='NERF'){
   if(drawRate>=0.20||defensive)return 'Reduce sustain/defense first: hp, arm, magDef, ability invulnerability/heal uptime.';
   if(evasive)return 'Reduce mobility/control first: spd, rest, untargetable duration, slow/knockback uptime.';
   if(damage)return 'Reduce offense first: dmg, projectile rate, reach, ability burst multiplier.';
   return `Trim the main ${role||'class'} strength by 3-6%, then rerun baseline.`;
  }
  if(row.avgDuration>75)return 'Increase threat/reliability first: dmg, reach, projectile cadence, or ability payoff.';
  if(avgHpMargin<-80)return 'Increase survivability first: hp, arm, magDef, escape/defensive ability uptime.';
  return 'Buff core reliability by 3-6%: weapon reach/tip radius, dmg, spd, or stack gain.';
 }
 function summarizeClassRow(key,row,totalMatches,matchups){
  const wr=row.games?row.wins/row.games:0,decisive=row.wins+row.losses,decisiveWr=decisive?row.wins/decisive:0;
  const drawRate=row.games?row.draws/row.games:0,share=totalMatches?row.games/(totalMatches*2):0;
  const avgHpMargin=row.games?row.hpMargin/row.games:0,avgEndHp=row.games?row.endHp/row.games:0,avgWinHp=row.wins?row.winHp/row.wins:0;
  const avgLossOpponentHp=row.losses?row.lossOpponentHp/row.losses:0;
  const rows=Object.values(matchups).filter(m=>m.a===key||m.b===key);
  let worst=null,best=null,hardCounters=0,dominantMatchups=0;
  for(const m of rows){
   const dec=m.games-m.draws,rate=dec?(m.a===key?m.aWins:m.bWins)/dec:0;
   const label=m.a===key?m.b:m.a;
   if(dec>=4&&rate<=0.25)hardCounters++;
   if(dec>=4&&rate>=0.75)dominantMatchups++;
   if(!worst||rate<worst.rate)worst={label,rate,games:m.games};
   if(!best||rate>best.rate)best={label,rate,games:m.games};
  }
  const confidence=clamp(row.games/200,0,1);
  const pressure=(wr-0.5)*120+(decisiveWr-0.5)*60+avgHpMargin*0.08+dominantMatchups*1.5-hardCounters*1.5-drawRate*20;
  const balanceScore=+(pressure*confidence).toFixed(1);
  const action=confidence<0.5?'NEEDS_MORE_DATA':balanceScore>=12?'NERF':balanceScore<=-12?'BUFF':'WATCH';
  const role=typeof CLASS_ROLE!=='undefined'?(CLASS_ROLE[key]||'FIGHTER'):'FIGHTER';
  const magnitude=action==='NERF'||action==='BUFF'?patchMagnitude(balanceScore):'';
  const patchTarget=patchTargets(key,action,row,drawRate,avgHpMargin);
  const adjustment=weightedStatAdjustment(balanceScore,confidence,role,avgHpMargin,drawRate,action);
  const suggestions=[];
  if(action==='NERF')suggestions.push('Nerf candidate: inspect survivability, damage uptime, ability impact, and dominant matchups.');
  else if(action==='BUFF')suggestions.push('Buff candidate: inspect weapon reliability, time-to-first-impact, survivability, and hard counters.');
  else if(action==='NEEDS_MORE_DATA')suggestions.push('Low confidence: gather closer to 200 games before changing stats.');
  if(row.avgDuration>75)suggestions.push('Long-match profile: watch for stalemate, sustain, or low interaction.');
  if(drawRate>=0.20)suggestions.push('High draw rate: inspect timeout, sustain, and low-lethality interactions.');
  if(share<0.015)suggestions.push('Low sample share: run a larger or uncapped baseline.');
  return{key,label:DEF[key].label,role,games:row.games,wins:row.wins,losses:row.losses,draws:row.draws,winRate:+wr.toFixed(4),winPct:pct(wr),decisiveWinRate:+decisiveWr.toFixed(4),drawRate:+drawRate.toFixed(4),avgDuration:+row.avgDuration.toFixed(2),avgEndHp:+avgEndHp.toFixed(2),avgHpMargin:+avgHpMargin.toFixed(2),avgWinHp:+avgWinHp.toFixed(2),avgLossOpponentHp:+avgLossOpponentHp.toFixed(2),hardCounters,dominantMatchups,worstMatchup:worst?`${worst.label} (${pct(worst.rate)}%)`:'',bestMatchup:best?`${best.label} (${pct(best.rate)}%)`:'',balanceScore,action,magnitude,patchTarget,totalAdjustmentPct:adjustment.totalAdjustmentPct,statAdjustments:adjustment.statAdjustments,confidence:+confidence.toFixed(2),suggestions};
 }
 function buildReport(results,options,elapsedMs,completedPlanned){
  const classes={};Object.keys(DEF).forEach(k=>classes[k]={games:0,wins:0,losses:0,draws:0,duration:0,avgDuration:0,endHp:0,hpMargin:0,winHp:0,lossOpponentHp:0});
  const matchups={};
  for(const r of results){
   const redMargin=r.redHp-r.blueHp,blueMargin=r.blueHp-r.redHp;
   for(const side of [{key:r.redKey,hp:r.redHp,oppHp:r.blueHp,margin:redMargin},{key:r.blueKey,hp:r.blueHp,oppHp:r.redHp,margin:blueMargin}]){
    const c=classes[side.key];c.games++;c.duration+=r.duration;c.endHp+=side.hp;c.hpMargin+=side.margin;
    if(r.winnerKey===side.key){c.wins++;c.winHp+=side.hp;}else if(r.winnerKey){c.losses++;c.lossOpponentHp+=side.oppHp;}else c.draws++;
   }
   const ordered=[r.redKey,r.blueKey].sort();const id=ordered.join('__vs__');
   if(!matchups[id])matchups[id]={a:ordered[0],b:ordered[1],games:0,aWins:0,bWins:0,draws:0,duration:0,timeoutTiebreaks:0,doubleKOs:0};
   const m=matchups[id];m.games++;m.duration+=r.duration;if(r.endReason==='timeout_hp_pct_tiebreak')m.timeoutTiebreaks++;if(r.endReason==='double_ko')m.doubleKOs++;if(r.winnerKey===m.a)m.aWins++;else if(r.winnerKey===m.b)m.bWins++;else m.draws++;
  }
  Object.values(classes).forEach(c=>{c.avgDuration=c.games?c.duration/c.games:0;});
  const classRows=Object.keys(classes).map(k=>summarizeClassRow(k,classes[k],results.length,matchups)).sort((a,b)=>b.balanceScore-a.balanceScore);
  const matchupRows=Object.values(matchups).map(m=>{
   const decisive=m.games-m.draws,aRate=decisive?m.aWins/decisive:0,bRate=decisive?m.bWins/decisive:0;
   const leader=aRate>=bRate?m.a:m.b,leaderRate=Math.max(aRate,bRate);
   return{matchup:`${m.a} vs ${m.b}`,a:m.a,b:m.b,games:m.games,decisiveGames:decisive,aWins:m.aWins,bWins:m.bWins,draws:m.draws,timeoutTiebreaks:m.timeoutTiebreaks,doubleKOs:m.doubleKOs,drawRate:+(m.games?m.draws/m.games:0).toFixed(4),aWinRate:+aRate.toFixed(4),bWinRate:+bRate.toFixed(4),leader,leaderWinRate:+leaderRate.toFixed(4),avgDuration:+(m.games?m.duration/m.games:0).toFixed(2),hardCounter:leaderRate>=0.75?`${leader} at ${Math.round(leaderRate*100)}% decisive WR`:null,impossibleMatch:decisive>=6&&leaderRate>=0.90};
  }).sort((a,b)=>Math.max(b.aWinRate,b.bWinRate)-Math.max(a.aWinRate,a.bWinRate));
  return{generatedAt:new Date().toISOString(),options,elapsedMs,completedPlanned,matchCount:results.length,classes:classRows,hardMatchups:matchupRows.filter(m=>m.hardCounter),matchups:matchupRows,results};
 }
 function download(name,mime,text){
  const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function toCsv(report){
  const lines=['key,label,role,action,magnitude,balanceScore,totalAdjustmentPct,statAdjustments,patchTarget,confidence,games,wins,losses,draws,winPct,decisiveWinRate,drawRate,avgDuration,avgEndHp,avgHpMargin,avgWinHp,avgLossOpponentHp,hardCounters,dominantMatchups,worstMatchup,bestMatchup,suggestions'];
  for(const r of report.classes)lines.push([r.key,r.label,r.role,r.action,r.magnitude,r.balanceScore,r.totalAdjustmentPct,`"${r.statAdjustments.replace(/"/g,'""')}"`,`"${r.patchTarget.replace(/"/g,'""')}"`,r.confidence,r.games,r.wins,r.losses,r.draws,r.winPct,r.decisiveWinRate,r.drawRate,r.avgDuration,r.avgEndHp,r.avgHpMargin,r.avgWinHp,r.avgLossOpponentHp,r.hardCounters,r.dominantMatchups,`"${r.worstMatchup.replace(/"/g,'""')}"`,`"${r.bestMatchup.replace(/"/g,'""')}"`,`"${r.suggestions.join(' | ').replace(/"/g,'""')}"`].join(','));
  return lines.join('\n');
 }
 function toMatchupCsv(report){
  const lines=['matchup,a,b,games,decisiveGames,aWins,bWins,draws,timeoutTiebreaks,doubleKOs,drawRate,aWinRate,bWinRate,leader,leaderWinRate,avgDuration,hardCounter,impossibleMatch'];
  for(const m of report.matchups)lines.push([`"${m.matchup.replace(/"/g,'""')}"`,m.a,m.b,m.games,m.decisiveGames,m.aWins,m.bWins,m.draws,m.timeoutTiebreaks,m.doubleKOs,m.drawRate,m.aWinRate,m.bWinRate,m.leader,m.leaderWinRate,m.avgDuration,`"${(m.hardCounter||'').replace(/"/g,'""')}"`,m.impossibleMatch].join(','));
  return lines.join('\n');
 }
 function buildRoundRobinPairs(keys,includeMirrors){
  const ordered=keys.slice();
  const pairs=[];
  if(includeMirrors)for(const key of ordered)pairs.push([key,key]);
  if(ordered.length<2)return pairs;
  if(ordered.length%2)ordered.push(null);
  const n=ordered.length,rotating=ordered.slice();
  for(let round=0;round<n-1;round++){
   for(let i=0;i<n/2;i++){
    const a=rotating[i],b=rotating[n-1-i];
    if(a!==null&&b!==null)pairs.push(round%2?[b,a]:[a,b]);
   }
   rotating.splice(1,0,rotating.pop());
  }
  return pairs;
 }
 function buildPlannedMatches(keys,options){
  const pairs=buildRoundRobinPairs(keys,options.includeMirrors);
  const planned=[];
  for(let r=0;r<options.roundsPerPair;r++){
   for(const p of pairs){
    planned.push([p[0],p[1],r]);
    if(p[0]!==p[1])planned.push([p[1],p[0],r]);
   }
  }
  if(options.targetMatches>0&&planned.length>options.targetMatches)planned.length=options.targetMatches;
  return planned;
 }
 window.runBalanceBaseline=async function(userOptions={}){
  const options=Object.assign({},DEFAULTS,userOptions);
  const keys=options.keys||Object.keys(DEF);
  if(options.targetGamesPerClass>0&&!userOptions.targetMatches)options.targetMatches=Math.ceil(keys.length*options.targetGamesPerClass/2);
  const planned=buildPlannedMatches(keys,options);
  const deadline=performance.now()+options.minutes*60*1000,results=[],started=performance.now();let count=0;
  const originalRandom=Math.random,originalNoVisuals=window._balanceNoVisuals;
  const restoreBalanceTimeoutTracker=installBalanceTimeoutTracker();
  window._balanceNoVisuals=options.noVisuals!==false;
  try{
   for(const [redKey,blueKey,round] of planned){
    if(performance.now()>deadline)break;
    const seed=(options.seed+count*2654435761+round*1013904223)>>>0,rng=mulberry32(seed);Math.random=rng;
    resetArenaForBalance(redKey,blueKey,rng);
    let t=0,winner=null,endReason='elimination';
    while(t<options.maxMatchSeconds){
     stepBalance(options.dt);t+=options.dt;
     const living=livingPrimaryFactions();
     if(living.factions.length<2&&spheres.length>=2){winner=resolveWinnerFromLivingFactions(living.alive,living.factions);endReason=winner?'elimination':'double_ko';break;}
    }
    if(!winner&&t>=options.maxMatchSeconds){
     const timeoutResult=resolveTimeoutWinner();
     winner=timeoutResult.winner;endReason=timeoutResult.reason;
    }
    const red=primaryForFaction(0),blue=primaryForFaction(1);
    results.push({redKey,blueKey,winnerKey:winner?winner.key:null,winnerFaction:winner?winner.faction:null,duration:+t.toFixed(2),seed,redHp:red?+Math.max(0,red.hp).toFixed(2):0,blueHp:blue?+Math.max(0,blue.hp).toFixed(2):0,endReason,draw:!winner});
    count++;
    if(count%options.chunkSize===0){
     const message=`${count}/${planned.length} matches`;
     console.log(`[balance] ${message} complete`);
     if(typeof options.progress==='function')options.progress({count,total:planned.length,message});
     await new Promise(r=>setTimeout(r,0));
    }
   }
  }finally{Math.random=originalRandom;window._balanceNoVisuals=originalNoVisuals;restoreBalanceTimeoutTracker();paused=false;}
  const report=buildReport(results,options,performance.now()-started,count===planned.length);
  window.lastBalanceReport=report;
  console.table(report.classes.slice(0,12));
  if(report.hardMatchups.length)console.table(report.hardMatchups.slice(0,20));
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  if(options.exportJson)download(`balance-baseline-${stamp}.json`,'application/json',JSON.stringify(report,null,2));
  if(options.exportCsv){
   download(`balance-class-summary-${stamp}.csv`,'text/csv',toCsv(report));
   download(`balance-matchup-summary-${stamp}.csv`,'text/csv',toMatchupCsv(report));
  }
  return report;
 };

window.startBalanceBaselineButton=function(){
 const btn=document.getElementById('balance-btn'),status=document.getElementById('balance-status');
 if(btn)btn.disabled=true;
 if(status)status.textContent='running...';
 return runBalanceBaseline({
  minutes:20,
  roundsPerPair:6,
  maxMatchSeconds:60,
  dt:1/20,
  targetGamesPerClass:200,
  chunkSize:25,
  noVisuals:true,
  progress:p=>{if(status)status.textContent=`${p.message} (${Math.round(p.count/p.total*100)}%)`;}
 }).then(report=>{
  if(status)status.textContent=`done: ${report.matchCount}`;
  return report;
 }).catch(err=>{
  console.error(err);
  if(status)status.textContent='failed';
 }).finally(()=>{if(btn)btn.disabled=false;});
};

})();
