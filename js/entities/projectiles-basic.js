'use strict';
// ▓▓▓ MODULE: entities/projectiles-basic.js — extracted from former js/entities.js ▓▓▓
// Basic projectile classes for arrows, bullets, hooks, bolas, and holy orbs.

class BoneArrow{
 constructor(x,y,vx,vy,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.owner=owner; // the Skeleton instance
  this.alive=true;this.life=3.5;this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>8)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H||this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   const isEnemy=true;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(s.key==='necromancer'&&s.faction===this.owner.faction)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+5){
    const fd=1.2/(s.d.arm*0.004+1);
    s.receiveDamage(fd);
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    s.applyImpact(nx*25,ny*25);
    spawnSpark(this.x,this.y,'#c8c0a0',3);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const ang=Math.atan2(this.vy,this.vx);
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(ang);
  ctx.fillStyle='#8a7a50';ctx.fillRect(-14,-1.5,14,3);
  ctx.fillStyle='#d4cfa8';
  ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(7,0);ctx.lineTo(0,4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#a09060';
  ctx.beginPath();ctx.moveTo(-14,-1.5);ctx.lineTo(-10,-5);ctx.lineTo(-8,-1.5);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-14,1.5);ctx.lineTo(-10,5);ctx.lineTo(-8,1.5);ctx.closePath();ctx.fill();
  ctx.restore();
 }
}
class Arrow{
 constructor(x,y,vx,vy,dmg,owner,spread=false){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;this.spread=spread;
  this.alive=true;this.life=2.8;this.trail=[];
  this.col='#88cc44';
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>10)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.22*dt;
  this.life-=dt;
  if(this.x<-30||this.x>W+30||this.y>H+40||this.life<=0){this.alive=false;return;}
  if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   spawnSpark(this.x,this.y,'#88cc44',4);this.alive=false;return;
  }
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+8){
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    s.applyImpact(nx*Math.hypot(this.vx,this.vy)*0.32,ny*Math.hypot(this.vx,this.vy)*0.32);
    s.receiveDamage(this.dmg);
    if(this.fireBurn){s.burning=true;s.burnT=2.5;s.burnTickInterval=1.0;s.burnTickT=1.0;}
    if(this.owner&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}
    if(this.isCrit){
     spawnBurst(this.x,this.y,'#ff4400','#ffaa22',14);
     spawnDmgNum(s.x,s.y-s.radius*1.4,this.dmg,'#ff4400');
    } else {
     spawnArrowHit(this.x,this.y);
    }
    this.alive=false;return;
   }
  }
  for(const sk of skeletons){
   const isEnemy=true;
   if(!isEnemy||sk===this.owner||sameFaction(this.owner,sk)||!sk.alive)continue;
   if(Math.hypot(sk.x-this.x,sk.y-this.y)<sk.radius+8){
    const dmg=this.dmg/(sk.arm*0.004+1);
    sk.hp=Math.max(0,sk.hp-dmg);sk.hitFlash=1;
    const nx=(sk.x-this.x)/Math.hypot(sk.x-this.x,sk.y-this.y)||1;
    const ny=(sk.y-this.y)/Math.hypot(sk.x-this.x,sk.y-this.y)||0;
    sk.applyImpact(nx*80,ny*80);
    spawnArrowHit(this.x,this.y);
    spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=8?'#ff4444':'#ffffff');
    if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  for(let i=1;i<this.trail.length;i++){
   const t=this.trail[i],a=(i/this.trail.length)*0.5,sz=5*(i/this.trail.length);
   ctx.save();ctx.globalAlpha=a;
   ctx.fillStyle=this.isCrit?`hsl(${20+i*4},100%,55%)`:(this.col||'#5a9a20');
   ctx.fillRect(t.x-sz/2,t.y-sz/2,sz,sz);ctx.restore();
  }
  const ang=Math.atan2(this.vy,this.vx);
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(ang);
  if(this.isCrit){
   ctx.shadowColor='#ff4400';ctx.shadowBlur=10;
  }
  ctx.fillStyle=this.isCrit?'#5a1a00':'#8a5a20';ctx.fillRect(-22,-2.5,22,5);
  ctx.fillStyle=this.isCrit?'#ff8844':(this.col||'#c0c8a0');
  ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(13,0);ctx.lineTo(0,5);ctx.closePath();ctx.fill();
  ctx.fillStyle=this.isCrit?'#ff4400':(this.col||'#88cc44');
  ctx.beginPath();ctx.moveTo(-22,-2);ctx.lineTo(-16,-8);ctx.lineTo(-12,-2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-22,2);ctx.lineTo(-16,8);ctx.lineTo(-12,2);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;
  ctx.restore();
 }
}
globalThis.Arrow=Arrow;
class GrapplingHook{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.5;
  this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>8)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.3*dt;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H){this._hookWall();return;}
  if(this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+10){
    s.receiveDamage(this.dmg);
    const pullX=this.owner.x-s.x,pullY=this.owner.y-s.y;
    const pullD=Math.hypot(pullX,pullY)||1;
    s.applyImpact((pullX/pullD)*380,(pullY/pullD)*380);
    this.owner.applyImpact((-pullX/pullD)*80,(-pullY/pullD)*80);
    spawnBurst(s.x,s.y,'#ffcc02',this.owner.d.rim,10);
    this.owner.gainStack();
    this.alive=false;return;
   }
  }
 }

 _hookWall(){
  const hx=Math.max(0,Math.min(W,this.x));
  const hy=Math.max(0,Math.min(H,this.y));
  this.x=hx;this.y=hy;
  if(this.owner&&this.owner.alive&&!this.owner.dying){
   const pullX=hx-this.owner.x,pullY=hy-this.owner.y;
   const pullD=Math.hypot(pullX,pullY)||1;
   this.owner.applyImpact((pullX/pullD)*380,(pullY/pullD)*380);
   spawnBurst(hx,hy,'#ffcc02',this.owner.d.rim,10);
   spawnDmgNum(hx,hy-14,'HOOK','#ffcc02');
  }
  this.alive=false;
 }

 draw(){
  if(!this.alive)return;
  ctx.strokeStyle='#ffcc02';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
  ctx.beginPath();ctx.moveTo(this.owner.x,this.owner.y);ctx.lineTo(this.x,this.y);ctx.stroke();
  ctx.setLineDash([]);
  ctx.save();ctx.translate(this.x,this.y);
  const ang=Math.atan2(this.vy,this.vx);ctx.rotate(ang);
  ctx.fillStyle='#c0a030';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#ffcc02';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(10,-5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(10,3);ctx.stroke();
  ctx.restore();
 }
}
class Bola{
 constructor(x,y,vx,vy,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.owner=owner;this.alive=true;this.life=1.8;
  this.rot=0;this.trail=[];
 }
 update(dt){
  this.rot+=dt*14;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>10)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.3*dt;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y>H+20||this.life<=0){
     this.owner.sheriffHitCount=0;
   this.alive=false;return;
  }
   if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   this.owner.sheriffHitCount=0;
   spawnSpark(this.x,this.y,'#d4a83a',4);this.alive=false;return;
  }
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+12){
   
    s.vx=0;s.vy=0;s.impactVx=0;s.impactVy=0;
    s.bolaRootT=1.0;
    s.bolaFloating=true; // suppress gravity while rooted
   
    spawnBurst(this.x,this.y,'#d4a83a','#8a6010',12);
   
    const dx=this.owner.x-s.x,dy=this.owner.y-s.y,dist=Math.hypot(dx,dy)||1;
    this.owner.applyImpact((dx/dist)*320,(dy/dist)*320);
   
    this.owner._firePiercingShot(s);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.6;
   ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#8a6010';ctx.lineWidth=1.5;
   if(i>1){ctx.beginPath();ctx.moveTo(this.trail[i-1].x,this.trail[i-1].y);ctx.lineTo(tr.x,tr.y);ctx.stroke();}
   ctx.restore();
  }
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  ctx.strokeStyle='#8a6010';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(11,0);ctx.stroke();
  const g1=ctx.createRadialGradient(-11,-2,1,-11,0,6);
  g1.addColorStop(0,'#e8c860');g1.addColorStop(1,'#7a5010');
  ctx.fillStyle=g1;ctx.beginPath();ctx.arc(-11,0,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#5a3808';ctx.lineWidth=1;ctx.stroke();
  const g2=ctx.createRadialGradient(11,-2,1,11,0,6);
  g2.addColorStop(0,'#e8c860');g2.addColorStop(1,'#7a5010');
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(11,0,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#5a3808';ctx.lineWidth=1;ctx.stroke();
  ctx.restore();
 }
}
class PiercingBullet{
 constructor(x,y,vx,vy,owner,target,damage=30){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.owner=owner;this.target=target;this.damage=damage;
  this.alive=true;this.life=1.5;
  this.trail=[];this.t=0;
  this.startX=x;this.startY=y;
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>22)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H||this.life<=0){this.alive=false;return;}
   if(this.target&&this.target.alive&&!this.target.dying){
   if(Math.hypot(this.target.x-this.x,this.target.y-this.y)<this.target.radius+8){
       let finalDmg=this.damage+(this.target.maxHp*0.05);
if(this.target._sheriffArmPen){const penBonus=this.target.d.arm*0.40*0.004;finalDmg+=penBonus;this.target._sheriffArmPen=false;}
    this.target.hp=Math.max(0,this.target.hp-finalDmg);
    this.target.hitFlash=1;
    spawnBloodSplat(this.target.x,this.target.y,this.target.d.color,finalDmg);
   
    spawnDmgNum(this.target.x,this.target.y-this.target.radius*0.5,finalDmg,'#e8d840');
    if(this.target.hp<=0&&!this.target.dying){
     this.target.alive=false;this.target.dying=true;
     spawnBurst(this.target.x,this.target.y,this.target.d.rim,this.target.d.color,28);
    }
    spawnBurst(this.x,this.y,'#c8b840','#fff8a0',12);
    spawnSpark(this.x,this.y,'#ffe060',10);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  if(this.trail.length>1){
   const src=this.trail[0];
   ctx.save();ctx.globalAlpha=0.35;
   ctx.strokeStyle='#c8b020';ctx.lineWidth=7;ctx.lineCap='round';
   ctx.shadowColor='#c8b020';ctx.shadowBlur=10;
   ctx.beginPath();ctx.moveTo(src.x,src.y);ctx.lineTo(this.x,this.y);ctx.stroke();
   ctx.globalAlpha=0.85;
   ctx.strokeStyle='#e8d840';ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(src.x,src.y);ctx.lineTo(this.x,this.y);ctx.stroke();
   ctx.globalAlpha=1;
   ctx.strokeStyle='#fffaa0';ctx.lineWidth=1.2;
   ctx.beginPath();ctx.moveTo(src.x,src.y);ctx.lineTo(this.x,this.y);ctx.stroke();
   ctx.shadowBlur=0;ctx.restore();
  }
  ctx.save();
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,8);
  g.addColorStop(0,'rgba(255,250,160,.9)');g.addColorStop(0.4,'rgba(200,180,40,.5)');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}
class SheriffBullet{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.8;this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>8)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.06*dt;
  this.life-=dt;
  if(this.x<-20||this.x>W+20||this.y>H+20||this.life<=0){this.alive=false;return;}
  if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   spawnSpark(this.x,this.y,'#d4a83a',3);this.alive=false;return;
  }
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+5){
       const penArm=s.d.arm*0.8;
    const fd=this.dmg/(penArm*0.004+1)+(s.maxHp*0.05);
    s.receiveDamage(fd);
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    s.applyImpact(nx*60,ny*60);
    this.owner._applyHitBuff();
    spawnSpark(this.x,this.y,'#d4a83a',5);
    this.alive=false;return;
   }
  }
   for(const sk of skeletons){
   const isEnemy=true;
   if(!isEnemy||!sk.alive)continue;
   if(Math.hypot(sk.x-this.x,sk.y-this.y)<sk.radius+5){
    const dmg=this.dmg/(sk.arm*0.004+1);
    sk.hp=Math.max(0,sk.hp-dmg);sk.hitFlash=1;
    const nx=(sk.x-this.x)/Math.hypot(sk.x-this.x,sk.y-this.y)||1;
    const ny=(sk.y-this.y)/Math.hypot(sk.x-this.x,sk.y-this.y)||0;
    sk.applyImpact(nx*80,ny*80);
    spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=8?'#ff4444':'#ffffff');
    spawnSpark(this.x,this.y,'#d4a83a',5);
    if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.5;
   ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#c8a040';
   ctx.fillRect(tr.x-1,tr.y-1,2,2);ctx.restore();
  }
  const ang=Math.atan2(this.vy,this.vx);
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(ang);
  ctx.fillStyle='#d4a83a';ctx.fillRect(-6,-1.5,6,3);
  ctx.fillStyle='#c8c090';
  ctx.beginPath();ctx.moveTo(0,-1.5);ctx.lineTo(5,0);ctx.lineTo(0,1.5);ctx.closePath();ctx.fill();
  ctx.restore();
 }
}
class HolyOrb{
 constructor(x,y,vx,vy,dmg,owner,isBenediction=false){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;this.isBenediction=isBenediction;
  this.alive=true;this.trail=[];
  this.t=0;this.r=8;
  this.homingT=0;
  this.rot=0;
 }
 update(dt){
  this.t+=dt;this.rot+=dt*4;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>14)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
 
   if(this.x-this.r<0||this.x+this.r>W||this.y-this.r<0||this.y+this.r>H){
   spawnSpark(this.x,this.y,'#fff8c0',4);this.alive=false;return;
  }
   if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   spawnSpark(this.x,this.y,'#fff8c0',4);this.alive=false;return;
  }
   if(this.t>0.18){
   let nearEnemy=null,nearDist=Infinity;
   for(const s of spheres){
    const isEnemy=s!==this.owner;
    if(!isEnemy||!s.alive||s.dying)continue;
    const d=Math.hypot(s.x-this.x,s.y-this.y);
    if(d<nearDist){nearDist=d;nearEnemy=s;}
   }
   if(nearEnemy){
    const dx=nearEnemy.x-this.x,dy=nearEnemy.y-this.y,dist=nearDist||1;
       const turnStrength=Math.min(0.95,0.55+(this.t-0.18)*1.2);
    const spd=Math.hypot(this.vx,this.vy)||200;
    this.vx+=(dx/dist)*spd*turnStrength*dt*3;
    this.vy+=(dy/dist)*spd*turnStrength*dt*3;
       const newSpd=Math.hypot(this.vx,this.vy);
    if(newSpd>spd*1.05){this.vx*=spd/newSpd;this.vy*=spd/newSpd;}
   }
  }
   if(this.t>0.3){
  for(const s of spheres){
   const isAlly=s===this.owner;
   if(!isAlly||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
       s.d=Object.assign({},s.d);
     s.d.dmg+=2;
     s.blessDmgT=8.0;
     s.blessDmgAdded=(s.blessDmgAdded||0)+2;
     s.priestShieldStacks=Math.min(10,s.priestShieldStacks+1);
     s.priestShieldT=8.0;
     spawnHolyShieldBurst(s.x,s.y);
    spawnHealNum(s.x,s.y-s.radius,2);
    this.alive=false;return;
   }
  }
  }
   for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    s.receiveMagicDamage(this.dmg); // magic damage — uses magDef
       s.d=Object.assign({},s.d);
    const baseMagDef=DEF[s.key].magDef;
    s.d.magDef=Math.max(Math.max(0,baseMagDef-30),s.d.magDef-5);
    if(this.fireBurn){s.burning=true;s.burnT=2.5;s.burnTickInterval=1.0;s.burnTickT=1.0;}
    if(this.owner&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}
    spawnSpark(this.x,this.y,'#fff8c0',8);
    spawnBurst(this.x,this.y,'#f0e890','#fff',10);
    this.alive=false;return;
   }
  }
   for(const sk of skeletons){
   const isEnemy=true;
   if(!isEnemy||!sk.alive)continue;
   if(Math.hypot(sk.x-this.x,sk.y-this.y)<sk.radius+this.r){
    const dmg=this.dmg/(sk.arm*0.004+1);
    sk.hp=Math.max(0,sk.hp-dmg);sk.hitFlash=1;
    const nx=(sk.x-this.x)/Math.hypot(sk.x-this.x,sk.y-this.y)||1;
    const ny=(sk.y-this.y)/Math.hypot(sk.x-this.x,sk.y-this.y)||0;
    sk.applyImpact(nx*70,ny*70);
    spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=8?'#fff8c0':'#ffffff');
    spawnBurst(this.x,this.y,'#f0e890','#fff',8);
    if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
    this.alive=false;return;
   }
  }
 }
 draw(){
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.5;
   ctx.save();ctx.globalAlpha=a*0.6;
   const sz=6*(i/this.trail.length);
   const g=ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,sz);
   g.addColorStop(0,'rgba(255,248,180,.8)');g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.save();ctx.translate(this.x,this.y);
  const smokeCount=3;
  for(let i=0;i<smokeCount;i++){
   const phase=(this.t*1.4+i*0.33)%1;
   const sw=this.r*(0.5+phase*1.2);
   const sa=Math.max(0,0.14-phase*0.14);
   ctx.save();ctx.globalAlpha=sa;
   const sg=ctx.createRadialGradient(0,0,0,0,0,sw);
   sg.addColorStop(0,'rgba(240,238,230,.8)');sg.addColorStop(1,'transparent');
   ctx.fillStyle=sg;ctx.beginPath();ctx.arc(0,0,sw,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  const halo=ctx.createRadialGradient(0,0,this.r,0,0,this.r*2.5);
  halo.addColorStop(0,'rgba(255,248,160,.25)');halo.addColorStop(1,'transparent');
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,this.r*2.5,0,Math.PI*2);ctx.fill();
  const pulse=0.6+0.4*Math.sin(this.t*7);
  const og=ctx.createRadialGradient(-this.r*0.25,-this.r*0.25,0.5,0,0,this.r);
  og.addColorStop(0,'#fffce0');og.addColorStop(0.4,'#f0e070');og.addColorStop(0.8,'#c8a828');og.addColorStop(1,'#806010');
  ctx.fillStyle=og;ctx.beginPath();ctx.arc(0,0,this.r,0,Math.PI*2);ctx.fill();
  ctx.rotate(this.rot);
  ctx.strokeStyle=`rgba(255,255,220,${0.55+pulse*0.3})`;ctx.lineWidth=1.2;
  for(let i=0;i<4;i++){
   const a=(i/4)*Math.PI*2;
   ctx.beginPath();ctx.moveTo(Math.cos(a)*(this.r+2),Math.sin(a)*(this.r+2));
   ctx.lineTo(Math.cos(a)*(this.r+5),Math.sin(a)*(this.r+5));ctx.stroke();
  }
  ctx.fillStyle='rgba(255,255,240,.6)';ctx.beginPath();ctx.arc(-this.r*0.25,-this.r*0.3,this.r*0.32,0,Math.PI*2);ctx.fill();
  if(this.isBenediction){
   ctx.shadowColor='#fff8a0';ctx.shadowBlur=10;
   ctx.strokeStyle='rgba(255,248,160,.8)';ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(0,0,this.r+2,0,Math.PI*2);ctx.stroke();
   ctx.shadowBlur=0;
  }
  ctx.restore();
 }
}
class FlameBolt{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=2.5;this.trail=[];
  this.t=0;this.r=9;
  this.rodType=null;this.rodCol=null;this.effectPower=0; // set externally when rod is active
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y,t:this.t});
  if(this.trail.length>18)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.09*dt;
  this.life-=dt;
  if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   spawnSpark(this.x,this.y,this.rodCol||'#cc88ff',4);this.alive=false;return;
  }
  if(this.x<-30||this.x>W+30||this.y>H+40||this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r+3){
    const power=this.effectPower||0;
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    if(this.rodType===0){
     s.electrified=true;s.electrifiedT=1.4+power*0.3;
     spawnSpark(s.x,s.y,'#ffee00',8);
     } else if(this.rodType===1){// Fire: longer, faster burn ticks
      s.burning=true;s.burnT=4.0+power*0.65;s.burnTickInterval=Math.max(0.5,DEFAULT_BURN_TICK_INTERVAL-power*0.14);s.burnTickT=Math.min(0.75,s.burnTickInterval);
     spawnFlameExplosion(s.x,s.y);
    } else if(this.rodType===2){// Water: stronger, longer slow stacking
     s.waterSlow=Math.min(2.8+power*0.35,s.waterSlow+1.35+power*0.22);s.waterSlowT=2.6+power*0.35;
     spawnRingBurst(s.x,s.y,'#44aaff');
    } else if(this.rodType===3){// Wind: knockback + particles
     s.applyImpact(nx*(230+power*30),ny*(230+power*30));
     for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2;particles.push({x:s.x,y:s.y,vx:Math.cos(a)*120,vy:Math.sin(a)*120,life:1,maxL:.25,sz:3,col:'#ffffff',sq:false});}
    } else if(this.rodType===4){
     s.stunned=true;s.stunnedT=0.45+power*0.07;
     s.applyImpact(nx*(280+power*35),ny*(280+power*35));
     spawnBurst(s.x,s.y,'#886633','#554422',12);
    }
   const baseKB=(this.rodType===3?55:110)+power*12;
   s.applyImpact(nx*baseKB,ny*baseKB);
   let finalDmg=this.dmg;
   if(s.electrifiedT>0)finalDmg=Math.max(0,finalDmg-1);
   s.receiveMagicDamage(finalDmg); // magic damage — uses magDef not arm
   if(this.owner&&this.owner.key==='wizard')_playSphereAudio(this.owner.key,'projectileHit');
   this.owner.gainStack();
   this.owner._applyHitBuff();
   if(this.rodType===null||this.rodType===undefined)spawnFlameExplosion(this.x,this.y);
   else spawnSpark(this.x,this.y,this.rodCol,6);
   this.alive=false;return;
   }
  }
  for(const sk of skeletons){
   if(!sk.alive||sk.faction===this.owner.faction)continue;
   if(Math.hypot(sk.x-this.x,sk.y-this.y)<sk.radius+this.r+3){
    const dmg=this.dmg/(sk.arm*0.004+1);
    sk.hp=Math.max(0,sk.hp-dmg);sk.hitFlash=1;
   const nx=(sk.x-this.x)/Math.hypot(sk.x-this.x,sk.y-this.y)||1;
   const ny=(sk.y-this.y)/Math.hypot(sk.x-this.x,sk.y-this.y)||0;
   sk.applyImpact(nx*100,ny*100);
   if(this.owner&&this.owner.key==='wizard')_playSphereAudio(this.owner.key,'projectileHit');
   spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=8?'#ff4444':'#ffffff');
   spawnFlameExplosion(this.x,this.y);
   if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
   this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const col=this.rodCol||null;
  for(let i=0;i<this.trail.length;i++){
   const tr=this.trail[i];
   const a=(i/this.trail.length);
   const sz=(4+a*8)*a;
   const wobble=Math.sin(tr.t*18+i)*sz*0.4;
   ctx.save();ctx.globalAlpha=a*0.7;
   const g=ctx.createRadialGradient(tr.x+wobble,tr.y,0,tr.x+wobble,tr.y,sz);
   if(col){g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(0.4,col+'bb');g.addColorStop(1,'transparent');}
   else{g.addColorStop(0,'rgba(255,200,255,.9)');g.addColorStop(0.4,'rgba(180,80,255,.7)');g.addColorStop(1,'rgba(100,0,180,0)');}
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x+wobble,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  const wobble=Math.sin(this.t*20)*3;
  const g=ctx.createRadialGradient(this.x+wobble,this.y-3,1,this.x,this.y,this.r+4);
  if(col){g.addColorStop(0,'#fff');g.addColorStop(0.3,col);g.addColorStop(0.7,col+'88');g.addColorStop(1,'transparent');}
  else{g.addColorStop(0,'#fff');g.addColorStop(0.3,'#dd88ff');g.addColorStop(0.7,'#8800cc');g.addColorStop(1,'transparent');}
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(this.x+wobble,this.y,this.r,0,Math.PI*2);ctx.fill();
 }
}
class SkullOrb{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=3.0;this.trail=[];
  this.t=0;this.r=10;this.rot=0;
 }
 update(dt){
  this.t+=dt;this.rot+=dt*3;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>14)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.045*dt; // reduced gravity for skull orb
  this.life-=dt;
  if(this.x<-30||this.x>W+30||this.y>H+40||this.life<=0){this.alive=false;return;}
  if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){
   spawnToxicCloud(this.x,this.y);this.alive=false;return;
  }
  for(const s of spheres){
   const isEnemy=s!==this.owner;
   if(!isEnemy||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r+3){
    s.receiveMagicDamage(this.dmg); // magic damage — uses magDef not arm
    if(this.fireBurn){s.burning=true;s.burnT=2.5;s.burnTickInterval=1.0;s.burnTickT=1.0;}
    if(this.owner&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}
    if(s.deathMarkTicks<=0){
     s.deathMarkTicks=7;
     s.deathMarkTimer=0.18;
     s.deathMarkDmg=this.dmg*0.70+1;
    } else {
     s.deathMarkDmg=this.dmg*0.70+1;
     s.deathMarkDoTHits=(s.deathMarkDoTHits||0)+7; // credit a full sequence
    }
    s.woundT=Math.max(s.woundT, 7*0.3+2.0);
    s.applyImpact((s.x-this.x)*0.20,(s.y-this.y)*0.20);
    s.vx*=0.92;s.vy*=0.92;
    spawnToxicCloud(this.x,this.y);
    this.alive=false;return;
   }
  }
  for(const sk of skeletons){
   const isEnemy=true;
   if(!isEnemy||!sk.alive||sk.faction===this.owner.faction)continue;
   if(Math.hypot(sk.x-this.x,sk.y-this.y)<sk.radius+this.r+3){
    const dmg=this.dmg/(sk.arm*0.004+1);
    sk.hp=Math.max(0,sk.hp-dmg);sk.hitFlash=1;
    const nx=(sk.x-this.x)/Math.hypot(sk.x-this.x,sk.y-this.y)||1;
    const ny=(sk.y-this.y)/Math.hypot(sk.x-this.x,sk.y-this.y)||0;
    sk.applyImpact(nx*60,ny*60);
    spawnDmgNum(sk.x,sk.y-sk.radius*0.5,dmg,dmg>=8?'#cc88ff':'#ffffff');
    spawnToxicCloud(this.x,this.y);
    if(sk.hp<=0){sk.alive=false;spawnToxicCloud(sk.x,sk.y);spawnBurst(sk.x,sk.y,'#7c4dff','#c8c0a0',14);}
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  for(let i=0;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.6;
   const sz=5*(i/this.trail.length);
   ctx.save();ctx.globalAlpha=a*0.55;
   ctx.fillStyle=`hsl(${100+i*3},80%,45%)`;
   ctx.beginPath();ctx.arc(tr.x+(Math.sin(i*1.2))*4,tr.y,sz+2,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  const g=ctx.createRadialGradient(0,0,1,0,0,this.r+6);
  g.addColorStop(0,'rgba(180,255,120,.4)');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,this.r+6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1a0a2e';ctx.beginPath();ctx.arc(0,0,this.r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#7c4dff';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#7c4dff';
  ctx.beginPath();ctx.arc(-3.5,-2,2.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(3.5,-2,2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(124,77,255,.7)';
  for(let i=-2;i<=2;i++){ctx.fillRect(i*2.2-0.8,3,1.5,3);}
  ctx.restore();
 }
}
// ▓▓▓ NEW CHARACTER PROJECTILES ▓▓▓
