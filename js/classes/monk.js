'use strict';
// ▓▓▓ MODULE: classes/monk.js — Monk sphere kit registry ▓▓▓

DEF.monk = {"label":"Monk","weapon":"Quarterstaff","ab":"100-Fist Nirvana","color":"#c8a870","dark":"#7a5a28","rim":"#ffe0a0","out":"#3a2808","wcol":"#ffe0a0","wdrk":"#c8a040","mass":5,"spd":267,"hp":378,"om":11,"dmg":1.43,"arm":33,"magDef":18,"rest":0.76,"reach":2.9,"tipR":0.15,"abilityType":"hybrid","passiveType":"hybrid","wt":"quarterstaff"};
CLASS_ROLE.monk = "FIGHTER";
CLASS_DESC.monk = {
  "ability": "100-Fist Nirvana (3 stacks) — For 3s, spin multiplies to 4× base omega. Every weapon hit during Nirvana launches the enemy with +400 flat impact force on top of normal physics — enemies become leaves in a divine hurricane.",
  "passive": "Water Emptying the Teapot — Every wall bounce accelerates the Monk by 1.4×. The Monk is the ricochet made flesh, gaining speed from every wall until the arena cannot contain the storm."
};
STACK_THRESHOLD.monk = 3;
STACK_DISPLAY_THRESHOLD.monk = 3;
SPHERE_AUDIO.monk = {
  "weaponCollision": "audio/monk/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.monk = function(){
  this.nirvanaActive=false;this.nirvanaT=0;
};

ABILITY_HANDLERS.monk = function(){
  if(this.stacks>=3){
   this.stacks=0;
   this.nirvanaActive=true;this.nirvanaT=2.0;
   this.omegaCur=this.d.om*2.5*Math.sign(this.omegaCur||1);
   this.dmgMult=0.18;
   spawnNirvanaActivate(this.x,this.y);
  }
};

PASSIVE_HANDLERS.monk = function(dt){
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
  }
};

WALL_BOUNCE_HANDLERS.monk = function(){
  this.vx*=1.1;this.vy*=1.1;spawnSpark(this.x,this.y,'#ffe0a0',4);
};

DRAW_OVERLAY_HANDLERS.monk = function(ctx,r,p){
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
};


ON_HIT_LANDED.monk = function(def,hx,hy,dmg){
  if(this.nirvanaActive){
   const nx2=(def.x-this.x)||1,ny2=(def.y-this.y)||0;
   const nd2=Math.hypot(nx2,ny2)||1;
   def.applyImpact((nx2/nd2)*520,(ny2/nd2)*520);
   spawnSpark(hx,hy,'#ffe0a0',6);
  }
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
