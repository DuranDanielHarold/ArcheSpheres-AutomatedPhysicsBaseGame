'use strict';
// ▓▓▓ MODULE: entities/projectiles-roster.js — extracted from former js/entities.js ▓▓▓
// Roster-specific projectile classes and alchemy flask configuration.

class RosterBolt{
 constructor(x,y,vx,vy,dmg,owner,kind='hex'){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.dmg=dmg;this.owner=owner;this.kind=kind;
  this.alive=true;this.life=kind==='trap'?3:3.2;this.maxLife=this.life;this.t=0;this.trail=[];
  this.r=kind==='arcane'?10:kind==='dust'?5:kind==='word'?6:7;
  const words=['???','ZAN','MURM','BLARG','XUUL','NIM','VORP','YONK','∴','LEX?'];
  this.word=kind==='word'?words[Math.floor(Math.random()*words.length)]:'';
  this.spinSeed=Math.random()*Math.PI*2;
 }
 update(dt){
  this.t+=dt;this.life-=dt;this.trail.push({x:this.x,y:this.y,t:this.t});if(this.trail.length>18)this.trail.shift();
  if(this.kind==='hex'&&this.life<1.5){const e=spheres.find(s=>s!==this.owner&&!sameFaction(this.owner,s)&&s.alive&&!s.dying);if(e){const dx=e.x-this.x,dy=e.y-this.y,d=Math.hypot(dx,dy)||1;this.vx+=(dx/d)*60*dt;this.vy+=(dy/d)*60*dt;}}
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  if(this.x<0||this.x>W||this.y<0||this.y>H){if(this.kind==='arcane'){this._explode();return;}spawnSpark(Math.max(4,Math.min(W-4,this.x)),Math.max(4,Math.min(H-4,this.y)),this.kind==='dust'?'#fff0ff':this.kind==='word'?'#d6f0b2':'#d77bff',4);this.alive=false;return;}
  if(this.life<=0){this.alive=false;return;}
  for(const q of spheres){if(q===this.owner||sameFaction(this.owner,q)||!q.alive||q.dying)continue;if(Math.hypot(q.x-this.x,q.y-this.y)<q.radius+this.r){this._hit(q);return;}}
 }
 _hit(q){
  if(this.kind==='arcane'){this._explode(q);return;}
  if(this.kind==='dust'){q.receiveMagicDamage(this.dmg);if(this.owner&&this.owner.canTriggerTraits!==false&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}spawnSpark(this.x,this.y,'#fff0ff',5);return this.alive=false;}
  if(this.kind==='word'){q.receiveMagicDamage(this.dmg);if(this.owner&&this.owner.canTriggerTraits!==false&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}spawnDmgNum(q.x,q.y-q.radius*1.7,this.word,'#d6f0b2');spawnBurst(this.x,this.y,'#d6f0b2','#6c8f52',7);return this.alive=false;}
  q.receiveMagicDamage(this.dmg);
  q.hexRecent=(q.hexRecent||[]).filter(t=>this.t-t<0.5);q.hexRecent.push(this.t);q.jinxStacks=(q.jinxStacks||0)+1;
  if(q.hexRecent.length>=2){q.dmgHalvedT=Math.max(q.dmgHalvedT||0,4);q.omegaCur*=-1;spawnDmgNum(q.x,q.y-q.radius*1.8,'CURSE','#d77bff');spawnPulse(q.x,q.y,'#d77bff');}
  if(q.jinxStacks>=4){q.jinxStacks=0;const roll=Math.floor(Math.random()*4);if(roll===0){q.blinded=true;q.blindT=3;}else if(roll===1){q.burning=true;q.burnT=3;q.burnTickT=0.4;}else if(roll===2){q.waterSlow=Math.max(q.waterSlow||0,2);q.waterSlowT=3;}else{q.omegaCur*=-1;q.spinReverseT=3;}spawnDmgNum(q.x,q.y-q.radius*2,'JINX','#d77bff');spawnBurst(q.x,q.y,'#d77bff','#12051f',12);}
  if(this.owner&&this.owner.canTriggerTraits!==false&&this.owner.gainStack&&!this.owner.hexBurstFired&&(this.owner.stacks||0)<getStackThreshold(this.owner.key)){this.owner.gainStack();this.owner._applyHitBuff();}
  this.alive=false;spawnBurst(this.x,this.y,'#d77bff','#5b1f86',8);
 }
 _explode(target){
  const rad=this.owner.radius*(this.owner.overloadActive?2.7:1.7);
  for(const q of spheres){if(q===this.owner||sameFaction(this.owner,q)||!q.alive||q.dying)continue;if(Math.hypot(q.x-this.x,q.y-this.y)<rad+q.radius){q.receiveMagicDamage(this.dmg);if(this.owner&&this.owner.canTriggerTraits!==false&&this.owner.gainStack){this.owner.gainStack();this.owner._applyHitBuff();}}}
  slowZones.push(new ArcaneBurnZone(this.x,this.y,rad,this.owner.overloadActive?6:2,this.owner));
  if(this.owner.overloadActive){const selfHarm=2;this.owner.hp=Math.max(1,this.owner.hp-selfHarm);spawnDmgNum(this.owner.x,this.owner.y-this.owner.radius*1.2,selfHarm,'#78d8ff');}
  spawnBurst(this.x,this.y,'#78d8ff','#e8fbff',18);spawnPulse(this.x,this.y,'#78d8ff');this.alive=false;
 }
 draw(){
  ctx.save();
  const alpha=Math.max(.25,this.life/this.maxLife),t=this.t+this.spinSeed;
  const main=this.kind==='arcane'?'#78d8ff':this.kind==='dust'?'#fff0ff':this.kind==='word'?'#d6f0b2':'#d77bff';
  const edge=this.kind==='arcane'?'#ff7a22':this.kind==='dust'?'#ff8ce2':this.kind==='word'?'#6c8f52':'#5b1f86';
  for(let i=1;i<this.trail.length;i++){
   const a=i/this.trail.length,pt=this.trail[i];ctx.globalAlpha=alpha*a*.55;
   ctx.fillStyle=main;ctx.beginPath();ctx.arc(pt.x,pt.y,this.r*a*.72,0,Math.PI*2);ctx.fill();
   if(this.kind==='hex'){ctx.strokeStyle=edge;ctx.lineWidth=1;ctx.beginPath();ctx.arc(pt.x+Math.sin(t+i)*this.r*.55,pt.y+Math.cos(t+i)*this.r*.55,this.r*a*.32,0,Math.PI*2);ctx.stroke();}
   if(this.kind==='word'){ctx.fillStyle=edge;ctx.font=`bold ${Math.max(5,this.r*a)}px serif`;ctx.fillText('?',pt.x,pt.y);}
  }
  ctx.globalAlpha=alpha;ctx.shadowColor=main;ctx.shadowBlur=this.kind==='arcane'?18:this.kind==='dust'?14:13;
  if(this.kind==='hex'||this.kind==='trap'){
   ctx.translate(this.x,this.y);ctx.rotate(t*3);ctx.fillStyle=main;ctx.beginPath();for(let i=0;i<8;i++){const rr=i%2?this.r*.48:this.r*1.05,a=i*Math.PI/4;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.4;ctx.stroke();
   if(this.kind==='trap'){ctx.globalAlpha=alpha*.75;ctx.strokeStyle='#d77bff';ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(0,0,this.r*2.2+Math.sin(t*4)*2,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  } else if(this.kind==='arcane'){
   ctx.translate(this.x,this.y);ctx.rotate(t*2);ctx.fillStyle=main;ctx.beginPath();ctx.arc(0,0,this.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,this.r*1.45,this.r*.65,0,0,Math.PI*2);ctx.stroke();ctx.rotate(Math.PI/2);ctx.beginPath();ctx.ellipse(0,0,this.r*1.25,this.r*.52,0,0,Math.PI*2);ctx.stroke();
  } else if(this.kind==='word'){
   ctx.translate(this.x,this.y);ctx.rotate(Math.sin(t*5)*.15);ctx.font=`bold ${Math.max(9,this.r*1.35)}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.strokeStyle='#132010';ctx.lineWidth=3;ctx.strokeText(this.word,0,0);ctx.fillStyle=main;ctx.fillText(this.word,0,0);ctx.strokeStyle=edge;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-this.r*1.1,this.r*.8);ctx.quadraticCurveTo(0,this.r*1.1,this.r*1.1,this.r*.8);ctx.stroke();
  } else {
   ctx.translate(this.x,this.y);ctx.rotate(t*4);ctx.fillStyle=main;ctx.beginPath();for(let i=0;i<10;i++){const rr=i%2?this.r*.45:this.r*1.0,a=i*Math.PI/5;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.fillStyle='#ff8ce2';ctx.beginPath();ctx.arc(0,0,this.r*.38,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
 }
}
class RiptideBolt{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.8;this.trail=[];this.t=0;this.r=10;
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>14)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.12*dt;
  this.life-=dt;
  if(this.x<-20||this.x>W+20||this.y>H+30||this.life<=0){this.alive=false;return;}
  if(this.x<16&&this.y<16||this.x>W-16&&this.y<16||this.x<16&&this.y>H-16||this.x>W-16&&this.y>H-16){spawnRingBurst(this.x,this.y,'#44ccff');this.alive=false;return;}
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    // Find nearest wall and pull toward it
    const walls=[{d:s.x,nx:-1,ny:0},{d:W-s.x,nx:1,ny:0},{d:s.y,ny:-1,nx:0},{d:H-s.y,ny:1,nx:0}];
    walls.sort((a,b)=>a.d-b.d);
    const nw=walls[0];
    const pullSpd=600+Math.max(0,300-nw.d)*2;
    s.applyImpact(nw.nx*pullSpd,nw.ny*pullSpd);
    s.receiveMagicDamage(this.dmg);
    // Impact damage based on how hard they'd hit
    const impactDmg=Math.min(nw.d/W,nw.d/H)>0.05?this.dmg*0.5:this.dmg*1.5;
    if(nw.d<40) s.receiveDamage(impactDmg);
    this.owner.gainStack();this.owner._applyHitBuff();
    spawnRingBurst(s.x,s.y,'#44ccff');
    spawnDmgNum(s.x,s.y-s.radius*1.4,'RIPTIDE!','#44ccff');
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i],a=(i/this.trail.length)*0.6,sz=this.r*(0.3+a*0.7);
   ctx.save();ctx.globalAlpha=a*0.7;
   const g=ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,sz);
   g.addColorStop(0,'rgba(68,200,255,0.8)');g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.save();
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r+4);
  g.addColorStop(0,'rgba(200,240,255,0.95)');g.addColorStop(0.4,'rgba(68,200,255,0.7)');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r+4,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}
class BreathFlame{
 constructor(x,y,vx,vy,dmg,owner){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.dmg=dmg;this.owner=owner;
  this.alive=true;this.life=1.2;this.maxLife=1.2;
  this.trail=[];this.t=0;this.r=12;this.hasSpawnedZone=false;
 }
 update(dt){
  this.t+=dt;
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>10)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.3*dt;
  this.life-=dt;
  // On expire, spawn a lingering fire zone
  if((this.x<0||this.x>W||this.y>H||this.life<=0)&&!this.hasSpawnedZone){
   this.hasSpawnedZone=true;
   thornPatches.push(new FireBreathZone(this.x,this.y,this.owner));
   this.alive=false;return;
  }
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+this.r){
    s.receiveDamage(this.dmg);
     s.burning=true;s.burnT=2.0;s.burnTickInterval=WHELPLING_BURN_TICK_INTERVAL;s.burnTickT=WHELPLING_BURN_TICK_INTERVAL;
    this.owner._applyHitBuff();
    if(!this.hasSpawnedZone){this.hasSpawnedZone=true;thornPatches.push(new FireBreathZone(this.x,this.y,this.owner));}
    spawnFlameExplosion(s.x,s.y);
    this.alive=false;return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const a=this.life/this.maxLife;
  for(let i=0;i<this.trail.length;i++){
   const tr=this.trail[i],ta=(i/this.trail.length)*a;
   ctx.save();ctx.globalAlpha=ta*0.7;
   const sz=this.r*(0.4+i/this.trail.length*0.8);
   const g=ctx.createRadialGradient(tr.x,tr.y,0,tr.x,tr.y,sz);
   g.addColorStop(0,'rgba(255,200,60,0.9)');g.addColorStop(0.5,'rgba(255,80,0,0.6)');g.addColorStop(1,'transparent');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(tr.x,tr.y,sz,0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  const g2=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r+6);
  g2.addColorStop(0,'rgba(255,220,100,0.95)');g2.addColorStop(0.4,'rgba(255,100,0,0.7)');g2.addColorStop(1,'transparent');
  ctx.save();ctx.globalAlpha=a;
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(this.x,this.y,this.r+6,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}
const VIAL_CFG={
 purple:{c0:'rgba(160,40,220,.6)',c1:'rgba(90,10,140,.35)',rim:'rgba(200,80,255,.55)',spark:'#cc44ff',label:'POISON',labelCol:'#dd88ff'},
 yellow:{c0:'rgba(220,200,20,.6)',c1:'rgba(140,120,0,.35)',rim:'rgba(255,230,40,.55)',spark:'#ffee22',label:'MELT',labelCol:'#ffee44'},
 green: {c0:'rgba(40,200,60,.6)', c1:'rgba(10,100,20,.35)',rim:'rgba(60,255,80,.55)', spark:'#44ff66',label:'BURN',labelCol:'#66ff88'},
};
class LingeringMiasma{
 constructor(x,y,owner,vialType){
  this.x=x;this.y=y;this.owner=owner;
  this.vialType=vialType||'green';
  this.r=owner.radius*4.2;
  this.life=5.5;this.maxLife=5.5;
  this.tickT=0;this.rot=0;
 }
 update(dt){
  this.life-=dt;this.tickT+=dt;this.rot+=dt*0.8;
  if(this.tickT<0.25)return;
  this.tickT=0;
  const cfg=VIAL_CFG[this.vialType];
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)>this.r+s.radius)continue;
   if(this.vialType==='purple'){
    // Poison: direct magic damage tick + stack corrosion
    const pdmg=this.owner.d.dmg*0.9;
    s.receiveMagicDamage(pdmg);
    s.corrosionStacks=Math.min(6,(s.corrosionStacks||0)+1);
    if(s.corrosionT<=0)s.corrosionT=1.2;
    const _bA=s.baseArm||DEF[s.key]?.arm||s.d.arm||0;
    s.d=Object.assign({},s.d);s.d.arm=Math.max(0,_bA-s.corrosionStacks*9);
    spawnSpark(s.x,s.y,cfg.spark,5);
    spawnDmgNum(s.x,s.y-s.radius*1.6,cfg.label,cfg.labelCol);
   } else if(this.vialType==='yellow'){
    // MagDef shred + blind
    s.d=Object.assign({},s.d);
    s.d.magDef=Math.max(0,s.d.magDef-18);
    s.blinded=true;s.blindT=Math.max(s.blindT||0,3.5);
    spawnSpark(s.x,s.y,cfg.spark,5);
    spawnDmgNum(s.x,s.y-s.radius*1.6,'BLIND','#ffee44');
   } else {
    // Green: burn + blind
     s.burning=true;s.burnT=Math.max(s.burnT||0,4.5);s.burnTickInterval=DEFAULT_BURN_TICK_INTERVAL;s.burnTickT=0;
    s.blinded=true;s.blindT=Math.max(s.blindT||0,2.0);
    spawnSpark(s.x,s.y,cfg.spark,6);
    spawnDmgNum(s.x,s.y-s.radius*1.6,cfg.label,cfg.labelCol);
   }
  }
 }
 draw(){
  const pct=this.life/this.maxLife;
  const cfg=VIAL_CFG[this.vialType];
  ctx.save();ctx.globalAlpha=pct*0.72;
  const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
  g.addColorStop(0,cfg.c0);g.addColorStop(0.55,cfg.c1);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
  const spokes=10;
  ctx.strokeStyle=cfg.rim;ctx.lineWidth=1.5;ctx.setLineDash([4,5]);
  for(let i=0;i<spokes;i++){
   const a=this.rot+(i/spokes)*Math.PI*2;
   ctx.beginPath();
   ctx.moveTo(this.x+Math.cos(a)*this.r*0.25,this.y+Math.sin(a)*this.r*0.25);
   ctx.lineTo(this.x+Math.cos(a)*this.r*0.9,this.y+Math.sin(a)*this.r*0.9);
   ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle=cfg.rim;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.stroke();
  ctx.restore();
 }
}
const VIAL_COLORS={
 purple:{fill:'rgba(180,60,255,.9)',mid:'rgba(120,20,200,.7)',outer:'rgba(60,0,100,.4)',stroke:'rgba(200,100,255,.8)',trail:'#aa44ff',stopper:'#330066'},
 yellow:{fill:'rgba(255,230,60,.9)', mid:'rgba(200,170,10,.7)',outer:'rgba(100,80,0,.4)', stroke:'rgba(255,240,80,.8)', trail:'#eebb00',stopper:'#554400'},
 green: {fill:'rgba(140,255,100,.9)',mid:'rgba(60,200,30,.7)', outer:'rgba(10,80,5,.4)',  stroke:'rgba(120,255,70,.8)', trail:'#44cc22',stopper:'#113300'},
};
class AlchemyFlask{
 constructor(x,y,vx,vy,owner,vialType){
  this.x=x;this.y=y;this.vx=vx;this.vy=vy;
  this.owner=owner;this.alive=true;
  this.vialType=vialType||'green';
  this.life=2.8;this.rot=0;this.trail=[];
 }
 update(dt){
  this.trail.push({x:this.x,y:this.y});
  if(this.trail.length>12)this.trail.shift();
  this.x+=this.vx*dt;this.y+=this.vy*dt;
  this.vy+=GRAVITY*0.55*dt;
  this.rot+=dt*10;
  this.life-=dt;
  const cfg=VIAL_COLORS[this.vialType];
  const shatter=()=>{
   miasmaClouds.push(new LingeringMiasma(this.x,this.y,this.owner,this.vialType));
   spawnVialShatter(this.x,this.y,this.vialType);
   this.alive=false;
  };
  if(this.y+6>H||this.y<0||this.x<0||this.x>W||this.life<=0){shatter();return;}
  for(const s of spheres){
   if(s===this.owner||!s.alive||s.dying)continue;
   if(Math.hypot(s.x-this.x,s.y-this.y)<s.radius+8){
    s.receiveMagicDamage(this.owner.d.dmg*2.8);
    spawnSpark(s.x,s.y,cfg.trail,8);
    shatter();return;
   }
  }
 }
 draw(){
  if(!this.alive)return;
  const cfg=VIAL_COLORS[this.vialType];
  for(let i=1;i<this.trail.length;i++){
   const tr=this.trail[i];
   ctx.save();ctx.globalAlpha=(i/this.trail.length)*0.4;
   ctx.fillStyle=cfg.trail;ctx.beginPath();ctx.arc(tr.x,tr.y,5*(i/this.trail.length),0,Math.PI*2);ctx.fill();
   ctx.restore();
  }
  ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.rot);
  const gf=ctx.createRadialGradient(-2,-3,1,0,0,9);
  gf.addColorStop(0,cfg.fill);gf.addColorStop(0.5,cfg.mid);gf.addColorStop(1,cfg.outer);
  ctx.fillStyle=gf;ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=cfg.stroke;ctx.lineWidth=1.8;
  ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-2,-3,2.5,3.5,-.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=cfg.trail;ctx.fillRect(-2,-12,4,5);
  ctx.fillStyle=cfg.stopper;ctx.fillRect(-3,-13,6,2);
  ctx.restore();
 }
}
// ▓▓▓ END:ENGINE ▓▓▓

