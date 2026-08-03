'use strict';
// ▓▓▓ MODULE: classes/phoenix.js — Phoenix sphere kit registry ▓▓▓

DEF.phoenix = {"label":"Phoenix","weapon":"Ashwing Talons","ab":"Cinder Wing","color":"#e65100","dark":"#bf360c","rim":"#ffcc02","out":"#6d1900","wcol":"#ffcc02","wdrk":"#f9a825","mass":6.5,"spd":245,"hp":395,"om":7.5,"dmg":4.32,"arm":81,"magDef":42,"rest":0.76,"reach":3.1,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"talon"};
CLASS_ROLE.phoenix = "FIGHTER";
CLASS_DESC.phoenix = {
  "ability": "Cinder Wing (3 stacks) — Ignites the Ashwing Talons for 2.2s, granting +18% speed, +35% spin, and a burst of Ember charge.",
  "passive": "Kindling Flight — Speed and wall bounces build Ember. At full Ember, the next weapon hit releases a compact flame burst for bonus damage. Once per match, lethal damage triggers Rebirth: 35% HP, 1.2s invincibility, full Ember, and a short knockback flare."
};
STACK_THRESHOLD.phoenix = 3;
STACK_DISPLAY_THRESHOLD.phoenix = 3;
SPHERE_AUDIO.phoenix = {
  "weaponCollision": "audio/phoenix/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.phoenix = function(){
  this.rebirthDone=false;
  this.phoenixEmber=0;this.phoenixEmberFlash=0;this.ashwingActive=false;this.ashwingT=0;
};

ABILITY_HANDLERS.phoenix = function(){
  if(this.stacks>=3){
   this.stacks=0;
   this.ashwingActive=true;this.ashwingT=2.2;
   this._phoenixAddEmber(40);
   this.targetSpd=this.baseSpd*1.18;
   this.omegaCur=this.d.om*1.35*Math.sign(this.omegaCur||1);
   spawnBurst(this.x,this.y,'#ffcc02','#ff4400',18);
   spawnPulse(this.x,this.y,'#ffcc02');
  }
};

PASSIVE_HANDLERS.phoenix = function(dt){
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
};

WALL_BOUNCE_HANDLERS.phoenix = function(){
  this._phoenixAddEmber(16);spawnSpark(this.x,this.y,'#ffcc02',4);
};

ON_HIT_LANDED.phoenix = function(def,hx,hy,dmg){
  this._releasePhoenixEmber(def,hx,hy);
};

PRE_DEATH_HANDLERS.phoenix = function(){
  if(this.rebirthDone)return false;
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
};

DRAW_OVERLAY_HANDLERS.phoenix = function(ctx,r,p){
  if(this.rebirthDone){ctx.shadowColor=this.d.rim;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.strokeStyle=`rgba(255,200,0,${.55+p*.4})`;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;}
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
};

PROTOTYPE_METHOD_INSTALLERS.phoenix = function(proto){
proto._phoenixAddEmber = function(amount){
  if(this.key!=='phoenix'||!isFinite(amount)||amount<=0)return;
  const before=this.phoenixEmber||0;
  this.phoenixEmber=Math.min(100,before+amount);
  if(before<100&&this.phoenixEmber>=100){
   this.phoenixEmberFlash=0.75;
   spawnDmgNum(this.x,this.y-this.radius*1.6,'EMBER','#ffcc02');
   spawnSpark(this.x,this.y,'#ffcc02',8);
  }
};

proto._releasePhoenixEmber = function(target,hx,hy){
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
};
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
