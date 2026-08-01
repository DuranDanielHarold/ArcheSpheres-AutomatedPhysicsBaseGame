'use strict';
// ▓▓▓ MODULE: entities/zones-and-traps.js — extracted from former js/entities.js ▓▓▓
// Terrain zones, traps, patches, mounds, shards, and rat minions.

let _burialMoundSeq=0;
class PixieDustPatch{
 constructor(x,y,owner){this.x=x;this.y=y;this.owner=owner;this.r=owner.radius*0.8;this.life=3;this.maxLife=3;this.alive=true;this.t=0;this.tick=0;this.seed=Math.random()*10;}
 update(dt){this.life-=dt;this.t+=dt;if(this.life<=0)this.alive=false;for(const s of spheres){if(!s.alive||s.dying)continue;if(Math.hypot(s.x-this.x,s.y-this.y)<this.r+s.radius){if(s===this.owner){this.tick-=dt;if(this.tick<=0){this.tick=.5;s.receiveHeal(0.3);}}else if(!sameFaction(this.owner,s)){s.omegaCur=-Math.abs(s.omegaCur||1)*Math.sign(this.owner.omegaCur||1);s.charmedT=1.2;s.vx*=.75;s.vy*=.75;}}}}
 draw(){ctx.save();const a=this.life/this.maxLife;ctx.globalAlpha=.12+.26*a;const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.45,'rgba(255,184,239,.55)');g.addColorStop(1,'rgba(255,90,200,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.35*a;ctx.strokeStyle='#fff0ff';ctx.setLineDash([4,5]);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(this.x,this.y,this.r*(.74+.08*Math.sin(this.t*4)),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<7;i++){const ang=this.seed+i*Math.PI*2/7+this.t*.7,rr=this.r*(.18+.62*((i*37)%100)/100);ctx.fillStyle=i%2?'#ff8ce2':'#fff0ff';ctx.beginPath();ctx.arc(this.x+Math.cos(ang)*rr,this.y+Math.sin(ang)*rr,1.4+i%3,0,Math.PI*2);ctx.fill();}ctx.restore();}
}
class ArcaneBurnZone{
 constructor(x,y,r,dur,owner){this.x=x;this.y=y;this.r=r;this.life=dur;this.maxLife=dur;this.owner=owner;this.tick=0;this.t=0;}
 update(dt){this.life-=dt;this.t+=dt;this.tick-=dt;if(this.tick<=0){this.tick=.5;for(const s of spheres){if(!sameFaction(this.owner,s)&&s.alive&&!s.dying&&Math.hypot(s.x-this.x,s.y-this.y)<this.r+s.radius)s.receiveMagicDamage(2);}}}
 apply(){}
 draw(){ctx.save();const a=this.life/this.maxLife;ctx.globalAlpha=.13+.2*a;const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);g.addColorStop(0,'rgba(232,251,255,.75)');g.addColorStop(.42,'rgba(120,216,255,.36)');g.addColorStop(1,'rgba(255,122,34,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.45*a;ctx.strokeStyle='#78d8ff';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.t*(.6+i*.25)+i*Math.PI/3);ctx.beginPath();ctx.ellipse(0,0,this.r*(.35+i*.22),this.r*(.18+i*.16),0,0,Math.PI*2);ctx.stroke();ctx.restore();}ctx.strokeStyle='#ff7a22';ctx.setLineDash([5,6]);ctx.beginPath();ctx.arc(this.x,this.y,this.r*(.92+.04*Math.sin(this.t*5)),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
}
class BurialMound{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;this.r=owner.radius*1.35;this.life=Infinity;this.maxLife=Infinity;this.alive=true;
  this.seq=++_burialMoundSeq;this.triggerCD=0;this.t=0;
 }
 update(dt){
  this.t+=dt;this.triggerCD=Math.max(0,this.triggerCD-dt);
  if(!this.owner||!this.owner.alive)this.alive=false;
  if(this.triggerCD>0)return;
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<this.r+s.radius*0.55){
    this.triggerCD=0.75;
    s.vx*=0.72;s.vy*=0.72;s.impactVx*=0.72;s.impactVy*=0.72;
    const tdmg=Math.max(1,s.hp*0.03);
    s.hp=Math.max(0,s.hp-tdmg);s.hitFlash=1;
    spawnDmgNum(s.x,s.y-s.radius*1.4,tdmg,'#a7834b');
    spawnSpark(s.x,s.y,'#8a6a40',4);
    if(s.hp<=0&&!s.dying){s.alive=false;s.dying=true;spawnBurst(s.x,s.y,s.d.rim,s.d.color,28);}
   }
  }
 }
 draw(){
  const pulse=0.45+0.25*Math.sin(this.t*3);
  ctx.save();ctx.globalAlpha=0.82;
  const coreR=this.r*0.82;
  const g=ctx.createRadialGradient(this.x-coreR*0.28,this.y-coreR*0.35,coreR*0.08,this.x,this.y,coreR);
  g.addColorStop(0,'rgba(158,126,82,.86)');g.addColorStop(0.48,'rgba(92,66,40,.74)');g.addColorStop(1,'rgba(30,20,12,.88)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,coreR,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=`rgba(167,131,75,${0.45+pulse})`;ctx.lineWidth=2;ctx.setLineDash([5,4]);
  ctx.beginPath();ctx.arc(this.x,this.y,coreR*0.96,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha=0.38;ctx.fillStyle='rgba(230,205,150,.9)';ctx.beginPath();ctx.arc(this.x-coreR*0.28,this.y-coreR*0.34,coreR*0.22,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=0.55;ctx.fillStyle='rgba(42,30,18,.85)';
  for(let i=0;i<4;i++){
   const a=this.t*0.25+i*Math.PI*0.5;
   ctx.beginPath();ctx.arc(this.x+Math.cos(a)*coreR*0.42,this.y+Math.sin(a)*coreR*0.38,coreR*(0.06+i*0.012),0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
 }
}
class RatMinion{
 constructor(x,y,vx,vy,owner,gnaw=false){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.owner=owner;this.life=5;this.maxLife=5;this.alive=true;this.r=5;this.tick=0;this.gnaw=gnaw;this.t=Math.random()*10;
 }
 update(dt){
  this.life-=dt;this.t+=dt;if(this.life<=0){this.alive=false;return;}
  const target=spheres.find(s=>!sameFaction(this.owner,s)&&s.alive&&!s.dying);
  if(target){
   const dx=target.x-this.x,dy=target.y-this.y,d=Math.hypot(dx,dy)||1;
   const accel=this.gnaw?360:260;
   this.vx+=(dx/d)*accel*dt;this.vy+=(dy/d)*accel*dt;
   const max=this.gnaw?260:210,spd=Math.hypot(this.vx,this.vy)||1;
   if(spd>max){this.vx=this.vx/spd*max;this.vy=this.vy/spd*max;}
   if(d<target.radius+this.r+4){
    if(this.gnaw){
     target.receiveDamage(2);
     target.gnawedArmorStacks=Math.min(5,(target.gnawedArmorStacks||0)+1);target.gnawedArmorT=8.0;
     target._refreshGnawedArmor();
     spawnDmgNum(target.x,target.y-target.radius*1.8,'GNAWED','#b7c06a');
     spawnSpark(target.x,target.y,'#9aa050',3);
     this.alive=false;
    } else {
     this.tick-=dt;
     if(this.tick<=0){this.tick=1;target.receiveDamage(1);spawnSpark(target.x,target.y,'#9aa050',2);}
    }
   }
  }
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  if(this.x<0||this.x>W)this.vx*=-0.7;if(this.y<0||this.y>H)this.vy*=-0.7;
  this.x=Math.max(2,Math.min(W-2,this.x));this.y=Math.max(2,Math.min(H-2,this.y));
 }
 draw(){
  ctx.save();ctx.globalAlpha=Math.max(0.25,this.life/this.maxLife);
  ctx.translate(this.x,this.y);ctx.rotate(Math.atan2(this.vy,this.vx));
  ctx.fillStyle=this.gnaw?'#d0d070':'#333820';ctx.beginPath();ctx.ellipse(0,0,this.r*1.25,this.r*0.75,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(this.r*0.65,-this.r*0.28,this.r*0.2,0,Math.PI*2);ctx.arc(this.r*0.65,this.r*0.28,this.r*0.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a120d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-this.r,0);ctx.quadraticCurveTo(-this.r*2,Math.sin(this.t*9)*this.r,-this.r*2.7,0);ctx.stroke();
  ctx.restore();
 }
}
class GlassShard{
 constructor(x,y,owner){this.x=x;this.y=y;this.owner=owner;this.r=owner.radius*0.42;this.life=18;this.maxLife=18;this.alive=true;this.t=Math.random()*10;}
 update(dt){
  this.life-=dt;this.t+=dt;if(this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   const spd=Math.hypot(s.vx+s.impactVx,s.vy+s.impactVy);
   if(spd>170&&Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){this.shatter(s,8);break;}
  }
 }
 shatter(target,dmg=8){
  if(!this.alive)return 0;
  this.alive=false;
  if(target&&target.alive&&!target.dying){
   target.hp=Math.max(0,target.hp-dmg);target.hitFlash=1;target.glassBleedT=Math.max(target.glassBleedT||0,4.0);
   spawnDmgNum(target.x,target.y-target.radius*1.4,dmg,'#82f4ff');
   if(target.hp<=0&&!target.dying){target.alive=false;target.dying=true;spawnBurst(target.x,target.y,target.d.rim,target.d.color,28);}
  }
  spawnBurst(this.x,this.y,'#82f4ff','#ffffff',10);return target?1:0;
 }
 detonate(){
  if(!this.alive)return 0;
  let hits=0;
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r*3.0)hits+=this.shatter(s,6);
  }
  if(this.alive){this.alive=false;spawnBurst(this.x,this.y,'#82f4ff','#ffffff',8);}
  return hits;
 }
 draw(){
  const pulse=0.55+0.45*Math.sin(this.t*5);
  ctx.save();ctx.globalAlpha=Math.max(0.35,this.life/this.maxLife);
  ctx.translate(this.x,this.y);ctx.rotate(this.t);
  ctx.shadowColor='#82f4ff';ctx.shadowBlur=4+pulse*8;
  ctx.fillStyle='rgba(170,250,255,.75)';ctx.beginPath();ctx.moveTo(0,-this.r);ctx.lineTo(this.r*0.72,this.r*0.5);ctx.lineTo(-this.r*0.55,this.r*0.65);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.stroke();ctx.restore();
 }
}
class SlowZone{
 constructor(x,y,r,dur,owner){this.x=x;this.y=y;this.r=r;this.life=dur;this.maxLife=dur;this.owner=owner;}
 update(dt){this.life-=dt;}
 apply(s){
  const isEnemy=!sameFaction(this.owner,s);
  if(!isEnemy) return;
  const d=Math.hypot(s.x-this.x,s.y-this.y);
  if(d<this.r+s.radius){
   s.vx*=0.88;s.vy*=0.88;
   s.impactVx*=0.88;s.impactVy*=0.88;
  }
 }
 draw(){
  const pct=this.life/this.maxLife;
  const pulse=0.5+0.5*Math.sin((1-pct)*Math.PI*8);
  ctx.save();ctx.globalAlpha=0.18+pct*0.34;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,'rgba(255,250,190,.58)');
  g.addColorStop(0.45,'rgba(255,220,80,.30)');
  g.addColorStop(1,'rgba(255,180,20,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  ctx.shadowColor='rgba(255,230,110,.9)';ctx.shadowBlur=8+pulse*10;
  ctx.strokeStyle=`rgba(255,238,150,${0.45+pulse*0.25})`;ctx.lineWidth=2.5;ctx.setLineDash([8,5]);
  ctx.beginPath();ctx.arc(this.x,this.y,this.r*(0.96+0.03*pulse),0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(255,248,200,.38)';ctx.lineWidth=1.4;
  for(let i=0;i<12;i++){
   const a=i/12*Math.PI*2+(1-pct)*Math.PI;
   const ir=this.r*0.42,or=this.r*(0.82+0.04*pulse);
   ctx.beginPath();ctx.moveTo(this.x+Math.cos(a)*ir,this.y+Math.sin(a)*ir);
   ctx.lineTo(this.x+Math.cos(a)*or,this.y+Math.sin(a)*or);ctx.stroke();
  }
  ctx.restore();
 }
}
class GuardianSanctuaryZone{
 constructor(owner){
  this.owner=owner;this.x=owner.x;this.y=owner.y;this.r=owner.radius*2.4;
  this.life=8.0;this.maxLife=8.0;this.consumed=false;this.t=0;
 }
 update(dt){this.life-=dt;this.t+=dt;}
 apply(){}
 contains(s){return !this.consumed&&this.life>0&&Math.hypot(s.x-this.x,s.y-this.y)<this.r+s.radius*0.25;}
 consume(){this.consumed=true;this.life=0;}
 draw(){
  if(this.consumed)return;
  const pct=Math.max(0,this.life/this.maxLife);
  const pulse=0.5+0.5*Math.sin(this.t*7);
  ctx.save();ctx.globalAlpha=0.22+pct*0.48;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,'rgba(128,203,196,.34)');
  g.addColorStop(0.55,'rgba(80,220,210,.18)');
  g.addColorStop(1,'rgba(0,137,123,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  ctx.shadowColor='#80cbc4';ctx.shadowBlur=12+pulse*8;
  ctx.strokeStyle=`rgba(128,235,225,${0.56+pulse*0.22})`;ctx.lineWidth=3;
  ctx.beginPath();
  for(let i=0;i<6;i++){
   const a=-Math.PI/2+i*Math.PI/3;
   const px=this.x+Math.cos(a)*this.r*0.88,py=this.y+Math.sin(a)*this.r*0.88;
   if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(224,247,250,.45)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(this.x,this.y,this.r*(0.42+0.05*pulse),0,Math.PI*2);ctx.stroke();
  ctx.restore();
 }
}
class ThornPatch{
 constructor(x,y,r,dur,owner){
  this.x=x;this.y=y;this.r=r;this.life=dur;this.maxLife=dur;this.owner=owner;
  this.rootTimer=0;this.dotTimer=0;
 }
 update(dt){
  this.life-=dt;
  this.rootTimer+=dt;
  this.dotTimer+=dt;
  for(const s of spheres){
   const isEnemy=!this.owner||!sameFaction(this.owner,s);
   if(!isEnemy||!s.alive||s.dying)continue;
   if(s.hp<=0)continue;
   const d=Math.hypot(s.x-this.x,s.y-this.y);
   if(d<this.r+s.radius){
    s.vx*=Math.pow(0.02,dt);s.vy*=Math.pow(0.02,dt);
    s.impactVx*=Math.pow(0.02,dt);s.impactVy*=Math.pow(0.02,dt);
    if(this.dotTimer>=0.8&&this.owner&&this.owner.d){
     s.receiveDamage(this.owner.d.dmg*0.7);
     spawnSpark(s.x,s.y,this.owner.d.rim,3);
    }
   }
  }
  if(this.dotTimer>=0.8)this.dotTimer=0;
 }
 draw(){
  const pct=this.life/this.maxLife;
  ctx.save();ctx.globalAlpha=pct*0.85;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,'rgba(30,140,50,.7)');g.addColorStop(0.6,'rgba(20,90,30,.5)');g.addColorStop(1,'rgba(10,50,15,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#69f0ae';ctx.lineWidth=1.5;
  const spikes=10;
  for(let i=0;i<spikes;i++){
   const a=(i/spikes)*Math.PI*2;
   const ir=this.r*0.55,or=this.r*0.9;
   ctx.beginPath();
   ctx.moveTo(this.x+Math.cos(a)*ir,this.y+Math.sin(a)*ir);
   ctx.lineTo(this.x+Math.cos(a)*or,this.y+Math.sin(a)*or);
   ctx.stroke();
  }
  ctx.setLineDash([4,3]);ctx.strokeStyle='rgba(105,240,174,.5)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();
 }
}
class ToxicSmear{
 constructor(x,y,r,owner){
  this.x=x;this.y=y;this.r=r;this.owner=owner;
  this.life=Infinity;this.maxLife=Infinity;this.dotTimer=0;this.t=0;
  this.seed=Math.random()*Math.PI*2;
 }
 update(dt){
  this.t+=dt;this.dotTimer+=dt;
  for(const s of spheres){
   const isEnemy=!this.owner||!sameFaction(this.owner,s);
   if(!isEnemy||!s.alive||s.dying||s.hp<=0)continue;
   const d=Math.hypot(s.x-this.x,s.y-this.y);
   if(d<this.r+s.radius){
    s.vx*=Math.pow(0.78,dt);s.vy*=Math.pow(0.78,dt);
    s.impactVx*=Math.pow(0.72,dt);s.impactVy*=Math.pow(0.72,dt);
    if(this.dotTimer>=0.8&&this.owner&&this.owner.d){
     s.receiveDamage(this.owner.d.dmg*0.55);
     spawnSpark(s.x,s.y,'#aadd44',4);
    }
   }
  }
  if(this.dotTimer>=0.8)this.dotTimer=0;
 }
 draw(){
  const pulse=0.5+0.5*Math.sin(this.t*2.4+this.seed);
  ctx.save();
  ctx.globalAlpha=0.78;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,`rgba(190,255,70,${0.28+pulse*0.10})`);
  g.addColorStop(0.36,'rgba(90,150,22,0.42)');
  g.addColorStop(0.72,'rgba(35,70,16,0.34)');
  g.addColorStop(1,'rgba(8,18,4,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=`rgba(170,221,68,${0.50+pulse*0.25})`;ctx.lineWidth=2;
  ctx.setLineDash([7,5]);
  ctx.beginPath();
  const lobes=18;
  for(let i=0;i<=lobes;i++){
   const a=this.seed+(i/lobes)*Math.PI*2;
   const wob=0.80+0.15*Math.sin(i*1.7+this.t*1.3)+0.08*Math.cos(i*2.9+this.seed);
   const px=this.x+Math.cos(a)*this.r*wob;
   const py=this.y+Math.sin(a)*this.r*wob;
   if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.closePath();ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<7;i++){
   const a=this.seed+i*0.92+this.t*0.22;
   const rr=this.r*(0.18+0.55*((i*37)%100)/100);
   const bx=this.x+Math.cos(a)*rr,by=this.y+Math.sin(a)*rr*0.72;
   const br=this.r*(0.045+0.025*((i*19)%7));
   ctx.fillStyle=`rgba(190,255,85,${0.13+pulse*0.10})`;
   ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='rgba(220,255,120,0.35)';ctx.lineWidth=1;ctx.stroke();
  }
  ctx.shadowColor='#aadd44';ctx.shadowBlur=10+pulse*10;
  ctx.strokeStyle=`rgba(220,255,110,${0.35+pulse*0.35})`;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(this.x,this.y,this.r*(0.42+pulse*0.08),0,Math.PI*2);ctx.stroke();
  ctx.shadowBlur=0;
  ctx.restore();
 }
}
class FireBreathZone{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;
  this.r=owner.radius*(2.2+(owner.whelplingGrowth||0)*0.08);
  this.life=5.0;this.maxLife=5.0;
  this.tickT=0;this.rot=0;
 }
 update(dt){
  this.life-=dt;this.tickT+=dt;this.rot+=dt;
  if(this.tickT<0.5)return;
  this.tickT=0;
  const now=performance.now();
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)>this.r+s.radius)continue;
   // Anti-stack: only deal damage if not hit by any fire zone in last 0.45s
   if(s._fireZoneHitTime&&now-s._fireZoneHitTime<450)continue;
   s._fireZoneHitTime=now;
   s.receiveDamage(2);
    s.burning=true;s.burnT=Math.max(s.burnT||0,2.0);s.burnTickInterval=WHELPLING_BURN_TICK_INTERVAL;s.burnTickT=Math.min(s.burnTickT||WHELPLING_BURN_TICK_INTERVAL,WHELPLING_BURN_TICK_INTERVAL);
   spawnSpark(s.x,s.y,'#ff4400',3);
  }
 }
 draw(){
  const pct=this.life/this.maxLife;
  ctx.save();ctx.globalAlpha=pct*0.65;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,'rgba(255,180,60,0.6)');g.addColorStop(0.5,'rgba(255,80,0,0.35)');g.addColorStop(1,'rgba(200,40,0,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,120,0,0.6)';ctx.lineWidth=2;ctx.setLineDash([5,4]);
  ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);ctx.restore();
 }
}
class VoidTear{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;
  this.life=3.0;this.maxLife=3.0;
  this.r=18;this.t=0;this.rot=0;
  this.alive=true;
  this.tickT=0; // DoT interval timer
 }
 update(dt){
  this.life-=dt;this.t+=dt;this.rot+=dt*1.2;this.tickT+=dt;
  if(this.life<=0){this.alive=false;return;}
  // Damage fires once per 1.5s, not every frame
  if(this.tickT<0.6)return;
  this.tickT=0;
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    s.vx*=0.85;s.vy*=0.85;
    s.receiveMagicDamage(this.owner.d.dmg*0.4);
    spawnSpark(s.x,s.y,'#aa44ff',3);
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  ctx.save();ctx.globalAlpha=pct*0.75;
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  // Void distortion rings
  for(let i=0;i<3;i++){
   const rr=this.r*(0.4+i*0.3);
   const g=ctx.createRadialGradient(0,0,rr*.5,0,0,rr);
   g.addColorStop(0,'rgba(170,68,255,0.5)');g.addColorStop(1,'transparent');
   ctx.strokeStyle=`rgba(170,68,255,${0.4-i*0.1})`;ctx.lineWidth=2-i*.5;
   ctx.setLineDash([4,3+i*2]);
   ctx.beginPath();ctx.ellipse(0,0,rr*1.4,rr,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.setLineDash([]);
  // Central black void
  const vg=ctx.createRadialGradient(0,0,0,0,0,this.r*.55);
  vg.addColorStop(0,'rgba(0,0,0,1)');vg.addColorStop(0.6,'rgba(40,0,80,0.8)');vg.addColorStop(1,'transparent');
  ctx.fillStyle=vg;ctx.beginPath();ctx.arc(0,0,this.r*.55,0,Math.PI*2);ctx.fill();
  ctx.restore();ctx.restore();
 }
}
class SingularityZone{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;
  this.r=60;this.life=2.5;this.maxLife=2.5;
  this.t=0;this.rot=0;this.alive=true;
 }
 update(dt){this.life-=dt;this.t+=dt;this.rot+=dt*2;if(this.life<=0){this.alive=false;}}
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  const pulse=0.5+0.5*Math.sin(this.t*10);
  ctx.save();ctx.globalAlpha=pct*0.85;
  ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  // Event horizon rings
  for(let i=3;i>=0;i--){
   const rr=this.r*(0.25+i*0.2);
   ctx.beginPath();ctx.arc(0,0,rr,0,Math.PI*2);
   ctx.strokeStyle=`rgba(${170-i*30},${68-i*15},255,${0.7-i*0.12})`;
   ctx.lineWidth=3-i*.6;ctx.stroke();
  }
  // Dark core
  const cg=ctx.createRadialGradient(0,0,0,0,0,this.r*.3);
  cg.addColorStop(0,'rgba(0,0,0,1)');cg.addColorStop(0.7,'rgba(20,0,40,0.9)');cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,0,this.r*.3,0,Math.PI*2);ctx.fill();
  // Accretion disk
  ctx.strokeStyle=`rgba(170,68,255,${0.35+pulse*0.2})`;ctx.lineWidth=6;
  ctx.setLineDash([8,6]);
  ctx.beginPath();ctx.ellipse(0,0,this.r*.8,this.r*.25,Math.PI/6,0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
 }
}
// ▓▓▓ END NEW CHARACTER PROJECTILES ▓▓▓
