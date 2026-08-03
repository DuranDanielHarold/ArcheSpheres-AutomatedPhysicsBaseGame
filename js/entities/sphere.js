'use strict';
// ▓▓▓ MODULE: entities/sphere.js — extracted from former js/entities.js ▓▓▓
// Main Sphere class and class-specific behavior methods.

class Sphere{
 constructor(key,faction,x,y,vx,vy,hpOverride,opts){
  if(hpOverride&&typeof hpOverride==='object'){opts=hpOverride;hpOverride=opts.hpOverride;}
  opts=opts||{};
  const d=DEF[key];
  this.key=key;this.d=Object.assign({},d);this.faction=faction;
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.targetSpd=Math.hypot(vx,vy);
  this.baseSpd=this.targetSpd;
  this.angle=Math.random()*Math.PI*2;
  const base=Math.min(W,H);
  this.radius=base*(d.mass>=20?0.115:d.mass>=12?0.105:d.mass>=8?0.095:0.085);
  this.mass=d.mass;
  const hp=hpOverride||d.hp;
  this.hp=hp;this.maxHp=hp;
  this.hpBarDisplayHp=hp;this.hpBarLastHp=hp;
  this.hpBarDamageGhostHp=hp;this.hpBarDamageHoldT=0;this.hpBarDamageAlpha=0;
  this.hpBarHealTargetHp=hp;this.hpBarHealHoldT=0;this.hpBarHealAlpha=0;
  this.hpBarLastUpdate=performance.now();
  this.alive=true;this.dying=false;this.dyingT=0;this.hitFlash=0;
  this.isReplica=!!opts.isReplica;
  this.replicaKind=opts.replicaKind||null;
  this.replicaOwner=opts.replicaOwner||null;
  this.canTriggerTraits=opts.canTriggerTraits===false?false:!this.isReplica;
  this.impactVx=0;this.impactVy=0;this.impactDecay=0;
  this._hitDefenders=new Map();
  this.stacks=0;this.dmgMult=1;
  this.invincible=false;this.invincibleT=0;
  this.phaseInvincible=false;
  this.preinvincibleDmgMult=undefined;
  this.spiralActive=false;this.spiralT=0;this.spiralAngle=0;
  this.ramActive=false;this.ramT=0;
  this.orbitActive=false;this.orbitT=0;this.orbitAngle=0;this.orbitTarget=null;
  this.blinking=false;
  this.backstabCharged=false;this.backstabT=0;
  this.phaseOut=false;this.phaseOutT=0;
  this.slowFieldActive=false;this.slowFieldT=0;
  this.templarAnchor=0;
  this.snareActive=false;this.snareT=0;
  this.spreadActive=false;
  this.phalanxActive=false;this.phalanxT=0;
  this.guardianSanctuaryTimer=0;
  this.fortified=false;this.golemFortifyT=0;
  this.golemFortifyActive=false;
  this.rebirthDone=false;
  this.phoenixEmber=0;this.phoenixEmberFlash=0;this.ashwingActive=false;this.ashwingT=0;
  this.deathMarkTicks=0;this.deathMarkTimer=0;this.deathMarkDmg=0;this.deathMarkDoTHits=0;
  this.woundT=0;
  this.pulseTimer=0;this.pulseWave=null;
  this.warlordSpinT=0; // spin window after earthquake
  this.rageDecayT=0;
  this.vikingRageSpinActive=false;this.vikingRageSpinT=0;
  this.vikingLastStandActive=false;this.vikingLastStandT=0;this.vikingLastStandUsed=false;
  this.jesterLurchT=0;
  this.thornAoeTimer=0; // passive whip AoE sweep cooldown
  this.draining=false;
  this.pirateRegenTimer=0; // vampiric aura passive regen tick
  this.grapplingHook=null;
  this.wrathActive=false;this.wrathT=0;
  this.wrathExhausted=false;this.wrathExhaustT=0;
  this.wrathAuraTimer=0;
  this.critChance=0;
  this.lastShotWasCrit=false;
  this.wizardHpThreshold=90;
  this.wizardDmgBonusTotal=0;
  this.wizardStaffPower=0;
  this.kiteCD=0;
  this.rodType=Math.floor(Math.random()*5);
  this.rodActive=false; // rod effect window active
  this.rodT=0;
  this.electrified=false;this.electrifiedT=0;  // lightning: -1 dmg per hit for 1s
  this.burning=false;this.burnT=0;this.burnTickT=0;this.burnTickInterval=DEFAULT_BURN_TICK_INTERVAL; // fire: 3 true dmg ticks over 3s
  this.blinded=false;this.blindT=0;                 // green vial: 30% miss chance on attacks
  this.waterSlow=0;this.waterSlowT=0;          // water: slow stacking up to 2 in 2s
  this.stunned=false;this.stunnedT=0;          // earth: 0.3s freeze
  this.shotCD=0.2+Math.random()*0.3;
  this.drawCharge=0;
  this.volleyDmgBonus=0;
  this.abTimer=Math.random()*1.5;
  this.omegaCur=d.om*(faction===0?1:-1);
  this.rotationSpeed=0;
  this.maxRotationSpeed=10.0;
  this.weaponHitCD=0;
  this.hitBuffStacks=0;      // increments on each successful hit
  this.lowHpBuffApplied=false;
  this.sheriffHitCount=0;
  this.sheriffReloading=false;this.sheriffReloadT=0;this.sheriffReloadDuration=0.75;
  this.sheriffCylinder=6;    // shots remaining in cylinder
  this.cylinderRot=0;        // visual cylinder rotation
  this.bolaRootT=0;
  this.bolaFloating=false;
  this.bolaSlowT=0;
  this.sheriffSwitching=false;this.sheriffSwitchT=0; // buckshot swap animation
  this.sheriffPiercingTimer=0;
  this.sheriffPiercingTarget=null;
  this._sheriffArmPen=false;
  this.priestShieldStacks=0;  // 0-10, each stack = 2 HP absorption
  this.priestShieldT=0;
  this.benedictionActive=false;this.benedictionT=0; // dmg buff window
  this.blessDmgT=0;
  this.blessDmgAdded=0;
  this.pyreActive=false;this.pyreT=0;this.pyreAuraTimer=0;this.pyreArmBonus=0;
  this.heatTrails=[];this.heatTrailTimer=0;
  // Vampire state
  this.ghostMode=false;this.untargetable=false;this.swarmT=0;
  this.batTickT=0;
  this.sanguineLeechCD=0;
  // Monk state
  this.nirvanaActive=false;this.nirvanaT=0;
  // Alchemist state
  this.corrosionStacks=0;this.corrosionT=0;this.baseArm=d.arm;
  this.flaskCD=0;
  // Dragoon state
  this.magicShield=true;this.shieldTimer=0;  // Wyrmscale passive
  this.isLeaping=false;this.leapT=0;          // Wyrm's Descent ability
  this.leapTargetX=0;this.leapTargetY=0;      // where we'll land
  this.drawScale=1.0;                          // visual scale during leap
  this.justLanded=false;this.justLandedT=0;   // brief impact flash
  // Knight — Stalwart: per-hit stat buff, max 30 stacks
  this.stalwartStacks=0;
  // Samurai — Iaijutsu: 2× dmg bonus on first hit after spin-direction reversal (cd 3s)
  this.iaijutsuReady=false;this.iaijutsuCD=0;this.lastOmegaSign=Math.sign(d.om)*(faction===0?1:-1);
  // Barbarian — Bloodlust: +6 speed per hit landed (max +60), resets on taking a hit
  this.bloodlustBonus=0;
  // Ninja — Shadow Step: wall bounce fires shuriken at enemy + brief untargetable (3s CD)
  this.shadowStepCD=0;this.shadowStepActive=false;this.shadowStepT=0;
  // Berserker — Iron Will: below 40% HP, ignore knockback for 0.8s (6s CD)
  this.ironWillActive=false;this.ironWillT=0;this.ironWillCD=0;
  this.tricksterMirrorSpawned=this.isReplica;
  // Rogue — Hemorrhage: hits apply bleed DoT, up to 3 stacks, 1.5s each
  this.bleedStacks=0;this.bleedT=0;this.bleedTickT=0;
  // Bard state
  this.crescendoActive=false;this.crescendoT=0;
  this.noiseTrapCD=0;
  this.dissonantT=0;       // spin recovery suppressor after NoiseTrap hit
  this.discordFireRateT=0; // ranged fire rate penalty from NoiseTrap
  // Plague Doctor state
  this.virulenceStacks=0;this.virulenceWallHitCD=0;
  this.plagueSepsisTarget=null;this.plagueSepsisCount=0;
  this.sepsisWeakenedT=0;this.sepsisDotTicks=0;this.sepsisDotTimer=0;this.sepsisDotDmg=0;
  // Tidecaller state
  this.riptideCharged=false;
  // Crusader state
  this.holyChargeActive=false;this.holyChargeT=0;this.holyChargeElapsed=0;this.holyChargeCD=0;this.holyChargeCollisionCD=0;
  this.retributionCounter=0;
  // Mimic state
  this.perfectCopyActive=false;this.perfectCopyT=0;
  this.mimicDmgStolen=0;
  // Stormbringer state
  this.staticCharge=0;this.thunderclapActive=false;this.thunderclapT=0;this.thunderclapCD=0;
  // Void Walker state
  this.singularityActive=false;this.singularityT=0;this.singularityX=0;this.singularityY=0;
  this.voidTearCount=0;
  // Whelpling state
  this.whelplingGrowth=0;this.whelplingGrowTimer=0;
  this.mouthOpenTimer=0;this.mouthOpenMode=0; // 0=idle, 1=bite snap, 2=firebreath
  this.whelplingFireCooldown=0;
  // New roster class state
  this.flagellantWoundTier=0;
  // Prince — Weapon Master / Royal Blood state
  this.princeWeaponMode=this.key==='prince'?'saber':null;
  this.princeModeDmgBonus=0;
  this.princeModeOmegaBonus=0;
  this.princeRoyalShield=0;this.princeRoyalShieldT=0;
  this.princeRoyalBulwarkT=0;this.princeRoyalBulwarkBonus=0;
  this.princeBowDraw=0;
  this.gravediggerWallContacts=0;
  this.exhumeSpinT=0;
  this.locksmithLocks=0;this.locksmithJamT=0;
  this.gnawedArmorStacks=0;this.gnawedArmorT=0;
  this.glassBleedT=0;this.glassBleedTickT=0;
  this.favor=0;this.crowdDouble=false;this.netRootT=0;this.netLockoutT=0;this.savedArm=null;this.ironStacks=0;this.sovereignArmBonus=0;this.sovereignDmgBonus=0;this.decreeT=0;this.queenDmgBonus=0;this.queenGambitT=0;this.queenGambitSavedDef=null;this.queenInvisible=false;this.queenInvisibleT=0;this.rushT=0;this.rushElapsed=0;this.wishClone=null;this.wishFireRateT=0;this.dustDropT=0;this.packHuntT=0;this.knowledge=0;this.foresightT=0;this.overloadActive=false;this.overloadT=0;this.arcaneCharge=0;this.hexBurstActive=false;this.hexBurstFired=false;this.hexBurstFiredT=0;this.abilityAimT=0;this.abilityAimAngle=null;
 }
 _nearestEnemy(){
  let nearest=null,nearDist=Infinity;
  for(const s of spheres){
   if(s===this||!s.alive||s.dying||sameFaction(this,s))continue;
   const d=Math.hypot(s.x-this.x,s.y-this.y);
   if(d<nearDist){nearDist=d;nearest=s;}
  }
  return nearest?{enemy:nearest,dist:nearDist}:null;
 }
 _aimAbilityAtNearestEnemy(duration=0.3){
  const target=this._nearestEnemy();
  if(!target)return false;
  const dx=target.enemy.x-this.x,dy=target.enemy.y-this.y;
  this.abilityAimAngle=Math.atan2(dy,dx);
  this.abilityAimT=duration;
  this.angle=this.abilityAimAngle;
  return true;
 }
 _removePrinceModeBonuses(){
  if(this.key!=='prince')return;
  if((this.princeModeDmgBonus||0)!==0){this.d=Object.assign({},this.d);this.d.dmg-=this.princeModeDmgBonus;this.princeModeDmgBonus=0;}
  if((this.princeModeOmegaBonus||0)!==0){const sign=Math.sign(this.omegaCur)||1;this.omegaCur=Math.max(0,Math.abs(this.omegaCur)-this.princeModeOmegaBonus)*sign;this.princeModeOmegaBonus=0;}
 }
 _applyPrinceModeBonuses(){
  if(this.key!=='prince'||this.princeRoyalShield<=0||this.princeRoyalShieldT<=0)return;
  if(this.princeWeaponMode==='saber'){
   this.d=Object.assign({},this.d);this.d.dmg+=2;this.princeModeDmgBonus=2;
   const bonus=Math.max(0.6,DEF.prince.om*0.18);const sign=Math.sign(this.omegaCur)||1;
   this.omegaCur=(Math.abs(this.omegaCur)+bonus)*sign;this.princeModeOmegaBonus=bonus;
  }
 }
 _setPrinceWeaponMode(mode){
  if(this.key!=='prince'||this.princeWeaponMode===mode)return;
  this._removePrinceModeBonuses();
  this.princeWeaponMode=mode;
  this.d=Object.assign({},this.d);
  if(mode==='bow'){
   this.d.weapon='Silver Wood Bow';this.d.wt='longbow';this.d.reach=3.2;this.d.tipR=0.12;
  } else {
   this.d.weapon='Dueling Sabre';this.d.wt='duelingsabre';this.d.reach=DEF.prince.reach;this.d.tipR=DEF.prince.tipR;
  }
  this._applyPrinceModeBonuses();
  spawnSpark(this.x,this.y,mode==='bow'?'#e6f0ff':'#8bb7ff',5);
 }
 _updatePrinceWeaponMaster(dt){
  if(this.key!=='prince')return;
  const target=this._nearestEnemy();
  const saberReach=this.radius*DEF.prince.reach+(target?target.enemy.radius:0)+this.radius*.3;
  this._setPrinceWeaponMode(target&&target.dist<=saberReach?'saber':'bow');
  if(this.princeRoyalBulwarkT>0){
   this.princeRoyalBulwarkT-=dt;
   if(this.princeRoyalBulwarkT<=0&&this.princeRoyalBulwarkBonus>0){
    this.d=Object.assign({},this.d);this.d.arm-=this.princeRoyalBulwarkBonus;this.d.magDef-=this.princeRoyalBulwarkBonus;this.princeRoyalBulwarkBonus=0;
   }
  }
  if(this.princeRoyalShieldT>0){
   this.princeRoyalShieldT-=dt;
   if(this.princeRoyalShieldT<=0||this.princeRoyalShield<=0){
    this.princeRoyalShield=0;this.princeRoyalShieldT=0;this._removePrinceModeBonuses();
   }
  }
  if(this.princeWeaponMode==='bow'){
   const rate=this.princeRoyalShield>0&&this.princeRoyalShieldT>0?0.12:0.18;
   this.princeBowDraw=Math.min(1,(this.princeBowDraw||0)+dt/rate);
   this.drawCharge=this.princeBowDraw;
   if(this.shotCD<=0&&this.princeBowDraw>=1){
    this.princeBowDraw=0;this.drawCharge=0;this.shotCD=rate;
    this._firePrinceArrow();
   }
   this._applyKite(dt);
  } else {
   this.princeBowDraw=0;this.drawCharge=0;
  }
 }
 _startPrinceRoyalBlood(){
  this.stacks=0;
  this.princeRoyalShield=10;this.princeRoyalShieldT=6;
  this._removePrinceModeBonuses();this._applyPrinceModeBonuses();
  spawnBurst(this.x,this.y,'#e6f0ff','#1747b8',22);
  spawnPulse(this.x,this.y,'#8bb7ff');
  spawnDmgNum(this.x,this.y-this.radius*1.7,'ROYAL BLOOD','#e6f0ff');
 }
 _breakPrinceRoyalShield(){
  if(this.key!=='prince'||this.princeRoyalShieldT<=0)return;
  this.princeRoyalShield=0;this.princeRoyalShieldT=0;this._removePrinceModeBonuses();
  if(this.princeRoyalBulwarkBonus<=0){this.d=Object.assign({},this.d);this.d.arm+=30;this.d.magDef+=30;this.princeRoyalBulwarkBonus=30;}
  this.princeRoyalBulwarkT=3;
  spawnBurst(this.x,this.y,'#ffd35a','#1747b8',18);
  spawnDmgNum(this.x,this.y-this.radius*1.9,'BULWARK +30','#ffd35a');
 }
 _firePrinceArrow(){
  // Projectiles must honor the weapon's current facing. Do not auto-aim at enemies.
  const tip=this.getTip(),spd=520;
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const dmg=(this.d.dmg+2.5)*this.dmgMult;
  const arr=new Arrow(tip.x,tip.y,wx*spd,wy*spd,dmg,this);
  arr.col='#e6f0ff';projectiles.push(arr);
  spawnSpark(tip.x,tip.y,'#e6f0ff',5);
 }
 _fireSageWord(){
  // Sage words fire straight from the tome tip instead of snapping aim to a target.
  const tip=this.getTip(),spd=330;
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  projectiles.push(new RosterBolt(tip.x,tip.y,wx*spd,wy*spd,(this.d.dmg+8)*this.dmgMult,this,'word'));
  spawnSpark(tip.x,tip.y,'#d6f0b2',4);
 }
 _onWallBounce(){
  if(this.canTriggerTraits===false)return;
  if(this.key==='gravedigger'){
   this.gravediggerWallContacts=(this.gravediggerWallContacts||0)+1;
   if(this.gravediggerWallContacts%6===0)this._buryMound();
  }
  if(this.key==='glassblower')this._dropGlassShard();
 }
 _buryMound(){
  const r=this.radius*1.35;
  const overlaps=noiseTraps.some(n=>n instanceof BurialMound&&n.alive&&Math.hypot(n.x-this.x,n.y-this.y)<n.r+r+2);
  if(overlaps)return;
  noiseTraps.push(new BurialMound(this.x,this.y,this));
  spawnSpark(this.x,this.y,'#a7834b',3);
 }
 _oldestBurialMound(){
  let found=null;
  for(const n of noiseTraps){
   if(n instanceof BurialMound&&n.owner===this&&n.alive&&(!found||n.seq<found.seq))found=n;
  }
  return found;
 }
 _dropGlassShard(x=this.x,y=this.y){
  if(noiseTraps.filter(n=>n instanceof GlassShard&&n.owner===this&&n.alive).length>=18)return;
  noiseTraps.push(new GlassShard(x,y,this));
  spawnSpark(x,y,'#82f4ff',3);
 }
 _spawnRatBurst(count,gnaw=false){
  for(let i=0;i<count;i++){
   const a=(i/count)*Math.PI*2+(Math.random()-.5)*0.25;
   const spd=(gnaw?150:110)+Math.random()*80;
   noiseTraps.push(new RatMinion(this.x+Math.cos(a)*this.radius*0.5,this.y+Math.sin(a)*this.radius*0.5,Math.cos(a)*spd,Math.sin(a)*spd,this,gnaw));
  }
 }
 _refreshGnawedArmor(){
  const base=DEF[this.key]?.arm??this.d.arm;
  this.d=Object.assign({},this.d);
  this.d.arm=Math.max(0,base-(this.gnawedArmorStacks||0)*6);
 }
 _flagellantApplyWounds(){
  if(this.key!=='flagellant')return;
  const lost=Math.max(0,this.maxHp-this.hp);
  const tier=Math.floor(lost/15);
  if(tier<=this.flagellantWoundTier)return;
  const diff=tier-this.flagellantWoundTier;
  this.flagellantWoundTier=tier;
  this.d=Object.assign({},this.d);
  this.d.dmg+=diff*0.8;this.d.om+=diff*0.4;
  this.omegaCur+=diff*0.4*Math.sign(this.omegaCur||1);
  spawnDmgNum(this.x,this.y-this.radius*1.6,`WOUNDS +${diff}`,'#d8b06a');
 }
 _flagellantSelfWound(dmg){
  this.hp=Math.max(0,this.hp-dmg);this.hitFlash=1;spawnBloodSplat(this.x,this.y,this.d.color,dmg);
  spawnDmgNum(this.x,this.y-this.radius*0.5,dmg,'#d8b06a');
  this._flagellantApplyWounds();
  if(this.hp<=0&&!this.dying){this.alive=false;this.dying=true;spawnBurst(this.x,this.y,this.d.rim,this.d.color,28);}
 }
 applyImpact(ivx,ivy){
  if(this.key==='berserker'&&this.ironWillActive)return; // Iron Will: ignore knockback
  if(this.key==='templar'){ivx*=0.5;ivy*=0.5;} // Immovable: halved collision KB
  if(this.key==='crusader'&&this.holyChargeActive)return; // Holy Charge: knockback immune
  this.impactVx+=ivx;this.impactVy+=ivy;this.impactDecay=2.2;
 }
 gainStack(){
  if(this.canTriggerTraits===false)return;
  if(this.key==='queen'&&this.queenInvisible)return; // no stack gain during Royal Invisibility
  if(this.key==='monk'&&this.nirvanaActive)return; // no stack gain during Nirvana
  const cap=getStackThreshold(this.key);
  if(this.key==='druid'){
   this.stacks=Math.min(cap,this.stacks+2);
  } else {
   this.stacks=Math.min(cap,this.stacks+1);
  }
  if(this.key==='viking')this.rageDecayT=0;
  if(window._balanceCombatTracker)window._balanceCombatTracker.onPassiveTrigger(this.key,0);
  if(window._liveCombatTracker)window._liveCombatTracker.onPassiveTrigger(this.key,0);
  this._checkAbilityTrigger();
 }
 _checkAbilityTrigger(){
  if(this.canTriggerTraits===false)return;
  const before=this.stacks,threshold=typeof getStackThreshold==='function'?getStackThreshold(this.key):0;
  const liveTracking=!!window._liveCombatTracker,prior=window._liveCurrentAbilityKey;
  if(liveTracking)window._liveCurrentAbilityKey=this.key;
  try{
  switch(this.key){
    case 'knight':
    if(this.stacks>=5){
     this.stacks=0;
     this.invincible=true;this.invincibleT=3.6;
     this.dmgMult=1.5; // offensive surge during the bubble
     spawnBurst(this.x,this.y,'#ffffff',this.d.rim,16);
    } break;
   case 'paladin':
    if(this.stacks>=5){
     this.stacks=0;
     this.wrathActive=true;this.wrathT=5.0;this.wrathAuraTimer=0;
     this.dmgMult=1.4;
     spawnBurst(this.x,this.y,'#f0c040','#fff',20);
     spawnPulse(this.x,this.y,'#f0c040');
    } break;
   case 'ninja':
    if(this.stacks>=5){
     this.stacks=0;
     this.blinking=true;
     const en5=(this._nearestEnemy()||{}).enemy;
     if(en5){
      const dx=en5.x-this.x,dy=en5.y-this.y,dist=Math.hypot(dx,dy)||1;
      let bx=en5.x+(dx/dist)*-(en5.radius+this.radius+8);
      let by=en5.y+(dy/dist)*-(en5.radius+this.radius+8);
      const margin=this.radius+20;
      bx=Math.max(margin,Math.min(W-margin,bx));
      by=Math.max(margin,Math.min(H-margin,by));
      const cornerR=24;
      if(bx<cornerR&&by<cornerR){bx=cornerR;by=cornerR;}
      else if(bx>W-cornerR&&by<cornerR){bx=W-cornerR;by=cornerR;}
      else if(bx<cornerR&&by>H-cornerR){bx=cornerR;by=H-cornerR;}
      else if(bx>W-cornerR&&by>H-cornerR){bx=W-cornerR;by=H-cornerR;}
      this.x=bx;this.y=by;
      spawnBurst(this.x,this.y,this.d.rim,'#ffffff',14);
     }
     setTimeout(()=>{this.blinking=false;},300);
    } break;
   case 'warlord':
    if(this.stacks>=5){
     this.stacks=0;
     const enW=(this._nearestEnemy()||{}).enemy;
     if(enW){
      const dx=enW.x-this.x,dy=enW.y-this.y,dist=Math.hypot(dx,dy)||1;
      enW.applyImpact((dx/dist)*320,(dy/dist)*320);
      enW.receiveDamage(18);
     }
     spawnBurst(this.x,this.y,this.d.rim,this.d.color,28);
     for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2;particles.push({x:this.x,y:this.y,vx:Math.cos(a)*220,vy:Math.sin(a)*220,life:1,maxL:.35,sz:5,col:this.d.rim,sq:false});}
     this.warlordSpinT=3.0; // spin window after earthquake
    } break;
   case 'wizard':
    if(this.stacks>=4){
     this.stacks=0;
     this.rodType=(this.rodType+1)%5;
     this.wizardStaffPower=(this.wizardStaffPower||0)+1;
     const staffPower=this.wizardStaffPower;
     this.rodActive=true;this.rodT=8.0+staffPower;
     const tip5=this.getTip();
     const ROD_COLORS=['#ffee00','#ff4400','#44aaff','#ffffff','#886633'];
     for(let i=0;i<3;i++){
      const a=(i/3)*Math.PI*2+this.angle;
      const bolt=new FlameBolt(tip5.x,tip5.y,Math.cos(a)*420,Math.sin(a)*420,(this.d.dmg+5+staffPower)*this.dmgMult,this);
      bolt.rodType=this.rodType;bolt.rodCol=ROD_COLORS[this.rodType];bolt.effectPower=staffPower;
      projectiles.push(bolt);
     }
     spawnBurst(this.x,this.y,ROD_COLORS[this.rodType],'#fff',14);
    } break;
   case 'viking':
    if(this.stacks>=4&&!this.vikingRageSpinActive){
     if(!this.vikingLastStandActive)this.stacks=0;
     this._startVikingRageSpin();
    }
    break;
   case 'berserker':
    if(this.stacks>=5){
     this.stacks=0;this.orbitActive=true;this.orbitT=2.5;
     this.dmgMult=1.1;
     const enB=(this._nearestEnemy()||{}).enemy;
     if(enB)this.orbitTarget=enB;
    } break;
    case 'samurai':
    if(this.stacks>=3){
     this.stacks=0;this.spiralActive=true;this.spiralT=1.2;
     this.spiralAngle=this.angle;
     const baseDmgRatio=DEF[this.key].dmg>0?this.d.dmg/DEF[this.key].dmg:1;
     this.dmgMult=Math.min(2.5,2.5/Math.max(1,baseDmgRatio));
    } break;
   case 'barbarian':
    if(this.stacks>=3){
     this.stacks=0;this.ramActive=true;this.ramT=0.7;
     const enRam=(this._nearestEnemy()||{}).enemy;
     if(enRam){
      const dx=enRam.x-this.x,dy=enRam.y-this.y,dist=Math.hypot(dx,dy)||1;
      this.vx=(dx/dist)*this.targetSpd*3.5;
      this.vy=(dy/dist)*this.targetSpd*3.5;
      this.targetSpd=this.baseSpd*3.5;
     }
     this.dmgMult=2.0;
    } break;
   case 'rogue':
    if(this.stacks>=3){
     this.stacks=0;this.backstabCharged=true;this.backstabT=3.0;
     this.omegaCur*=-1;
     this.dmgMult=3.0;
    } break;
   case 'templar':
    if(this.stacks>=3){
     this.stacks=0;this.slowFieldActive=true;this.slowFieldT=3.0;
     slowZones.push(new SlowZone(this.x,this.y,this.radius*2.5,3.0,this));
    } break;
   case 'druid':
    if(this.stacks>=3){
     this.stacks=0;this.snareActive=true;this.snareT=0;
     thornPatches.push(new ThornPatch(this.x,this.y,this.radius*2.2,7.0,this));
     spawnBurst(this.x,this.y,this.d.rim,'#1b5e20',10);
    } break;
   case 'necromancer':
    if(this.stacks>=3){
     this.stacks=0;
     const enNec=(this._nearestEnemy()||{}).enemy;
     if(enNec&&enNec.deathMarkTicks===0){enNec.deathMarkTicks=7;enNec.deathMarkTimer=0.18;enNec.deathMarkDmg=this.d.dmg*0.70+1;}
    } break;
    case 'trickster':
    if(this.stacks>=2){
     this.stacks=0;this.phaseOut=true;this.phaseOutT=0.9;
     this.preinvincibleDmgMult=this.dmgMult;
     this.invincible=true;this.invincibleT=0.5;this.phaseInvincible=true;
     const randAngle=(Math.random()-0.5)*Math.PI*0.8;
     const spd=Math.hypot(this.vx,this.vy)||this.targetSpd;
     const curA=Math.atan2(this.vy,this.vx)+Math.PI+randAngle;
     this.vx=Math.cos(curA)*spd*1.4;
     this.vy=Math.sin(curA)*spd*1.4;
    } break;
   case 'guardian':
    if(this.stacks>=2){
     this.stacks=0;this.phalanxActive=true;this.phalanxT=3.5;
     spawnBurst(this.x,this.y,'#80cbc4','#e0f7fa',14);
    }
    break;
    case 'viking':
    if(this.vikingRageSpinActive){
     this.omegaCur=(this.d.om+4.0)*Math.sign(this.omegaCur||1);
     this.dmgMult=1.6;
    }
    break;
   case 'ranger':
    if(this.stacks>=4){
     this.stacks=0;
     this.volleyActive=true;this.volleyBurstsLeft=3;
     this.volleyBurstTimer=0;
     this.volleyWindowT=10.0;
     this.volleyDmgBonus=2;
    }
    this.spreadActive=this.stacks>=4; break;
   case 'pirate':
    if(this.stacks>=3){
     this.stacks=0;
     this.pirateRegenTimer=0;
     this._fireGrapplingHook();
    }
    this.draining=this.stacks>=1; break;
   case 'jester':
    this.omegaCur=this.d.om*(1+1.5*(this.stacks/5))*Math.sign(this.omegaCur||1);
    if(this.stacks>=3){this.stacks=0;
     const chaosA=Math.random()*Math.PI*2;
     this.vx=Math.cos(chaosA)*this.targetSpd*2.2;
     this.vy=Math.sin(chaosA)*this.targetSpd*2.2;
     this.omegaCur*=-1;
     this.dmgMult=2.0;
     this.jesterLurchT=1.5;
    } break;
   case 'golem':
    if(this.stacks>=3){
     this.stacks=0;this.fortified=true;this.golemFortifyActive=true;this.golemFortifyT=4.0;
     this.dmgMult=1.4;
     spawnBurst(this.x,this.y,'#b0bec5','#607d8b',16);
    }
    break;
   case 'phoenix':
    if(this.stacks>=3){
     this.stacks=0;
     this.ashwingActive=true;this.ashwingT=2.2;
     this._phoenixAddEmber(40);
     this.targetSpd=this.baseSpd*1.18;
     this.omegaCur=this.d.om*1.35*Math.sign(this.omegaCur||1);
     spawnBurst(this.x,this.y,'#ffcc02','#ff4400',18);
     spawnPulse(this.x,this.y,'#ffcc02');
    } break;
   case 'inquisitor':
    if(this.stacks>=4){
     this.stacks=0;
     this.pyreActive=true;this.pyreT=4.0;this.pyreAuraTimer=0;
     this.pyreArmBonus=0;
     spawnBurst(this.x,this.y,'#ff6600','#ff2200',20);
     spawnPulse(this.x,this.y,'#ff4400');
    } break;
   case 'vampire':
    if(this.stacks>=6){
     this.stacks=0;
     this.ghostMode=true;
     this.untargetable=true;
     this.swarmT=2.5;
     this.batTickT=0.25;
     spawnBurst(this.x,this.y,'#cc0044','#1a0020',24);
     spawnPulse(this.x,this.y,'#880022');
    } break;
   case 'monk':
    if(this.stacks>=3){
     this.stacks=0;
     this.nirvanaActive=true;this.nirvanaT=2.0;
     this.omegaCur=this.d.om*2.5*Math.sign(this.omegaCur||1);
     this.dmgMult=0.18;
     spawnNirvanaActivate(this.x,this.y);
    } break;
   case 'alchemist':
    if(this.stacks>=3){
     this.stacks=0;
     const enAlch=(this._nearestEnemy()||{}).enemy;
     const atx=enAlch?enAlch.x:this.x+(this.faction===0?120:-120);
     const aty=enAlch?enAlch.y:this.y;
     const adx=atx-this.x,ady=aty-this.y,adist=Math.hypot(adx,ady)||1;
     const aspd=520;
     const vials=['purple','yellow','green'];
     const spreads=[-0.9,0,0.9];
     const yOffsets=[0.18,0,0.18]; // outer vials arc slightly higher
     for(let vi=0;vi<3;vi++){
      const ang=Math.atan2(ady,adx)+spreads[vi];
      projectiles.push(new AlchemyFlask(this.x,this.y,Math.cos(ang)*aspd,Math.sin(ang)*aspd-GRAVITY*(0.22+yOffsets[vi]),this,vials[vi]));
     }
     spawnBurst(this.x,this.y,'#cc44ff','#ffee22',10);
     spawnSpark(this.x,this.y,'#66ff88',8);
    } break;
   case 'bard':
    if(this.stacks>=3){
     this.stacks=0;
     this.crescendoActive=true;this.crescendoT=0.6;
     // Fire SonicProjectile along weapon tip angle — player aims by spinning
     const bTip=this.getTip();
     const bwx=Math.cos(this.angle),bwy=Math.sin(this.angle);
     projectiles.push(new SonicProjectile(bTip.x,bTip.y,bwx*480,bwy*480,(this.d.dmg+2)*2.2*this.dmgMult,this));
     spawnBurst(this.x,this.y,this.d.rim,'#e040fb',16);
     spawnPulse(this.x,this.y,'#e040fb');
    } break;
   case 'plague':
    if(this.stacks>=3){
     this.stacks=0;
     const enPlg=(this._nearestEnemy()||{}).enemy;
     if(enPlg){
      enPlg.virulenceStacks=Math.min(5,(enPlg.virulenceStacks||0)+2);
      enPlg.virulenceWallHitCD=0;
      spawnBurst(enPlg.x,enPlg.y,'#aadd44','#2a3a1a',14);
      spawnDmgNum(enPlg.x,enPlg.y-enPlg.radius*1.5,'VIRULENT!','#aadd44');
     }
    } break;
   case 'tidecaller':
    if(this.stacks>=3){
     this.stacks=0;
     this.riptideCharged=true;
     // Fire riptide bolt toward enemy
     const enTide=(this._nearestEnemy()||{}).enemy;
     if(enTide){
      const dtx=enTide.x-this.x,dty=enTide.y-this.y,dtd=Math.hypot(dtx,dty)||1;
      projectiles.push(new RiptideBolt(this.x,this.y,(dtx/dtd)*540,(dty/dtd)*540,this.d.dmg*2.0,this));
      spawnBurst(this.x,this.y,'#44ccff','#0066aa',16);
      spawnPulse(this.x,this.y,'#44ccff');
     }
    } break;
   case 'crusader':
    if(this.stacks>=3&&this.holyChargeCD<=0){
     this.stacks=0;
     this.holyChargeActive=true;this.holyChargeT=2.2;this.holyChargeElapsed=0;this.holyChargeCollisionCD=0;
     this.holyChargeCD=8.0;
     this.invincible=true;this.invincibleT=2.2;
     this.dmgMult=2.0;
     spawnBurst(this.x,this.y,'#fffacc','#c8b870',20);
     spawnPulse(this.x,this.y,'#fffacc');
    } break;
   case 'mimic':
    if(this.stacks>=3){
     this.stacks=0;
     const enMimic=(this._nearestEnemy()||{}).enemy;
     if(enMimic){
      this.perfectCopyActive=true;this.perfectCopyT=4.0;
      // Temporarily add enemy stats on top
      this._mimicBaseDmg=this.d.dmg;this._mimicBaseSpd=this.baseSpd;
      this.d=Object.assign({},this.d);
      this.d.dmg=Math.min(this.d.dmg+enMimic.d.dmg, this.d.dmg*2.5);
      const newSpd=Math.min(this.baseSpd+enMimic.d.spd,this.baseSpd*2.0);
      this.baseSpd=newSpd;this.targetSpd=newSpd;
      spawnBurst(this.x,this.y,'#cc88ff',enMimic.d.color,20);
      spawnDmgNum(this.x,this.y-this.radius*1.5,'PERFECT COPY!','#cc88ff');
     }
    } break;
   case 'stormbringer':
    if(this.stacks>=3&&this.thunderclapCD<=0){
     this.stacks=0;
     this.thunderclapActive=true;this.thunderclapT=0.8;
     this.thunderclapCD=6.0;
     this.invincible=true;this.invincibleT=0.8;
     // Shockwave all enemies
     for(const s of spheres){
      if(sameFaction(this,s)||!s.alive||s.dying)continue;
      const dsx=s.x-this.x,dsy=s.y-this.y,dsd=Math.hypot(dsx,dsy)||1;
      s.applyImpact((dsx/dsd)*380,(dsy/dsd)*380);
      s.receiveMagicDamage(this.d.dmg*2.5*this.dmgMult);
      spawnSpark(s.x,s.y,'#88ccff',8);
     }
     // Discharge static charge as bonus
     const dischargeDmg=this.staticCharge*0.8;
     if(dischargeDmg>0){
      for(const s of spheres){
       if(sameFaction(this,s)||!s.alive||s.dying)continue;
       s.hp=Math.max(0,s.hp-dischargeDmg);
       if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}
       spawnDmgNum(s.x,s.y-s.radius*1.5,dischargeDmg,'#88ccff');
      }
     }
     this.staticCharge=0;
     spawnBurst(this.x,this.y,'#88ccff','#ffffff',28);
     spawnPulse(this.x,this.y,'#88ccff');
    } break;
   case 'voidwalker':
    if(this.stacks>=3){
     this.stacks=0;
     this.singularityActive=true;this.singularityT=2.5;
     this.singularityX=this.x;this.singularityY=this.y;
     spawnBurst(this.x,this.y,'#aa44ff','#000000',24);
     spawnPulse(this.x,this.y,'#aa44ff');
    } break;
   case 'whelpling':
    if(this.stacks>=3&&!(this.whelplingFireCooldown>0)){
     this.stacks=0;
     this.whelplingFireCooldown=2.5; // block re-trigger for 2.5s
     // Open mouth wide for firebreath animation
     this.mouthOpenTimer=1.2;this.mouthOpenMode=2;
     // Firebreath zone ahead
     const fbTip=this.getTip();
     const fbAngle=this.angle;
     for(let fi=0;fi<3;fi++){
      const fa=fbAngle+(fi-1)*0.22;
      const fspd=200+fi*40;
      projectiles.push(new BreathFlame(fbTip.x,fbTip.y,Math.cos(fa)*fspd,Math.sin(fa)*fspd,this.d.dmg*0.4,this));
     }
     spawnBurst(this.x,this.y,'#ff6600','#ff2200',18);
    } break;
   case 'gravedigger':
    if(this.stacks>=4){
     const mound=this._oldestBurialMound();
     if(mound){
      this.stacks=0;
      this.x=Math.max(this.radius+6,Math.min(W-this.radius-6,mound.x));
      this.y=Math.max(this.radius+6,Math.min(H-this.radius-6,mound.y));
      this.invincible=true;this.invincibleT=0.6;
      this.exhumeSpinT=1.2;
      this.omegaCur=this.d.om*1.8*Math.sign(this.omegaCur||1);
      spawnBurst(this.x,this.y,'#a7834b','#3f3326',22);
      spawnPulse(this.x,this.y,'#a7834b');
     }
    } break;
   case 'flagellant':
    if(this.stacks>=3){
     this.stacks=0;
     this.invincible=true;this.invincibleT=1.5;
     this._flagellantSelfWound(10);
     for(const s of spheres){
      if(sameFaction(this,s)||!s.alive||s.dying)continue;
      const dx=s.x-this.x,dy=s.y-this.y,d=Math.hypot(dx,dy)||1;
      if(d<this.radius+s.radius+18){
       s.hp=Math.max(0,s.hp-10);s.hitFlash=1;
       s.applyImpact((dx/d)*180,(dy/d)*180);
       spawnDmgNum(s.x,s.y-s.radius*1.5,10,'#d8b06a');
       if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}
      }
     }
     spawnBurst(this.x,this.y,'#d8b06a','#4a1116',24);
     spawnPulse(this.x,this.y,'#d8b06a');
    } break;
   case 'ratcatcher':
    if(this.stacks>=3){
     this.stacks=0;this._spawnRatBurst(12,true);
     spawnBurst(this.x,this.y,'#b7c06a','#2f3520',18);
    } break;
   case 'locksmith':
    if(this.stacks>=3){
     this.stacks=0;
     const enLock=(this._nearestEnemy()||{}).enemy;
     if(enLock){
      const locks=enLock.locksmithLocks||0;
      enLock.stacks=Math.max(0,enLock.stacks-locks*0.25);
      if(locks>=2)enLock.locksmithJamT=Math.max(enLock.locksmithJamT||0,1.1);
      this.targetSpd=this.baseSpd*(1+locks*0.08);
      this.locksmithHasteT=0.35*locks;
      enLock.locksmithLocks=0;
      spawnDmgNum(enLock.x,enLock.y-enLock.radius*1.7,'UNLOCKED','#d0b45a');
      spawnBurst(this.x,this.y,'#d0b45a','#24313a',16);
     }
    } break;
   case 'glassblower':
    if(this.stacks>=4){
     this.stacks=0;
     const hitMap=new Map();
     for(const n of noiseTraps){
      if(n instanceof GlassShard&&n.owner===this&&n.alive){
       for(const s of spheres){
        if(sameFaction(this,s)||!s.alive||s.dying)continue;
        const before=n.alive;
        if(Math.hypot(s.x-n.x,s.y-n.y)<s.radius+n.r*3.0){
         n.detonate();
         if(before)hitMap.set(s,(hitMap.get(s)||0)+1);
         break;
        }
       }
       if(n.alive)n.detonate();
      }
     }
     for(const [target,hits] of hitMap){
      if(hits>=3){target.blinded=true;target.blindT=Math.max(target.blindT||0,1.2);target.omegaCur*=-1;target.vx+=(Math.random()-.5)*180;target.vy+=(Math.random()-.5)*180;spawnDmgNum(target.x,target.y-target.radius*1.8,'BLINDED','#82f4ff');}
     }
     spawnPulse(this.x,this.y,'#82f4ff');
    } break;
   case 'witch':
    if(this.stacks>=3){this.stacks=0;this._aimAbilityAtNearestEnemy(.38);this.hexBurstFired=true;this.hexBurstFiredT=.5;const tip=this.getTip();for(const off of[-.16,0,.16]){const a=this.angle+off;projectiles.push(new RosterBolt(tip.x,tip.y,Math.cos(a)*240,Math.sin(a)*240,(this.d.dmg+4)*this.dmgMult,this,'hex'));}spawnBurst(this.x,this.y,'#d77bff','#5b1f86',16);} break;
   case 'spartan':
    if(this.stacks>=3||this.ironStacks>=5){this.stacks=0;this.ironStacks=0;this._aimAbilityAtNearestEnemy(.32);this.ramActive=true;this.ramT=0.7;this.dmgMult=1;this.vx=Math.cos(this.angle)*this.baseSpd*3;this.vy=Math.sin(this.angle)*this.baseSpd*3;this.targetSpd=this.baseSpd*3;spawnBurst(this.x,this.y,'#d24634','#d8b060',18);} break;
   case 'gladiator':
    if(this.stacks>=3&&this.netLockoutT<=0){this.stacks=0;const en=(this._nearestEnemy()||{}).enemy;if(en){en.netRootT=0.8;en.savedArm=en.d.arm;en.d=Object.assign({},en.d);en.d.arm=en.savedArm*.3;this.dmgMult=1.8;this.netLockoutT=2.0;spawnDmgNum(en.x,en.y-en.radius*1.8,'NET','#f0c08a');}} break;
   case 'king':
    if(this.stacks>=4){this.stacks=0;this.decreeT=6;this.dmgMult=1.6;this.omegaCur=(this.d.om*1.5)*Math.sign(this.omegaCur||1);for(let i=0;i<3;i++){const a=i*Math.PI*2/3+Math.random()*.4;skeletons.push(new BarbAlly(this.x+Math.cos(a)*this.radius*1.4,this.y+Math.sin(a)*this.radius*1.4,this));}spawnBurst(this.x,this.y,'#ffd35a','#d00020',30);spawnPulse(this.x,this.y,'#ffd35a');} break;
   case 'queen':
    if(this.stacks>=4){
     this.stacks=0;this.queenGambitT=3;
     if(!this.queenGambitSavedDef){this.queenGambitSavedDef={arm:this.d.arm,magDef:this.d.magDef};this.d=Object.assign({},this.d);this.d.arm*=2/3;this.d.magDef*=2/3;}
     spawnDmgNum(this.x,this.y-this.radius*1.5,'GAMBIT','#ff8bd1');
     spawnBurst(this.x,this.y,'#ff8bd1','#b01872',22);
     spawnPulse(this.x,this.y,'#ff8bd1');
    } break;
   case 'prince':
    if(this.stacks>=4)this._startPrinceRoyalBlood(); break;
   case 'fairy':
    if(this.stacks>=4){this.stacks=0;this.wishFireRateT=2.6;const roll=Math.floor(Math.random()*4);if(roll===0){this.invincible=true;this.invincibleT=2.6;spawnDmgNum(this.x,this.y-this.radius*1.5,'WISH:SAFE','#fff0ff');}else if(roll===1){this.receiveHeal(this.maxHp*.45);spawnDmgNum(this.x,this.y-this.radius*1.5,'WISH:HEAL','#fff0ff');}else if(roll===2){this.targetSpd=this.baseSpd*3.35;this.wishDashT=2.0;spawnDmgNum(this.x,this.y-this.radius*1.5,'WISH:DASH','#fff0ff');}else{this._spawnTricksterMirrorReplica();spawnDmgNum(this.x,this.y-this.radius*1.5,'WISH:CLONE','#fff0ff');}} break;
   case 'beastmaster':
    if(this.stacks>=4){this.stacks=0;this.packHuntT=10;for(const k of['wolf','boar','hawk'])noiseTraps.push(new BeastCompanion(this.x,this.y,this,k));spawnBurst(this.x,this.y,'#ffb060','#b85a13',20);} break;
   case 'sage':
    if(this.stacks>=3){this.stacks=0;this.foresightT=2;this.untargetable=true;spawnBurst(this.x,this.y,'#d6f0b2','#6c8f52',18);} break;
   case 'arcanist':
    if(this.stacks>=3){this.stacks=0;this.overloadActive=true;this.overloadT=4;spawnBurst(this.x,this.y,'#78d8ff','#e8fbff',22);} break;
   case 'dragoon':
    if(this.stacks>=3&&!this.isLeaping){
     this.stacks=0;
     const enD=(this._nearestEnemy()||{}).enemy;
     if(!enD)break;
     this.leapTargetX=enD.x;this.leapTargetY=enD.y;
     this.isLeaping=true;this.untargetable=true;
     this.leapT=1.2;
     this.vx=0;this.vy=0;this.impactVx=0;this.impactVy=0;
     spawnBurst(this.x,this.y,'#4488cc','#88bbdd',18);
     spawnPulse(this.x,this.y,'#4488cc');
    } break;
   case 'priest':
    if(this.stacks>=8){
     this.stacks=0;
     this.benedictionActive=true;this.benedictionT=10.0;
     const preBenedictDmg=(this.d.dmg+2)*this.dmgMult;
     for(let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2;
      const orb=new HolyOrb(this.x,this.y,Math.cos(a)*260,Math.sin(a)*260,preBenedictDmg,this,true);
      projectiles.push(orb);
     }
     this.d=Object.assign({},this.d);
     this.d.dmg+=8;
     spawnBurst(this.x,this.y,'#fff8c0','#f0e070',24);
     spawnPulse(this.x,this.y,'#fff8a0');
    } break;
  }
  }finally{if(liveTracking)window._liveCurrentAbilityKey=prior;}
  if(liveTracking&&before>=threshold&&this.stacks===0)window._liveCombatTracker.onAbilityUse(this.key,true);
 }
 update(dt){
  if(this.dying){this.dyingT+=dt;return;}
  if(this.key==='trickster'&&this.canTriggerTraits!==false)this._checkTricksterMirrorPassive();
  this.hitFlash=Math.max(0,this.hitFlash-dt*5);
  if(this.netRootT>0){this.netRootT-=dt;this.vx*=0.04;this.vy*=0.04;this.impactVx*=0.04;this.impactVy*=0.04;if(this.netRootT<=0&&this.savedArm!==null){this.d=Object.assign({},this.d);this.d.arm=this.savedArm;this.savedArm=null;}}
  if(this.subduedT>0){this.subduedT-=dt;this.targetSpd=this.baseSpd*.6;if(this.subduedT<=0)this.targetSpd=this.baseSpd;}
  if(this.dmgHalvedT>0)this.dmgHalvedT-=dt;
  if(this.courtlyT>0)this.courtlyT-=dt;
  this.abTimer+=dt;
  if(this.virulenceWallHitCD>0)this.virulenceWallHitCD=Math.max(0,this.virulenceWallHitCD-dt);
  if(this.virulenceStacks>0)this.virulenceStacks=Math.max(0,this.virulenceStacks-dt*0.15);
  if(this.discordFireRateT>0){this.discordFireRateT-=dt;this.shotCD=Math.max(0,this.shotCD-dt*0.35);}else{this.shotCD=Math.max(0,this.shotCD-dt);}
  this.weaponHitCD=Math.max(0,this.weaponHitCD-dt);
  if(this.impactDecay>0){
   this.impactDecay=Math.max(0,this.impactDecay-dt);
   this.impactVx*=Math.pow(0.04,dt);
   this.impactVy*=Math.pow(0.04,dt);
   if(this.impactDecay<=0){this.impactVx=0;this.impactVy=0;}
  }
  if(this.invincible){
   this.invincibleT-=dt;
   if(this.invincibleT<=0){
    this.invincible=false;
    if(this.preinvincibleDmgMult!==undefined){this.dmgMult=this.preinvincibleDmgMult;this.preinvincibleDmgMult=undefined;}
    else if(!this.golemFortifyActive){this.dmgMult=1;}
    this.phaseInvincible=false;
   }
   else if(!this.phaseInvincible){this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1);}
  }
  if(this.spiralActive){
   this.spiralT-=dt;
   if(this.spiralT<=0){this.spiralActive=false;this.dmgMult=1;this.targetSpd=this.baseSpd;}
   else{
    const en=(this._nearestEnemy()||{}).enemy;
    if(en){
     this.spiralAngle+=dt*8;
     const orR=Math.max(en.radius*1.5,Math.hypot(en.x-this.x,en.y-this.y)*0.6);
     const tx=en.x+Math.cos(this.spiralAngle)*orR;
     const ty=en.y+Math.sin(this.spiralAngle)*orR;
     const ddx=tx-this.x,ddy=ty-this.y,ddd=Math.hypot(ddx,ddy)||1;
     this.vx=(ddx/ddd)*this.baseSpd*4;this.vy=(ddy/ddd)*this.baseSpd*4;
     this.targetSpd=this.baseSpd*4;
    }
   }
  }
  if(this.ramActive){
   this.ramT-=dt;
   if(this.ramT<=0){this.ramActive=false;this.dmgMult=1;this.targetSpd=this.baseSpd;}
  }
  if(this.orbitActive&&this.orbitTarget){
   this.orbitT-=dt;
   if(this.orbitT<=0){this.orbitActive=false;this.orbitTarget=null;this.dmgMult=1;}
   else{
    this.omegaCur=this.d.om*1.4*Math.sign(this.omegaCur||1);
    this.orbitAngle+=dt*6;
    const oR=this.orbitTarget.radius*1.6+this.radius;
    const tx=this.orbitTarget.x+Math.cos(this.orbitAngle)*oR;
    const ty=this.orbitTarget.y+Math.sin(this.orbitAngle)*oR;
    const ddx=tx-this.x,ddy=ty-this.y,ddd=Math.hypot(ddx,ddy)||1;
    this.vx=(ddx/ddd)*this.baseSpd*3;this.vy=(ddy/ddd)*this.baseSpd*3;
   }
  }
  if(this.warlordSpinT>0){
   this.warlordSpinT-=dt;
   this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1);
  }
  if(this.slowFieldActive){
   this.slowFieldT-=dt;
   if(this.slowFieldT<=0){this.slowFieldActive=false;}
   else{this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1);}
  }
  if(this.phalanxActive){
   this.phalanxT-=dt;
   if(this.phalanxT<=0){this.phalanxActive=false;this.phalanxT=0;}
   else this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1);
  }
  if(this.fortified){
   this.golemFortifyT-=dt;
   if(this.golemFortifyT<=0){this.fortified=false;this.golemFortifyActive=false;this.golemFortifyT=0;this.dmgMult=1;}
   else this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1);
  }
  if(this.snareActive){this.snareT+=dt;if(this.snareT>0.5)this.snareActive=false;}
  if(this.phaseOut){
   this.phaseOutT-=dt;
   if(this.phaseOutT<=0){
    this.phaseOut=false;
    // Phase Out leaves its fragile combat replica after the retreat finishes.
    this._spawnTricksterPhaseReplica();
   }
  }
  if(this.jesterLurchT>0){
   this.jesterLurchT-=dt;
   if(this.jesterLurchT<=0){this.jesterLurchT=0;if(this.dmgMult===2.0)this.dmgMult=1;}
  }
  if(this.backstabCharged){
   this.backstabT-=dt;
   if(this.backstabT<=0){this.backstabCharged=false;this.dmgMult=1;}
  }
  if(this.deathMarkTicks>0){
   this.deathMarkTimer-=dt;
   if(this.deathMarkTimer<=0){
    this.receiveDamage(this.deathMarkDmg);
    spawnToxicCloud(this.x,this.y);
    this.deathMarkDoTHits=(this.deathMarkDoTHits||0)+1;
    this.deathMarkTicks--;
    this.deathMarkTimer=0.18;
    if(this.deathMarkTicks<=0){
     if(this.deathMarkDoTHits>=7){
      this.deathMarkDoTHits=0; // reset for next skeleton
      const necro=spheres.find(s=>s.key==='necromancer'&&s.alive&&!s.dying&&
       (!sameFaction(this,s)));
      if(necro){
       skeletons.push(new Skeleton(this.x,this.y,necro.faction));
       spawnBurst(this.x,this.y,'#7c4dff','#1a0a2e',16);
      }
     }
    }
   }
  }
  if(this.woundT>0){this.woundT=Math.max(0,this.woundT-dt);}
  if(this.corrosionStacks>0){
   this.corrosionT=Math.max(0,this.corrosionT-dt);
   if(this.corrosionT<=0){
    this.corrosionStacks--;
    this.d=Object.assign({},this.d);
    const _bA2=this.baseArm||DEF[this.key]?.arm||0;
    this.d.arm=Math.max(0,_bA2-this.corrosionStacks*5);
    if(this.corrosionStacks>0)this.corrosionT=1.2; // next stack decays in 1.2s
   }
  }
  if(this.wrathActive){
   this.wrathT-=dt;
   this.omegaCur=this.d.om*2*Math.sign(this.omegaCur||1); // 2x spin during wrath
   this.wrathAuraTimer+=dt;
   if(this.wrathAuraTimer>=0.5){
    this.wrathAuraTimer=0;
    for(const s of spheres){
     const isEnemy=!sameFaction(this,s);
     if(!isEnemy||!s.alive||s.dying)continue;
     if(Math.hypot(s.x-this.x,s.y-this.y)<this.radius*2.5){
      s.receiveDamage(2.5);
      spawnSpark(s.x,s.y,'#f0c040',3);
     }
    }
   }
   if(this.wrathT<=0){
    this.wrathActive=false;this.dmgMult=1;
    this.wrathExhausted=true;this.wrathExhaustT=0.5;
    spawnPulse(this.x,this.y,'#f0c040');
   }
  }
  if(this.wrathExhausted){
   this.wrathExhaustT-=dt;
   this.targetSpd=this.baseSpd*0.75;
   if(this.wrathExhaustT<=0){this.wrathExhausted=false;this.targetSpd=this.baseSpd;}
  }
  if(this.key==='inquisitor'){
   const curSpd=Math.hypot(this.vx,this.vy);
   const spdFrac=Math.min(1,curSpd/(this.baseSpd*1.5));
   this.dmgMult=1+spdFrac*0.8;
   if(this.pyreActive){
    this.pyreT-=dt;
    this.pyreAuraTimer+=dt;
    const pyreSecElapsed=4.0-this.pyreT;
    const newArmBonus=Math.floor(pyreSecElapsed)*8;
    if(newArmBonus>this.pyreArmBonus){
     const diff=newArmBonus-this.pyreArmBonus;
     this.pyreArmBonus=newArmBonus;
     this.d=Object.assign({},this.d);
     this.d.arm+=diff;
    }
    if(this.pyreAuraTimer>=0.4){
     this.pyreAuraTimer=0;
     for(const s of spheres){
      if(sameFaction(this,s)||!s.alive||s.dying)continue;
      if(Math.hypot(s.x-this.x,s.y-this.y)<this.radius*2.8){
       s.receiveDamage(this.d.dmg*0.55*this.dmgMult);
       spawnSpark(s.x,s.y,'#ff4400',4);
      }
     }
    }
    for(let i=0;i<3;i++){
     const a=Math.random()*Math.PI*2,r2=this.radius*(0.8+Math.random()*0.8);
     particles.push({x:this.x+Math.cos(a)*r2,y:this.y+Math.sin(a)*r2,
      vx:(Math.random()-.5)*40,vy:-(20+Math.random()*60),
      life:1,maxL:0.4+Math.random()*0.3,sz:3+Math.random()*5,
      col:Math.random()<0.5?'#ff4400':'#ff8800',sq:false});
    }
    if(this.pyreT<=0){
     this.pyreActive=false;
     this.d=Object.assign({},this.d);
     this.d.arm=Math.max(DEF['inquisitor'].arm,this.d.arm-this.pyreArmBonus);
     this.pyreArmBonus=0;
    }
   }
   this.heatTrailTimer+=dt;
   if(this.heatTrailTimer>=0.12&&curSpd>this.baseSpd*0.4){
    this.heatTrailTimer=0;
    this.heatTrails.push({x:this.x,y:this.y,life:1.2,maxLife:1.2,r:this.radius*0.6});
   }
   this.heatTrails=this.heatTrails.filter(h=>{
    h.life-=dt;
    if(h.life>0){
     for(const s of spheres){
      if(sameFaction(this,s)||!s.alive||s.dying)continue;
      if(Math.hypot(s.x-h.x,s.y-h.y)<h.r+s.radius*0.5){
       s.receiveDamage(this.d.dmg*0.08);
      }
     }
    }
    return h.life>0;
   });
  }
  if(this.key==='pirate'&&this.draining){
   if(!this.draining){this.pirateRegenTimer=0;}
   this.pirateRegenTimer+=dt;
   if(this.pirateRegenTimer>=2.0){
    this.pirateRegenTimer=0;
    this.receiveHeal(1);
   }
  }
  if(this.key==='druid'){
   this.thornAoeTimer+=dt;
   if(this.thornAoeTimer>=4.0){
    this.thornAoeTimer=0;
    for(const s of spheres){
     const isEnemy=!sameFaction(this,s);
     if(!isEnemy||!s.alive||s.dying)continue;
     const dist=Math.hypot(s.x-this.x,s.y-this.y);
     if(dist<this.radius*this.d.reach+s.radius){
      s.receiveDamage(this.d.dmg*0.4);
      const nx=(s.x-this.x)/dist||1,ny=(s.y-this.y)/dist||0;
      s.applyImpact(nx*80,ny*80);
      spawnSpark(s.x,s.y,this.d.rim,5);
      // dragoon passive: no stack gain here — stacks only from weapon hits
     }
    }
   }
  }
  if(this.key==='viking'){
   if(this.vikingLastStandActive){
    this.vikingLastStandT-=dt;
    if(this.stacks>=4&&!this.vikingRageSpinActive)this._startVikingRageSpin();
    if(this.vikingLastStandT<=0){
     this.vikingLastStandActive=false;this.vikingRageSpinActive=false;this.dmgMult=1;
     this.hp=Math.max(1,this.hp);
     spawnDmgNum(this.x,this.y-this.radius*1.6,'LAST STAND END','#c8a030');
    }
   }
   if(this.vikingRageSpinActive){
    this.vikingRageSpinT-=dt;
    this.omegaCur=(this.d.om+4.0)*Math.sign(this.omegaCur||1);
    this.dmgMult=1.6;
    if(this.vikingRageSpinT<=0){this.vikingRageSpinActive=false;if(!this.vikingLastStandActive)this.dmgMult=1;}
   } else if(this.stacks>0&&!this.vikingLastStandActive){
    this.rageDecayT+=dt;
    const decayInterval=2.5;
    if(this.rageDecayT>=decayInterval){this.rageDecayT=0;this.stacks=Math.max(0,this.stacks-1);}
   }
  }
  if(this.sepsisWeakenedT>0)this.sepsisWeakenedT=Math.max(0,this.sepsisWeakenedT-dt);
  if(this.sepsisDotTicks>0){
   this.sepsisDotTimer-=dt;
   if(this.sepsisDotTimer<=0){
    const sdmg=this.sepsisDotDmg;
    this.hp=Math.max(0,this.hp-sdmg);this.hitFlash=1;
    spawnDmgNum(this.x,this.y-this.radius*1.2,sdmg,'#aadd44');
    spawnToxicCloud(this.x,this.y);
    this.sepsisDotTicks--;this.sepsisDotTimer=0.5;
    if(this.hp<=0&&!this.dying){
     if(this._triggerPhoenixRebirth())return;
     if(this._triggerVikingLastStand())return;
     this.alive=false;this.dying=true;spawnBurst(this.x,this.y,this.d.rim,this.d.color,28);return;
    }
   }
  }
  if(this.priestShieldT>0){
   this.priestShieldT-=dt;
   if(this.priestShieldT<=0){this.priestShieldStacks=0;this.priestShieldT=0;}
  }
  if(this.benedictionActive){
   this.benedictionT-=dt;
   if(this.benedictionT<=0){
    this.benedictionActive=false;
    this.d=Object.assign({},this.d);
    this.d.dmg=Math.max(DEF[this.key].dmg,this.d.dmg-8);
   }
  }
  if(this.blessDmgT>0){
   this.blessDmgT-=dt;
   if(this.blessDmgT<=0&&this.blessDmgAdded>0){
    this.d=Object.assign({},this.d);
    this.d.dmg=Math.max(DEF[this.key].dmg,this.d.dmg-this.blessDmgAdded);
    this.blessDmgAdded=0;
   }
  }
  if(this.key==='vampire'&&this.ghostMode){
   this.swarmT-=dt;
   this.batTickT-=dt;
   if(this.batTickT<=0){
    this.batTickT=0.28;
    for(const s of spheres){
     if(sameFaction(this,s)||!s.alive||s.dying)continue;
     const dist=Math.hypot(s.x-this.x,s.y-this.y);
     if(dist<this.radius+s.radius+12){
      const batDmg=this.d.dmg*0.55*this.dmgMult/(s.d.arm*0.004+1);
      if(batDmg>0.1){
       s.receiveDamage(batDmg);
       this.receiveHeal(batDmg*0.4);
       spawnSpark(s.x,s.y,'#cc0044',4);
      }
     }
    }
   }
   for(let i=0;i<2;i++){
    const ba=Math.random()*Math.PI*2,br=this.radius*(0.8+Math.random()*1.2);
    particles.push({x:this.x+Math.cos(ba)*br,y:this.y+Math.sin(ba)*br,
     vx:(Math.cos(ba)*18+(Math.random()-.5)*55),
     vy:(Math.sin(ba)*18+(Math.random()-.5)*55-12),
     life:1,maxL:0.45+Math.random()*0.3,sz:3+Math.random()*4,
     col:Math.random()<0.6?'#cc0044':'#1a0020',sq:false});
   }
   if(this.swarmT<=0){
    this.ghostMode=false;this.untargetable=false;
    spawnBurst(this.x,this.y,'#cc0044','#1a0020',14);
   }
  }
  if(this.volleyActive){
   this.volleyWindowT-=dt;
   this.volleyBurstTimer-=dt;
   if(this.volleyBurstTimer<=0&&this.volleyBurstsLeft>0){
    this._fireVolleyBurst();
    this.volleyBurstsLeft--;
    this.volleyBurstTimer=0.6;
   }
   if(this.volleyBurstsLeft<=0||this.volleyWindowT<=0){
    this.volleyActive=false;this.volleyDmgBonus=0;this.volleyWindowT=0;
   }
  }
  if(this.rodActive){
   this.rodT-=dt;
   if(this.rodT<=0){this.rodActive=false;}
  }
  if(this.stunned){
   this.stunnedT-=dt;
   if(this.stunnedT<=0){this.stunned=false;}
   else{this.vx*=Math.pow(0.001,dt);this.vy*=Math.pow(0.001,dt);} // near-freeze
  }
  if(this.blinded){
   this.blindT-=dt;
   if(this.blindT<=0){this.blinded=false;}
  }
  if(this.burning){
   this.burnT-=dt;this.burnTickT-=dt;
   if(this.burnTickT<=0){
    this.receiveDamage(2);
    spawnSpark(this.x,this.y,'#ff4400',4);
    this.burnTickT=this.burnTickInterval||DEFAULT_BURN_TICK_INTERVAL;
   }
   if(this.burnT<=0){this.burning=false;this.burnTickInterval=DEFAULT_BURN_TICK_INTERVAL;}
  }
  if(this.waterSlowT>0){
   this.waterSlowT-=dt;
   if(this.waterSlowT<=0){this.waterSlow=0;}
  }
  if(this.electrifiedT>0)this.electrifiedT-=dt;
  // ── Bard: Crescendo flash decay + dissonant spin suppression
  if(this.key==='bard'&&this.crescendoT>0){this.crescendoT-=dt;if(this.crescendoT<=0)this.crescendoActive=false;}
  if(this.dissonantT>0){
   this.dissonantT-=dt;
   // Suppress omega recovery — keep spin near 0 while dissonant
   this.omegaCur*=Math.pow(0.04,dt);
  }
  // ── Samurai: Iaijutsu – track spin reversal
  if(this.key==='samurai'){
   this.iaijutsuCD=Math.max(0,this.iaijutsuCD-dt);
   const curSign=Math.sign(this.omegaCur)||1;
   if(curSign!==this.lastOmegaSign){
    this.lastOmegaSign=curSign;
    if(this.iaijutsuCD<=0){this.iaijutsuReady=true;}
   }
  }
  // ── Barbarian: Bloodlust – decay slowly over time
  if(this.key==='barbarian'&&this.bloodlustBonus>0){
   this.bloodlustBonus=Math.max(0,this.bloodlustBonus-dt*4);
   this.targetSpd=this.baseSpd+this.bloodlustBonus;
  }
  if(this.d.sphereMelee){
   const activeSpin=Math.abs(this.omegaCur||0);
   if(activeSpin>Math.max(1,this.d.om*0.65)){
    this.rotationSpeed=Math.min(this.maxRotationSpeed,Math.max(this.rotationSpeed,activeSpin));
    this.rotationSpeed+=(this.maxRotationSpeed-this.rotationSpeed)*Math.min(1,dt*2.4);
   }else{
    this.rotationSpeed*=Math.pow(0.85,dt*30);
   }
  }
  // ── Berserker: Iron Will – track cooldown and active window
  if(this.key==='berserker'){
   this.ironWillCD=Math.max(0,this.ironWillCD-dt);
   if(this.ironWillActive){
    this.ironWillT-=dt;
    if(this.ironWillT<=0){this.ironWillActive=false;}
   }
   // trigger when below 40% HP and cd expired
   if(!this.ironWillActive&&this.ironWillCD<=0&&this.hp<this.maxHp*0.4){
    this.ironWillActive=true;this.ironWillT=0.8;this.ironWillCD=6.0;
    spawnSpark(this.x,this.y,'#ff4444',6);
    spawnDmgNum(this.x,this.y-this.radius*1.5,'IRON WILL','#ff4444');
   }
  }
  // ── Ninja: Shadow Step cooldown
  if(this.key==='ninja'){
   this.shadowStepCD=Math.max(0,this.shadowStepCD-dt);
   if(this.shadowStepActive){
    this.shadowStepT-=dt;
    if(this.shadowStepT<=0){this.shadowStepActive=false;this.untargetable=false;}
   }
  }
  // ── New roster status timers
  if(this.exhumeSpinT>0){this.exhumeSpinT-=dt;this.omegaCur=this.d.om*1.8*Math.sign(this.omegaCur||1);}
  if(this.locksmithJamT>0){
   this.locksmithJamT-=dt;
   this.omegaCur*=Math.pow(0.03,dt);
   if(this.locksmithJamT<=0)this.locksmithLocks=0;
  }
  if(this.locksmithHasteT>0){
   this.locksmithHasteT-=dt;
   if(this.locksmithHasteT<=0)this.targetSpd=this.baseSpd;
  }
  if(this.gnawedArmorT>0){
   this.gnawedArmorT-=dt;
   if(this.gnawedArmorT<=0){this.gnawedArmorStacks=0;this._refreshGnawedArmor();}
  }
  if(this.glassBleedT>0){
   this.glassBleedT-=dt;this.glassBleedTickT-=dt;
   this.vx*=Math.pow(0.96,dt*10);this.vy*=Math.pow(0.96,dt*10);
   if(this.glassBleedTickT<=0){this.glassBleedTickT=0.65;this.receiveDamage(1.5);spawnSpark(this.x,this.y,'#82f4ff',2);}
  }
  // ── Hemorrhage bleed ticks — runs on the VICTIM, not the rogue
  if(this.bleedStacks>0){
   this.bleedT=Math.max(0,this.bleedT-dt);
   this.bleedTickT-=dt;
   if(this.bleedTickT<=0){
    this.bleedTickT=0.5;
    const bdmg=this.bleedStacks*0.18*this.d.dmg*0.5; // flat tick, no arm reduction (it's a bleed)
    this.receiveDamage(bdmg);
    spawnSpark(this.x,this.y,'#e74c3c',3);
   }
   if(this.bleedT<=0){this.bleedStacks=0;this.bleedTickT=0;}
  }
  this._passiveAbility(dt);
  if(this.key==='dragoon'&&this.isLeaping)return; // suspended during leap — no gravity/walls/movement
  if(!this.bolaFloating)this.vy+=GRAVITY*dt;
  const baseOm=this.d.om*Math.sign(this.omegaCur||1);
  if(!this.invincible&&!this.orbitActive&&!this.warlordSpinT&&!this.slowFieldActive&&!this.phalanxActive&&!this.fortified&&!this.ashwingActive){
   this.omegaCur+=(baseOm-this.omegaCur)*Math.min(1,dt*2.5);
  }
  const waterSlowMult=this.waterSlow>0?(1-Math.min(0.7,this.waterSlow*0.35)):1;
  const spd=Math.hypot(this.vx,this.vy);
  const tgt=this.targetSpd*waterSlowMult;
  if(spd>tgt*3.5&&!this.ramActive&&!this.spiralActive&&!this.orbitActive){const f=tgt*3.5/spd;this.vx*=f;this.vy*=f;}
  else if(spd<tgt*0.65&&spd>0.1&&!this.spiralActive&&!this.orbitActive){const f=tgt*0.65/spd;this.vx*=f;this.vy*=f;}
  if(spd>tgt&&!this.ramActive&&!this.spiralActive&&!this.orbitActive){
   const friction=Math.pow(0.92,dt*10);
   this.vx*=friction;this.vy*=friction;
  }
  this.x+=(this.vx+this.impactVx)*dt;
  this.y+=(this.vy+this.impactVy)*dt;
  if(this.abilityAimT>0){this.abilityAimT=Math.max(0,this.abilityAimT-dt);if(this.abilityAimAngle!==null)this.angle=this.abilityAimAngle;else this.angle+=this.omegaCur*dt;}
  else {this.abilityAimAngle=null;this.angle+=this.omegaCur*dt;}
  const R=this.radius;
  if(this.x-R<0){this.x=R;this.vx=Math.max(Math.abs(this.vx)*WALL_REST,tgt*0.5);this.impactVx=0;this.vy+=(Math.random()-.5)*tgt*.12;
   if(this.ramActive)this.vx=Math.min(this.vx,this.targetSpd*1.2);
   if(this.key==='monk'){this.vx*=1.1;this.vy*=1.1;spawnSpark(this.x,this.y,'#ffe0a0',4);}
   if(this.key==='phoenix'){this._phoenixAddEmber(16);spawnSpark(this.x,this.y,'#ffcc02',4);}
   if(this.key==='ninja')this._shadowStepBounce();
   if(this.virulenceStacks>0&&this.virulenceWallHitCD<=0){this.virulenceWallHitCD=1.0;thornPatches.push(new ToxicSmear(this.x,this.y,R*1.5,this));spawnDmgNum(this.x,this.y-R-10,'SMEAR!','#aadd44');}
   if(this.key==='voidwalker'){noiseTraps.push(new VoidTear(this.x,this.y,this));this.voidTearCount=(this.voidTearCount||0)+1;}
   this._onWallBounce();
  }
  if(this.x+R>W){this.x=W-R;this.vx=-Math.max(Math.abs(this.vx)*WALL_REST,tgt*0.5);this.impactVx=0;this.vy+=(Math.random()-.5)*tgt*.12;
   if(this.ramActive)this.vx=Math.max(this.vx,-this.targetSpd*1.2);
   if(this.key==='monk'){this.vx*=1.1;this.vy*=1.1;spawnSpark(this.x,this.y,'#ffe0a0',4);}
   if(this.key==='phoenix'){this._phoenixAddEmber(16);spawnSpark(this.x,this.y,'#ffcc02',4);}
   if(this.key==='ninja')this._shadowStepBounce();
   if(this.virulenceStacks>0&&this.virulenceWallHitCD<=0){this.virulenceWallHitCD=1.0;thornPatches.push(new ToxicSmear(this.x,this.y,R*1.5,this));spawnDmgNum(this.x,this.y-R-10,'SMEAR!','#aadd44');}
   if(this.key==='voidwalker'){noiseTraps.push(new VoidTear(this.x,this.y,this));this.voidTearCount=(this.voidTearCount||0)+1;}
   this._onWallBounce();
  }
  if(this.y-R<0){this.y=R;this.vy=Math.max(Math.abs(this.vy)*WALL_REST,tgt*0.5);this.impactVy=0;this.vx+=(Math.random()-.5)*tgt*.12;
   if(this.ramActive)this.vy=Math.min(this.vy,this.targetSpd*1.2);
   if(this.key==='monk'){this.vx*=1.1;this.vy*=1.1;spawnSpark(this.x,this.y,'#ffe0a0',4);}
   if(this.key==='phoenix'){this._phoenixAddEmber(16);spawnSpark(this.x,this.y,'#ffcc02',4);}
   if(this.key==='ninja')this._shadowStepBounce();
   if(this.virulenceStacks>0&&this.virulenceWallHitCD<=0){this.virulenceWallHitCD=1.0;thornPatches.push(new ToxicSmear(this.x,this.y,R*1.5,this));spawnDmgNum(this.x,this.y+R+10,'SMEAR!','#aadd44');}
   if(this.key==='voidwalker'){noiseTraps.push(new VoidTear(this.x,this.y,this));this.voidTearCount=(this.voidTearCount||0)+1;}
   this._onWallBounce();
  }
  if(this.y+R>H){this.y=H-R;this.vy=-Math.max(Math.abs(this.vy)*WALL_REST,tgt*0.5);this.impactVy=0;this.vx+=(Math.random()-.5)*tgt*.12;
   if(this.ramActive)this.vy=Math.max(this.vy,-this.targetSpd*1.2);
   if(this.key==='monk'){this.vx*=1.1;this.vy*=1.1;spawnSpark(this.x,this.y,'#ffe0a0',4);}
   if(this.key==='phoenix'){this._phoenixAddEmber(16);spawnSpark(this.x,this.y,'#ffcc02',4);}
   if(this.key==='ninja')this._shadowStepBounce();
   if(this.virulenceStacks>0&&this.virulenceWallHitCD<=0){this.virulenceWallHitCD=1.0;thornPatches.push(new ToxicSmear(this.x,this.y,R*1.5,this));spawnDmgNum(this.x,this.y-R-10,'SMEAR!','#aadd44');}
   if(this.key==='voidwalker'){noiseTraps.push(new VoidTear(this.x,this.y,this));this.voidTearCount=(this.voidTearCount||0)+1;}
   this._onWallBounce();
  }
  if(this.pulseWave){this.pulseWave.r+=dt*250;this.pulseWave.life-=dt*2;if(this.pulseWave.life<=0)this.pulseWave=null;}
  if(this.bolaRootT>0){
   this.bolaRootT-=dt;
   this.vx*=Math.pow(0.001,dt);this.vy*=Math.pow(0.001,dt);
   this.impactVx*=Math.pow(0.001,dt);this.impactVy*=Math.pow(0.001,dt);
   if(this.bolaFloating){this.vy=0;}
   if(this.bolaRootT<=0){this.bolaFloating=false;}
  }
  for(const sz of slowZones)sz.apply(this);
  if(this.bolaSlowT>0&&this.bolaRootT<=0){
   this.bolaSlowT-=dt;
   this.targetSpd=this.baseSpd*0.20;
   const slowOm=this.d.om*0.20*Math.sign(this.omegaCur||1);
   this.omegaCur+=(slowOm-this.omegaCur)*Math.min(1,dt*4);
   if(this.bolaSlowT<=0){
    this.targetSpd=this.baseSpd;
   }
  }
 }
 _passiveAbility(dt){
  if(this.canTriggerTraits===false)return;
  switch(this.key){
   case 'paladin':
    this.pulseTimer+=dt;
    if(this.pulseTimer>=3.0){
     this.pulseTimer=0;this.pulseWave={r:this.radius*1.1,life:1};
     const healAmt=8;
     const prevHpPal=this.hp;
     this.receiveHeal(healAmt);
     spawnSpark(this.x,this.y,'#f0c040',4);
     const en=(this._nearestEnemy()||{}).enemy;
     if(en){const dx=en.x-this.x,dy=en.y-this.y,dist=Math.hypot(dx,dy)||1;
      en.applyImpact((dx/dist)*280,(dy/dist)*280);
      const pulseDmg=12/(en.d.arm*0.004+1);
      en.receiveDamage(pulseDmg);
      spawnPulse(this.x,this.y,this.d.rim);
     }
    } break;
   case 'templar': {
    const speed=Math.hypot(this.vx,this.vy);
    const anchorThreshold=Math.max(30,this.baseSpd*0.35);
    const gainRate=this.slowFieldActive?0.9:0.45;
    const decayRate=0.65;
    if(speed<anchorThreshold)this.templarAnchor=Math.min(1,(this.templarAnchor||0)+gainRate*dt);
    else this.templarAnchor=Math.max(0,(this.templarAnchor||0)-decayRate*dt);
    if(this.slowFieldActive)this.templarAnchor=Math.max(this.templarAnchor,0.35);
    break;}
   case 'guardian':
    this.guardianSanctuaryTimer+=dt;
    if(this.guardianSanctuaryTimer>=10.0){
     this.guardianSanctuaryTimer=0;
     slowZones.push(new GuardianSanctuaryZone(this));
     spawnDmgNum(this.x,this.y-this.radius*1.5,'SANCTUARY','#80cbc4');
    }
    break;
   case 'ranger':
    const rangerHpLost=this.maxHp>0?Math.max(0,1-(this.hp/this.maxHp)):0;
    this.critChance=Math.min(0.60,rangerHpLost);
    this.critDamageBonus=Math.min(0.30,rangerHpLost);
    this.drawCharge=Math.min(1,this.drawCharge+(dt/0.13));
    if(!this.volleyActive&&this.drawCharge>=1&&this.shotCD<=0){
     this.drawCharge=0;this.shotCD=0.14;
     this._fireArrow();
    }
    this._applyKite(dt); break;
   case 'wizard':
    if(this.wizardHpThreshold>0){
     const triggerFrac=this.wizardHpThreshold/100;
     if(this.hp<this.maxHp*triggerFrac){
      while(this.wizardHpThreshold>0 && this.hp<this.maxHp*(this.wizardHpThreshold/100)){
       this.wizardHpThreshold-=10;
       const corners=[
        {x:this.radius+30,y:this.radius+30},
        {x:W-this.radius-30,y:this.radius+30},
        {x:this.radius+30,y:H-this.radius-30},
        {x:W-this.radius-30,y:H-this.radius-30},
       ];
       let farthest=corners[0],farthestDist=0;
       for(const c of corners){
        const d=Math.hypot(c.x-this.x,c.y-this.y);
        if(d>farthestDist){farthestDist=d;farthest=c;}
       }
       spawnWizardTeleportDepart(this.x,this.y);
       this.x=farthest.x;this.y=farthest.y;
       spawnWizardTeleportArrive(this.x,this.y);
       this.d=Object.assign({},this.d);
       this.d.dmg+=3;
       this.wizardDmgBonusTotal+=3;
       spawnDmgNum(this.x,this.y-this.radius*1.5,3,'#cc88ff');
      }
     }
    }
    if(this.rodActive&&this.rodType===3){
     const sign=Math.sign(this.omegaCur)||1;
     this.omegaCur=this.d.om*1.6*sign;
     this.targetSpd=this.baseSpd*1.4;
    } else if(this.targetSpd>this.baseSpd*1.05&&!this.ramActive&&!this.spiralActive){
     this.targetSpd=this.baseSpd;
    }
    if(this.shotCD<=0){this.shotCD=0.22;this._fireFlameBolt();}
    this._applyKite(dt); break;
   case 'necromancer':
    if(this.shotCD<=0){this.shotCD=0.23;this._fireSkullOrb();}
    this._applyKite(dt); break;
   case 'sheriff':
    this.cylinderRot=(this.cylinderRot||0)+dt*2;
    if(this.sheriffSwitching){
     this.sheriffSwitchT-=dt;
     if(this.sheriffSwitchT<=0)this.sheriffSwitching=false;
    }
    if(this.sheriffReloading){
     const hpLossPct=this.maxHp>0?Math.max(0,(1-this.hp/this.maxHp)*100):0;
     this.sheriffReloadDuration=Math.max(0.35,0.75-Math.min(0.4,hpLossPct*0.05));
     this.sheriffReloadT-=dt;
     if(this.sheriffReloadT<=0){
      this.sheriffReloading=false;this.sheriffCylinder=6;
      spawnSpark(this.x,this.y,this.d.rim,4);
     }
    } else if(this.sheriffCylinder>0&&this.shotCD<=0&&!this.sheriffSwitching){
     this.shotCD=0.16;
     this._fireSheriffBullet();
     this.sheriffCylinder--;
     this.cylinderRot+=(Math.PI*2/6);
     if(this.sheriffCylinder<=0){
      const hpLossPct=this.maxHp>0?Math.max(0,(1-this.hp/this.maxHp)*100):0;
      this.sheriffReloadDuration=Math.max(0.35,0.75-Math.min(0.4,hpLossPct*0.05));
      this.sheriffReloading=true;this.sheriffReloadT=this.sheriffReloadDuration;
      spawnPulse(this.x,this.y,'#d4a83a');
     }
    }
    this._applyKite(dt); break;
   case 'phoenix': {
    const speed=Math.hypot(this.vx,this.vy);
    const speedRatio=this.baseSpd>0?speed/this.baseSpd:1;
    const chargeRate=(this.ashwingActive?18:8)+Math.max(0,speedRatio-0.95)*(this.ashwingActive?28:16);
    this._phoenixAddEmber(chargeRate*dt);
    if(this.phoenixEmberFlash>0)this.phoenixEmberFlash=Math.max(0,this.phoenixEmberFlash-dt);
    if(this.ashwingActive){
     this.ashwingT-=dt;
     this.targetSpd=this.baseSpd*1.18;
     this.omegaCur=this.d.om*1.35*Math.sign(this.omegaCur||1);
     const a=this.abTimer*8;
     const orb=this.radius*(1.15+0.08*Math.sin(this.abTimer*10));
     particles.push({x:this.x+Math.cos(a)*orb,y:this.y+Math.sin(a)*orb,
      vx:(Math.random()-.5)*28,vy:(Math.random()-.5)*28-10,
      life:1,maxL:.18+Math.random()*.12,sz:2+Math.random()*3,
      col:Math.random()<0.5?'#ffcc02':'#ff4400',sq:false});
     if(this.ashwingT<=0){
      this.ashwingActive=false;this.ashwingT=0;
      this.targetSpd=this.baseSpd;
     }
    }
   } break; // rebirth handled in receiveDamage
   case 'vampire': break; // Sanguine Thirst handled directly in _weaponHit
   case 'monk':
    if(this.nirvanaActive){
     this.nirvanaT-=dt;
     this.omegaCur=this.d.om*2.5*Math.sign(this.omegaCur||1);
     // Chi trail — tight golden sparks orbiting the monk while Nirvana burns
     for(let i=0;i<2;i++){
      const a=Date.now()*0.014+i*Math.PI;
      const orb=this.radius*1.3;
      particles.push({
       x:this.x+Math.cos(a)*orb, y:this.y+Math.sin(a)*orb,
       vx:(Math.random()-.5)*22, vy:(Math.random()-.5)*22-8,
       life:1, maxL:0.18+Math.random()*0.1, sz:2+Math.random()*2.5,
       col:Math.random()<0.6?'#ffe0a0':'#fff', sq:false
      });
     }
     if(this.nirvanaT<=0){
      this.nirvanaActive=false;
      this.dmgMult=1;
      this.omegaCur=this.d.om*Math.sign(this.omegaCur||1);
      // Exhaust burst — energy dispersing outward
      spawnBurst(this.x,this.y,'#ffe0a0','#c8a040',14);
     }
    } break;
   case 'alchemist': break;
   case 'dragoon':
    if(!this.magicShield){
     this.shieldTimer+=dt;
     if(this.shieldTimer>=8.0){this.magicShield=true;this.shieldTimer=0;spawnSpark(this.x,this.y,'#4488cc',6);}
    }
    if(this.isLeaping){
     this.leapT-=dt;
     // Spawn motion trail — blue comet streak particles at current (hidden) position
     for(let i=0;i<4;i++){
      const a=Math.random()*Math.PI*2;
      particles.push({x:this.leapTargetX+(Math.random()-.5)*this.radius*2,
       y:this.leapTargetY+(Math.random()-.5)*this.radius*2,
       vx:Math.cos(a)*15,vy:Math.sin(a)*15-8,
       life:1,maxL:0.22+Math.random()*0.18,sz:3+Math.random()*5,
       col:Math.random()<0.6?'#4488cc':'#88bbdd',sq:false});
     }
     const prog=(1.2-this.leapT)/1.2; // 0→1 as time passes
     // Growing shadow ring at target — intensifies as dragoon approaches
     if(prog>0.25){
      const shadowPulse=0.4+0.5*Math.sin(Date.now()*.025);
      const shadowR=this.radius*(0.55+prog*1.1);
      ctx.save();ctx.globalAlpha=(prog-0.25)*0.80;
      // Perfect circle shadow — no angle/perspective distortion
      ctx.fillStyle='rgba(10,20,40,0.65)';
      ctx.beginPath();ctx.arc(this.leapTargetX,this.leapTargetY,shadowR,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(68,136,204,${0.5+shadowPulse*0.5})`;ctx.lineWidth=2.5+prog*2;
      ctx.beginPath();ctx.arc(this.leapTargetX,this.leapTargetY,shadowR*1.18,0,Math.PI*2);ctx.stroke();
      ctx.restore();
     }
     if(this.leapT<=0){
      this.x=Math.max(this.radius+10,Math.min(W-this.radius-10,this.leapTargetX));
      this.y=Math.max(this.radius+10,Math.min(H-this.radius-10,this.leapTargetY));
      this.isLeaping=false;this.untargetable=false;
      this.justLanded=true;this.justLandedT=0.45;
      this._triggerImpactAoE(this.radius*3.5,this.d.dmg*1.6*this.dmgMult);
      // Shockwave rings
      for(let i=0;i<3;i++){
       setTimeout(()=>{
        spawnRingBurst(this.x,this.y,'#4488cc');
        spawnBurst(this.x,this.y,'#4488cc','#ffffff',i===0?28:14);
       },i*80);
      }
      spawnPulse(this.x,this.y,'#88bbdd');
      const bouncA=Math.atan2(this.y-this.leapTargetY,this.x-this.leapTargetX)||Math.random()*Math.PI*2;
      this.vx=Math.cos(bouncA)*this.baseSpd*2.0;
      this.vy=Math.sin(bouncA)*this.baseSpd*2.0;
      // dragoon does NOT gain a stack on landing — stacks only from weapon hits
     }
    }
    if(this.justLanded){
     this.justLandedT-=dt;
     if(this.justLandedT<=0)this.justLanded=false;
    }
    break;
   case 'priest':
    if(this.shotCD<=0){this.shotCD=0.35;this._fireHolyOrb();}
    this._applyKite(dt); break;
   case 'bard':
    this.noiseTrapCD=Math.max(0,this.noiseTrapCD-dt);
    if(this.shotCD<=0){
     this.shotCD=0.55;
     this._fireMusicNote();
     // Discordant Echo — spawn NoiseTrap at current position (with CD)
     if(this.noiseTrapCD<=0){
      this.noiseTrapCD=3.5;
      noiseTraps.push(new NoiseTrap(this.x,this.y,this));
     }
    }
    this._applyKite(dt); break;
   case 'plague':
    // Virulence: infected enemies that bounce off walls leave toxic smears
    // (virulenceStacks decay is handled generically in sphere.update for all spheres)
    break;
   case 'tidecaller':{
    // Tidal Momentum: faster near walls, slower near center
    const tx=this.x,ty=this.y;
    const wallDist=Math.min(tx,W-tx,ty,H-ty);
    const centerDist=Math.hypot(tx-W/2,ty-H/2);
    const centerR=Math.min(W,H)*0.25;
    if(wallDist<60){
     const bonus=1+(1-wallDist/60)*0.4;
     this.targetSpd=this.baseSpd*bonus;
    } else if(centerDist<centerR){
     const penalty=1-(1-centerDist/centerR)*0.15;
     this.targetSpd=this.baseSpd*penalty;
    } else {
     this.targetSpd=this.baseSpd;
    }
    break;}
   case 'crusader':
    this.holyChargeCD=Math.max(0,this.holyChargeCD-dt);
    this.holyChargeCollisionCD=Math.max(0,this.holyChargeCollisionCD-dt);
    if(this.holyChargeActive){
     this.holyChargeElapsed+=dt;
     this.holyChargeT-=dt;
     this.invincible=true;this.invincibleT=Math.max(this.invincibleT,this.holyChargeT);
     if(this.holyChargeT<=0){
      this.holyChargeActive=false;
      this.dmgMult=1;
     }
    }
    // Retribution: decay counter very slowly
    if(this.retributionCounter>0) this.retributionCounter=Math.max(0,this.retributionCounter-dt*2);
    break;
   case 'mimic':
    if(this.perfectCopyActive){
     this.perfectCopyT-=dt;
     if(this.perfectCopyT<=0){
      this.perfectCopyActive=false;
      if(this._mimicBaseDmg!==undefined){this.d=Object.assign({},this.d);this.d.dmg=this._mimicBaseDmg+this.mimicDmgStolen;this._mimicBaseDmg=undefined;}
      if(this._mimicBaseSpd!==undefined){this.baseSpd=this._mimicBaseSpd;this.targetSpd=this._mimicBaseSpd;this._mimicBaseSpd=undefined;}
     }
    }
    break;
   case 'stormbringer':{
    // Static charge builds with speed
    const spd2=Math.hypot(this.vx,this.vy);
    const chargeRate=spd2/this.baseSpd*4.0;
    this.staticCharge=Math.min(30,this.staticCharge+chargeRate*dt);
    if(this.thunderclapActive){
     this.thunderclapT-=dt;
     if(this.thunderclapT<=0){this.thunderclapActive=false;}
    }
    this.thunderclapCD=Math.max(0,this.thunderclapCD-dt);
    // Emit occasional spark particles when charged
    if(this.staticCharge>15&&Math.random()<dt*3){
     spawnSpark(this.x,this.y,'#88ccff',2);
    }
    break;}
   case 'voidwalker':
    if(this.singularityActive){
     this.singularityT-=dt;
     if(this.singularityT<=0){
      this.singularityActive=false;
      spawnBurst(this.singularityX,this.singularityY,'#aa44ff','#000000',12);
     } else {
      // Pull all enemies toward singularity
      this._singularityTickT=(this._singularityTickT||0)+dt;
      for(const s of spheres){
       if(sameFaction(this,s)||!s.alive||s.dying)continue;
       const sx=this.singularityX-s.x,sy=this.singularityY-s.y;
       const sd=Math.hypot(sx,sy)||1;
       const pullStr=Math.min(1,60/sd)*360;
       s.impactVx+=(sx/sd)*pullStr*dt;
       s.impactVy+=(sy/sd)*pullStr*dt;
      }
      // Tick damage every 0.35s instead of random every frame
      if(this._singularityTickT>=0.35){
       this._singularityTickT=0;
       for(const s of spheres){
        if(sameFaction(this,s)||!s.alive||s.dying)continue;
        s.receiveMagicDamage(this.d.dmg*0.3);
       }
      }
     }
    }
    break;
   case 'witch': if(this.hexBurstFiredT>0){this.hexBurstFiredT-=dt;if(this.hexBurstFiredT<=0)this.hexBurstFired=false;}if(this.shotCD<=0){this.shotCD=.22;const tip=this.getTip();projectiles.push(new RosterBolt(tip.x,tip.y,Math.cos(this.angle)*250,Math.sin(this.angle)*250,(this.d.dmg+9)*this.dmgMult,this,'hex'));}this._applyKite(dt);break;
   case 'fairy': this.dustDropT-=dt;if(this.dustDropT<=0){this.dustDropT=.22;noiseTraps.push(new PixieDustPatch(this.x,this.y,this));}if(this.wishFireRateT>0)this.wishFireRateT=Math.max(0,this.wishFireRateT-dt);if(this.shotCD<=0){this.shotCD=this.wishFireRateT>0?.10:.17;const tip=this.getTip();projectiles.push(new RosterBolt(tip.x,tip.y,Math.cos(this.angle)*360,Math.sin(this.angle)*360,(this.d.dmg+9)*.85,this,'dust'));}if(this.wishDashT>0){this.wishDashT-=dt;if(this.wishDashT<=0)this.targetSpd=this.baseSpd;}this._applyKite(dt);break;
   case 'arcanist': this.arcaneCharge=Math.min(5,(this.arcaneCharge||0)+dt);if(this.overloadActive){this.overloadT-=dt;if(this.overloadT<=0)this.overloadActive=false;}if(this.shotCD<=0){this.shotCD=this.overloadActive?.20:.38;const tip=this.getTip(),spd=this.overloadActive?660:220;const b=new RosterBolt(tip.x,tip.y,Math.cos(this.angle)*spd,Math.sin(this.angle)*spd,(this.d.dmg+8)*this.dmgMult,this,'arcane');if(this.arcaneCharge>=5){const en=(this._nearestEnemy()||{}).enemy;if(en){b.x=en.x;b.y=en.y;b._explode(en);}this.arcaneCharge=0;}else projectiles.push(b);}this._applyKite(dt);break;
   case 'queen': if(this.queenGambitT>0){this.queenGambitT-=dt;if(this.queenGambitT<=0&&this.queenGambitSavedDef){this.d=Object.assign({},this.d);this.d.arm=this.queenGambitSavedDef.arm;this.d.magDef=this.queenGambitSavedDef.magDef;this.queenGambitSavedDef=null;spawnDmgNum(this.x,this.y-this.radius*1.5,'NORMAL','#ffb8e6');}}if(this.queenInvisibleT>0){this.queenInvisibleT-=dt;if(this.queenInvisibleT<=0){this.queenInvisible=false;this.untargetable=false;for(let i=0;i<3;i++){const a=i*Math.PI*2/3+Math.random()*.4;skeletons.push(new ArcherAlly(this.x+Math.cos(a)*this.radius*1.3,this.y+Math.sin(a)*this.radius*1.3,this));}spawnBurst(this.x,this.y,'#ff69b4','#ffb8e6',18);}}for(const en of spheres){if(!sameFaction(this,en)&&en.alive&&!en.dying&&Math.hypot(en.x-this.x,en.y-this.y)<this.radius*2.9+en.radius){en.courtlyT=1.5;en.vx*=.90;en.vy*=.90;}}break;
   case 'prince': this._updatePrinceWeaponMaster(dt);break;
   case 'king': if(this.decreeT>0){this.decreeT-=dt;if(this.decreeT<=0){this.dmgMult=1;this.omegaCur=this.d.om*Math.sign(this.omegaCur||1);}}break;
   case 'gladiator': if(this.netLockoutT>0){this.netLockoutT-=dt;if(this.netLockoutT<=0)this.dmgMult=1;}break;
   case 'sage': if(this.shotCD<=0){this.shotCD=.32;this._fireSageWord();}this._applyKite(dt);if(this.foresightT>0){this.foresightT-=dt;const en=(this._nearestEnemy()||{}).enemy;if(en){this.vx=-(en.vx+en.impactVx);this.vy=-(en.vy+en.impactVy);}if(this.foresightT<=0){this.untargetable=false;for(const q of spheres){if(!sameFaction(this,q)&&q.alive&&!q.dying&&Math.hypot(q.x-this.x,q.y-this.y)<this.radius*4)q.receiveMagicDamage(this.d.dmg*2);}spawnDmgNum(this.x,this.y-this.radius*1.8,'2× WISDOM','#d6f0b2');spawnPulse(this.x,this.y,'#d6f0b2');}}break;
   case 'whelpling':
    // Mouth open timer countdown
    if(this.mouthOpenTimer>0)this.mouthOpenTimer=Math.max(0,this.mouthOpenTimer-dt);
    else this.mouthOpenMode=0;
    // Firebreath re-trigger cooldown
    if(this.whelplingFireCooldown>0)this.whelplingFireCooldown=Math.max(0,this.whelplingFireCooldown-dt);
    // Growing Menace: every 4s grow
    this.whelplingGrowTimer+=dt;
    if(this.whelplingGrowTimer>=4.0){
     this.whelplingGrowTimer=0;
     this.whelplingGrowth++;
     const prevR=this.radius;
     this.radius=Math.min(36,this.radius+2);
     this.maxHp=Math.min(this.maxHp+15,800);
     this.hp=Math.min(this.hp+8,this.maxHp);
     this.d=Object.assign({},this.d);
     this.mass=Math.min(20,this.mass+1);
     spawnBurst(this.x,this.y,'#ff6600',this.d.rim,10);
     spawnDmgNum(this.x,this.y-this.radius*1.5,'GROWN!','#ff6600');
    }
    break;
  } // end switch
  } // end _passiveAbility
  _checkTricksterMirrorPassive(){
   if(this.tricksterMirrorSpawned||this.hp<=0||this.maxHp<=0)return;
   if(this.hp/this.maxHp>=0.4)return;
   this.tricksterMirrorSpawned=true;
   this._spawnTricksterMirrorReplica();
  }
  _spawnTricksterMirrorReplica(){
   const scale=0.8;
   const side=Math.random()<0.5?-1:1;
   const a=this.angle+side*Math.PI/2;
   const gap=this.radius*0.85;
   const margin=this.radius+4;
   const cx=Math.max(margin,Math.min(W-margin,this.x+Math.cos(a)*gap));
   const cy=Math.max(margin,Math.min(H-margin,this.y+Math.sin(a)*gap));
   const clone=new Sphere(this.key,this.faction,cx,cy,this.vx*scale,this.vy*scale,Math.max(1,Math.round(this.hp*scale)),{
    isReplica:true,
    replicaKind:'mirror',
    replicaOwner:this,
   });
   clone.d=Object.assign({},this.d);
   clone.d.dmg*=scale;
   clone.d.arm=Math.max(0,Math.round(clone.d.arm*scale));
   clone.d.magDef=Math.max(0,Math.round(clone.d.magDef*scale));
   clone.d.spd*=scale;
   clone.d.om*=scale;
   clone.d.mass=(clone.d.mass||this.mass)*scale;
   clone.d.hp=Math.max(1,Math.round(this.maxHp*scale));
   clone.mass=Math.max(0.5,this.mass*scale);
   clone.radius=this.radius;
   clone.maxHp=clone.d.hp;
   clone.hp=Math.max(1,Math.min(clone.maxHp,Math.round(this.hp*scale)));
   clone.baseSpd=this.baseSpd*scale;
   clone.targetSpd=this.targetSpd*scale;
   clone.vx=this.vx*scale;clone.vy=this.vy*scale;
   clone.impactVx=this.impactVx*scale;clone.impactVy=this.impactVy*scale;clone.impactDecay=this.impactDecay;
   clone.angle=this.angle;
   clone.omegaCur=this.omegaCur*scale;
   clone.dmgMult=this.dmgMult;
   clone.hitBuffStacks=this.hitBuffStacks;
   clone.lowHpBuffApplied=this.lowHpBuffApplied;
   clone.stacks=0;
   clone.canTriggerTraits=false;
   clone.tricksterMirrorSpawned=true;
   clone.invincible=false;clone.invincibleT=0;clone.phaseInvincible=false;clone.preinvincibleDmgMult=undefined;
   clone.phaseOut=false;clone.phaseOutT=0;clone.untargetable=false;
   spheres.push(clone);
   spawnBurst(this.x,this.y,this.d.rim,'#e0f7fa',18);
   spawnDmgNum(this.x,this.y-this.radius*1.7,'MIRROR','#e0f7fa');
  }
  _spawnTricksterPhaseReplica(){
   const speed=Math.hypot(this.vx,this.vy);
   const baseA=speed>0.01?Math.atan2(this.vy,this.vx)+Math.PI:this.angle+Math.PI;
   const gap=this.radius*2+4;
   const margin=this.radius+4;
   let cx=this.x,cy=this.y,bestDist=0;
   for(let i=0;i<16;i++){
    const a=baseA+(i%2===0?1:-1)*Math.ceil(i/2)*(Math.PI/8);
    const tx=Math.max(margin,Math.min(W-margin,this.x+Math.cos(a)*gap));
    const ty=Math.max(margin,Math.min(H-margin,this.y+Math.sin(a)*gap));
    const d=Math.hypot(tx-this.x,ty-this.y);
    if(d>bestDist){cx=tx;cy=ty;bestDist=d;}
    if(d>=gap-0.5)break;
   }
   const clone=new Sphere(this.key,this.faction,cx,cy,this.vx,this.vy,1,{
    isReplica:true,
    replicaKind:'phase',
    replicaOwner:this,
   });
   clone.d=Object.assign({},this.d);
   clone.d.hp=1;clone.d.arm=0;clone.d.magDef=0;
   clone.radius=this.radius;
   clone.mass=Math.max(0.5,this.mass*0.45);
   clone.maxHp=1;clone.hp=1;
   clone.baseSpd=this.baseSpd;clone.targetSpd=this.targetSpd;
   clone.vx=this.vx;clone.vy=this.vy;
   clone.impactVx=this.impactVx;clone.impactVy=this.impactVy;clone.impactDecay=this.impactDecay;
   clone.angle=this.angle;
   clone.omegaCur=this.omegaCur;
   clone.d.om=Math.max(0.1,Math.abs(this.omegaCur));
   clone.dmgMult=this.dmgMult;
   clone.stacks=0;
   clone.canTriggerTraits=false;
   clone.tricksterMirrorSpawned=true;
   clone.invincible=false;clone.invincibleT=0;clone.phaseInvincible=false;clone.preinvincibleDmgMult=undefined;
   clone.phaseOut=false;clone.phaseOutT=0;clone.untargetable=false;
   spheres.push(clone);
   spawnSpark(clone.x,clone.y,this.d.rim,8);
  }
  _destroyReplica(label){
   if(!this.isReplica||this.dying)return;
   this.hp=0;this.alive=false;this.dying=true;this.dyingT=0;
   spawnBurst(this.x,this.y,this.d.rim,'#e0f7fa',12);
   if(label)spawnDmgNum(this.x,this.y-this.radius*1.4,label,'#e0f7fa');
  }
  _triggerImpactAoE(radius,dmg){
  for(const s of spheres){
   if(sameFaction(this,s)||!s.alive||s.dying)continue;
   const dist=Math.hypot(s.x-this.x,s.y-this.y);
   if(dist<radius+s.radius){
    // True damage — bypasses armor, this is the lance strike on descent
    s.hp=Math.max(0,s.hp-dmg);
    s.hitFlash=1;
    if(dmg>0.5)spawnBloodSplat(s.x,s.y,s.d.color,dmg);
    if(dmg>0.2)spawnDmgNum(s.x,s.y-s.radius*0.5,dmg,'#4488cc');
    // Heavy radial knockback
    const nx=(s.x-this.x)/Math.max(dist,1),ny=(s.y-this.y)/Math.max(dist,1);
    s.applyImpact(nx*520,ny*520);
    if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}
   }
  }
 }
 _applyKite(dt){
  this.kiteCD=Math.max(0,this.kiteCD-dt);
  if(this.kiteCD>0)return;
  const dangerR=this.radius*3.5;
  const threat=spheres.find(s=>{
   const isEnemy=!sameFaction(this,s);
   return isEnemy&&s.alive&&!s.dying&&Math.hypot(s.x-this.x,s.y-this.y)<dangerR;
  });
  if(!threat)return;
  const dx=this.x-threat.x,dy=this.y-threat.y;
  const dist=Math.hypot(dx,dy)||1;
  const urgency=1-(dist/dangerR); // 0 at edge, 1 at contact
  const force=this.baseSpd*(1.8+urgency*1.4);
  this.vx+=(dx/dist)*force*dt*6;
  this.vy+=(dy/dist)*force*dt*6;
  const spd=Math.hypot(this.vx,this.vy);
  if(spd>this.targetSpd*2.2){const f=this.targetSpd*2.2/spd;this.vx*=f;this.vy*=f;}
  this.kiteCD=0.12;
 }
 _fireArrow(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const isCrit=Math.random()<(this.critChance||0);
  const bonus=this.volleyDmgBonus||0;
  const critMult=isCrit?2+(this.critDamageBonus||0):1;
  const spd=470,dmg=(this.d.dmg+3+bonus)*this.dmgMult*critMult;
  if(!isFinite(dmg)||dmg<=0)return; // NaN/Infinity guard
  const arr=new Arrow(tip.x,tip.y,wx*spd,wy*spd,dmg,this);
  arr.isCrit=isCrit;
  projectiles.push(arr);
  if(isCrit)spawnSpark(tip.x,tip.y,'#ff4400',6);
 }
 _fireVolleyBurst(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const isCrit=Math.random()<(this.critChance||0);
  const bonus=this.volleyDmgBonus||0;
  const critMult=isCrit?2+(this.critDamageBonus||0):1;
  const spd=470,dmg=(this.d.dmg+3+bonus)*this.dmgMult*critMult;
  if(!isFinite(dmg)||dmg<=0)return; // NaN/Infinity guard
  const angles=[0,-0.22,0.22,-0.44,0.44];
  for(const a of angles){
   const cos=Math.cos(a),sin=Math.sin(a);
   const arr=new Arrow(tip.x,tip.y,(wx*cos-wy*sin)*spd,(wx*sin+wy*cos)*spd,dmg,this);
   arr.isCrit=isCrit;
   projectiles.push(arr);
  }
  if(isCrit)spawnSpark(tip.x,tip.y,'#ff4400',10);
  else spawnSpark(tip.x,tip.y,this.d.rim,8);
 }
 _fireFlameBolt(){
  const en=(this._nearestEnemy()||{}).enemy;if(!en)return;
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const ROD_COLORS=['#ffee00','#ff4400','#44aaff','#ffffff','#886633'];
  const bolt=new FlameBolt(tip.x,tip.y,wx*420,wy*420,(this.d.dmg+5)*this.dmgMult,this);
  if(this.rodActive){bolt.rodType=this.rodType;bolt.rodCol=ROD_COLORS[this.rodType];bolt.effectPower=this.wizardStaffPower||0;}
  projectiles.push(bolt);
  // Wizard-only projectile cast audio.
  if(this.key==='wizard')_playSphereAudio(this.key,'projectileThrow');
 }
 _fireSkullOrb(){
  const en=(this._nearestEnemy()||{}).enemy;if(!en)return;
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  projectiles.push(new SkullOrb(tip.x,tip.y,wx*450,wy*450,(this.d.dmg+2)*this.dmgMult,this));
 }
 _fireGrapplingHook(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const hook=new GrapplingHook(tip.x,tip.y,wx*500,wy*500,this.d.dmg*1.5,this);
  projectiles.push(hook);
  spawnSpark(tip.x,tip.y,'#ffcc02',6);
 }
 _fireBola(){
  let nearest=null,nearDist=Infinity;
  for(const s of spheres){
   const isEnemy=!sameFaction(this,s);
   if(!isEnemy||!s.alive||s.dying)continue;
   const d=Math.hypot(s.x-this.x,s.y-this.y);
   if(d<nearDist){nearDist=d;nearest=s;}
  }
  if(!nearest)return;
  const dx=nearest.x-this.x,dy=nearest.y-this.y,dist=nearDist||1;
  const spd=620;
  projectiles.push(new Bola(this.x,this.y,(dx/dist)*spd,(dy/dist)*spd,this));
  spawnSpark(this.x,this.y,'#d4a83a',6);
  spawnBurst(this.x,this.y,'#d4a83a',this.d.color,8);
 }
 _fireSheriffBullet(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  projectiles.push(new SheriffBullet(tip.x,tip.y,wx*580,wy*580,(this.d.dmg+2)*this.dmgMult,this));
 }
 _firePiercingShot(target){
  if(target){
   const dx=target.x-this.x,dy=target.y-this.y;
   this.angle=Math.atan2(dy,dx);
  }
  this.sheriffSwitching=true;this.sheriffSwitchT=0.55;
  if(target){target._sheriffArmPen=true;}
  const snapAngle=this.angle;
  const owner=this;
  const doFire=()=>{
   if(!target||!target.alive||target.dying)return;
   const dx=target.x-owner.x,dy=target.y-owner.y;
   owner.angle=Math.atan2(dy,dx);
   const tip=owner.getTip();
   const dist=Math.hypot(dx,dy)||1;
   projectiles.push(new PiercingBullet(tip.x,tip.y,(dx/dist)*700,(dy/dist)*700,owner,target,32));
   spawnSpark(tip.x,tip.y,'#c8b840',8);
  };
  setTimeout(doFire,220);
 }
 _fireHolyOrb(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const spd=200; // starts slow — homing will guide it
  projectiles.push(new HolyOrb(tip.x,tip.y,wx*spd,wy*spd,(this.d.dmg+2)*this.dmgMult,this,false));
 }
 _fireMusicNote(){
  const tip=this.getTip();
  const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
  const spd=340;
  const note=new SonicProjectile(tip.x,tip.y,wx*spd,wy*spd,(this.d.dmg+2)*this.dmgMult,this);
  projectiles.push(note);
 }
  _shadowStepBounce(){
   if(this.shadowStepCD>0)return;
   this.shadowStepCD=3.0;
   this.shadowStepActive=true;this.shadowStepT=0.35;
  this.untargetable=true;
  spawnBurst(this.x,this.y,this.d.rim,'#1a1a2e',10);
  // fire 2 shurikens toward nearest enemy
  const en=(this._nearestEnemy()||{}).enemy;
  if(en){
   const dx=en.x-this.x,dy=en.y-this.y,dist=Math.hypot(dx,dy)||1;
   const spd=520;
   const spreads=[-0.18,0.18];
   for(const sp of spreads){
    const ca=Math.cos(sp),sa=Math.sin(sp);
    const vx=(dx/dist*ca-dy/dist*sa)*spd;
    const vy=(dx/dist*sa+dy/dist*ca)*spd;
    projectiles.push(new Shuriken(this.x,this.y,vx,vy,this.d.dmg*1.2,this));
    }
   }
  }
  _phoenixAddEmber(amount){
   if(this.key!=='phoenix'||!isFinite(amount)||amount<=0)return;
   const before=this.phoenixEmber||0;
   this.phoenixEmber=Math.min(100,before+amount);
   if(before<100&&this.phoenixEmber>=100){
    this.phoenixEmberFlash=0.75;
    spawnDmgNum(this.x,this.y-this.radius*1.6,'EMBER','#ffcc02');
    spawnSpark(this.x,this.y,'#ffcc02',8);
   }
  }
  _releasePhoenixEmber(target,hx,hy){
   if(this.key!=='phoenix'||(this.phoenixEmber||0)<100)return false;
   if(!target||!target.alive||target.dying)return false;
   this.phoenixEmber=0;this.phoenixEmberFlash=0.35;
   const dx=target.x-this.x,dy=target.y-this.y,dist=Math.hypot(dx,dy)||1;
   const burstDmg=(this.ashwingActive?9:7);
   target.receiveDamage(burstDmg);
   target.applyImpact((dx/dist)*135,(dy/dist)*135);
   spawnBurst(hx,hy,'#ffcc02','#ff4400',16);
   spawnDmgNum(target.x,target.y-target.radius*1.6,'EMBER','#ffcc02');
   return true;
  }
  _startVikingRageSpin(){
   this.vikingRageSpinActive=true;this.vikingRageSpinT=6.0;
   this.dmgMult=1.6;
   this.omegaCur=(this.d.om+4.0)*Math.sign(this.omegaCur||1);
   spawnBurst(this.x,this.y,this.d.rim,'#c8a030',18);
   spawnDmgNum(this.x,this.y-this.radius*1.6,'RAGE SPIN','#c8a030');
  }
  _triggerVikingLastStand(){
   if(this.key!=='viking'||this.vikingLastStandUsed)return false;
   this.vikingLastStandUsed=true;this.vikingLastStandActive=true;this.vikingLastStandT=6.0;
   this.hp=1;this.stacks=Math.max(this.stacks,4);
   this._startVikingRageSpin();
   spawnBurst(this.x,this.y,'#c8a030',this.d.rim,26);
   spawnDmgNum(this.x,this.y-this.radius*1.8,'LAST STAND','#c8a030');
   return true;
  }
  _onHolyChargeCollision(target,nx,ny){
   if(!this.holyChargeActive||this.holyChargeCollisionCD>0||!target||!target.alive||target.dying)return;
   this.holyChargeCollisionCD=0.25;
   const remainingCap=Math.max(0,5.0-(this.holyChargeElapsed||0));
   this.holyChargeT=Math.min(remainingCap,this.holyChargeT+0.4);
   this.invincible=true;this.invincibleT=Math.max(this.invincibleT,this.holyChargeT);
   target.receiveDamage(this.d.dmg*2.0);
   target.applyImpact(nx*260,ny*260);
   spawnBurst(target.x,target.y,'#fffacc','#c8b870',10);
   spawnDmgNum(this.x,this.y-this.radius*1.4,'+0.4s','#fffacc');
  }
  _triggerPhoenixRebirth(){
   if(this.key!=='phoenix'||this.rebirthDone)return false;
   this.rebirthDone=true;
   this.hp=this.maxHp*0.35;
   this.invincible=true;this.invincibleT=1.2;
   this.ashwingActive=true;this.ashwingT=1.4;
   this.phoenixEmber=100;this.phoenixEmberFlash=0.75;
   this.targetSpd=this.baseSpd*1.18;
   this.omegaCur=this.d.om*1.35*Math.sign(this.omegaCur||1);
   spawnBurst(this.x,this.y,'#ffcc02','#ff4400',36);
   spawnPulse(this.x,this.y,'#ffcc02');
   spawnDmgNum(this.x,this.y-this.radius*1.7,'REBIRTH','#ffcc02');
   const flareR=this.radius*3.0;
   for(const s of spheres){
    if(sameFaction(this,s)||!s.alive||s.dying)continue;
    const dx=s.x-this.x,dy=s.y-this.y,dist=Math.hypot(dx,dy)||1;
    if(dist>flareR+s.radius)continue;
    s.applyImpact((dx/dist)*260,(dy/dist)*260);
    s.receiveDamage(6);
    spawnSpark(s.x,s.y,'#ffcc02',5);
   }
   return true;
  }
  getTip(){
   const reach=this.radius*this.d.reach;
   return{x:this.x+Math.cos(this.angle)*reach,y:this.y+Math.sin(this.angle)*reach};
  }
 getBladePoints(){
  const pts=[];const steps=5;
  for(let i=1;i<=steps;i++){
   const t=i/steps,reach=this.radius*this.d.reach*t;
   pts.push({x:this.x+Math.cos(this.angle)*reach,y:this.y+Math.sin(this.angle)*reach});
  }
  // Rogue daggers and monk quarterstaff extend in both directions — add back-blade points
  // so hasHitThisSwing resets correctly when either end is in contact with the enemy
  if(this.key==='rogue'||this.key==='monk'||this.key==='vampire'||this.key==='spartan'||this.key==='gladiator'){
   for(let i=1;i<=steps;i++){
    const t=i/steps,reach=this.radius*this.d.reach*t;
    pts.push({x:this.x+Math.cos(this.angle+Math.PI)*reach,y:this.y+Math.sin(this.angle+Math.PI)*reach});
   }
  }
  return pts;
 }
 receiveHeal(amount){
  if(amount<=0)return 0;
  const actual=this.woundT>0?amount*0.5:amount;
  const prevHp=this.hp;
  this.hp=Math.min(this.maxHp,this.hp+actual);
  const gained=this.hp-prevHp;
  if(gained>=0.5)spawnHealNum(this.x,this.y-this.radius,gained);
  return gained;
 }
 _consumeGuardianSanctuary(){
  if(this.key!=='guardian')return false;
  const zone=slowZones.find(z=>z instanceof GuardianSanctuaryZone&&z.owner===this&&z.contains(this));
  if(!zone)return false;
  zone.consume();
  spawnBurst(this.x,this.y,'#80cbc4','#e0f7fa',18);
  spawnDmgNum(this.x,this.y-this.radius*1.3,'SANCTUARY','#80cbc4');
  return true;
 }
 _recordLiveCombatDamage(dealt){
  const source=window._balanceDamageSource||(window._liveCurrentAbilityKey?{key:window._liveCurrentAbilityKey,type:'ability'}:null);
  if(!window._liveCombatTracker||!source||!isFinite(dealt)||dealt<=0)return;
  if(source.type==='projectile')window._liveCombatTracker.onProjectileHit(source.key,dealt);
  else if(source.type==='passive')window._liveCombatTracker.onPassiveTrigger(source.key,dealt);
  else window._liveCombatTracker.onDamage(source.key,dealt,source.type||'base');
 }
 receiveDamage(dmg){
  if(this.dying)return;
  if(this.invincible)return; // knight bubble
  if(this.vikingLastStandActive)return;
  if(this.untargetable)return; // vampire ghost mode
  if(!isFinite(dmg)||dmg<=0)return;
  if(this._consumeGuardianSanctuary())return;
  if(this.replicaKind==='phase'){this._destroyReplica('POOF');return;}
  let fd=dmg;
  if(this.key==='templar'){
   const anchor=Math.max(0,Math.min(1,this.templarAnchor||0));
   fd*=0.85-(0.30*anchor);
  }
  if(this.key==='golem')fd*=0.65;
  if(this.key==='guardian'&&this.phalanxActive)fd*=0.45;
  if(this.sepsisWeakenedT>0)fd*=1.15;
  if(this.key==='prince'&&this.princeRoyalShield>0&&this.princeRoyalShieldT>0&&fd>0){
   const absorbed=Math.min(fd,this.princeRoyalShield);
   this.princeRoyalShield-=absorbed;fd-=absorbed;
   spawnSpark(this.x,this.y,'#8bb7ff',4);
   if(this.princeRoyalShield<=0)this._breakPrinceRoyalShield();
  }
  if(this.priestShieldStacks>0&&fd>0){
   const shieldHP=this.priestShieldStacks*2;
   if(fd<=shieldHP){
    const stacksConsumed=Math.ceil(fd/2);
    this.priestShieldStacks=Math.max(0,this.priestShieldStacks-stacksConsumed);
    spawnSpark(this.x,this.y,'#fff8c0',4);
    fd=0; // fully absorbed
   } else {
    const absorbed=shieldHP;
    this.priestShieldStacks=0;this.priestShieldT=0;
    fd-=absorbed;
    spawnSpark(this.x,this.y,'#fff8c0',4);
   }
  }
  // Barbarian — Bloodlust resets when hit
  if(this.key==='barbarian'&&fd>0.5){this.bloodlustBonus=0;this.targetSpd=this.baseSpd;}
  // Crusader — Retribution counter charges on taking damage
  if(this.key==='crusader'&&fd>0.5){this.retributionCounter=Math.min(60,(this.retributionCounter||0)+fd);}
  this.hp=Math.max(0,this.hp-fd);this.hitFlash=1;
  if(window._liveCombatTracker&&fd>0)this._recordLiveCombatDamage(fd);
  if(this.key==='flagellant')this._flagellantApplyWounds();
  if(this.key==='sage'&&fd>0){const gain=Math.floor(fd/10);if(gain>0){this.knowledge=(this.knowledge||0)+gain;this.d=Object.assign({},this.d);this.d.dmg+=gain*.25;this.d.magDef+=gain*2;}}
  if(this.key==='arcanist'&&fd>0){this.arcaneCharge=0;this.applyImpact((Math.random()-.5)*160,(Math.random()-.5)*160);}
  if(this.key==='gladiator'&&fd>0)this.favor=Math.max(0,(this.favor||0)-3);
  if(fd>0.5)spawnBloodSplat(this.x,this.y,this.d.color,fd);
  if(fd>0.2){
   const col=fd>=15?'#ff4444':fd>=6?'#ffaa22':'#ffffff';
   spawnDmgNum(this.x,this.y-this.radius*0.5,fd,col);
  }
  if(this.canTriggerTraits!==false&&!this.lowHpBuffApplied&&this.hp/this.maxHp<0.30&&this.hp>0){
   this.lowHpBuffApplied=true;
   this._applyLowHpBuff();
  }
  if(this.hp<=0&&!this.dying){
   if(this._triggerPhoenixRebirth())return; // don't die
   if(this._triggerVikingLastStand())return;
   this.alive=false;this.dying=true;spawnBurst(this.x,this.y,this.d.rim,this.d.color,28);}
 }
 receiveMagicDamage(dmg){
  if(this.dying)return;
  if(this.invincible)return;
  if(this.vikingLastStandActive)return;
  if(this.untargetable)return; // vampire ghost mode / dragoon leap
  if(!isFinite(dmg)||dmg<=0)return;
  if(this._consumeGuardianSanctuary())return;
  if(this.replicaKind==='phase'){this._destroyReplica('POOF');return;}
  // Wyrmscale passive — absorb one magic hit completely
  if(this.key==='dragoon'&&this.magicShield){
   this.magicShield=false;this.shieldTimer=0;
   spawnBurst(this.x,this.y,'#4488cc','#88bbdd',12);
   spawnSpark(this.x,this.y,'#4488cc',8);
   spawnDmgNum(this.x,this.y-this.radius*0.5,0,'#4488cc');
   return;
  }
  let fd=dmg/(this.d.magDef*0.004+1);
  if(this.sepsisWeakenedT>0)fd*=1.15;
  if(this.key==='prince'&&this.princeRoyalShield>0&&this.princeRoyalShieldT>0&&fd>0){
   const absorbed=Math.min(fd,this.princeRoyalShield);
   this.princeRoyalShield-=absorbed;fd-=absorbed;
   spawnSpark(this.x,this.y,'#8bb7ff',4);
   if(this.princeRoyalShield<=0)this._breakPrinceRoyalShield();
  }
  if(this.priestShieldStacks>0&&fd>0){
   const shieldHP=this.priestShieldStacks*2;
   if(fd<=shieldHP){
    const stacksConsumed=Math.ceil(fd/2);
    this.priestShieldStacks=Math.max(0,this.priestShieldStacks-stacksConsumed);
    spawnSpark(this.x,this.y,'#fff8c0',4);
    fd=0;
   } else {
    const absorbed=shieldHP;
    this.priestShieldStacks=0;this.priestShieldT=0;
    fd-=absorbed;
    spawnSpark(this.x,this.y,'#fff8c0',4);
   }
  }
  if(fd<=0)return;
  this.hp=Math.max(0,this.hp-fd);this.hitFlash=1;
  if(window._liveCombatTracker&&fd>0)this._recordLiveCombatDamage(fd);
  if(this.key==='flagellant')this._flagellantApplyWounds();
  if(fd>0.5)spawnBloodSplat(this.x,this.y,this.d.color,fd);
  if(fd>0.2){
   spawnDmgNum(this.x,this.y-this.radius*0.5,fd,'#cc88ff');
  }
  if(this.canTriggerTraits!==false&&!this.lowHpBuffApplied&&this.hp/this.maxHp<0.30&&this.hp>0){
   this.lowHpBuffApplied=true;this._applyLowHpBuff();
  }
  if(this.hp<=0&&!this.dying){
   if(this._triggerPhoenixRebirth())return;
   if(this._triggerVikingLastStand())return;
   this.alive=false;this.dying=true;spawnBurst(this.x,this.y,this.d.rim,this.d.color,28);
  }
 }
 _applyLowHpBuff(){
  if(this.canTriggerTraits===false)return;
  this.d=Object.assign({},this.d);
  this.d.dmg*=1.17;this.d.arm=Math.round(this.d.arm*1.17);
  this.d.om*=1.17;this.d.spd*=1.17;
  this.baseSpd*=1.17;this.targetSpd*=1.17;
  this.omegaCur*=1.17;
  spawnBurst(this.x,this.y,'#ff8800',this.d.rim,20);
  if(window._balanceCombatTracker)window._balanceCombatTracker.onPassiveTrigger(this.key,0);
  if(window._liveCombatTracker)window._liveCombatTracker.onPassiveTrigger(this.key,0);
  if(typeof updateBattleHud==='function')updateBattleHud();
 }
 _applyHitBuff(){
  if(this.canTriggerTraits===false)return;
  this.hitBuffStacks++;
  this.d=Object.assign({},this.d);
  this.d.dmg*=1.004;
  this.d.arm=Math.round(this.d.arm*1.004);
  this.d.om*=1.004;
  const sign=Math.sign(this.omegaCur)||1;
  this.omegaCur=Math.abs(this.omegaCur)*1.004*sign;
  if(this.key==='gladiator'){
   this.favor=Math.min(10,(this.favor||0)+0.5);
   this.targetSpd=this.baseSpd+this.favor*2;
   this.omegaCur=(Math.sign(this.omegaCur)||1)*(this.d.om+this.favor*.12);
   if(this.favor>=10){this.crowdDouble=true;spawnDmgNum(this.x,this.y-this.radius*1.7,'FAVOR!','#ffd35a');spawnBurst(this.x,this.y,'#ffd35a','#f0c08a',16);}
  }
  if(this.key==='beastmaster'){
   if(noiseTraps.filter(n=>n instanceof BeastCompanion&&n.owner===this&&n.kind==='ferret'&&n.alive).length<8){
    const a=this.angle+Math.PI+(Math.random()-.5)*.8;
    noiseTraps.push(new BeastCompanion(this.x+Math.cos(a)*this.radius,this.y+Math.sin(a)*this.radius,this,'ferret'));
   }
  }
  if(this.key==='sheriff'){
   if(!this.sheriffReloading){
    this.sheriffHitCount++;
    if(this.sheriffHitCount>=2){
     this.sheriffHitCount=0;
     this._fireBola();
    }
   } else {
    this.sheriffHitCount=Math.min(1,this.sheriffHitCount+1);
   }
  }
 }
 draw(){
  if(!this.alive&&this.dyingT>0.7)return;
  const alpha=this.dying?Math.max(0,1-this.dyingT/0.7):1;
  const leapAlpha=this.isLeaping?Math.max(0.0,1.0-(1.2-this.leapT)/1.2):1;
  let baseAlpha=this.phaseOut?alpha*0.45:this.ghostMode?alpha*0.30:alpha*leapAlpha;if(this.queenInvisible)baseAlpha=alpha*.08;
  if(this.isReplica)baseAlpha*=this.replicaKind==='phase'?0.58:0.84;
  // Shadow + warning drawn inside _passiveAbility during leap — nothing extra needed here
  ctx.save();ctx.globalAlpha=baseAlpha;
  if(this.pulseWave){ctx.save();ctx.globalAlpha=baseAlpha*this.pulseWave.life*.45;ctx.beginPath();ctx.arc(this.x,this.y,this.pulseWave.r,0,Math.PI*2);ctx.strokeStyle=this.d.rim;ctx.lineWidth=5;ctx.stroke();ctx.restore();}
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
  if(WEAPONS[this.d.wt])WEAPONS[this.d.wt](ctx,this.radius,this.d,this);
  ctx.restore();
  this._drawBody();
  this._drawPowerOverlay();
  if(this.stacks>0&&!this.dying&&this.key!=='sheriff'){
   const total=getStackDisplayThreshold(this.key);
   const pip=4,gap=6;
   const startX=this.x-((total-1)*gap)/2;
   for(let i=0;i<total;i++){ctx.fillStyle=i<this.stacks?this.d.rim:'#334';ctx.beginPath();ctx.arc(startX+i*gap,this.y+this.radius+15,pip/2,0,Math.PI*2);ctx.fill();}
  }
  if(!this.dying){
   const fs=Math.max(6,this.radius*.42);
   ctx.font=`bold ${fs}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
   const txt=Math.ceil(this.hp).toString();
   ctx.fillStyle='#000';for(const[ox,oy]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,-2],[0,2],[-2,0],[2,0]])ctx.fillText(txt,this.x+ox,this.y+oy);
   ctx.fillStyle=this.hitFlash>.5?'#ffff44':'#fff';ctx.fillText(txt,this.x,this.y);
   if(this.key==='sage'&&(this.knowledge||0)>0){ctx.fillStyle='#d6f0b2';ctx.font=`bold ${Math.max(5,this.radius*.25)}px 'Press Start 2P',monospace`;ctx.fillText(`KNOW ${this.knowledge}`,this.x,this.y-this.radius-16);}
   if(this.key==='king'&&(this.sovereignArmBonus||0)>0){ctx.fillStyle='#ffd35a';ctx.font=`bold ${Math.max(7,this.radius*.32)}px serif`;ctx.fillText('♛'.repeat(Math.min(5,Math.ceil(this.sovereignArmBonus/6))),this.x,this.y-this.radius-16);}
  }
  ctx.restore();
  if(!this.dying){this._drawHpBar();this._drawStatusEffectBadges();}
 }
 _drawPowerOverlay(){
  const r=this.radius,p=0.5+0.5*Math.sin(Date.now()*.016);
  if(this.invincible){
   ctx.shadowColor='#fff';ctx.shadowBlur=20;
   ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,255,255,${.7+p*.3})`;ctx.lineWidth=4;ctx.stroke();
   ctx.shadowBlur=0;
  }
  if(this.key==='king'&&this.decreeT>0){const rr=r*2.5+p*4;ctx.shadowColor='#ffd35a';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(this.x,this.y,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(255,211,90,${.58+p*.32})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
  if(this.queenInvisible){ctx.shadowColor='#ffb8e6';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(this.x,this.y,r+5+p*2,0,Math.PI*2);ctx.strokeStyle=`rgba(255,184,230,${.35+p*.25})`;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;}
  if(this.isReplica){
   ctx.beginPath();ctx.arc(this.x,this.y,r+5+p*2,0,Math.PI*2);
   ctx.strokeStyle=this.replicaKind==='phase'?`rgba(224,247,250,${0.45+p*0.25})`:`rgba(224,247,250,${0.65+p*0.25})`;
   ctx.lineWidth=this.replicaKind==='phase'?2:3;
   ctx.setLineDash(this.replicaKind==='phase'?[4,4]:[7,3]);
   ctx.stroke();ctx.setLineDash([]);
  }
  if(this.spiralActive){ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.strokeStyle='rgba(255,220,80,.9)';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.ramActive){ctx.beginPath();ctx.arc(this.x,this.y,r+5+p*5,0,Math.PI*2);ctx.strokeStyle=`rgba(255,55,0,${.55+p*.4})`;ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.orbitActive){ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);ctx.strokeStyle=`rgba(255,50,50,${.6+p*.3})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
  if(this.blinking){ctx.shadowColor=this.d.rim;ctx.shadowBlur=22;ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.strokeStyle=this.d.rim;ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.backstabCharged){ctx.shadowColor='#e74c3c';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.strokeStyle='rgba(231,76,60,.85)';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.draining){ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);ctx.strokeStyle=`rgba(255,100,0,${.4+p*.4})`;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;}
  if(this.phalanxActive){ctx.shadowColor='#80cbc4';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(this.x,this.y,r+7,0,Math.PI*2);ctx.strokeStyle='rgba(128,203,196,.75)';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.fortified){ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.strokeStyle=`rgba(176,190,197,${.6+p*.3})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
  if(this.rebirthDone){ctx.shadowColor=this.d.rim;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.strokeStyle=`rgba(255,200,0,${.55+p*.4})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
  if(this.key==='phoenix'){
   const ep=Math.min(1,(this.phoenixEmber||0)/100);
   if(ep>0){
    ctx.beginPath();ctx.arc(this.x,this.y,r+7,-Math.PI/2,-Math.PI/2+Math.PI*2*ep);
    ctx.strokeStyle=`rgba(255,${Math.round(90+ep*150)},0,${0.25+ep*0.55})`;ctx.lineWidth=2+ep*2;ctx.stroke();
   }
   if(this.ashwingActive||ep>=1){
    ctx.shadowColor='#ffcc02';ctx.shadowBlur=14+(this.phoenixEmberFlash||0)*10;
    ctx.beginPath();ctx.arc(this.x,this.y,r+11+p*3,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,204,2,${0.45+p*0.35})`;ctx.lineWidth=this.ashwingActive?3.5:2.5;ctx.stroke();
    ctx.shadowBlur=0;
   }
  }
  // Samurai — Iaijutsu ready: golden flash ring
  if(this.iaijutsuReady){ctx.shadowColor='#c8c0a8';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.strokeStyle=`rgba(200,192,168,${0.7+p*0.3})`;ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#c8c0a8';ctx.fillText('IAI',this.x,this.y-r-30);}
  // Berserker — Iron Will active: red pulsing shield
  if(this.ironWillActive){ctx.shadowColor='#ff4444';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(this.x,this.y,r+9,0,Math.PI*2);ctx.strokeStyle=`rgba(255,68,68,${0.65+p*0.35})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
  // Ninja — Shadow Step active: purple ghost ring
  if(this.shadowStepActive){ctx.shadowColor='#9b59b6';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(this.x,this.y,r+7,0,Math.PI*2);ctx.strokeStyle=`rgba(155,89,182,${0.6+p*0.35})`;ctx.lineWidth=3;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;}
  // Barbarian — Bloodlust stacks: speed glow
  if(this.bloodlustBonus>0){const bl=this.bloodlustBonus/60;ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);ctx.strokeStyle=`rgba(255,${Math.round(80+bl*80)},0,${0.35+bl*0.45})`;ctx.lineWidth=2+bl*2;ctx.stroke();}
  // Rogue — bleed indicator on bleeding target
  if(this.bleedStacks>0){ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.textBaseline='bottom';
   const bleedY=this.corrosionStacks>0&&this.blinded?(this.y-r-58):this.corrosionStacks>0||this.blinded?(this.y-r-44):(this.y-r-30);
   ctx.fillStyle='#e74c3c';ctx.fillText(`BLEED x${this.bleedStacks}`,this.x,bleedY);}
  // Bard — Crescendo active: purple halo
  if(this.crescendoActive){ctx.shadowColor='#e040fb';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.strokeStyle=`rgba(224,64,251,${0.7+p*0.3})`;ctx.lineWidth=3.5;ctx.stroke();ctx.shadowBlur=0;}
  // Knight — Stalwart stacks: dim blue aura building up
  if(this.stalwartStacks>0){const sf=this.stalwartStacks/30;ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);ctx.strokeStyle=`rgba(216,234,248,${0.2+sf*0.5})`;ctx.lineWidth=1.5+sf*2;ctx.stroke();}
  // New roster polish: passive/ability identity rings and counters.
  if(this.key==='witch'){
   ctx.strokeStyle=`rgba(215,123,255,${0.25+p*0.35})`;ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(this.x,this.y,r+7+p*3,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   for(let i=0;i<4;i++){const a=Date.now()*.002+i*Math.PI/2;ctx.fillStyle=i<this.stacks?'#d77bff':'rgba(215,123,255,.22)';ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+13),this.y+Math.sin(a)*(r+13),2.4,0,Math.PI*2);ctx.fill();}
  }
  if(this.key==='spartan'){
   const iron=Math.min(5,this.ironStacks||0);if(iron>0){ctx.strokeStyle=`rgba(216,176,96,${.25+iron*.1})`;ctx.lineWidth=2+iron*.35;ctx.beginPath();ctx.arc(this.x,this.y,r+5+iron,Math.PI*.62,Math.PI*1.38);ctx.stroke();}
   if(this.ramActive){ctx.strokeStyle=`rgba(255,211,90,${.55+p*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(this.x+Math.cos(this.angle)*r*.4,this.y+Math.sin(this.angle)*r*.4);ctx.lineTo(this.x+Math.cos(this.angle)*(r+32),this.y+Math.sin(this.angle)*(r+32));ctx.stroke();}
  }
  if(this.key==='gladiator'){
   const fv=Math.min(10,this.favor||0);if(fv>0){ctx.strokeStyle=`rgba(255,211,90,${.18+fv*.055})`;ctx.lineWidth=2+fv*.18;ctx.beginPath();ctx.arc(this.x,this.y,r+4+fv*.55,-Math.PI/2,-Math.PI/2+Math.PI*2*(fv/10));ctx.stroke();}
   if(this.crowdDouble||fv>=10){ctx.shadowColor='#ffd35a';ctx.shadowBlur=16;ctx.strokeStyle=`rgba(255,211,90,${.65+p*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(this.x,this.y,r+12+p*3,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;}
  }
  if(this.key==='king'){
   if(this.decreeT>0){ctx.shadowColor='#ffd35a';ctx.shadowBlur=18;ctx.strokeStyle=`rgba(255,211,90,${.55+p*.35})`;ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,rr=r*1.38+(i%2)*r*.25;ctx.lineTo(this.x+Math.cos(a)*rr,this.y+Math.sin(a)*rr);}ctx.closePath();ctx.stroke();ctx.shadowBlur=0;}
  }
  if(this.key==='queen'){
   if(this.queenGambitT>0){ctx.shadowColor=this.d.color;ctx.shadowBlur=18;ctx.strokeStyle=`rgba(255,139,209,${.55+p*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(this.x,this.y,r+10+p*4,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ff8bd1';ctx.font=`bold ${Math.max(5,r*.2)}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.fillText('TRUE',this.x,this.y-r-44);}
   ctx.strokeStyle=`rgba(255,139,209,${.16+p*.12})`;ctx.lineWidth=2;ctx.setLineDash([8,5]);ctx.beginPath();ctx.arc(this.x,this.y,r*2.9,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   if(this.queenDmgBonus>0){ctx.fillStyle='#ff8bd1';ctx.font=`bold ${Math.max(5,r*.2)}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.fillText(`MENACE +${Math.round(this.queenDmgBonus*100)}%`,this.x,this.y-r-28);}
  }
  if(this.key==='prince'){
   const wb=Math.min(5,this.wallBounceBonus||0);if(wb>0){ctx.strokeStyle=`rgba(139,183,255,${.22+wb*.1})`;ctx.lineWidth=2+wb*.25;ctx.beginPath();ctx.arc(this.x,this.y,r+5+wb*1.5,0,Math.PI*2);ctx.stroke();}
   if(this.rushT>0){ctx.strokeStyle=`rgba(139,183,255,${.55+p*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(this.x-Math.cos(this.angle)*(r+24),this.y-Math.sin(this.angle)*(r+24));ctx.lineTo(this.x-Math.cos(this.angle)*r*.3,this.y-Math.sin(this.angle)*r*.3);ctx.stroke();}
  }
  if(this.key==='fairy'){
   ctx.strokeStyle=`rgba(255,240,255,${.28+p*.22})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(this.x,this.y,r+6+p*3,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<5;i++){const a=Date.now()*.003+i*Math.PI*2/5;ctx.fillStyle=i%2?'#ff8ce2':'#fff0ff';ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+11),this.y+Math.sin(a)*(r+11),1.8,0,Math.PI*2);ctx.fill();}
  }
  if(this.key==='beastmaster'){
   if(this.packHuntT>0){ctx.strokeStyle=`rgba(255,176,96,${.42+p*.32})`;ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(this.x,this.y,r+11+p*3,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  }
  if(this.key==='sage'){
   if(this.foresightT>0){ctx.strokeStyle=`rgba(214,240,178,${.55+p*.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(this.x,this.y,r+10+p*4,0,Math.PI*2);ctx.stroke();}
   if((this.knowledge||0)>0){const k=Math.min(1,this.knowledge/20);ctx.strokeStyle=`rgba(214,240,178,${.18+k*.42})`;ctx.lineWidth=2+k*3;ctx.beginPath();ctx.arc(this.x,this.y,r+4+k*8,0,Math.PI*2);ctx.stroke();}
  }
  if(this.key==='arcanist'){
   const ch=Math.min(1,(this.arcaneCharge||0)/5);if(ch>0){ctx.strokeStyle=`rgba(120,216,255,${.18+ch*.45})`;ctx.lineWidth=2+ch*2;ctx.beginPath();ctx.arc(this.x,this.y,r+5+ch*7,-Math.PI/2,-Math.PI/2+Math.PI*2*ch);ctx.stroke();}
   if(this.overloadActive){ctx.strokeStyle=`rgba(255,122,34,${.55+p*.35})`;ctx.lineWidth=4;ctx.setLineDash([4,3]);ctx.beginPath();ctx.arc(this.x,this.y,r+13+p*4,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  }
   const stackThresh=getStackDisplayThreshold(this.key);
  if(this.key!=='sheriff'&&this.stacks>=stackThresh){ctx.shadowColor=this.d.rim;ctx.shadowBlur=22;ctx.beginPath();ctx.arc(this.x,this.y,r+9,0,Math.PI*2);ctx.strokeStyle=`${this.d.rim}cc`;ctx.lineWidth=5;ctx.stroke();ctx.shadowBlur=0;}
  if(this.slowFieldActive){ctx.beginPath();ctx.arc(this.x,this.y,r*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,230,80,.22)';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;}
  if(this.snareActive){ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.strokeStyle='rgba(105,240,174,.7)';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
  if(this.woundT>0){
   const wp=0.5+0.5*Math.sin(Date.now()*.018);
   ctx.shadowColor='#9b00ff';ctx.shadowBlur=12;
   ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);
   ctx.strokeStyle=`rgba(155,0,255,${0.55+wp*0.35})`;ctx.lineWidth=2.5;ctx.setLineDash([3,4]);ctx.stroke();
   ctx.setLineDash([]);ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(5,r*.2)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='rgba(180,50,255,0.9)';ctx.fillText('WOUND',this.x,this.y-r-10);
  }
  if(this.deathMarkTicks>0){
   const t2=Date.now()*.005;
   for(let i=0;i<this.deathMarkTicks;i++){
    const a=i/this.deathMarkTicks*Math.PI*2+t2;
    ctx.fillStyle='rgba(124,77,255,.8)';ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+10),this.y+Math.sin(a)*(r+10),4,0,Math.PI*2);ctx.fill();
   }
  }
  if(this.lowHpBuffApplied){
   ctx.shadowColor='#ff8800';ctx.shadowBlur=16;
   ctx.beginPath();ctx.arc(this.x,this.y,r+12,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,136,0,${0.5+p*.5})`;ctx.lineWidth=3;ctx.stroke();
   ctx.shadowBlur=0;
  }
  if(this.hitBuffStacks>0){
   const intensity=Math.min(1,this.hitBuffStacks/50);
   ctx.beginPath();ctx.arc(this.x,this.y,r+2,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,220,80,${intensity*0.55})`;ctx.lineWidth=2+intensity*2;ctx.stroke();
   ctx.shadowBlur=0;
  }
  if(this.rodActive){
   const ROD_COLORS=['#ffee00','#ff4400','#44aaff','#ffffff','#886633'];
   const rc=ROD_COLORS[this.rodType];
   ctx.shadowColor=rc;ctx.shadowBlur=14;
   ctx.beginPath();ctx.arc(this.x,this.y,r+10,0,Math.PI*2);
   ctx.strokeStyle=rc;ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.stroke();
   ctx.setLineDash([]);ctx.shadowBlur=0;
   const ROD_NAMES=['⚡LIGHTNING','🔥FIRE','💧WATER','🌀WIND','🌍EARTH'];
   ctx.font=`bold ${Math.max(5,r*.28)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle=rc;ctx.fillText(ROD_NAMES[this.rodType],this.x,this.y-r-16);
  }
  if(this.volleyActive){
   ctx.beginPath();ctx.arc(this.x,this.y,r+7+p*4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(136,204,68,${0.6+p*.4})`;ctx.lineWidth=2.5;ctx.stroke();
   ctx.shadowBlur=0;
   for(let i=0;i<this.volleyBurstsLeft;i++){
    ctx.fillStyle='#88cc44';ctx.beginPath();
    ctx.arc(this.x+(i-1)*8,this.y+r+20,3,0,Math.PI*2);ctx.fill();
   }
  }
  if(this.stunned){
   ctx.shadowColor='#886633';ctx.shadowBlur=14;
   ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);
   ctx.strokeStyle='rgba(136,102,51,0.9)';ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;
  }
  if(this.burning){
   ctx.beginPath();ctx.arc(this.x,this.y,r+4+p*3,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,68,0,${0.6+p*.4})`;ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;
  }
  if(this.waterSlow>0){
   ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);
   ctx.strokeStyle=`rgba(68,170,255,${0.4+this.waterSlow*0.2})`;ctx.lineWidth=2;
   ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
  }
  if(this.electrifiedT>0){
   const et=Date.now()*.02;
   ctx.shadowColor='#ffee00';ctx.shadowBlur=10;
   ctx.strokeStyle='rgba(255,238,0,0.8)';ctx.lineWidth=1.5;
   for(let i=0;i<3;i++){
    const a2=(i/3)*Math.PI*2+et;
    ctx.beginPath();ctx.arc(this.x+Math.cos(a2)*(r+4),this.y+Math.sin(a2)*(r+4),3,0,Math.PI*2);ctx.stroke();
   }
   ctx.shadowBlur=0;
  }
  if(this.wrathActive){
   ctx.shadowColor='#f0c040';ctx.shadowBlur=22;
   ctx.beginPath();ctx.arc(this.x,this.y,r+10,0,Math.PI*2);
   ctx.strokeStyle=`rgba(240,192,64,${0.7+p*.3})`;ctx.lineWidth=4;ctx.stroke();
   ctx.beginPath();ctx.arc(this.x,this.y,r*2.5,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,230,100,${0.15+p*.1})`;ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.stroke();
   ctx.setLineDash([]);ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(5,r*.25)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#f0c040';ctx.fillText('⚔WRATH',this.x,this.y-r-16);
  }
  if(this.wrathExhausted){
   ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(180,180,180,${0.4+p*.2})`;ctx.lineWidth=3;ctx.setLineDash([3,3]);ctx.stroke();
   ctx.setLineDash([]);
  }
  if(this.key==='pirate'&&this.draining){
   ctx.shadowColor='#ff7043';ctx.shadowBlur=12;
   ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,112,67,${0.4+p*.4})`;ctx.lineWidth=2;ctx.stroke();
   ctx.shadowBlur=0;
  }
  if(this.key==='sheriff'){
   const pipColors=['#d4a83a','#fff'];
   const total=getStackDisplayThreshold(this.key);
   const startX=this.x-((total-1)*8)/2;
   for(let i=0;i<total;i++){
    ctx.fillStyle=i<this.sheriffHitCount?pipColors[i]:'#334';
    ctx.beginPath();ctx.arc(startX+i*8,this.y+r+20,3.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#000';ctx.lineWidth=0.5;ctx.stroke();
   }
   if(this.sheriffReloading){
    const pct=1-(this.sheriffReloadT/(this.sheriffReloadDuration||0.75));
    ctx.shadowColor='#d4a83a';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(this.x,this.y,r+8,-(Math.PI/2),(Math.PI*2*pct)-(Math.PI/2));
    ctx.strokeStyle='rgba(212,168,58,0.8)';ctx.lineWidth=3;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#d4a83a';ctx.fillText('RELOAD',this.x,this.y-r-14);
   } else {
    for(let i=0;i<6;i++){
     const a=(i/6)*Math.PI*2-(Math.PI/2);
     ctx.fillStyle=i<this.sheriffCylinder?'#d4a83a':'#334';
     ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+10),this.y+Math.sin(a)*(r+10),2.5,0,Math.PI*2);ctx.fill();
    }
   }
   if(this.sheriffHitCount>=1){
    ctx.shadowColor='#d4a83a';ctx.shadowBlur=14;
    ctx.beginPath();ctx.arc(this.x,this.y,r+6+p*3,0,Math.PI*2);
    ctx.strokeStyle=`rgba(212,168,58,${0.7+p*.3})`;ctx.lineWidth=2.5;ctx.stroke();
    ctx.shadowBlur=0;
   }
  }
  if(this.bolaRootT>0){
   ctx.strokeStyle=`rgba(212,168,58,0.8)`;ctx.lineWidth=3;ctx.setLineDash([4,3]);
   ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.stroke();
   ctx.setLineDash([]);
  }
  if(this.bolaSlowT>0){
   const pctSlow=this.bolaSlowT/2.0;
   ctx.shadowColor='#d4a83a';ctx.shadowBlur=8;
   ctx.strokeStyle=`rgba(180,140,30,${0.4+pctSlow*.4})`;ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(this.x,this.y,r+8,-(Math.PI/2),(Math.PI*2*pctSlow)-(Math.PI/2));
   ctx.stroke();
   ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(4,r*.2)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='rgba(212,168,58,0.8)';
   ctx.fillText('SLOW',this.x,this.y-r-10);
  }
  if(this.priestShieldStacks>0){
   const sIntensity=this.priestShieldStacks/10;
   const sTime=Date.now()*.002;
   ctx.shadowColor='#fff8c0';ctx.shadowBlur=12*sIntensity;
   ctx.beginPath();ctx.arc(this.x,this.y,r+7+p*3,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,248,192,${0.35+sIntensity*0.45})`;ctx.lineWidth=2.5;ctx.stroke();
   ctx.shadowBlur=0;
   const ang2=sTime*1.8;
   for(let i=0;i<4;i++){
    const a=ang2+(i/4)*Math.PI*2;
    ctx.fillStyle=`rgba(255,248,160,${0.5+sIntensity*0.4})`;
    ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+11),this.y+Math.sin(a)*(r+11),2.2,0,Math.PI*2);ctx.fill();
   }
   ctx.font=`bold ${Math.max(5,r*.24)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#fff8a0';
   ctx.fillText(`${this.priestShieldStacks*2}`,this.x,this.y-r-14);
  }
  if(this.benedictionActive){
   const bPulse=0.5+0.5*Math.sin(Date.now()*.012);
   ctx.shadowColor='#fff8a0';ctx.shadowBlur=16;
   ctx.beginPath();ctx.arc(this.x,this.y,r+10+bPulse*4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,248,160,${0.55+bPulse*0.35})`;ctx.lineWidth=3;ctx.stroke();
   ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#fff8a0';ctx.fillText('BLESS',this.x,this.y-r-14);
  }
  if(this.key==='inquisitor'){
   const curSpd=Math.hypot(this.vx,this.vy);
   const spdFrac=Math.min(1,curSpd/(this.baseSpd*1.5));
   if(spdFrac>0.2){
    ctx.shadowColor='#ff4400';ctx.shadowBlur=Math.round(6+spdFrac*12);
    ctx.beginPath();ctx.arc(this.x,this.y,r+2+spdFrac*4,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,${Math.round(68+spdFrac*100)},0,${0.3+spdFrac*0.6})`;
    ctx.lineWidth=1.5+spdFrac*2;ctx.stroke();ctx.shadowBlur=0;
   }
   if(this.pyreActive){
    const pp=0.5+0.5*Math.sin(Date.now()*.02);
    ctx.shadowColor='#ff4400';ctx.shadowBlur=20+pp*10;
    ctx.beginPath();ctx.arc(this.x,this.y,r*2.8,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,80,0,${0.25+pp*0.2})`;ctx.lineWidth=3+pp*3;ctx.stroke();
    ctx.beginPath();ctx.arc(this.x,this.y,r+8+pp*4,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,120,0,${0.6+pp*0.3})`;ctx.lineWidth=3;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#ff6600';ctx.fillText('PYRE',this.x,this.y-r-14);
    if(this.pyreArmBonus>0){
     ctx.fillStyle='#ff9900';ctx.fillText(`+${this.pyreArmBonus}ARM`,this.x,this.y-r-26);
    }
   }
   for(const h of this.heatTrails){
    const a=(h.life/h.maxLife)*0.5;
    ctx.save();ctx.globalAlpha=a;
    const g=ctx.createRadialGradient(h.x,h.y,0,h.x,h.y,h.r);
    g.addColorStop(0,'rgba(255,120,0,0.7)');g.addColorStop(1,'rgba(255,40,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,Math.PI*2);ctx.fill();
    ctx.restore();
   }
  }
  if(this.key==='vampire'){
   if(this.ghostMode){
    const swp=0.4+0.4*Math.sin(Date.now()*.018);
    ctx.shadowColor='#cc0044';ctx.shadowBlur=18;
    ctx.beginPath();ctx.arc(this.x,this.y,r+10+swp*5,0,Math.PI*2);
    ctx.strokeStyle=`rgba(200,0,68,${0.5+swp*0.4})`;ctx.lineWidth=3;ctx.setLineDash([4,3]);ctx.stroke();
    ctx.setLineDash([]);ctx.shadowBlur=0;
    const swarmPct=Math.max(0,this.swarmT/2.5);
    ctx.shadowColor='#cc0044';ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(this.x,this.y,r+14,-(Math.PI/2),(Math.PI*2*swarmPct)-(Math.PI/2));
    ctx.strokeStyle='rgba(200,0,68,0.7)';ctx.lineWidth=2.5;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#cc0044';ctx.fillText('SWARM',this.x,this.y-r-14);
   } else if(this.stacks>0){
    const sva=0.15+this.stacks*0.08;
    ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);
    ctx.strokeStyle=`rgba(200,0,68,${sva})`;ctx.lineWidth=2.5;ctx.stroke();
   }
  }
  if(this.key==='monk'){
   if(this.nirvanaActive){
    const np=0.5+0.5*Math.sin(Date.now()*.022);
    ctx.shadowColor='#ffe0a0';ctx.shadowBlur=20+np*10;
    ctx.beginPath();ctx.arc(this.x,this.y,r+10+np*6,0,Math.PI*2);
    ctx.strokeStyle=`rgba(255,224,160,${0.55+np*0.35})`;ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.arc(this.x,this.y,r*2.4,0,Math.PI*2);
    ctx.strokeStyle=`rgba(200,160,64,${0.2+np*0.15})`;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.stroke();
    ctx.setLineDash([]);ctx.shadowBlur=0;
    const nirvPct=Math.max(0,this.nirvanaT/2.0);
    ctx.beginPath();ctx.arc(this.x,this.y,r+14,-(Math.PI/2),(Math.PI*2*nirvPct)-(Math.PI/2));
    ctx.strokeStyle='rgba(255,224,160,0.8)';ctx.lineWidth=2.5;ctx.stroke();
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#ffe0a0';ctx.fillText('NIRVANA',this.x,this.y-r-14);
   }
  }
  if(this.corrosionStacks>0){
   const cp=0.5+0.5*Math.sin(Date.now()*.02);
   const ci=this.corrosionStacks/6;
   ctx.shadowColor='#66ff44';ctx.shadowBlur=8+ci*8;
   ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);
   ctx.strokeStyle=`rgba(80,220,40,${0.3+ci*0.5})`;ctx.lineWidth=2+ci*2;
   ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(4,r*.2)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   const corrY=this.blinded?(this.y-r-44):(this.y-r-30);
   ctx.fillStyle='#2a8822';ctx.fillText(`CORR x${this.corrosionStacks}`,this.x,corrY);
  }
  if(this.key==='dragoon'){
   if(this.magicShield){
    ctx.shadowColor='#4488cc';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);
    ctx.strokeStyle=`rgba(68,136,204,${0.5+p*0.35})`;ctx.lineWidth=2.5;ctx.stroke();
    ctx.shadowBlur=0;
    for(let i=0;i<4;i++){
     const a=(i/4)*Math.PI*2+Date.now()*.0008;
     ctx.fillStyle='#88bbdd';ctx.beginPath();ctx.arc(this.x+Math.cos(a)*(r+10),this.y+Math.sin(a)*(r+10),2.5,0,Math.PI*2);ctx.fill();
    }
   } else {
    const rechargePct=Math.min(1,this.shieldTimer/8.0);
    ctx.beginPath();ctx.arc(this.x,this.y,r+6,-(Math.PI/2),(Math.PI*2*rechargePct)-(Math.PI/2));
    ctx.strokeStyle='rgba(68,136,204,0.45)';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.stroke();
    ctx.setLineDash([]);
   }
   if(this.isLeaping){
    const lp2=0.5+0.5*Math.sin(Date.now()*.025);
    ctx.shadowColor='#4488cc';ctx.shadowBlur=28+lp2*12;
    ctx.beginPath();ctx.arc(this.x,this.y,r+10+lp2*6,0,Math.PI*2);
    ctx.strokeStyle=`rgba(68,136,204,${0.65+lp2*0.3})`;ctx.lineWidth=4;ctx.stroke();
    // Speed lines radiating outward
    for(let i=0;i<6;i++){
     const a=(i/6)*Math.PI*2+this.angle;
     const ir=r+14,or=r+22+lp2*8;
     ctx.strokeStyle=`rgba(136,187,221,${0.3+lp2*0.4})`;ctx.lineWidth=1.5;
     ctx.beginPath();ctx.moveTo(this.x+Math.cos(a)*ir,this.y+Math.sin(a)*ir);
     ctx.lineTo(this.x+Math.cos(a)*or,this.y+Math.sin(a)*or);ctx.stroke();
    }
    ctx.shadowBlur=0;
    const leapPct=Math.max(0,(1.2-this.leapT)/1.2);
    ctx.beginPath();ctx.arc(this.x,this.y,r+16,-(Math.PI/2),(Math.PI*2*leapPct)-(Math.PI/2));
    ctx.strokeStyle='rgba(136,187,221,0.8)';ctx.lineWidth=2.5;ctx.stroke();
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#88bbdd';ctx.fillText('DESCENT',this.x,this.y-r-16);
   }
   if(this.justLanded){
    const jlp=this.justLandedT/0.45;
    ctx.shadowColor='#ffffff';ctx.shadowBlur=35*jlp;
    ctx.beginPath();ctx.arc(this.x,this.y,r*(1+jlp*0.5),0,Math.PI*2);
    ctx.strokeStyle=`rgba(68,136,204,${jlp*0.95})`;ctx.lineWidth=5+jlp*5;ctx.stroke();
    // Shockwave expanding rings
    for(let i=0;i<2;i++){
     const wr=r*(1.5+i*0.8+(1-jlp)*2.5);
     ctx.beginPath();ctx.arc(this.x,this.y,wr,0,Math.PI*2);
     ctx.strokeStyle=`rgba(136,187,221,${jlp*(0.6-i*0.25)})`;ctx.lineWidth=2.5-i*0.8;ctx.stroke();
    }
    ctx.shadowBlur=0;
   }
  }
  if(this.blinded){
   const bp=0.5+0.5*Math.sin(Date.now()*.022);
   const r=this.radius;
   ctx.save();
   ctx.globalAlpha=0.55+bp*0.35;
   ctx.strokeStyle=`rgba(220,200,20,${0.6+bp*0.35})`;ctx.lineWidth=3;
   ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.stroke();
   ctx.setLineDash([]);ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(4,r*.2)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#ffee22';ctx.fillText('BLIND',this.x,this.y-r-30);
   ctx.restore();
  }
  // ── Plague Doctor overlays
  if(this.key==='plague'){
   if((this.virulenceStacks||0)>0){
    const vi=Math.min(1,this.virulenceStacks/5);
    ctx.shadowColor='#aadd44';ctx.shadowBlur=8+vi*10;
    ctx.strokeStyle=`rgba(170,221,68,${0.4+vi*0.5})`;ctx.lineWidth=2.5;
    ctx.setLineDash([4,3]);ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(4,r*.19)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#aadd44';ctx.fillText(`INFECT x${Math.ceil(this.virulenceStacks)}`,this.x,this.y-r-14);
   }
   if((this.plagueSepsisCount||0)>0){
    ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#669922';ctx.fillText(`SEPSIS ${this.plagueSepsisCount}/5`,this.x,this.y-r-26);
   }
  }
  // ── Crusader overlays
  if(this.key==='crusader'){
   if(this.holyChargeActive){
    const cp=0.5+0.5*Math.sin(Date.now()*.025);
    ctx.shadowColor='#fffacc';ctx.shadowBlur=22+cp*8;
    ctx.strokeStyle=`rgba(255,250,204,${0.75+cp*0.25})`;ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(this.x,this.y,r+10+cp*4,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#fffacc';ctx.fillText('CHARGE!',this.x,this.y-r-14);
   } else if((this.retributionCounter||0)>5){
    const ri=Math.min(1,this.retributionCounter/30);
    ctx.shadowColor='#ff8800';ctx.shadowBlur=6+ri*12;
    ctx.strokeStyle=`rgba(255,${Math.round(136+ri*100)},0,${0.3+ri*0.5})`;ctx.lineWidth=2;
    ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#ffaa44';ctx.fillText(`RET ${Math.ceil(this.retributionCounter)}`,this.x,this.y-r-14);
   }
  }
  // ── Mimic overlays
  if(this.key==='mimic'){
   if(this.perfectCopyActive){
    const hue=Math.floor((Date.now()*.03)%360);
    ctx.shadowColor=`hsl(${hue},100%,70%)`;ctx.shadowBlur=18;
    ctx.strokeStyle=`hsla(${hue},90%,70%,0.85)`;ctx.lineWidth=3.5;
    ctx.beginPath();ctx.arc(this.x,this.y,r+10,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle=`hsl(${hue},100%,75%)`;ctx.fillText('COPY!',this.x,this.y-r-14);
   } else if((this.mimicDmgStolen||0)>0.05){
    ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#cc88ff';ctx.fillText(`STEAL +${(this.mimicDmgStolen||0).toFixed(1)}`,this.x,this.y-r-14);
   }
  }
  // ── Stormbringer overlays
  if(this.key==='stormbringer'){
   const charge=this.staticCharge||0;
   if(charge>5){
    const ci=Math.min(1,charge/30);
    ctx.shadowColor='#88ccff';ctx.shadowBlur=6+ci*14;
    ctx.strokeStyle=`rgba(136,200,255,${0.35+ci*0.55})`;ctx.lineWidth=2+ci;
    ctx.beginPath();ctx.arc(this.x,this.y,r+5+ci*4,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
    if(ci>0.3){
     ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;
     ctx.textAlign='center';ctx.textBaseline='bottom';
     ctx.fillStyle='#88ccff';ctx.fillText(`⚡${Math.ceil(charge)}`,this.x,this.y-r-14);
    }
   }
   if(this.thunderclapActive){
    const tp=0.5+0.5*Math.sin(Date.now()*.03);
    ctx.shadowColor='#ffffff';ctx.shadowBlur=28+tp*10;
    ctx.strokeStyle=`rgba(200,230,255,${0.8+tp*0.2})`;ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(this.x,this.y,r+12+tp*6,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#88ccff';ctx.fillText('CLAP!',this.x,this.y-r-14);
   }
  }
  // ── Void Walker overlays
  if(this.key==='voidwalker'){
   const tears=this.voidTearCount||0;
   if(tears>0){
    const vi2=Math.min(1,tears/5);
    ctx.strokeStyle=`rgba(170,68,255,${0.3+vi2*0.4})`;ctx.lineWidth=1.5;
    ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.stroke();
    ctx.setLineDash([]);
   }
   if(this.singularityActive){
    // Draw the singularity at its placed position
    const sz2=new SingularityZone(this.singularityX,this.singularityY,this);
    sz2.life=this.singularityT;sz2.maxLife=2.5;sz2.t=this.abTimer;sz2.rot=this.abTimer*2;
    sz2.draw();
    ctx.font=`bold ${Math.max(5,r*.22)}px 'Press Start 2P',monospace`;
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillStyle='#aa44ff';ctx.fillText('VOID',this.x,this.y-r-14);
   }
  }
  // ── Whelpling overlays
  if(this.key==='whelpling'&&(this.whelplingGrowth||0)>0){
   const gp=Math.min(1,this.whelplingGrowth/8);
   ctx.shadowColor='#ff6600';ctx.shadowBlur=4+gp*12;
   ctx.strokeStyle=`rgba(255,${Math.round(102+gp*80)},0,${0.3+gp*0.4})`;ctx.lineWidth=1.5+gp*2;
   ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
   ctx.font=`bold ${Math.max(4,r*.18)}px 'Press Start 2P',monospace`;
   ctx.textAlign='center';ctx.textBaseline='bottom';
   ctx.fillStyle='#ff6600';ctx.fillText(`G+${this.whelplingGrowth}`,this.x,this.y-r-14);
  }
 } // end _drawPowerOverlay
 _drawBody(){
  const d=this.d,r=this.radius,px=this.x,py=this.y;
  ctx.save();
  if(d.bodyAlpha!==undefined)ctx.globalAlpha=d.bodyAlpha;
  ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=d.color;ctx.fill();
  ctx.beginPath();ctx.arc(px,py,r,0,Math.PI);ctx.lineTo(px,py);ctx.closePath();ctx.fillStyle=d.dark+'bb';ctx.fill();
  ctx.restore();
  ctx.beginPath();ctx.arc(px-r*.14,py-r*.14,r*.75,-Math.PI*.88,-Math.PI*.08);ctx.strokeStyle=d.rim;ctx.lineWidth=Math.max(2,r*.09);ctx.stroke();
  ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.strokeStyle=d.out;ctx.lineWidth=Math.max(2,r*.07);ctx.stroke();
  if(this.hitFlash>0){ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,60,${this.hitFlash*.45})`;ctx.fill();}
 }
 _syncHpBarVisual(){
  const now=performance.now();
  const dt=Math.min(0.05,Math.max(0,(now-(this.hpBarLastUpdate||now))/1000));
  this.hpBarLastUpdate=now;
  const curHp=Math.max(0,Math.min(this.maxHp,this.hp));
  if(this.hpBarDisplayHp===undefined){
   this.hpBarDisplayHp=curHp;this.hpBarLastHp=curHp;
   this.hpBarDamageGhostHp=curHp;this.hpBarHealTargetHp=curHp;
  }
  const prevHp=this.hpBarLastHp===undefined?curHp:this.hpBarLastHp;
  if(curHp<prevHp){
   this.hpBarDisplayHp=curHp;
   this.hpBarDamageGhostHp=Math.max(this.hpBarDamageGhostHp||0,prevHp);
   this.hpBarDamageHoldT=0.49;this.hpBarDamageAlpha=1;
   this.hpBarHealTargetHp=curHp;this.hpBarHealHoldT=0;this.hpBarHealAlpha=0;
  } else if(curHp>prevHp){
   this.hpBarHealTargetHp=curHp;
   this.hpBarHealHoldT=0.49;this.hpBarHealAlpha=1;
   this.hpBarDamageGhostHp=Math.max(this.hpBarDamageGhostHp||0,curHp);
  }
  this.hpBarLastHp=curHp;
  if(this.hpBarDamageHoldT>0)this.hpBarDamageHoldT=Math.max(0,this.hpBarDamageHoldT-dt);
  else if((this.hpBarDamageGhostHp||0)>curHp){
   const drain=dt/0.55;
   this.hpBarDamageGhostHp+=(curHp-this.hpBarDamageGhostHp)*Math.min(1,drain*4.2);
   if(Math.abs(this.hpBarDamageGhostHp-curHp)<0.5)this.hpBarDamageGhostHp=curHp;
  }
  if((this.hpBarDamageGhostHp||0)<=curHp+0.5&&this.hpBarDamageAlpha>0){
   this.hpBarDamageAlpha=Math.max(0,this.hpBarDamageAlpha-dt/0.28);
  }
  if(this.hpBarHealHoldT>0)this.hpBarHealHoldT=Math.max(0,this.hpBarHealHoldT-dt);
  else if((this.hpBarDisplayHp||0)<(this.hpBarHealTargetHp||curHp)){
   const fill=dt/0.55;
   this.hpBarDisplayHp+=(this.hpBarHealTargetHp-this.hpBarDisplayHp)*Math.min(1,fill*4.2);
   if(Math.abs(this.hpBarDisplayHp-this.hpBarHealTargetHp)<0.5)this.hpBarDisplayHp=this.hpBarHealTargetHp;
  }
  if((this.hpBarDisplayHp||0)>curHp)this.hpBarDisplayHp=curHp;
  if((this.hpBarDisplayHp||0)>=curHp-0.5&&this.hpBarHealAlpha>0){
   this.hpBarHealAlpha=Math.max(0,this.hpBarHealAlpha-dt/0.28);
  }
 }
 _collectStatusEffectBadges(){
  const badges=[];
  const add=(label,color)=>badges.push({label,color});
  if(this.stunned)add('STUN','#ffee55');
  if((this.netRootT||0)>0)add('NET','#f0c08a');
  if((this.bolaRootT||0)>0)add('ROOT','#ffaa44');
  if((this.locksmithJamT||0)>0)add('JAM','#d0b45a');
  if(this.blinded)add('BLIND','#ffee22');
  if(this.burning)add('BURN','#ff6600');
  if((this.waterSlow||0)>0)add('SLOW','#44aaff');
  if(this.electrified)add('SHOCK','#ffee00');
  if((this.woundT||0)>0)add('WOUND','#b432ff');
  if((this.bleedStacks||0)>0)add(`BLEED×${this.bleedStacks}`,'#e74c3c');
  if((this.corrosionStacks||0)>0)add(`CORR×${this.corrosionStacks}`,'#2a8822');
  if((this.virulenceStacks||0)>0)add(`INFECT×${Math.ceil(this.virulenceStacks)}`,'#aadd44');
  if((this.sepsisWeakenedT||0)>0)add('WEAK','#aadd44');
  if((this.gnawedArmorStacks||0)>0)add(`GNAW×${this.gnawedArmorStacks}`,'#b7c06a');
  if((this.deathMarkTicks||0)>0)add(`MARK×${this.deathMarkTicks}`,'#7c4dff');
  if((this.subduedT||0)>0)add('SUBDUE','#ffd35a');
  if((this.dmgHalvedT||0)>0)add('CURSE','#d77bff');
  if((this.spinReverseT||0)>0)add('REVERSE','#d77bff');
  if((this.charmedT||0)>0)add('CHARM','#ff8ce2');
  if((this.courtlyT||0)>0)add('MENACE','#ff8bd1');
  if((this.bolaSlowT||0)>0)add('SNARED','#ffaa44');
  if((this.locksmithLocks||0)>0)add(`LOCK×${this.locksmithLocks}`,'#d0b45a');
  return badges;
 }
 _drawStatusEffectBadges(){
  const badges=this._collectStatusEffectBadges();
  if(!badges.length)return;
  const r=this.radius,bw=r*2.35,barY=this.y-r-13;
  const fontSize=Math.max(5,Math.min(8,r*.18));
  const padX=3,gapX=3,rowGap=3,badgeH=fontSize+5,maxRowW=Math.max(bw*1.35,70);
  ctx.save();
  ctx.font=`bold ${fontSize}px 'Press Start 2P',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
  const rows=[];let row=[],rowW=0;
  for(const badge of badges){
   const w=Math.ceil(ctx.measureText(badge.label).width)+padX*2;
   if(row.length&&rowW+w+gapX>maxRowW){rows.push({items:row,w:rowW-gapX});row=[];rowW=0;}
   row.push({...badge,w});rowW+=w+gapX;
  }
  if(row.length)rows.push({items:row,w:rowW-gapX});
  for(let ri=0;ri<rows.length;ri++){
   const row=rows[ri];
   let x=this.x-row.w/2;
   const y=barY-5-badgeH-ri*(badgeH+rowGap);
   for(const badge of row.items){
    const bx=x,by=y;
    ctx.fillStyle='rgba(4,6,10,.86)';rrect(ctx,bx,by,badge.w,badgeH,3);ctx.fill();
    ctx.strokeStyle=badge.color;ctx.lineWidth=1;rrect(ctx,bx+.5,by+.5,badge.w-1,badgeH-1,3);ctx.stroke();
    ctx.fillStyle=badge.color;ctx.fillText(badge.label,bx+badge.w/2,by+badgeH/2+0.5);
    x+=badge.w+gapX;
   }
  }
  ctx.restore();
 }
 _drawHpBar(){
  this._syncHpBarVisual();
  const r=this.radius,bw=r*2.35,bh=6,bx=this.x-bw/2,by=this.y-r-13;
  const clampPct=hp=>Math.max(0,Math.min(1,hp/Math.max(1,this.maxHp)));
  const curPct=clampPct(this.hpBarDisplayHp||0);
  const truePct=clampPct(this.hp);
  const ghostPct=clampPct(this.hpBarDamageGhostHp||0);
  const healPct=clampPct(this.hpBarHealTargetHp||0);
  const lowPulse=truePct<0.3?0.5+0.5*Math.sin(performance.now()*0.009):0;
  ctx.save();
  ctx.fillStyle='#050608';ctx.fillRect(bx-2,by-2,bw+4,bh+4);
  ctx.fillStyle='#18202a';ctx.fillRect(bx,by,bw,bh);
  ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(bx,by,bw,1);
  if(ghostPct>truePct+0.002&&this.hpBarDamageAlpha>0){
   const gx=bx+bw*truePct,gw=bw*(ghostPct-truePct);
   const dg=ctx.createLinearGradient(gx,by,gx+gw,by);
   dg.addColorStop(0,`rgba(90,0,0,${0.62*this.hpBarDamageAlpha})`);
   dg.addColorStop(0.72,`rgba(220,76,20,${0.76*this.hpBarDamageAlpha})`);
   dg.addColorStop(1,`rgba(255,220,58,${0.92*this.hpBarDamageAlpha})`);
   ctx.fillStyle=dg;ctx.fillRect(gx,by,gw,bh);
  }
  if(healPct>curPct+0.002&&this.hpBarHealAlpha>0){
   const hx=bx+bw*curPct,hw=bw*(healPct-curPct);
   const hg=ctx.createLinearGradient(hx,by,hx+hw,by);
   hg.addColorStop(0,`rgba(0,80,30,${0.55*this.hpBarHealAlpha})`);
   hg.addColorStop(0.72,`rgba(55,235,80,${0.72*this.hpBarHealAlpha})`);
   hg.addColorStop(1,`rgba(210,255,70,${0.9*this.hpBarHealAlpha})`);
   ctx.fillStyle=hg;ctx.fillRect(hx,by,hw,bh);
  }
  const hpGrad=ctx.createLinearGradient(bx,by,bx+bw*curPct,by);
  if(curPct>.6){hpGrad.addColorStop(0,'#208f34');hpGrad.addColorStop(1,'#55ee68');}
  else if(curPct>.3){hpGrad.addColorStop(0,'#9a6818');hpGrad.addColorStop(1,'#ffd24a');}
  else{hpGrad.addColorStop(0,'#7b1118');hpGrad.addColorStop(1,`rgba(255,68,68,${0.86+lowPulse*0.14})`);}
  ctx.fillStyle=hpGrad;ctx.fillRect(bx,by,bw*curPct,bh);
  if(lowPulse>0){ctx.fillStyle=`rgba(255,255,180,${lowPulse*0.16})`;ctx.fillRect(bx,by,bw*curPct,bh);}
  ctx.fillStyle='rgba(0,0,0,.42)';for(let i=1;i<10;i++)ctx.fillRect(bx+bw/10*i,by,1,bh);
  ctx.fillStyle='rgba(255,255,255,.18)';for(let i=1;i<10;i++)ctx.fillRect(bx+bw/10*i+1,by,1,bh);
  if(this.priestShieldStacks>0){
   const shieldPct=Math.min(1,(this.priestShieldStacks*2)/Math.max(1,this.maxHp));
   ctx.fillStyle='rgba(255,248,200,.85)';ctx.fillRect(bx,by-2,bw*shieldPct,1.5);
  }
  if(this.key==='prince'&&this.princeRoyalShield>0&&this.princeRoyalShieldT>0){
   const royalPct=Math.min(1,this.princeRoyalShield/10);
   ctx.fillStyle='rgba(139,183,255,.92)';ctx.fillRect(bx,by-4,bw*royalPct,2);
  }
  if(this.magicShield){
   ctx.strokeStyle='rgba(136,187,221,.9)';ctx.lineWidth=1;ctx.strokeRect(bx-1,by-1,bw+2,bh+2);
  }
  ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(bx-2,by-2,bw+4,bh+4);
  ctx.restore();
 }
}
