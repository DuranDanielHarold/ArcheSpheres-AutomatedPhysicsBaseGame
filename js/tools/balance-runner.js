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
  noVisuals:true,
  progress:null,
  exportJson:true,
  exportCsv:true,
 };
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
 function summarizeClassRow(key,row,totalMatches){
  const wr=row.games?row.wins/row.games:0;
  const share=totalMatches?row.games/totalMatches:0;
  const suggestions=[];
  if(wr>=0.60&&row.games>=10)suggestions.push('Likely overtuned: inspect survivability, damage uptime, and ability impact.');
  else if(wr<=0.40&&row.games>=10)suggestions.push('Likely undertuned: inspect weapon reliability, time-to-first-impact, and ability payoff.');
  if(row.avgDuration>75)suggestions.push('Long-match profile: watch for stalemate, sustain, or low interaction.');
  if(share<0.03)suggestions.push('Low sample share: gather more games before changing stats.');
  return{key,label:DEF[key].label,games:row.games,wins:row.wins,losses:row.losses,draws:row.draws,winRate:+wr.toFixed(4),avgDuration:+row.avgDuration.toFixed(2),suggestions};
 }
 function buildReport(results,options,elapsedMs,completedPlanned){
  const classes={};Object.keys(DEF).forEach(k=>classes[k]={games:0,wins:0,losses:0,draws:0,duration:0,avgDuration:0});
  const matchups={};
  for(const r of results){
   for(const key of [r.redKey,r.blueKey]){classes[key].games++;classes[key].duration+=r.duration;if(r.winnerKey===key)classes[key].wins++;else if(r.winnerKey)classes[key].losses++;else classes[key].draws++;}
   const ordered=[r.redKey,r.blueKey].sort();const id=ordered.join('__vs__');
   if(!matchups[id])matchups[id]={a:ordered[0],b:ordered[1],games:0,aWins:0,bWins:0,draws:0,duration:0};
   const m=matchups[id];m.games++;m.duration+=r.duration;if(r.winnerKey===m.a)m.aWins++;else if(r.winnerKey===m.b)m.bWins++;else m.draws++;
  }
  Object.values(classes).forEach(c=>{c.avgDuration=c.games?c.duration/c.games:0;});
  const classRows=Object.keys(classes).map(k=>summarizeClassRow(k,classes[k],results.length)).sort((a,b)=>b.winRate-a.winRate);
  const matchupRows=Object.values(matchups).map(m=>{
   const decisive=m.games-m.draws,aRate=decisive?m.aWins/decisive:0,bRate=decisive?m.bWins/decisive:0;
   const leader=aRate>=bRate?m.a:m.b,leaderRate=Math.max(aRate,bRate);
   return{matchup:`${m.a} vs ${m.b}`,a:m.a,b:m.b,games:m.games,aWins:m.aWins,bWins:m.bWins,draws:m.draws,aWinRate:+aRate.toFixed(4),bWinRate:+bRate.toFixed(4),avgDuration:+(m.games?m.duration/m.games:0).toFixed(2),hardCounter:leaderRate>=0.75?`${leader} at ${Math.round(leaderRate*100)}% decisive WR`:null};
  }).sort((a,b)=>Math.max(b.aWinRate,b.bWinRate)-Math.max(a.aWinRate,a.bWinRate));
  return{generatedAt:new Date().toISOString(),options,elapsedMs,completedPlanned,matchCount:results.length,classes:classRows,hardMatchups:matchupRows.filter(m=>m.hardCounter),matchups:matchupRows,results};
 }
 function download(name,mime,text){
  const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function toCsv(report){
  const lines=['key,label,games,wins,losses,draws,winRate,avgDuration,suggestions'];
  for(const r of report.classes)lines.push([r.key,r.label,r.games,r.wins,r.losses,r.draws,r.winRate,r.avgDuration,`"${r.suggestions.join(' | ').replace(/"/g,'""')}"`].join(','));
  return lines.join('\n');
 }
 window.runBalanceBaseline=async function(userOptions={}){
  const options=Object.assign({},DEFAULTS,userOptions);
  const keys=options.keys||Object.keys(DEF),pairs=[];
  for(let i=0;i<keys.length;i++)for(let j=0;j<keys.length;j++)if(options.includeMirrors||i!==j)if(options.includeMirrors||i<j)pairs.push([keys[i],keys[j]]);
  const planned=[];for(const p of pairs)for(let r=0;r<options.roundsPerPair;r++){planned.push([p[0],p[1],r]);planned.push([p[1],p[0],r]);}
  if(options.targetMatches>0&&planned.length>options.targetMatches)planned.length=options.targetMatches;
  const deadline=performance.now()+options.minutes*60*1000,results=[],started=performance.now();let count=0;
  const originalRandom=Math.random,originalNoVisuals=window._balanceNoVisuals;
  window._balanceNoVisuals=options.noVisuals!==false;
  try{
   for(const [redKey,blueKey,round] of planned){
    if(performance.now()>deadline)break;
    const seed=(options.seed+count*2654435761+round*1013904223)>>>0,rng=mulberry32(seed);Math.random=rng;
    resetArenaForBalance(redKey,blueKey,rng);
    let t=0,winner=null;
    while(t<options.maxMatchSeconds){
     stepBalance(options.dt);t+=options.dt;
     const alive=spheres.filter(s=>s.alive&&!s.dying),factions=[...new Set(alive.map(s=>s.faction))];
     if(factions.length<2&&spheres.length>=2){winner=alive.find(s=>s.faction===factions[0]&&!s.isReplica)||alive.find(s=>s.faction===factions[0])||null;break;}
    }
    const red=spheres.find(s=>s.faction===0&&!s.isReplica)||spheres.find(s=>s.faction===0);
    const blue=spheres.find(s=>s.faction===1&&!s.isReplica)||spheres.find(s=>s.faction===1);
    results.push({redKey,blueKey,winnerKey:winner?winner.key:null,winnerFaction:winner?winner.faction:null,duration:+t.toFixed(2),seed,redHp:red?+Math.max(0,red.hp).toFixed(2):0,blueHp:blue?+Math.max(0,blue.hp).toFixed(2):0,draw:!winner});
    count++;
    if(count%options.chunkSize===0){
     const message=`${count}/${planned.length} matches`;
     console.log(`[balance] ${message} complete`);
     if(typeof options.progress==='function')options.progress({count,total:planned.length,message});
     await new Promise(r=>setTimeout(r,0));
    }
   }
  }finally{Math.random=originalRandom;window._balanceNoVisuals=originalNoVisuals;paused=false;}
  const report=buildReport(results,options,performance.now()-started,count===planned.length);
  window.lastBalanceReport=report;
  console.table(report.classes.slice(0,12));
  if(report.hardMatchups.length)console.table(report.hardMatchups.slice(0,20));
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  if(options.exportJson)download(`balance-baseline-${stamp}.json`,'application/json',JSON.stringify(report,null,2));
  if(options.exportCsv)download(`balance-class-summary-${stamp}.csv`,'text/csv',toCsv(report));
  return report;
 };

window.startBalanceBaselineButton=function(){
 const btn=document.getElementById('balance-btn'),status=document.getElementById('balance-status');
 if(btn)btn.disabled=true;
 if(status)status.textContent='running...';
 return runBalanceBaseline({
  minutes:1,
  roundsPerPair:3,
  maxMatchSeconds:60,
  dt:1/20,
  targetMatches:900,
  chunkSize:20,
  noVisuals:true,
  progress:p=>{if(status)status.textContent=p.message;}
 }).then(report=>{
  if(status)status.textContent=`done: ${report.matchCount}`;
  return report;
 }).catch(err=>{
  console.error(err);
  if(status)status.textContent='failed';
 }).finally(()=>{if(btn)btn.disabled=false;});
};

})();
