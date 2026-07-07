'use strict';
// ▓▓▓ MODULE: combat/collisions.js — extracted from former js/engine.js ▓▓▓
// Physics resolution, weapon hits/clashes, faction helpers, and skeleton combat.

function sameFaction(a,b){
 return a&&b&&a.faction!==undefined&&b.faction!==undefined&&a.faction===b.faction;
}
function getFactionDisplaySphere(faction){
 return spheres.find(s=>s.faction===faction&&s.alive&&!s.dying&&!s.isReplica)
  ||spheres.find(s=>s.faction===faction&&s.alive&&!s.dying)
  ||spheres.find(s=>s.faction===faction&&!s.isReplica)
  ||spheres.find(s=>s.faction===faction)
  ||null;
}

function resolveAll(){
 for(let i=0;i<spheres.length;i++){
  for(let j=i+1;j<spheres.length;j++){
    const a=spheres[i],b=spheres[j];
    if(!a.alive||!b.alive||a.dying||b.dying)continue;
    if(sameFaction(a,b))continue;
    // Ghost vampire passes through bodies but can still swing claws
   const aGhost=a.untargetable,bGhost=b.untargetable;
   if(!aGhost&&!bGhost){
    // Normal body collision — only when neither is a ghost
    const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy)||0.01;
    const nx=dx/dist,ny=dy/dist;
    const bodyMin=a.radius+b.radius;
    if(dist<bodyMin){
     const dvx=b.vx-a.vx+b.impactVx-a.impactVx,dvy=b.vy-a.vy+b.impactVy-a.impactVy;
     const vRel=dvx*nx+dvy*ny;
     if(vRel<0){
      const e=Math.max(0.55,Math.sqrt(a.d.rest*b.d.rest));
      const imp=(-(1+e)*vRel)/(1/a.mass+1/b.mass);
      a.vx-=(imp/a.mass)*nx;a.vy-=(imp/a.mass)*ny;
      b.vx+=(imp/b.mass)*nx;b.vy+=(imp/b.mass)*ny;
      const pushF=Math.abs(vRel)*0.12;
      const pushToA=pushF*b.mass*(b.vikingRageSpinActive?2:1);
      const pushToB=pushF*a.mass*(a.vikingRageSpinActive?2:1);
      if(a.key==='king'&&a.mass>=b.mass&&(a.sovereignArmBonus||0)<30){a.sovereignArmBonus=(a.sovereignArmBonus||0)+2;a.sovereignDmgBonus=(a.sovereignDmgBonus||0)+0.05;a.d=Object.assign({},a.d);a.d.arm+=2;a.d.dmg+=0.05;}
      if(b.key==='king'&&b.mass>=a.mass&&(b.sovereignArmBonus||0)<30){b.sovereignArmBonus=(b.sovereignArmBonus||0)+2;b.sovereignDmgBonus=(b.sovereignDmgBonus||0)+0.05;b.d=Object.assign({},b.d);b.d.arm+=2;b.d.dmg+=0.05;}
      a.applyImpact(-nx*pushToA,-ny*pushToA);
      b.applyImpact( nx*pushToB, ny*pushToB);
     }
     const ov=(bodyMin-dist)*0.85,tot=a.mass+b.mass;
     a.x-=nx*ov*(b.mass/tot);a.y-=ny*ov*(b.mass/tot);
     b.x+=nx*ov*(a.mass/tot);b.y+=ny*ov*(a.mass/tot);
     if(a.holyChargeActive)a._onHolyChargeCollision(b,nx,ny);
     if(b.holyChargeActive)b._onHolyChargeCollision(a,-nx,-ny);
     spawnSpark((a.x+b.x)/2,(a.y+b.y)/2,'#fff',3);
    }
   }
   // Weapon hits always run — _weaponHit guards against hitting a ghost def internally
   _weaponHit(a,b);_weaponHit(b,a);
   if(!aGhost&&!bGhost)_weaponClash(a,b);
  }
 }
 for(const sk of skeletons){
  if(!sk.alive)continue;
  for(const s of spheres){
   if(!s.alive||s.dying)continue;
   
   if(sameFaction(s,sk))continue;
   _skeletonWeaponHit(sk,s);
  }
 }
 for(const s of spheres){
  if(!s.alive||s.dying)continue;
  for(const sk of skeletons){
   if(!sk.alive)continue;
   
   _sphereHitSkeleton(s,sk);
  }
 }
 for(const s of spheres){
  if(!s.alive||s.dying)continue;
  for(const sk of skeletons){
   if(!sk.alive)continue;
   
   if(sameFaction(s,sk))continue;
   const dx=sk.x-s.x,dy=sk.y-s.y,dist=Math.hypot(dx,dy)||0.01;
   const bodyMin=s.radius+sk.radius;
   if(dist<bodyMin){
    const nx=dx/dist,ny=dy/dist;
    const dvx=sk.vx-s.vx,dvy=sk.vy-s.vy;
    const vRel=dvx*nx+dvy*ny;
    if(vRel<0){
     const e=0.65,imp=(-(1+e)*vRel)/(1/s.mass+1/sk.mass);
     s.vx-=(imp/s.mass)*nx;s.vy-=(imp/s.mass)*ny;
     sk.vx+=(imp/sk.mass)*nx;sk.vy+=(imp/sk.mass)*ny;
    }
    const ov=(bodyMin-dist)*0.85,tot=s.mass+sk.mass;
    s.x-=nx*ov*(sk.mass/tot);s.y-=ny*ov*(sk.mass/tot);
    sk.x+=nx*ov*(s.mass/tot);sk.y+=ny*ov*(s.mass/tot);
   }
  }
 }
}

function _unstickTricksterFromWeapon(att,def,pts,tipR){
 if(def.key!=='trickster'&&!def.isReplica)return;
 let pushX=0,pushY=0,total=0;
 for(const pt of pts){
  const dx=def.x-pt.x,dy=def.y-pt.y;
  const dist=Math.hypot(dx,dy)||0.01;
  const overlap=def.radius+tipR-dist;
  if(overlap<=0)continue;
  const weight=overlap+2;
  pushX+=(dx/dist)*weight;pushY+=(dy/dist)*weight;total+=weight;
 }
 if(total<=0)return;
 const mag=Math.hypot(pushX,pushY)||1;
 const nx=pushX/mag,ny=pushY/mag;
 const escape=Math.min(def.radius*0.6,total*0.22);
 def.x+=nx*escape;def.y+=ny*escape;
 def.applyImpact(nx*45,ny*45);
}

function _weaponHit(att,def){
 if(sameFaction(att,def))return;
 if(def.untargetable)return; // vampire ghost mode — weapons pass through ghost vampire
 // Note: att.untargetable is intentionally NOT checked — ghost vampire can still deal bat damage
 const traits=att.canTriggerTraits!==false;
 if(RANGED_KEYS.has(att.key)||(att.key==='prince'&&att.princeWeaponMode==='bow')){
  if(att.weaponHitCD>0)return;
  const tip=att.getTip();
  const tipR=att.radius*att.d.tipR;
  if(Math.hypot(tip.x-def.x,tip.y-def.y)<def.radius+tipR){
   att.weaponHitCD=0.55;
   const bluntDmg=(att.d.dmg*0.35*att.dmgMult)/(def.d.arm*0.004+1);
   if(bluntDmg>0.1){
    def.receiveDamage(bluntDmg);
    att.omegaCur*=-1;
    const nx=(def.x-att.x)||1,ny=(def.y-att.y)||0;
    const nd=Math.hypot(nx,ny)||1;
    def.applyImpact((nx/nd)*90,(ny/nd)*90);
    spawnSpark(tip.x,tip.y,att.d.rim,3);
   }
  }
  return;
 }
 const pts=att.getBladePoints();
 const tipR=att.radius*att.d.tipR;
 let hit=false,hitPt=null,hitDist=Infinity;
 for(const pt of pts){
  const pdx=pt.x-def.x,pdy=pt.y-def.y,d=Math.hypot(pdx,pdy);
  if(d<def.radius+tipR&&d<hitDist){hit=true;hitPt=pt;hitDist=d;}
 }
 const tip=att.getTip();
 if(hit)_unstickTricksterFromWeapon(att,def,pts,tipR);
 if(hit&&!att.hasHitThisSwing){
  att.hasHitThisSwing=true;
  if(att.blinded&&Math.random()<0.30){spawnDmgNum(att.x,att.y-att.radius*1.4,'MISS','#ffee44');return;} // blind: 30% miss
  const hx=hitPt.x,hy=hitPt.y,hdist=hitDist||0.01;
  const px=(hx-def.x)/hdist,py=(hy-def.y)/hdist;
  const armX=hx-att.x,armY=hy-att.y;
  const tvx=att.vx+att.impactVx+(-att.omegaCur*armY);
  const tvy=att.vy+att.impactVy+(att.omegaCur*armX);
  const rvx=tvx-def.vx-def.impactVx,rvy=tvy-def.vy-def.impactVy;
  const vRel=rvx*px+rvy*py;
  if(vRel>0){
   const e=0.82,imp=(1+e)*vRel/(1/def.mass+1/att.mass);
   def.applyImpact(px*(imp/def.mass)*1.1,py*(imp/def.mass)*1.1); // 0.9→1.1
   att.vx-=(imp/att.mass)*px*0.35;att.vy-=(imp/att.mass)*py*0.35; // slight attacker pushback
   const ov=(def.radius+tipR-hdist)*1.0;def.x+=px*ov;def.y+=py*ov;
  }
  att.omegaCur*=-1;
  const tipSpd=Math.hypot(tvx,tvy);
  const weaponWeight=att.mass*0.35;
  let dmg=(tipSpd*att.d.dmg*0.010+weaponWeight*0.12)*att.dmgMult/(def.d.arm*0.004+1);
  if(att.d.sphereMelee){
   const MIN_ROTATION_MULTIPLIER=0.80,MAX_ROTATION_MULTIPLIER=1.20;
   const maxRotationSpeed=att.maxRotationSpeed||10.0;
   const currentRotationSpeed=Math.max(0,Math.min(maxRotationSpeed,att.rotationSpeed||0));
   const rotationMultiplier=MIN_ROTATION_MULTIPLIER+(currentRotationSpeed/maxRotationSpeed)*(MAX_ROTATION_MULTIPLIER-MIN_ROTATION_MULTIPLIER);
   dmg*=rotationMultiplier;
  }
  if(att.dmgHalvedT>0)dmg*=0.5;
  if(att.key==='gladiator'&&att.crowdDouble){dmg*=2;att.crowdDouble=false;att.favor=0;}
  if(att.key==='prince'){const wb=Math.min(5,att.wallBounceBonus||0);dmg*=1+wb*.08;if(Math.hypot(att.vx,att.vy)>att.baseSpd*.8)dmg*=1.18;}
  if(att.key==='queen'&&def.courtlyT>0)dmg*=0.92;
  if(def.key==='spartan'&&def.ironStacks>0)dmg*=Math.max(.8,1-def.ironStacks*.04);
   if(traits&&att.key==='pirate'&&att.draining){
   att.receiveHeal(dmg*0.15);
   const pullX=att.x-def.x,pullY=att.y-def.y,pullD=Math.hypot(pullX,pullY)||1;
   def.applyImpact((pullX/pullD)*120,(pullY/pullD)*120);
  }
   if(traits&&att.key==='necromancer'){
   def.woundT=Math.max(def.woundT||0, 4.0);
  }
   if(traits&&att.key==='guardian')dmg*=1.22;
   if(def.canTriggerTraits!==false&&def.key==='guardian'){
   def.impactVx*=0.7;def.impactVy*=0.7; // reduce knockback taken
  }
   if(traits&&att.key==='rogue'&&att.backstabCharged){dmg*=2;att.backstabCharged=false;att.backstabT=0;att.dmgMult=1;}
  // Samurai — Iaijutsu: first hit after spin reversal deals 2× dmg
  if(traits&&att.key==='samurai'&&att.iaijutsuReady){dmg*=2;att.iaijutsuReady=false;att.iaijutsuCD=3.0;spawnDmgNum(att.x,att.y-att.radius*1.5,'IAIJUTSU','#8a1f28');}
  if(isFinite(dmg)&&dmg>0.2){
   if(window._balanceCombatTracker&&att.d&&att.d.sphereMelee)window._balanceCombatTracker.onRotationUpdate(att.key,att.rotationSpeed||0,true);
   if(att.key==='queen'&&att.queenGambitT>0){
    const _qBefore=def.hp;def.hp=Math.max(0,def.hp-dmg);def.hitFlash=1;if(window._balanceCombatTracker)window._balanceCombatTracker.onDamage(att.key,Math.max(0,_qBefore-def.hp),'ability');
    spawnDmgNum(def.x,def.y-def.radius*0.5,dmg,'#ff8bd1');
    spawnSpark(hx,hy,att.d.color,7);
    if(def.hp<=0&&!def.dying){def.alive=false;def.dying=true;spawnBurst(def.x,def.y,def.d.rim,def.d.color,28);}
   }
   else if(att.key==='alchemist'){window._balanceDamageSource={key:att.key,type:'base'};def.receiveMagicDamage(dmg);window._balanceDamageSource=null;}
   else{window._balanceDamageSource={key:att.key,type:'base'};def.receiveDamage(dmg);window._balanceDamageSource=null;}
    if(traits){att.gainStack();att._applyHitBuff();}
    // Whelpling: open the upper jaw, lunge forward, then clamp shut.
    if(att.key==='whelpling'&&att.mouthOpenMode!==2){att.mouthOpenTimer=0.42;att.mouthOpenMode=1;}
    if(traits&&att.key==='vampire'&&!att.ghostMode){
    att.receiveHeal(dmg*0.25);
    spawnSpark(att.x,att.y,'#cc0044',3);
   }
    if(traits&&att.key==='monk'&&att.nirvanaActive){
    const nx2=(def.x-att.x)||1,ny2=(def.y-att.y)||0;
    const nd2=Math.hypot(nx2,ny2)||1;
    def.applyImpact((nx2/nd2)*520,(ny2/nd2)*520);
    spawnSpark(hx,hy,'#ffe0a0',6);
   }
    if(traits&&att.key==='alchemist'){
    def.corrosionStacks=Math.min(6,(def.corrosionStacks||0)+1);
    if(def.corrosionT<=0)def.corrosionT=1.2; // start decay timer if not already ticking
    def.d=Object.assign({},def.d);
    const _baseA=def.baseArm||DEF[def.key]?.arm||def.d.arm||0;
    def.d.arm=Math.max(0,_baseA-def.corrosionStacks*5);
    spawnSpark(hx,hy,'#66ff44',4);
   }
   // Knight — Stalwart: permanent micro-buff per hit (capped at 30 stacks)
    if(traits&&att.key==='knight'&&att.stalwartStacks<30){
    att.stalwartStacks++;
    att.d=Object.assign({},att.d);
    att.d.dmg*=1.006;att.d.arm=Math.round(att.d.arm*1.006);att.d.om*=1.006;
    att.omegaCur=Math.abs(att.omegaCur)*1.006*Math.sign(att.omegaCur||1);
    if(att.stalwartStacks%5===0)spawnDmgNum(att.x,att.y-att.radius*1.5,'STALWART','#d8eaf8');
   }
   // Barbarian — Bloodlust: +6 speed per hit, max +60, decays slowly
    if(traits&&att.key==='barbarian'){
    att.bloodlustBonus=Math.min(60,att.bloodlustBonus+6);
    att.targetSpd=att.baseSpd+att.bloodlustBonus;
    spawnSpark(att.x,att.y,'#b04010',3);
   }
   // Rogue — Hemorrhage: apply/refresh bleed stacks on target (max 3)
    if(traits&&att.key==='rogue'){
    def.bleedStacks=Math.min(3,(def.bleedStacks||0)+1);
    def.bleedT=1.8;
    if(def.bleedTickT<=0)def.bleedTickT=0.5;
    spawnSpark(hx,hy,'#e74c3c',4);
    }
    // Ratcatcher — Rat Pack: each weapon hit releases one hunting rat.
    if(traits&&att.key==='ratcatcher')att._spawnRatBurst(1,false);
    if(traits&&att.key==='beastmaster'){noiseTraps.push(new RatMinion(att.x,att.y,(Math.random()-.5)*180,(Math.random()-.5)*180,att,false));def.markedBy=att;}
    if(traits&&att.key==='gladiator'){att.favor=Math.min(10,(att.favor||0)+0.5);att.targetSpd=att.baseSpd+att.favor*2;att.omegaCur+=(0.12*Math.sign(att.omegaCur||1));if(att.favor>=10){att.crowdDouble=true;spawnDmgNum(att.x,att.y-att.radius*1.7,'FAVOR','#ffd35a');}}
    if(traits&&att.key==='queen'){att.queenDmgBonus=(att.queenDmgBonus||0)+0.005;att.d=Object.assign({},att.d);att.d.dmg+=DEF[att.key].dmg*.005;}
    if(traits&&att.key==='prince'&&att.rushT>0){att.rushT=Math.min(2.5-(att.rushElapsed||0),att.rushT+.25);}
    spawnSpark(hx,hy,att.d.rim,7);
    spawnImpactBurst(hx,hy,att.d.rim,def.d.color);
     if(traits&&att.key==='phoenix')att._releasePhoenixEmber(def,hx,hy);
   // Plague Doctor — Sepsis: repeated hits on one enemy burst into DOT + weaken.
    if(traits&&att.key==='plague'){
    if(att.plagueSepsisTarget!==def){att.plagueSepsisTarget=def;att.plagueSepsisCount=0;}
    att.plagueSepsisCount=(att.plagueSepsisCount||0)+1;
    spawnDmgNum(def.x,def.y-def.radius*1.8,`SEPSIS ${att.plagueSepsisCount}/5`,'#aadd44');
    if(att.plagueSepsisCount>=5){
     att.plagueSepsisCount=0;
     def.sepsisWeakenedT=5.0;
     def.sepsisDotTicks=4;def.sepsisDotTimer=0.5;def.sepsisDotDmg=Math.max(1,def.hp*0.08/4);
     spawnBurst(def.x,def.y,'#aadd44','#2a3a1a',18);
     spawnDmgNum(def.x,def.y-def.radius*2.1,'WEAKENED','#aadd44');
    }
   }
   // Mimic — Essence Drain: steal DMG permanently
    if(traits&&att.key==='mimic'&&att.mimicDmgStolen<3.0){
    const steal=0.04;
    att.mimicDmgStolen=Math.min(3.0,(att.mimicDmgStolen||0)+steal);
    def.d=Object.assign({},def.d);
    def.d.dmg=Math.max(0.5,def.d.dmg-steal);
    att.d=Object.assign({},att.d);
    att.d.dmg+=(att._mimicBaseDmg===undefined?steal:0); // only when not copy-active
    if(Math.round(att.mimicDmgStolen*10)%5===0)spawnDmgNum(att.x,att.y-att.radius*1.5,`DRAIN ${att.mimicDmgStolen.toFixed(1)}`,'#cc88ff');
   }
   // Stormbringer — discharge static charge on hit
    if(traits&&att.key==='stormbringer'&&att.staticCharge>0){
    const trueDmg=att.staticCharge*0.6;
    def.hp=Math.max(0,def.hp-trueDmg);
    def.hitFlash=1;
    if(trueDmg>0.5){spawnDmgNum(def.x,def.y-def.radius*1.8,trueDmg,'#88ccff');spawnSpark(def.x,def.y,'#88ccff',5);}
    att.staticCharge=0;
    if(def.hp<=0&&!def.dying){def.alive=false;def.dying=true;spawnBurst(def.x,def.y,def.d.rim,def.d.color,28);}
   }
   // Crusader — Retribution: discharge on hit, then reset
    if(traits&&att.key==='crusader'&&att.retributionCounter>0){
     const rdmg=att.retributionCounter*0.5/(def.d.arm*0.004+1);
     if(rdmg>0.1){def.receiveDamage(rdmg);spawnDmgNum(att.x,att.y-att.radius*1.5,rdmg,'#fffacc');}
     att.retributionCounter=0;
    }
    if(att.replicaKind==='phase')att._destroyReplica('HIT');
   }
  }
 const bladeStillInside=pts.some(pt=>Math.hypot(pt.x-def.x,pt.y-def.y)<def.radius+tipR);
 if(!bladeStillInside)att.hasHitThisSwing=false;
}
function _applyLocksmithLock(att,def){
 def.locksmithLocks=Math.min(2,(def.locksmithLocks||0)+1);
 spawnDmgNum(def.x,def.y-def.radius*1.7,`LOCK ${def.locksmithLocks}/2`,'#d0b45a');
 if(def.locksmithLocks>=2){
  def.locksmithJamT=Math.max(def.locksmithJamT||0,1.0);
  def.locksmithLocks=0;
  spawnBurst(def.x,def.y,'#d0b45a','#24313a',12);
  spawnDmgNum(def.x,def.y-def.radius*2.0,'JAMMED','#d0b45a');
 }
}
function _weaponClash(a,b){
 if((a.key==='prince'&&a.princeWeaponMode==='bow')||(b.key==='prince'&&b.princeWeaponMode==='bow'))return;
 if(a.weaponHitCD>0||b.weaponHitCD>0)return;
 const ptsA=a.getBladePoints(), ptsB=b.getBladePoints();
 const clashDist=a.radius*a.d.tipR+b.radius*b.d.tipR+6;
 let clashPtA=null,clashPtB=null,bestDist=Infinity;
 for(const pa of ptsA){
  for(const pb of ptsB){
   const d=Math.hypot(pa.x-pb.x,pa.y-pb.y);
   if(d<clashDist&&d<bestDist){bestDist=d;clashPtA=pa;clashPtB=pb;}
  }
 }
 if(!clashPtA)return;
 const tipA=a.getTip(),tipB=b.getTip();
 const armAx=tipA.x-a.x,armAy=tipA.y-a.y;
 const armBx=tipB.x-b.x,armBy=tipB.y-b.y;
 const tvAx=a.vx+a.impactVx+(-a.omegaCur*armAy);
 const tvAy=a.vy+a.impactVy+(a.omegaCur*armAx);
 const tvBx=b.vx+b.impactVx+(-b.omegaCur*armBy);
 const tvBy=b.vy+b.impactVy+(b.omegaCur*armBx);
 const abx=tipB.x-tipA.x,aby=tipB.y-tipA.y,abd=Math.hypot(abx,aby)||1;
 const aConverging=(tvAx*(abx/abd)+tvAy*(aby/abd))>0;
 const bConverging=(tvBx*(-abx/abd)+tvBy*(-aby/abd))>0;
 if(aConverging||!bConverging) a.omegaCur*=-1;
 if(bConverging||!aConverging) b.omegaCur*=-1;
 a.weaponHitCD=0.28;b.weaponHitCD=0.28;
 const mx=(clashPtA.x+clashPtB.x)/2,my=(clashPtA.y+clashPtB.y)/2;
 // Play one clash sound from the first sphere that has a configured weaponCollision asset.
 if(SPHERE_AUDIO[a.key]&&SPHERE_AUDIO[a.key].weaponCollision)_playSphereAudio(a.key,'weaponCollision');
 else if(SPHERE_AUDIO[b.key]&&SPHERE_AUDIO[b.key].weaponCollision)_playSphereAudio(b.key,'weaponCollision');
 spawnSpark(mx,my,'#ffe066',10);spawnSpark(mx,my,'#fff',6);
 spawnImpactBurst(mx,my,'#ffe066','#fff');
 if(a.canTriggerTraits!==false&&a.key==='locksmith')_applyLocksmithLock(a,b);
 if(b.canTriggerTraits!==false&&b.key==='locksmith')_applyLocksmithLock(b,a);
 if(a.canTriggerTraits!==false&&a.key==='glassblower')a._dropGlassShard(mx,my);
 if(a.canTriggerTraits!==false&&b.key==='spartan'){b.ironStacks=Math.min(5,(b.ironStacks||0)+1);if(b.ramActive){a.receiveDamage(2);}}
 if(b.canTriggerTraits!==false&&b.key==='glassblower')b._dropGlassShard(mx,my);
 if(b.canTriggerTraits!==false&&a.key==='spartan'){a.ironStacks=Math.min(5,(a.ironStacks||0)+1);if(a.ramActive){b.receiveDamage(2);}}
 const bx=b.x-a.x,by2=b.y-a.y,bd=Math.hypot(bx,by2)||1;
 a.applyImpact(-(bx/bd)*80,-(by2/bd)*80);b.applyImpact((bx/bd)*80,(by2/bd)*80);
}
function _skeletonWeaponHit(sk,def){
 if(sk.weaponHitCD>0)return;
 const pts=sk.getBladePoints();
 const tipR=sk.radius*sk.tipR;
 let hit=false,hitPt=null,hitDist=Infinity;
 for(const pt of pts){
  const d=Math.hypot(pt.x-def.x,pt.y-def.y);
  if(d<def.radius+tipR&&d<hitDist){hit=true;hitPt=pt;hitDist=d;}
 }
 if(hit&&!sk.hasHitThisSwing){
  sk.hasHitThisSwing=true;
  sk.weaponHitCD=0.4;
  const hx=hitPt.x,hy=hitPt.y,hdist=hitDist||0.01;
  const px=(hx-def.x)/hdist,py=(hy-def.y)/hdist;
  const armX=hx-sk.x,armY=hy-sk.y;
  const tvx=sk.vx+sk.impactVx+(-sk.omegaCur*armY);
  const tvy=sk.vy+sk.impactVy+(sk.omegaCur*armX);
  const vRel=(tvx-def.vx)*px+(tvy-def.vy)*py;
  if(vRel>0){
   const e=0.7,imp=(1+e)*vRel/(1/def.mass+1/sk.mass);
   def.applyImpact(px*(imp/def.mass),py*(imp/def.mass));
   sk.vx-=(imp/sk.mass)*px*0.3;sk.vy-=(imp/sk.mass)*py*0.3;
  }
  sk.omegaCur*=-1;
  const dmg=sk.dmg*(sk.dmgMult||1)/(def.d.arm*0.004+1);
  if(dmg>0.1){
   def.receiveDamage(dmg);
   spawnSpark(hx,hy,'#c8c0a0',5);
  }
 }
 const bladeStillIn=pts.some(pt=>Math.hypot(pt.x-def.x,pt.y-def.y)<def.radius+tipR);
 if(!bladeStillIn)sk.hasHitThisSwing=false;
}
function _sphereHitSkeleton(att,sk){
 if(sameFaction(att,sk))return;
 if(att.weaponHitCD>0)return;
 const tip=att.getTip();
 const tipR=att.radius*att.d.tipR;
 const dist=Math.hypot(tip.x-sk.x,tip.y-sk.y);
 if(dist<sk.radius+tipR){
  att.weaponHitCD=0.35;
  const armX=tip.x-att.x,armY=tip.y-att.y;
  const tvx=att.vx+att.impactVx+(-att.omegaCur*armY);
  const tvy=att.vy+att.impactVy+(att.omegaCur*armX);
  const tipSpd=Math.hypot(tvx,tvy);
  const dmg=(tipSpd*att.d.dmg*0.010+(att.mass*0.35)*0.12)*att.dmgMult/(sk.arm*0.004+1);
  if(dmg>0.1){
   sk.hp=Math.max(0,sk.hp-dmg);
   sk.hitFlash=1;
   spawnBloodSplat(sk.x,sk.y,'#c8c0a0',dmg);
   spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=10?'#ff4444':dmg>=4?'#ffaa22':'#ffffff');
   const nx=(sk.x-tip.x)/dist||1,ny=(sk.y-tip.y)/dist||1;
   sk.applyImpact(nx*100,ny*100);
    att.omegaCur*=-1;
    if(att.replicaKind==='phase')att._destroyReplica('HIT');
    if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
   }
 }
}
