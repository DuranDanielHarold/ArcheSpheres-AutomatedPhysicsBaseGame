'use strict';
// ▓▓▓ MODULE: entities/companions.js — extracted from former js/entities.js ▓▓▓
// Companion and summon classes, including skeleton-derived allies.

class BeastCompanion{
 constructor(x,y,owner,kind){
  this.x=x;this.y=y;this.owner=owner;this.kind=kind;this.life=10;this.maxLife=10;this.alive=true;
  this.r=kind==='boar'?10:kind==='hawk'?7:kind==='ferret'?4:8;
  this.vx=0;this.vy=0;this.t=0;this.trail=[];this.seed=Math.random()*Math.PI*2;
 }
 update(dt){
  this.life-=dt;this.t+=dt;if(this.life<=0)this.alive=false;
  this.trail.push({x:this.x,y:this.y,t:this.t});if(this.trail.length>12)this.trail.shift();
  const t=spheres.find(s=>!sameFaction(this.owner,s)&&s.alive&&!s.dying);if(!t)return;
  const dx=t.x-this.x,dy=t.y-this.y,d=Math.hypot(dx,dy)||1;
  const spd=this.kind==='boar'?185:this.kind==='hawk'?310:this.kind==='ferret'?335:260;
  this.vx+=(dx/d)*spd*dt*3;this.vy+=(dy/d)*spd*dt*3;
  const m=Math.hypot(this.vx,this.vy)||1;if(m>spd){this.vx=this.vx/m*spd;this.vy=this.vy/m*spd;}
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  if(d<t.radius+this.r){
   t.receiveDamage(this.kind==='boar'?9:this.kind==='ferret'?1:6);
   t.applyImpact((dx/d)*(this.kind==='boar'?360:120),(dy/d)*(this.kind==='boar'?360:120));
   spawnBurst(this.x,this.y,this.kind==='hawk'?'#f3df8f':this.kind==='ferret'?'#d0c090':this.kind==='wolf'?'#9aa080':'#ffb060','#5a2608',8);
   this.alive=false;
  }
 }
 draw(){
  ctx.save();
  const a=this.life/this.maxLife,ang=Math.atan2(this.vy,this.vx),stride=Math.sin(this.t*18+this.seed);
  this._drawTrail(a,ang);
  ctx.globalAlpha=a;ctx.translate(this.x,this.y);ctx.rotate(ang);
  if(this.kind==='wolf')this._drawWolf(stride);
  else if(this.kind==='boar')this._drawBoar(stride);
  else if(this.kind==='hawk')this._drawHawk(stride);
  else this._drawFerret(stride);
  ctx.restore();
 }
 _drawTrail(alpha,ang){
  const color=this.kind==='hawk'?'#f3df8f':this.kind==='wolf'?'#9aa080':this.kind==='ferret'?'#d0c090':'#8a4a20';
  for(let i=0;i<this.trail.length;i++){
   const p=this.trail[i],k=i/this.trail.length;
   ctx.globalAlpha=.07*k*alpha;
   ctx.fillStyle=color;
   if(this.kind==='hawk'){
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(ang+Math.PI*.5);ctx.beginPath();ctx.ellipse(0,0,this.r*k*.9,this.r*k*.28,0,0,Math.PI*2);ctx.fill();ctx.restore();
   } else {
    ctx.beginPath();ctx.ellipse(p.x,p.y,this.r*k*.8,this.r*k*.45,ang,0,Math.PI*2);ctx.fill();
   }
  }
 }
 _drawWolf(stride){
  // Angular grey wolf: pointed ears, long muzzle, legs, and raised tail.
  ctx.fillStyle='#4f5246';ctx.strokeStyle='#171a14';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(-this.r*.15,0,this.r*1.35,this.r*.62,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#6f735f';ctx.beginPath();ctx.moveTo(this.r*.78,-this.r*.34);ctx.lineTo(this.r*1.46,-this.r*.18);ctx.lineTo(this.r*1.62,0);ctx.lineTo(this.r*1.46,this.r*.18);ctx.lineTo(this.r*.78,this.r*.34);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#35382f';for(const y of [-.22,.22]){ctx.beginPath();ctx.moveTo(this.r*.92,y*this.r);ctx.lineTo(this.r*1.04,y*this.r-this.r*.48*Math.sign(y));ctx.lineTo(this.r*1.18,y*this.r-this.r*.04*Math.sign(y));ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle='#e8e0c0';ctx.beginPath();ctx.arc(this.r*1.55,0,this.r*.12,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#ffb060';ctx.lineWidth=this.r*.09;ctx.beginPath();ctx.moveTo(this.r*.58,-this.r*.32);ctx.lineTo(this.r*.58,this.r*.32);ctx.stroke();
  ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.arc(this.r*.58,0,this.r*.11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f1d86a';ctx.beginPath();ctx.arc(this.r*1.18,-this.r*.12,this.r*.055,0,Math.PI*2);ctx.arc(this.r*1.18,this.r*.12,this.r*.055,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2f3328';ctx.lineWidth=1.4;for(const x of [-.65,-.15,.35,.75]){ctx.beginPath();ctx.moveTo(x*this.r,this.r*.48);ctx.lineTo((x+.12*stride)*this.r,this.r*.95);ctx.stroke();}
  ctx.strokeStyle='#70745f';ctx.lineWidth=this.r*.22;ctx.beginPath();ctx.moveTo(-this.r*1.2,0);ctx.quadraticCurveTo(-this.r*1.8,-this.r*.45,-this.r*2.15,-this.r*.14);ctx.stroke();
 }
 _drawBoar(stride){
  // Stocky armored boar: bristled back, snout plate, tusks, and heavy hooves.
  const body=ctx.createRadialGradient(-this.r*.3,-this.r*.25,1,0,0,this.r*1.3);body.addColorStop(0,'#b06a32');body.addColorStop(.55,'#7a3a18');body.addColorStop(1,'#321407');
  ctx.fillStyle=body;ctx.strokeStyle='#1b0903';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(-this.r*.18,0,this.r*1.48,this.r*.86,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#2a1208';for(let i=0;i<6;i++){const x=-this.r*.92+i*this.r*.28;ctx.beginPath();ctx.moveTo(x,-this.r*.7);ctx.lineTo(x+this.r*.13,-this.r*1.08);ctx.lineTo(x+this.r*.25,-this.r*.66);ctx.closePath();ctx.fill();}
  ctx.fillStyle='#8f4a22';ctx.beginPath();ctx.ellipse(this.r*1.1,0,this.r*.55,this.r*.48,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,176,96,.55)';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(-this.r*(.52-i*.42),0,this.r*.17,this.r*.72,0,0,Math.PI*2);ctx.fill();ctx.stroke();}
  ctx.fillStyle='#3a1809';ctx.beginPath();ctx.ellipse(this.r*1.5,0,this.r*.25,this.r*.28,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f0d0a0';for(const y of [-.38,.38]){ctx.beginPath();ctx.moveTo(this.r*1.32,y*this.r);ctx.quadraticCurveTo(this.r*1.86,y*this.r*.85,this.r*1.72,y*this.r*.08);ctx.quadraticCurveTo(this.r*1.52,y*this.r*.32,this.r*1.32,y*this.r);ctx.fill();ctx.stroke();}
  ctx.fillStyle='#130804';ctx.beginPath();ctx.arc(this.r*1.58,-this.r*.08,this.r*.04,0,Math.PI*2);ctx.arc(this.r*1.58,this.r*.08,this.r*.04,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2b1208';ctx.lineWidth=2;for(const x of [-.75,-.2,.35,.8]){ctx.beginPath();ctx.moveTo(x*this.r,this.r*.6);ctx.lineTo((x+.08*stride)*this.r,this.r*1.0);ctx.stroke();}
 }
 _drawHawk(stride){
  // Golden hawk: wide feathered wings, pointed beak, tail fan, and visible talons.
  const flap=.25*stride;
  ctx.fillStyle='#f0d58a';ctx.strokeStyle='#5b3b10';ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(this.r*1.35,0);ctx.lineTo(this.r*.25,-this.r*.34);ctx.lineTo(-this.r*.42,0);ctx.lineTo(this.r*.25,this.r*.34);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#c99738';
  ctx.beginPath();ctx.moveTo(-this.r*.08,-this.r*.12);ctx.lineTo(-this.r*1.55,-this.r*(.88+flap));ctx.lineTo(-this.r*.78,-this.r*.08);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff1a8';ctx.beginPath();ctx.moveTo(-this.r*1.55,-this.r*(.88+flap));ctx.lineTo(-this.r*1.18,-this.r*(.74+flap));ctx.lineTo(-this.r*1.32,-this.r*(.56+flap));ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-this.r*.08,this.r*.12);ctx.lineTo(-this.r*1.55,this.r*(.88+flap));ctx.lineTo(-this.r*.78,this.r*.08);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#f6e7aa';ctx.lineWidth=1;for(let i=0;i<4;i++){const yy=(i+1)*this.r*.18;ctx.beginPath();ctx.moveTo(-this.r*.42,-this.r*.18);ctx.lineTo(-this.r*(1.0+i*.15),-yy-this.r*.2);ctx.stroke();ctx.beginPath();ctx.moveTo(-this.r*.42,this.r*.18);ctx.lineTo(-this.r*(1.0+i*.15),yy+this.r*.2);ctx.stroke();}
  ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.moveTo(this.r*1.35,0);ctx.lineTo(this.r*1.72,-this.r*.13);ctx.lineTo(this.r*1.52,this.r*.12);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(this.r*.86,-this.r*.08,this.r*.045,0,Math.PI*2);ctx.arc(this.r*.86,this.r*.08,this.r*.045,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#ffd35a';ctx.lineWidth=1.2;for(const y of [-.16,.16]){ctx.beginPath();ctx.moveTo(this.r*.18,y*this.r);ctx.lineTo(this.r*.28,y*this.r+this.r*.34*Math.sign(y));ctx.stroke();}
 }
 _drawFerret(stride){
  // Slim tan ferret: clearly smaller and quicker than the pack beasts.
  ctx.fillStyle='#b59a68';ctx.strokeStyle='#2a1a08';ctx.lineWidth=1.1;
  ctx.beginPath();ctx.ellipse(-this.r*.2,0,this.r*1.85,this.r*.55,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#e7d1a0';ctx.beginPath();ctx.ellipse(this.r*1.35,0,this.r*.55,this.r*.42,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#3a2410';ctx.beginPath();ctx.ellipse(this.r*1.78,0,this.r*.16,this.r*.18,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(this.r*1.45,-this.r*.12,this.r*.055,0,Math.PI*2);ctx.arc(this.r*1.45,this.r*.12,this.r*.055,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#d8bf88';ctx.lineWidth=this.r*.28;ctx.beginPath();ctx.moveTo(-this.r*1.65,0);ctx.quadraticCurveTo(-this.r*2.35,-this.r*.42,-this.r*2.75,0);ctx.stroke();
  ctx.strokeStyle='#3a2410';ctx.lineWidth=1;for(const x of [-.8,-.25,.35,.8]){ctx.beginPath();ctx.moveTo(x*this.r,this.r*.34);ctx.lineTo((x+.16*stride)*this.r,this.r*.72);ctx.stroke();}
 }
}

const SKELETON_WEAPONS=['bow','sword','spear','hammer','axe'];
class Skeleton{
 constructor(x,y,faction){
  this.x=x;this.y=y;this.faction=faction;
  this.alive=true;this.life=18.0;this.maxLife=18.0;
  this.hp=150;this.maxHp=150;
  this.hitFlash=0;
  this.dmg=2.8;this.arm=20;
  this.radius=22;this.mass=4.5;
  this.speed=280+Math.random()*80;
  const a=Math.random()*Math.PI*2;
  this.vx=Math.cos(a)*this.speed;this.vy=Math.sin(a)*this.speed;
  this.angle=a;
  this.omegaCur=8*(Math.random()>0.5?1:-1);
  this.weaponType=SKELETON_WEAPONS[Math.floor(Math.random()*5)];
  this.hasHitThisSwing=false;
  this.weaponHitCD=0;
  this.attackCD=0;
  this.bowCD=0;
  this.impactVx=0;this.impactVy=0;this.impactDecay=0;
  const reaches={bow:2.2,sword:2.0,spear:2.8,hammer:1.6,axe:2.0};
  const tipRs={bow:0.12,sword:0.18,spear:0.14,hammer:0.40,axe:0.42};
  this.reach=reaches[this.weaponType]||2.0;
  this.tipR=tipRs[this.weaponType]||0.20;
 }
 getTip(){
  return{x:this.x+Math.cos(this.angle)*this.radius*this.reach,
     y:this.y+Math.sin(this.angle)*this.radius*this.reach};
 }
 getBladePoints(){
  const pts=[];const steps=4;
  for(let i=1;i<=steps;i++){
   const t=i/steps,reach=this.radius*this.reach*t;
   pts.push({x:this.x+Math.cos(this.angle)*reach,y:this.y+Math.sin(this.angle)*reach});
  }
  return pts;
 }
 update(dt){
  if(!this.alive)return;
  this.life-=dt;
  if(this.life<=0||this.hp<=0){this.alive=false;spawnToxicCloud(this.x,this.y);return;}
  this.hitFlash=Math.max(0,this.hitFlash-dt*5);
  if(this.netRootT>0){this.netRootT-=dt;this.vx*=0.04;this.vy*=0.04;this.impactVx*=0.04;this.impactVy*=0.04;if(this.netRootT<=0&&this.savedArm!==null){this.d=Object.assign({},this.d);this.d.arm=this.savedArm;this.savedArm=null;}}
  if(this.subduedT>0){this.subduedT-=dt;this.targetSpd=this.baseSpd*.6;if(this.subduedT<=0)this.targetSpd=this.baseSpd;}
  if(this.dmgHalvedT>0)this.dmgHalvedT-=dt;
  if(this.courtlyT>0)this.courtlyT-=dt;
  this.attackCD=Math.max(0,this.attackCD-dt);
  this.weaponHitCD=Math.max(0,this.weaponHitCD-dt);
  this.bowCD=Math.max(0,this.bowCD-dt);
  if(this.impactDecay>0){
   this.impactDecay=Math.max(0,this.impactDecay-dt);
   this.impactVx*=Math.pow(0.04,dt);
   this.impactVy*=Math.pow(0.04,dt);
  }
  let target=null,tDist=Infinity;
  if(!this.randomOnly){
   for(const s of spheres){
    const isEnemy=!sameFaction(this,s);
    if(!isEnemy||!s.alive||s.dying)continue;
    const d=Math.hypot(s.x-this.x,s.y-this.y);
    if(d<tDist){tDist=d;target=s;}
   }
   if(target){
    if(this.weaponType==='bow'&&this.bowCD<=0){
     this.bowCD=1.2;
     const tip=this.getTip();
     const bspd=280;
     const wx=Math.cos(this.angle),wy=Math.sin(this.angle);
     projectiles.push(new BoneArrow(tip.x,tip.y,wx*bspd,wy*bspd,this));
     spawnSpark(tip.x,tip.y,'#c8c0a0',3);
    }
   }
  }
  // Wander — occasional random direction nudge so movement feels alive
  if(Math.random()<dt*0.8){
   const wa=Math.random()*Math.PI*2;
   this.vx+=(Math.cos(wa))*this.speed*0.6;
   this.vy+=(Math.sin(wa))*this.speed*0.6;
  }
  const spd=Math.hypot(this.vx,this.vy);
  // Cap speed — snappy, not sluggish
  if(spd>this.speed*2.2){const f=this.speed*2.2/spd;this.vx*=f;this.vy*=f;}
  else if(spd<this.speed*0.8&&spd>0.1){const f=this.speed*0.8/spd;this.vx*=f;this.vy*=f;}
  // Minimal friction — skeletons glide fast and change direction quickly
  this.vx*=Math.pow(0.96,dt*10);
  this.vy*=Math.pow(0.96,dt*10);
  this.vy+=GRAVITY*(this.fullGravity?1:0.04)*dt; // player-like ally spawns use full arena gravity
  this.x+=(this.vx+this.impactVx)*dt;
  this.y+=(this.vy+this.impactVy)*dt;
  if(this.abilityAimT>0){this.abilityAimT=Math.max(0,this.abilityAimT-dt);if(this.abilityAimAngle!==null)this.angle=this.abilityAimAngle;else this.angle+=this.omegaCur*dt;}
  else {this.abilityAimAngle=null;this.angle+=this.omegaCur*dt;}
  const R=this.radius;
  const SKW=this.fullGravity?WALL_REST:0.55;
  if(this.x-R<0){this.x=R+1;this.vx=Math.abs(this.vx)*SKW;this.impactVx=0;}
  if(this.x+R>W){this.x=W-R-1;this.vx=-Math.abs(this.vx)*SKW;this.impactVx=0;}
  if(this.y-R<0){this.y=R+1;this.vy=Math.abs(this.vy)*SKW;this.impactVy=0;}
  if(this.y+R>H){this.y=H-R-1;this.vy=-Math.abs(this.vy)*SKW;this.impactVy=0;}
 }
 applyImpact(ivx,ivy){
  this.impactVx+=ivx;this.impactVy+=ivy;this.impactDecay=1.5;
 }
 draw(){
  if(!this.alive)return;
  const fadeT=Math.min(1,this.life/1.5);
  const alpha=Math.min(1,fadeT)*(this.hp/this.maxHp*0.4+0.6);
  const r=this.radius;
  ctx.save();ctx.globalAlpha=alpha;
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
  this._drawWeapon(r*1.35);
  ctx.restore();
  ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);
  ctx.fillStyle=this.bodyCol||'#2a2a1e';ctx.fill();
  ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);
  ctx.strokeStyle=this.rimCol||'#7c4dff';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.arc(this.x-r*.15,this.y-r*.15,r*.72,-Math.PI*.88,-Math.PI*.08);
  ctx.strokeStyle=this.boneCol||'#c8c0a0';ctx.lineWidth=Math.max(1.5,r*.07);ctx.stroke();
  const fs=Math.max(7,r*.52);
  ctx.font=`bold ${fs}px 'Press Start 2P',monospace`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  const hpTxt=Math.ceil(this.hp).toString();
  ctx.fillStyle='#000';
  for(const[ox,oy]of[[-1,-1],[1,-1],[-1,1],[1,1],[0,-2],[0,2],[-2,0],[2,0]])
   ctx.fillText(hpTxt,this.x+ox,this.y+oy);
  ctx.fillStyle=this.hitFlash>0?'#ffff44':(this.hpCol||this.boneCol||'#c8c0a0');
  ctx.fillText(hpTxt,this.x,this.y);
  const bw=r*2,bh=3,bx=this.x-r,by=this.y-r-8;
  ctx.fillStyle='#111';ctx.fillRect(bx-1,by-1,bw+2,bh+2);
  ctx.fillStyle=this.rimCol||'#7c4dff';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh);
  ctx.fillStyle=this.lifeCol||`rgba(124,77,255,${0.3*fadeT})`;
  ctx.beginPath();ctx.arc(this.x,this.y+r+6,3*(this.life/this.maxLife),0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 _drawWeapon(r){
  const bc=this.weaponCol||'#d4cfa8',bd=this.weaponDark||'#a09060',dk=this.weaponWood||'#5a4a20';
  ctx.strokeStyle=bc;ctx.fillStyle=bc;
  switch(this.weaponType){
   case 'sword':
    ctx.fillStyle=bd;ctx.fillRect(r*.6,-r*.07,r*.22,r*.14);
    ctx.fillStyle=bc;ctx.fillRect(r*.82,-r*.05,r*1.4,r*.1);
    ctx.beginPath();ctx.moveTo(r*.82+r*1.4,-r*.05);ctx.lineTo(r*.82+r*1.6,0);ctx.lineTo(r*.82+r*1.4,r*.05);ctx.closePath();ctx.fill();
    break;
   case 'spear':
    ctx.fillStyle=dk;ctx.fillRect(r*.6,-r*.04,r*2.0,r*.08);
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.moveTo(r*2.6,-r*.14);ctx.lineTo(r*2.95,0);ctx.lineTo(r*2.6,r*.14);ctx.closePath();ctx.fill();
    break;
   case 'hammer':
    ctx.fillStyle=dk;ctx.fillRect(r*.6,-r*.04,r*1.1,r*.08);
    ctx.fillStyle=bc;ctx.fillRect(r*1.65,-r*.4,r*.45,r*.8);
    ctx.fillStyle=bd;ctx.fillRect(r*1.67,-r*.38,r*.41,r*.2);
    break;
   case 'axe':
    ctx.fillStyle=dk;ctx.fillRect(r*.6,-r*.04,r*1.3,r*.08);
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.moveTo(r*1.9,-r*.7);
    ctx.bezierCurveTo(r*2.3,-r*.5,r*2.3,r*.3,r*1.9,r*.5);
    ctx.lineTo(r*1.9,r*.15);ctx.bezierCurveTo(r*2.0,r*.1,r*2.0,-r*.2,r*1.9,-r*.3);
    ctx.closePath();ctx.fill();
    break;
   case 'bow':
    ctx.strokeStyle=dk;ctx.lineWidth=r*.08;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(r*.85,-r*.6);ctx.quadraticCurveTo(r*1.4,0,r*.85,r*.6);ctx.stroke();
    ctx.strokeStyle=bc;ctx.lineWidth=r*.02;
    ctx.beginPath();ctx.moveTo(r*.85,-r*.6);ctx.lineTo(r*.85,r*.6);ctx.stroke();
    ctx.fillStyle=bd;ctx.fillRect(r*.85,-r*.03,r*1.0,r*.06);
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.moveTo(r*.85+r*1.0,-r*.1);ctx.lineTo(r*.85+r*1.2,0);ctx.lineTo(r*.85+r*1.0,r*.1);ctx.closePath();ctx.fill();
    break;
  }
 }

}
class BarbAlly extends Skeleton{
 constructor(x,y,king){super(x,y,king.faction);this.owner=king;this.life=10;this.maxLife=10;this.hp=80;this.maxHp=80;this.arm=0;this.magDef=0;this.radius=king.radius*.75;this.mass=4;this.speed=260;this.fullGravity=true;this.randomOnly=true;{const a=Math.random()*Math.PI*2;this.vx=Math.cos(a)*this.speed;this.vy=Math.sin(a)*this.speed;}this.omegaCur=6*Math.sign(king.omegaCur||1);this.weaponType='sword';this.reach=1.5;this.tipR=.30;this.dmg=king.d.dmg*.5;this.dmgMult=1;this.bodyCol='#3a3008';this.rimCol='#ffd35a';this.boneCol='#ffee88';this.hpCol='#fff3a0';this.weaponCol='#ffee88';this.weaponDark='#8a5a10';this.weaponWood='#6a3a00';this.lifeCol='rgba(255,211,90,.3)';}
 update(dt){if(this.owner&&this.owner.alive&&!this.owner.dying&&this.owner.decreeT>0&&Math.hypot(this.x-this.owner.x,this.y-this.owner.y)<this.owner.radius*2.5+this.radius)this.dmgMult=1.6;else this.dmgMult=1;super.update(dt)}
}
class ArcherAlly extends Skeleton{
 constructor(x,y,queen){super(x,y,queen.faction);this.owner=queen;this.life=10;this.maxLife=10;this.hp=1;this.maxHp=1;this.arm=0;this.magDef=0;this.radius=queen.radius*.72;this.mass=3.5;this.speed=240;this.fullGravity=true;this.randomOnly=false;{const a=Math.random()*Math.PI*2;this.vx=Math.cos(a)*this.speed;this.vy=Math.sin(a)*this.speed;}this.omegaCur=5*Math.sign(queen.omegaCur||1);this.weaponType='bow';this.reach=2.1;this.tipR=.12;this.dmg=queen.d.dmg*.4;this.bowCD=.15;this.kiteCD=0;this.bodyCol='#331025';this.rimCol='#ff69b4';this.boneCol='#ffb8e6';this.hpCol='#ffe3f5';this.weaponCol='#ffb8e6';this.weaponDark='#b01872';this.weaponWood='#8a2a60';this.lifeCol='rgba(255,105,180,.3)';}
 update(dt){
  // Keep Archer Allies firing from their current bow tip direction instead of aiming directly at enemies.
  super.update(dt);
 }
}
