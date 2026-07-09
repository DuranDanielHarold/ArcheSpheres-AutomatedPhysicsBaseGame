'use strict';
// Per-match combat event accumulator for balance-runner instrumentation.
class CombatTracker{
 constructor(redKey,blueKey){
  this.redKey=redKey;this.blueKey=blueKey;
  this._dmg={red:{base:0,ability:0,passive:0,dot:0,projectile:0},blue:{base:0,ability:0,passive:0,dot:0,projectile:0}};
  this._ability={red:{uses:0,hits:0},blue:{uses:0,hits:0}};
  this._passive={red:{triggers:0,dmg:0},blue:{triggers:0,dmg:0}};
  this._proj={red:{fired:0,hits:0,dmg:0},blue:{fired:0,hits:0,dmg:0}};
  this._rotation={red:{peak:0,sum:0,count:0,firstHitSpeed:null},blue:{peak:0,sum:0,count:0,firstHitSpeed:null}};
  this._melee={red:{attempts:0,hits:0,distSum:0,reachSum:0},blue:{attempts:0,hits:0,distSum:0,reachSum:0}};
  this._matchDuration=0;
 }
 _side(key){return key===this.redKey?'red':'blue';}
 onDamage(attackerKey,damage,type='base'){
  if(!attackerKey||!isFinite(damage)||damage<=0)return;
  const side=this._side(attackerKey),d=this._dmg[side];
  d[type]=(d[type]||0)+damage;
 }
 onAbilityUse(userKey,hit=false){if(!userKey)return;const a=this._ability[this._side(userKey)];a.uses++;if(hit)a.hits++;}
 onPassiveTrigger(userKey,damageIfAny=0){if(!userKey)return;const p=this._passive[this._side(userKey)];p.triggers++;p.dmg+=isFinite(damageIfAny)?damageIfAny:0;if(damageIfAny>0)this.onDamage(userKey,damageIfAny,'passive');}
 onProjectileFire(shooterKey){if(!shooterKey)return;this._proj[this._side(shooterKey)].fired++;}
 onProjectileHit(shooterKey,damage){if(!shooterKey||!isFinite(damage)||damage<=0)return;const p=this._proj[this._side(shooterKey)];p.hits++;p.dmg+=damage;this.onDamage(shooterKey,damage,'projectile');}
 onProjectileMiss(){}
 onRotationUpdate(fighterKey,speed,isHitTick=false){if(!fighterKey||!isFinite(speed))return;const r=this._rotation[this._side(fighterKey)];if(speed>r.peak)r.peak=speed;r.sum+=speed;r.count++;if(isHitTick&&r.firstHitSpeed===null)r.firstHitSpeed=speed;}
 onMeleeAttempt(attackerKey,distanceAtAttempt,reachStatValue,hit){if(!attackerKey)return;const m=this._melee[this._side(attackerKey)];m.attempts++;if(hit)m.hits++;m.distSum+=isFinite(distanceAtAttempt)?distanceAtAttempt:0;m.reachSum+=isFinite(reachStatValue)?reachStatValue:0;}
 onMatchEnd(duration){this._matchDuration=duration;}
 getSummary(){
  const safeDiv=(a,b)=>b>0?+(a/b).toFixed(4):0;
  const sideSummary=side=>{const d=this._dmg[side],total=d.base+d.ability+d.passive+d.dot+d.projectile,dur=this._matchDuration||1,r=this._rotation[side],a=this._ability[side],p=this._passive[side],pr=this._proj[side],m=this._melee[side];return{
   dmgDealt:+total.toFixed(2),baseDmgPct:safeDiv(d.base,total),abilityDmgPct:safeDiv(d.ability,total),passiveDmgPct:safeDiv(d.passive,total),dotDmgPct:safeDiv(d.dot,total),projectileDmgPct:safeDiv(d.projectile,total),
   abilityUses:a.uses,abilityHits:a.hits,abilityHitRate:safeDiv(a.hits,a.uses),abilityUsesPerSec:safeDiv(a.uses,dur),
   passiveTriggers:p.triggers,passiveTriggersPerSec:safeDiv(p.triggers,dur),passiveDmg:+p.dmg.toFixed(2),
   projectilesFired:pr.fired,projectilesHit:pr.hits,projectileHitRate:safeDiv(pr.hits,pr.fired),projectileDmgTotal:+pr.dmg.toFixed(2),avgProjectileDmgPerHit:pr.hits>0?+(pr.dmg/pr.hits).toFixed(2):0,
   meleeAttempts:m.attempts,meleeHits:m.hits,meleeHitRate:safeDiv(m.hits,m.attempts),avgMeleeAttemptDistance:m.attempts>0?+(m.distSum/m.attempts).toFixed(4):0,avgReachStatAtAttempt:m.attempts>0?+(m.reachSum/m.attempts).toFixed(4):0,
   rotationPeak:+r.peak.toFixed(4),rotationAvg:r.count>0?+(r.sum/r.count).toFixed(4):0,rotationFirstHitSpeed:r.firstHitSpeed!==null?+r.firstHitSpeed.toFixed(4):null};};
  return{red:sideSummary('red'),blue:sideSummary('blue'),duration:this._matchDuration};
 }
}
window.CombatTracker=CombatTracker;
