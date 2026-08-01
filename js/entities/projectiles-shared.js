'use strict';
// ▓▓▓ MODULE: entities/projectiles-shared.js — extracted from former js/engine.js ▓▓▓
// Shared entity projectile/effect classes used by multiple sphere abilities.

class Afterimage{
 constructor(owner){
  this.x=owner.x;this.y=owner.y;
  this.radius=owner.radius;
  this.angle=owner.angle;
  this.d=owner.d;
  this.life=1.2;this.maxLife=1.2;
  this.alive=true;
  this.absorbed=false; // has it taken a hit yet?
 }
 update(dt){
  if(!this.alive)return;
  this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  // Check if any enemy weapon tip hits this decoy
  for(const s of spheres){
   if(!s.alive||s.dying)continue;
   if(this.absorbed)break;
   const pts=s.getBladePoints();
   const tipR=s.radius*s.d.tipR;
   for(const pt of pts){
    if(Math.hypot(pt.x-this.x,pt.y-this.y)<this.radius+tipR){
     // Absorbed! Flash and vanish
     this.absorbed=true;this.life=Math.min(this.life,0.25);
     spawnBurst(this.x,this.y,this.d.rim,'#e0f7fa',12);
     spawnDmgNum(this.x,this.y-this.radius*1.4,'DECOY!','#e0f7fa');
     break;
    }
   }
   if(this.absorbed)break;
  }
 }
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  const alpha=this.absorbed?(this.life/0.25)*0.6:pct*0.55;
  ctx.save();ctx.globalAlpha=alpha;
  // Ghost body
  ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
  ctx.fillStyle=this.d.color;ctx.fill();
  // Cyan rim shimmer
  ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
  ctx.strokeStyle=this.d.rim;ctx.lineWidth=2.5;ctx.stroke();
  // Weapon ghost
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
  if(WEAPONS[this.d.wt])WEAPONS[this.d.wt](ctx,this.radius,this.d,null);
  ctx.restore();
  // Dissolve scan lines
  if(!this.absorbed){
   ctx.globalAlpha=alpha*0.4;
   for(let i=0;i<4;i++){
    const ly=this.y-this.radius+i*(this.radius*0.55);
    ctx.strokeStyle=this.d.rim;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(this.x-this.radius,ly);ctx.lineTo(this.x+this.radius,ly);ctx.stroke();
   }
  }
  ctx.restore();
 }
}

class SonicProjectile{
 static NOTE_TYPES=[
  {sym:'♩',col:'#44dd66',glow:'#00ff88',trail:'rgba(40,200,80,'},   // green  — quarter note
  {sym:'♪',col:'#ffdd00',glow:'#ffe040',trail:'rgba(220,190,0,'},    // yellow — eighth note
  {sym:'♫',col:'#ff4455',glow:'#ff6070',trail:'rgba(220,40,60,'},    // red    — beamed notes
  {sym:'♬',col:'#44aaff',glow:'#66ccff',trail:'rgba(40,140,220,'},   // blue   — beamed pair
  {sym:'𝄞',col:'#e040fb',glow:'#cc44ff',trail:'rgba(180,40,220,'},   // purple — treble clef
 ];
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=3.5;
  this.r=9;this.t=0;this.bounces=0;
  this.trail=[];
  // Pick a random note type for this projectile
  const ni=Math.floor(Math.random()*SonicProjectile.NOTE_TYPES.length);
  this.note=SonicProjectile.NOTE_TYPES[ni];
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>14)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  // Wall bounces — each bounce amplifies speed by WALL_REST
  const boost=WALL_REST; // 1.30
  if(this.x-this.r<0){this.x=this.r;this.vx=Math.abs(this.vx)*boost;this.bounces++;this._onBounce();}
  if(this.x+this.r>W){this.x=W-this.r;this.vx=-Math.abs(this.vx)*boost;this.bounces++;this._onBounce();}
  if(this.y-this.r<0){this.y=this.r;this.vy=Math.abs(this.vy)*boost;this.bounces++;this._onBounce();}
  if(this.y+this.r>H){this.y=H-this.r;this.vy=-Math.abs(this.vy)*boost;this.bounces++;this._onBounce();}
  // Cap speed so it doesn't go insane after many bounces
  const spd=Math.hypot(this.vx,this.vy);
  if(spd>1100){const f=1100/spd;this.vx*=f;this.vy*=f;}
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    // Minimal HP damage via magic, massive knockback
    const magDmg=this.dmg/(s.d.magDef*0.01+1);
    s.receiveMagicDamage(magDmg);
    const spd2=Math.hypot(this.vx,this.vy)||500;
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    const kbForce=300+this.bounces*120; // more bounces = harder hit
    s.applyImpact(nx*kbForce,ny*kbForce);
    this.owner.gainStack();
    this.owner._applyHitBuff();
    spawnBurst(s.x,s.y,this.note.col,this.note.glow,14);
    spawnDmgNum(s.x,s.y-s.radius*1.4,`${this.note.sym} ${Math.round(kbForce)}`,this.note.col);
    this.alive=false;return;
   }
  }
 }
 _onBounce(){
  spawnSpark(this.x,this.y,this.note.col,4);
 }
 draw(){
  if(!this.alive)return;
  const spd=Math.hypot(this.vx,this.vy);
  const intensity=Math.min(1,(spd-300)/800);
  const n=this.note;
  // Coloured trail — each note type has its own trail colour
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.65;
   ctx.save();ctx.globalAlpha=a*0.75;
   const sz=this.r*(0.35+a*0.65);
   const g=ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,sz);
   g.addColorStop(0,n.trail+'0.95)');
   g.addColorStop(0.55,n.trail+'0.4)');
   g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  // Outer glow halo
  ctx.save();
  ctx.shadowColor=n.glow;ctx.shadowBlur=10+intensity*16;
  const g2=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r+5);
  g2.addColorStop(0,'#ffffff');
  g2.addColorStop(0.25,n.col);
  g2.addColorStop(0.65,n.trail+`${0.45+intensity*0.35})`);
  g2.addColorStop(1,'transparent');
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(this.x,this.y,this.r+5,0,Math.PI*2);ctx.fill();
  // Note symbol — white with coloured shadow
  ctx.font=`bold ${this.r*1.5}px serif`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=n.col;ctx.fillText(n.sym,this.x+1,this.y+1); // coloured shadow
  ctx.fillStyle='#ffffff';ctx.fillText(n.sym,this.x,this.y);
  ctx.shadowBlur=0;ctx.restore();
 }
}
class NoiseTrap{
 constructor(x,y,owner){
  this.x=x;this.y=y;this.owner=owner;
  this.life=5.0;this.maxLife=5.0;
  this.alive=true;this.r=34;this.t=0;
 }
 update(dt){
  if(!this.alive)return;
  this.t+=dt;this.life-=dt;
  if(this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    // Zero out spin (melee threat) and slow ranged fire rate
    s.omegaCur=0;
    s.dissonantT=2.0;
    if(RANGED_KEYS.has(s.key)){
     s.discordFireRateT=3.0;
     spawnDmgNum(s.x,s.y-s.radius*2.0,'SILENCED!','#e040fb');
    }
    spawnBurst(this.x,this.y,this.owner.d.rim,'#e040fb',10);
    spawnDmgNum(s.x,s.y-s.radius*1.4,'DISCORD!','#e040fb');
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const pct=this.life/this.maxLife;
  const pulse=0.5+0.5*Math.sin(this.t*8);
  ctx.save();ctx.globalAlpha=0.55*pct;
  // Ripple ring
  ctx.strokeStyle=`rgba(224,64,251,${0.5+pulse*0.4})`;
  ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.arc(this.x,this.y,this.r*(0.8+pulse*0.3),0,Math.PI*2);ctx.stroke();
  ctx.setLineDash([]);
  // Inner glow
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,`rgba(224,64,251,${0.3*pct})`);
  g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  // ♩ note icon
  ctx.globalAlpha=0.8*pct;
  ctx.font=`bold ${this.r*0.9}px serif`;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#e040fb';ctx.fillText('♩',this.x,this.y);
  ctx.restore();
 }
}

class Shuriken{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.8;this.rot=0;
  this.points=Math.random()<0.5?4:3; // 3- or 4-pointed
  this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>8)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.rot+=dt*18;
  this.life-=dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H||this.life<=0){this.alive=false;return;}
  for(const s of spheres){
   if(sameFaction(this.owner,s)||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+7){
    const fd=this.dmg/(s.d.arm*0.004+1);
    s.receiveDamage(fd);
    const nx=(s.x-this.x)/Math.hypot(s.x-this.x,s.y-this.y)||1;
    const ny=(s.y-this.y)/Math.hypot(s.x-this.x,s.y-this.y)||0;
    s.applyImpact(nx*90,ny*90);
    spawnSpark(this.x,this.y,this.owner.d.rim,5);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  // Trail
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.4;
   ctx.save();ctx.globalAlpha=a;
   ctx.strokeStyle='#9b59b6';ctx.lineWidth=1.5;
   if(i>1){ctx.beginPath();ctx.moveTo(this.trail[i-1].x-this.x,this.trail[i-1].y-this.y);ctx.lineTo(tr.x-this.x,tr.y-this.y);ctx.stroke();}
   ctx.restore();
  }
  const n=this.points;
  const outerR=8,innerR=3.5;
  ctx.fillStyle='#2c3e50';
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/( n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR:innerR;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#9b59b6';
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/(n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR*0.7:innerR*0.9;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='#6c3483';ctx.lineWidth=1;
  ctx.beginPath();
  for(let i=0;i<n*2;i++){
   const a=(i/(n*2))*Math.PI*2-Math.PI/2;
   const r2=i%2===0?outerR:innerR;
   i===0?ctx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
  }
  ctx.closePath();ctx.stroke();
  ctx.fillStyle='rgba(155,89,182,0.5)';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}

