'use strict';
// Browser-console balance automation for repeatable baseline batches.
// Usage: await runBalanceBaseline({minutes:120, roundsPerPair:3, includeMirrors:false})

(function(){
 const DEFAULTS={
  minutes:10,
  roundsPerPair:2,
  // Keep live sudden-death defaults in sync with js/data/stallConfig.js unless explicitly overridden.
  maxMatchSeconds:typeof STALL_CONFIG!=='undefined'?STALL_CONFIG.hardTimeoutSeconds:60,
  dt:1/20,
  seed:1337,
  includeMirrors:false,
  chunkSize:25,
  targetMatches:0,
  targetGamesPerClass:0,
  noVisuals:true,
  progress:null,
  exportJson:true,
  exportCsv:true,
  stallThresholdSeconds:typeof STALL_CONFIG!=='undefined'?STALL_CONFIG.stallThresholdSeconds:42,
  stallRampSecondsToKill:typeof STALL_CONFIG!=='undefined'?STALL_CONFIG.rampDurationSeconds:10,
  debugStall:false,
 };

 function mean(vals){const filtered=vals.filter(v=>v!==undefined&&v!==null&&!isNaN(v));return filtered.length?filtered.reduce((a,b)=>a+b,0)/filtered.length:0;}
 function trackerSideForResult(r,key){return r.redKey===key?r.red:r.blue;}
 function computeAbilityAction(c){const abilityType=c.def?.abilityType,dmgPct=c.avgAbilityDmgPct,hitRate=c.avgAbilityHitRate,usesPerSec=c.avgAbilityUsesPerSec;if(!abilityType)return 'NO_ABILITY';if(abilityType==='utility')return usesPerSec<0.01?'OVERHAUL':'OK';if(usesPerSec<0.01)return 'NO_ABILITY';if(dmgPct<0.05||(hitRate<0.15&&dmgPct<0.15))return 'OVERHAUL';if(dmgPct<0.15||hitRate<0.30)return 'TUNE_UP';if(dmgPct>0.40||hitRate>0.70)return 'STRONG';return 'OK';}
 function computePassiveAction(c){const passiveType=c.def?.passiveType,triggersPerSec=c.avgPassiveTriggersPerSec,dmgPct=c.avgPassiveDmgPct;if(!passiveType)return 'NO_PASSIVE';if(passiveType==='utility')return triggersPerSec<0.01?'OVERHAUL':'OK';if(triggersPerSec<0.01&&dmgPct<0.01)return 'NO_PASSIVE';if(dmgPct<0.03&&triggersPerSec<0.05)return 'OVERHAUL';if(dmgPct<0.08||triggersPerSec<0.15)return 'TUNE_UP';if(dmgPct>0.25||triggersPerSec>0.50)return 'STRONG';return 'OK';}
 function computeMeleeHitboxAction(c){if(c.avgMeleeAttemptDistance==null||c.avgReachStatAtAttempt===0)return 'N/A';const ratio=c.reachUtilizationRatio,hitRate=c.avgMeleeHitRate;if(ratio<0.6&&hitRate>0.85)return 'HITBOX_SMALLER_THAN_REACH_STAT';if(ratio>0.85&&hitRate<0.55)return 'VISUAL_OUTPACING_HITBOX';if(hitRate<0.40)return 'OVERHAUL';return 'OK';}
 function computeProjectileAction(c){const hitRate=c.avgProjectileHitRate,dmgPct=c.avgProjectileDmgPct,fired=c.avgProjectilesFiredPerMatch;if(fired<0.5)return 'NOT_FIRING';if(hitRate<0.20||dmgPct<0.15)return 'OVERHAUL';if(hitRate<0.40||dmgPct<0.30)return 'TUNE_UP';if(hitRate>0.70||dmgPct>0.60)return 'STRONG';return 'OK';}
 function appendCombatSuggestions(c,suggestions){
  if(c.abilityAction==='OVERHAUL')suggestions.push(`Ability contributing only ${(c.avgAbilityDmgPct*100).toFixed(1)}% of damage at ${(c.avgAbilityHitRate*100).toFixed(0)}% hit rate — investigate trigger condition, hitbox, or targeting. Stat buff will not fix this.`);
  else if(c.abilityAction==='TUNE_UP')suggestions.push(`Ability underperforming (${(c.avgAbilityDmgPct*100).toFixed(1)}% dmg share, ${(c.avgAbilityHitRate*100).toFixed(0)}% hit rate) — increase ability damage coefficient or improve hitbox size/tracking.`);
  else if(c.abilityAction==='STRONG'&&c.action==='NERF')suggestions.push(`Ability accounts for ${(c.avgAbilityDmgPct*100).toFixed(1)}% of damage — nerf via ability cooldown or damage coefficient before touching base stats.`);
  if(c.passiveAction==='OVERHAUL')suggestions.push(`Passive triggers only ${c.avgPassiveTriggersPerSec.toFixed(2)}/s and deals ${(c.avgPassiveDmgPct*100).toFixed(1)}% of damage — trigger condition is likely too restrictive or never met in 1v1.`);
  else if(c.passiveAction==='STRONG'&&c.action==='NERF')suggestions.push(`Passive contributing ${(c.avgPassiveDmgPct*100).toFixed(1)}% of damage at ${c.avgPassiveTriggersPerSec.toFixed(2)}/s — reduce trigger rate or effect magnitude.`);
  if(DEF[c.key]?.rangedSphere){
   if(c.projectileAction==='NOT_FIRING')suggestions.push('Ranged sphere fires <1 projectile per match on average — check firing condition, cooldown, or AI targeting logic.');
   else if(c.projectileAction==='OVERHAUL')suggestions.push(`Projectile hit rate: ${(c.avgProjectileHitRate*100).toFixed(0)}%, damage share: ${(c.avgProjectileDmgPct*100).toFixed(1)}% — projectile is not contributing meaningfully. Check speed, tracking, hitbox radius, and per-hit damage value.`);
   else if(c.projectileAction==='TUNE_UP')suggestions.push(`Projectile hit rate ${(c.avgProjectileHitRate*100).toFixed(0)}% / ${(c.avgProjectileDmgPct*100).toFixed(1)}% damage share — below target range. Increase projectile speed, hit radius, or per-hit damage.`);
   else if(c.projectileAction==='STRONG'&&c.action==='NERF')suggestions.push(`Projectile carrying ${(c.avgProjectileDmgPct*100).toFixed(1)}% of total damage at ${(c.avgProjectileHitRate*100).toFixed(0)}% hit rate — nerf via projectile damage coefficient or reduce hit radius before touching base stats.`);
  }
  if(DEF[c.key]?.sphereMelee)suggestions.push(`Sphere melee — avg rotation: ${c.avgRotationAvg.toFixed(2)}, peak: ${c.avgRotationPeak.toFixed(2)}, speed at first hit: ${c.avgRotationFirstHitSpeed!==null?c.avgRotationFirstHitSpeed.toFixed(2):'N/A'}. ${c.avgRotationAvg<3.0?'Low avg rotation — fighters may not be maintaining spin between attacks. Check decay rate.':c.avgRotationPeak>9.5?'Consistently hitting peak rotation — MAX_ROTATION_MULTIPLIER may be too accessible.':'Rotation in healthy range.'}`);
  if(c.tiebreakWinRate>0.30)suggestions.push(`${(c.tiebreakWinRate*100).toFixed(0)}% of games won via timeout tiebreaker — overall WR overstated until stall ramp is functional. True combat WR (elimination only): ${(c.eliminationWinRate*100).toFixed(1)}%.`);
 }
 function installCombatTrackerHooks(){
  if(!window.CombatTracker||typeof Sphere==='undefined'||Sphere.prototype._balanceTrackerHooked)return function(){};
  const oldDamage=Sphere.prototype.receiveDamage,oldMagic=Sphere.prototype.receiveMagicDamage,oldAbility=Sphere.prototype._checkAbilityTrigger;
  const inferSource=()=>window._balanceDamageSource||(window._balanceCurrentAbilityKey?{key:window._balanceCurrentAbilityKey,type:'ability'}:null);
  const recordDamage=dealt=>{const src=inferSource();if(window._balanceCombatTracker&&src&&dealt>0){if(src.type==='projectile')window._balanceCombatTracker.onProjectileHit(src.key,dealt);else if(src.type==='passive')window._balanceCombatTracker.onPassiveTrigger(src.key,dealt);else window._balanceCombatTracker.onDamage(src.key,dealt,src.type||'base');}};
  Sphere.prototype.receiveDamage=function(dmg){const before=this.hp;oldDamage.call(this,dmg);recordDamage(Math.max(0,before-this.hp));};
  Sphere.prototype.receiveMagicDamage=function(dmg){const before=this.hp;oldMagic.call(this,dmg);recordDamage(Math.max(0,before-this.hp));};
  Sphere.prototype._checkAbilityTrigger=function(){const before=this.stacks,threshold=typeof getStackThreshold==='function'?getStackThreshold(this.key):0;const prior=window._balanceCurrentAbilityKey;window._balanceCurrentAbilityKey=this.key;try{oldAbility.call(this);}finally{window._balanceCurrentAbilityKey=prior;}if(window._balanceCombatTracker&&before>=threshold&&this.stacks===0)window._balanceCombatTracker.onAbilityUse(this.key,true);};
  Sphere.prototype._balanceTrackerHooked=true;
  return function(){Sphere.prototype.receiveDamage=oldDamage;Sphere.prototype.receiveMagicDamage=oldMagic;Sphere.prototype._checkAbilityTrigger=oldAbility;delete Sphere.prototype._balanceTrackerHooked;};
 }

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
 window.mulberry32=mulberry32;
 function matchupSeed(baseSeed,redKey,blueKey,round){
  const matchup=`${redKey}__vs__${blueKey}`;
  let hash=2166136261>>>0;
  for(let i=0;i<matchup.length;i++){
   hash^=matchup.charCodeAt(i);
   hash=Math.imul(hash,16777619)>>>0;
  }
  return (baseSeed^hash^Math.imul((round+1)>>>0,1000003))>>>0;
 }
 function resetArenaForBalance(redKey,blueKey,rng){
  cancelAnimationFrame(animId);
  clearPendingBalanceTimeouts();
  winDone=false;paused=true;
  window.matchTime=0;window.elapsedTime=0;
  // CLEANUP VERIFIED: fighters are discarded and freshly constructed below, so HP, cooldowns, buffs, debuffs, charge counters, combo state, rotationSpeed, targets, aggro, and AI memory come from new Sphere instances.
  // CLEANUP VERIFIED: active setTimeout callbacks are tracked by the balance runner and cleared between matches; per-entity crowd-control and defensive flags die with the discarded Sphere instances.
  // CLEANUP VERIFIED: companion/summon/secondary objects are destroyed by clearing skeletons/projectiles/noiseTraps along with all other spawned entity arrays.
  // CLEANUP VERIFIED: arena hazards, lingering zones, particles, damage numbers, blood, miasma, afterimages, slow zones, thorn patches, and terrain-like modifiers are reset to empty arrays.
  // CLEANUP VERIFIED: match timer accumulators are reset to exactly 0 before the new match starts.
  // CLEANUP VERIFIED: AI targeting/pathfinding/aggro memory is removed by replacing every combat object rather than mutating old ones in place.
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
 function applyBalanceStallRamp(dt,elapsed,options){
  if(elapsed<options.stallThresholdSeconds)return;
  const damage=options._stallDamagePerSecond*dt;
  for(const s of spheres){
   if(!s.alive||s.dying||s.isReplica)continue;
   s.hp=Math.max(0,s.hp-damage);
   s.hitFlash=1;
   if(options.debugStall)console.log(`[stall] ramp tick fired, damage=${damage.toFixed(2)}, ${s.key}_hp=${s.hp.toFixed(2)}`);
   if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}
  }
 }
 function stepBalance(dt,elapsed,options){
  for(const s of spheres)s.update(dt);
  for(const p of projectiles){
   const owner=p.owner;
   if(window._balanceCombatTracker&&owner&&owner.d&&owner.d.rangedSphere&&!p._balanceProjectileTracked){window._balanceCombatTracker.onProjectileFire(owner.key);p._balanceProjectileTracked=true;}
   window._balanceDamageSource=owner?{key:owner.key,type:'projectile'}:null;
   p.update(dt);
   window._balanceDamageSource=null;
  }
  resolveAll();
  applyBalanceStallRamp(dt,elapsed,options);
  if(window._balanceCombatTracker){for(const s of spheres){if(s.d&&s.d.sphereMelee)window._balanceCombatTracker.onRotationUpdate(s.key,s.rotationSpeed||0,false);}}
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
  const totalPct=+(clamp(Math.abs(score)*0.20,2,5)*confidence).toFixed(1);
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
  const sums=row.summaries||[];
  const avgDmgDealt=+mean(sums.map(s=>s.dmgDealt)).toFixed(2),avgBaseDmgPct=+mean(sums.map(s=>s.baseDmgPct)).toFixed(4),avgAbilityDmgPct=+mean(sums.map(s=>s.abilityDmgPct)).toFixed(4),avgPassiveDmgPct=+mean(sums.map(s=>s.passiveDmgPct)).toFixed(4),avgDotDmgPct=+mean(sums.map(s=>s.dotDmgPct)).toFixed(4),avgProjectileDmgPct=+mean(sums.map(s=>s.projectileDmgPct)).toFixed(4);
  const avgAbilityUsesPerSec=+mean(sums.map(s=>s.abilityUsesPerSec)).toFixed(4),avgAbilityHitRate=+mean(sums.map(s=>s.abilityHitRate)).toFixed(4),avgPassiveTriggersPerSec=+mean(sums.map(s=>s.passiveTriggersPerSec)).toFixed(4);
  const avgProjectilesFiredPerMatch=+mean(sums.map(s=>s.projectilesFired)).toFixed(2),avgProjectileHitRate=+mean(sums.map(s=>s.projectileHitRate)).toFixed(4),avgProjectileDmgPerHit=+mean(sums.map(s=>s.avgProjectileDmgPerHit)).toFixed(2);
  const firstHitVals=sums.map(s=>s.rotationFirstHitSpeed).filter(v=>v!==null&&v!==undefined&&!isNaN(v));
  const avgRotationPeak=+mean(sums.map(s=>s.rotationPeak)).toFixed(4),avgRotationAvg=+mean(sums.map(s=>s.rotationAvg)).toFixed(4),avgRotationFirstHitSpeed=firstHitVals.length?+mean(firstHitVals).toFixed(4):null;
  const eliminationWinRate=row.games?+((row.wins-(row.tiebreakWins||0))/row.games).toFixed(4):0,tiebreakWinRate=row.games?+((row.tiebreakWins||0)/row.games).toFixed(4):0;
  const avgMeleeHitRate=+mean(sums.map(s=>s.meleeHitRate)).toFixed(4),avgMeleeAttemptDistance=+mean(sums.map(s=>s.avgMeleeAttemptDistance)).toFixed(4),avgReachStatAtAttempt=+mean(sums.map(s=>s.avgReachStatAtAttempt)).toFixed(4);
  const reachUtilizationRatio=avgReachStatAtAttempt>0?+(avgMeleeAttemptDistance/avgReachStatAtAttempt).toFixed(4):0;
  const combatCols={def:DEF[key],avgMeleeHitRate,avgMeleeAttemptDistance,avgReachStatAtAttempt,reachUtilizationRatio,avgDmgDealt,avgBaseDmgPct,avgAbilityDmgPct,avgPassiveDmgPct,avgDotDmgPct,avgProjectileDmgPct,avgAbilityUsesPerSec,avgAbilityHitRate,avgPassiveTriggersPerSec,avgProjectilesFiredPerMatch,avgProjectileHitRate,avgProjectileDmgPerHit,avgRotationPeak,avgRotationAvg,avgRotationFirstHitSpeed,eliminationWinRate,tiebreakWinRate};
  combatCols.meleeHitboxAction=computeMeleeHitboxAction(combatCols);combatCols.abilityAction=computeAbilityAction(combatCols);combatCols.passiveAction=computePassiveAction(combatCols);combatCols.projectileAction=DEF[key].rangedSphere?computeProjectileAction(combatCols):'N/A';combatCols.key=key;combatCols.action=action;
  const suggestions=[];
  if(action==='NERF')suggestions.push('Nerf candidate: inspect survivability, damage uptime, ability impact, and dominant matchups.');
  else if(action==='BUFF')suggestions.push('Buff candidate: inspect weapon reliability, time-to-first-impact, survivability, and hard counters.');
  else if(action==='NEEDS_MORE_DATA')suggestions.push('Low confidence: gather closer to 200 games before changing stats.');
  if(row.avgDuration>75)suggestions.push('Long-match profile: watch for stalemate, sustain, or low interaction.');
  if(drawRate>=0.20)suggestions.push('High draw rate: inspect timeout, sustain, and low-lethality interactions.');
  if(share<0.015)suggestions.push('Low sample share: run a larger or uncapped baseline.');
  appendCombatSuggestions(combatCols,suggestions);
  return{key,label:DEF[key].label,role,games:row.games,wins:row.wins,losses:row.losses,draws:row.draws,winRate:+wr.toFixed(4),winPct:pct(wr),decisiveWinRate:+decisiveWr.toFixed(4),drawRate:+drawRate.toFixed(4),avgDuration:+row.avgDuration.toFixed(2),avgEndHp:+avgEndHp.toFixed(2),avgHpMargin:+avgHpMargin.toFixed(2),avgWinHp:+avgWinHp.toFixed(2),avgLossOpponentHp:+avgLossOpponentHp.toFixed(2),hardCounters,dominantMatchups,worstMatchup:worst?`${worst.label} (${pct(worst.rate)}%)`:'',bestMatchup:best?`${best.label} (${pct(best.rate)}%)`:'',balanceScore,action,magnitude,patchTarget,totalAdjustmentPct:adjustment.totalAdjustmentPct,statAdjustments:adjustment.statAdjustments,confidence:+confidence.toFixed(2),...combatCols,suggestions};
 }
 function buildReport(results,options,elapsedMs,completedPlanned){
  const classes={};Object.keys(DEF).forEach(k=>classes[k]={games:0,wins:0,losses:0,draws:0,duration:0,avgDuration:0,endHp:0,hpMargin:0,winHp:0,lossOpponentHp:0,summaries:[],tiebreakWins:0});
  const matchups={};
  for(const r of results){
   const redMargin=r.redHp-r.blueHp,blueMargin=r.blueHp-r.redHp;
   for(const side of [{key:r.redKey,hp:r.redHp,oppHp:r.blueHp,margin:redMargin,summary:r.red},{key:r.blueKey,hp:r.blueHp,oppHp:r.redHp,margin:blueMargin,summary:r.blue}]){
    const c=classes[side.key];c.games++;c.duration+=r.duration;c.endHp+=side.hp;c.hpMargin+=side.margin;if(side.summary)c.summaries.push(side.summary);
    if(r.winnerKey===side.key){c.wins++;c.winHp+=side.hp;if(r.endReason==='timeout_hp_pct_tiebreak')c.tiebreakWins++;}else if(r.winnerKey){c.losses++;c.lossOpponentHp+=side.oppHp;}else c.draws++;
   }
   const ordered=[r.redKey,r.blueKey].sort();const id=ordered.join('__vs__');
   if(!matchups[id])matchups[id]={a:ordered[0],b:ordered[1],games:0,aWins:0,bWins:0,draws:0,duration:0,timeoutTiebreaks:0,doubleKOs:0,summaries:[],eliminations:0};
   const m=matchups[id];m.games++;m.duration+=r.duration;m.summaries.push({a:r.redKey===m.a?r.red:r.blue,b:r.redKey===m.b?r.red:r.blue,endReason:r.endReason});if(r.endReason==='timeout_hp_pct_tiebreak')m.timeoutTiebreaks++;if(r.endReason==='double_ko')m.doubleKOs++;if(r.endReason==='elimination')m.eliminations++;if(r.winnerKey===m.a)m.aWins++;else if(r.winnerKey===m.b)m.bWins++;else m.draws++;
  }
  Object.values(classes).forEach(c=>{c.avgDuration=c.games?c.duration/c.games:0;});
  const classRows=Object.keys(classes).map(k=>summarizeClassRow(k,classes[k],results.length,matchups)).sort((a,b)=>b.balanceScore-a.balanceScore);
  const matchupRows=Object.values(matchups).map(m=>{
   const decisive=m.games-m.draws,aRate=decisive?m.aWins/decisive:0,bRate=decisive?m.bWins/decisive:0;
   const leader=aRate>=bRate?m.a:m.b,leaderRate=Math.max(aRate,bRate);
   const sums=m.summaries||[];return{matchup:`${m.a} vs ${m.b}`,a:m.a,b:m.b,games:m.games,decisiveGames:decisive,aWins:m.aWins,bWins:m.bWins,draws:m.draws,timeoutTiebreaks:m.timeoutTiebreaks,doubleKOs:m.doubleKOs,drawRate:+(m.games?m.draws/m.games:0).toFixed(4),aWinRate:+aRate.toFixed(4),bWinRate:+bRate.toFixed(4),leader,leaderWinRate:+leaderRate.toFixed(4),avgDuration:+(m.games?m.duration/m.games:0).toFixed(2),hardCounter:leaderRate>=0.75?`${leader} at ${Math.round(leaderRate*100)}% decisive WR`:null,impossibleMatch:decisive>=6&&leaderRate>=0.90,a_avgDmgDealt:+mean(sums.map(s=>s.a?.dmgDealt)).toFixed(2),b_avgDmgDealt:+mean(sums.map(s=>s.b?.dmgDealt)).toFixed(2),a_avgAbilityDmgPct:+mean(sums.map(s=>s.a?.abilityDmgPct)).toFixed(4),b_avgAbilityDmgPct:+mean(sums.map(s=>s.b?.abilityDmgPct)).toFixed(4),a_avgPassiveDmgPct:+mean(sums.map(s=>s.a?.passiveDmgPct)).toFixed(4),b_avgPassiveDmgPct:+mean(sums.map(s=>s.b?.passiveDmgPct)).toFixed(4),a_avgProjectileDmgPct:+mean(sums.map(s=>s.a?.projectileDmgPct)).toFixed(4),b_avgProjectileDmgPct:+mean(sums.map(s=>s.b?.projectileDmgPct)).toFixed(4),a_projectileHitRate:+mean(sums.map(s=>s.a?.projectileHitRate)).toFixed(4),b_projectileHitRate:+mean(sums.map(s=>s.b?.projectileHitRate)).toFixed(4),a_meleeHitRate:+mean(sums.map(s=>s.a?.meleeHitRate)).toFixed(4),b_meleeHitRate:+mean(sums.map(s=>s.b?.meleeHitRate)).toFixed(4),a_reachUtilizationRatio:+mean(sums.map(s=>s.a?.avgReachStatAtAttempt>0?s.a.avgMeleeAttemptDistance/s.a.avgReachStatAtAttempt:0)).toFixed(4),b_reachUtilizationRatio:+mean(sums.map(s=>s.b?.avgReachStatAtAttempt>0?s.b.avgMeleeAttemptDistance/s.b.avgReachStatAtAttempt:0)).toFixed(4),eliminationRate:+(m.games?m.eliminations/m.games:0).toFixed(4)};
  }).sort((a,b)=>Math.max(b.aWinRate,b.bWinRate)-Math.max(a.aWinRate,a.bWinRate));
  return{generatedAt:new Date().toISOString(),options,elapsedMs,completedPlanned,matchCount:results.length,classes:classRows,hardMatchups:matchupRows.filter(m=>m.hardCounter),matchups:matchupRows,results};
 }
 function download(name,mime,text){
  const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function toCsv(report){
  const lines=['key,label,role,action,magnitude,balanceScore,totalAdjustmentPct,statAdjustments,patchTarget,confidence,games,wins,losses,draws,winPct,decisiveWinRate,drawRate,avgDuration,avgEndHp,avgHpMargin,avgWinHp,avgLossOpponentHp,hardCounters,dominantMatchups,worstMatchup,bestMatchup,suggestions,avgDmgDealt,avgBaseDmgPct,avgAbilityDmgPct,avgPassiveDmgPct,avgDotDmgPct,avgProjectileDmgPct,avgAbilityUsesPerSec,avgAbilityHitRate,avgPassiveTriggersPerSec,avgProjectilesFiredPerMatch,avgProjectileHitRate,avgProjectileDmgPerHit,avgRotationPeak,avgRotationAvg,avgRotationFirstHitSpeed,eliminationWinRate,tiebreakWinRate,avgMeleeHitRate,avgMeleeAttemptDistance,avgReachStatAtAttempt,reachUtilizationRatio,meleeHitboxAction,abilityAction,passiveAction,projectileAction'];
  for(const r of report.classes)lines.push([r.key,r.label,r.role,r.action,r.magnitude,r.balanceScore,r.totalAdjustmentPct,`"${r.statAdjustments.replace(/"/g,'""')}"`,`"${r.patchTarget.replace(/"/g,'""')}"`,r.confidence,r.games,r.wins,r.losses,r.draws,r.winPct,r.decisiveWinRate,r.drawRate,r.avgDuration,r.avgEndHp,r.avgHpMargin,r.avgWinHp,r.avgLossOpponentHp,r.hardCounters,r.dominantMatchups,`"${r.worstMatchup.replace(/"/g,'""')}"`,`"${r.bestMatchup.replace(/"/g,'""')}"`,`"${r.suggestions.join(' | ').replace(/"/g,'""')}"`,r.avgDmgDealt,r.avgBaseDmgPct,r.avgAbilityDmgPct,r.avgPassiveDmgPct,r.avgDotDmgPct,r.avgProjectileDmgPct,r.avgAbilityUsesPerSec,r.avgAbilityHitRate,r.avgPassiveTriggersPerSec,r.avgProjectilesFiredPerMatch,r.avgProjectileHitRate,r.avgProjectileDmgPerHit,r.avgRotationPeak,r.avgRotationAvg,r.avgRotationFirstHitSpeed,r.eliminationWinRate,r.tiebreakWinRate,r.avgMeleeHitRate,r.avgMeleeAttemptDistance,r.avgReachStatAtAttempt,r.reachUtilizationRatio,r.meleeHitboxAction,r.abilityAction,r.passiveAction,r.projectileAction].join(','));
  return lines.join('\n');
 }
 function toMatchupCsv(report){
  const lines=['matchup,a,b,games,decisiveGames,aWins,bWins,draws,timeoutTiebreaks,doubleKOs,drawRate,aWinRate,bWinRate,leader,leaderWinRate,avgDuration,hardCounter,impossibleMatch,a_avgDmgDealt,b_avgDmgDealt,a_avgAbilityDmgPct,b_avgAbilityDmgPct,a_avgPassiveDmgPct,b_avgPassiveDmgPct,a_avgProjectileDmgPct,b_avgProjectileDmgPct,a_projectileHitRate,b_projectileHitRate,a_meleeHitRate,b_meleeHitRate,a_reachUtilizationRatio,b_reachUtilizationRatio,eliminationRate'];
  for(const m of report.matchups)lines.push([`"${m.matchup.replace(/"/g,'""')}"`,m.a,m.b,m.games,m.decisiveGames,m.aWins,m.bWins,m.draws,m.timeoutTiebreaks,m.doubleKOs,m.drawRate,m.aWinRate,m.bWinRate,m.leader,m.leaderWinRate,m.avgDuration,`"${(m.hardCounter||'').replace(/"/g,'""')}"`,m.impossibleMatch,m.a_avgDmgDealt,m.b_avgDmgDealt,m.a_avgAbilityDmgPct,m.b_avgAbilityDmgPct,m.a_avgPassiveDmgPct,m.b_avgPassiveDmgPct,m.a_avgProjectileDmgPct,m.b_avgProjectileDmgPct,m.a_projectileHitRate,m.b_projectileHitRate,m.a_meleeHitRate,m.b_meleeHitRate,m.a_reachUtilizationRatio,m.b_reachUtilizationRatio,m.eliminationRate].join(','));
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
 function buildBalancedTargetMatches(keys,targetMatches,includeMirrors){
  const planned=[];
  if(targetMatches<=0)return planned;
  if(includeMirrors&&keys.length===1){
   for(let i=0;i<targetMatches;i++)planned.push([keys[0],keys[0],i]);
   return planned;
  }
  const rotating=keys.slice();
  if(rotating.length<2)return planned;
  if(rotating.length%2)rotating.push(null);
  const n=rotating.length;
  let round=0;
  while(planned.length<targetMatches){
   for(let i=0;i<n/2&&planned.length<targetMatches;i++){
    const a=rotating[i],b=rotating[n-1-i];
    if(a===null||b===null)continue;
    planned.push((round+i)%2?[b,a,round]:[a,b,round]);
   }
   if(includeMirrors){
    const mirrorKey=keys[round%keys.length];
    if(planned.length<targetMatches)planned.push([mirrorKey,mirrorKey,round]);
   }
   rotating.splice(1,0,rotating.pop());
   round++;
  }
  return planned;
 }
 function buildPlannedMatches(keys,options){
  if(options.targetMatches>0)return buildBalancedTargetMatches(keys,options.targetMatches,options.includeMirrors);
  const pairs=buildRoundRobinPairs(keys,options.includeMirrors);
  const planned=[];
  for(let r=0;r<options.roundsPerPair;r++){
   for(const p of pairs){
    planned.push([p[0],p[1],r]);
    if(p[0]!==p[1])planned.push([p[1],p[0],r]);
   }
  }
  return planned;
 }
 window.runBalanceBaseline=async function(userOptions={}){
  const options=Object.assign({},DEFAULTS,userOptions);
  const maxHpInRoster=Math.max(...Object.keys(DEF).map(k=>DEF[k].hp||0));
  options._stallDamagePerSecond=maxHpInRoster/options.stallRampSecondsToKill;
  const keys=options.keys||Object.keys(DEF);
  if(options.targetGamesPerClass>0&&!userOptions.targetMatches)options.targetMatches=Math.ceil(keys.length*options.targetGamesPerClass/2);
  const planned=buildPlannedMatches(keys,options);
  const deadline=performance.now()+options.minutes*60*1000,results=[],started=performance.now();let count=0;
  const originalRandom=Math.random,originalNoVisuals=window._balanceNoVisuals;
  const restoreBalanceTimeoutTracker=installBalanceTimeoutTracker();
  const restoreCombatTrackerHooks=installCombatTrackerHooks();
  window._balanceNoVisuals=options.noVisuals!==false;
  try{
   for(const [redKey,blueKey,round] of planned){
    if(performance.now()>deadline)break;
    const seed=matchupSeed(options.seed,redKey,blueKey,round),rng=mulberry32(seed);Math.random=rng;
    resetArenaForBalance(redKey,blueKey,rng);
    const tracker=window.CombatTracker?new window.CombatTracker(redKey,blueKey):null;
    window._balanceCombatTracker=tracker;
    let t=0,winner=null,endReason='elimination';
    while(t<options.maxMatchSeconds){
     stepBalance(options.dt,t,options);t+=options.dt;
     const living=livingPrimaryFactions();
     if(living.factions.length<2&&spheres.length>=2){winner=resolveWinnerFromLivingFactions(living.alive,living.factions);endReason=winner?'elimination':'double_ko';break;}
    }
    if(!winner&&t>=options.maxMatchSeconds){
     const timeoutResult=resolveTimeoutWinner();
     winner=timeoutResult.winner;endReason=timeoutResult.reason;
    }
    const red=primaryForFaction(0),blue=primaryForFaction(1);
    if(tracker)tracker.onMatchEnd(+t.toFixed(2));
    const combatSummary=tracker?tracker.getSummary():{red:null,blue:null};
    results.push({redKey,blueKey,winnerKey:winner?winner.key:null,winnerFaction:winner?winner.faction:null,duration:+t.toFixed(2),seed,redHp:red?+Math.max(0,red.hp).toFixed(2):0,blueHp:blue?+Math.max(0,blue.hp).toFixed(2):0,endReason,timeoutWinner:endReason&&endReason.startsWith('timeout_')?(winner?winner.key:null):null,draw:!winner,red:combatSummary.red,blue:combatSummary.blue});
    window._balanceCombatTracker=null;
    count++;
    if(count%options.chunkSize===0){
     const message=`${count}/${planned.length} matches`;
     console.log(`[balance] ${message} complete`);
     if(typeof options.progress==='function')options.progress({count,total:planned.length,message});
     await new Promise(r=>setTimeout(r,0));
    }
   }
  }finally{Math.random=originalRandom;window._balanceNoVisuals=originalNoVisuals;window._balanceCombatTracker=null;window._balanceDamageSource=null;window._balanceCurrentAbilityKey=null;restoreCombatTrackerHooks();restoreBalanceTimeoutTracker();paused=false;}
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
  minutes:240,
  roundsPerPair:1,
  dt:1/20,
  targetMatches:50000,
  chunkSize:100,
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
