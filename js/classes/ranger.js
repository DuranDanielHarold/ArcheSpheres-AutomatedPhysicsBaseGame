'use strict';
// ▓▓▓ MODULE: classes/ranger.js — Ranger sphere kit registry ▓▓▓

DEF.ranger = {"label":"Ranger","rangedSphere":true,"weapon":"Longbow","ab":"Volley Shot","color":"#2d5a1b","dark":"#1a3610","rim":"#88cc44","out":"#0f1f0a","wcol":"#88cc44","wdrk":"#557733","mass":6,"spd":216,"hp":434,"om":5,"dmg":5.49,"arm":90,"magDef":33,"rest":0.72,"reach":3.24,"tipR":0.12,"abilityType":"hybrid","passiveType":"hybrid","wt":"longbow"};
CLASS_ROLE.ranger = "MARKSMAN";
CLASS_DESC.ranger = {
  "ability": "Volley Shot (4 stacks) — Rapidly fires 3 bursts of 5 spread arrows (center + 4 flanking) every 0.6s with +2 volley bonus damage each. Single shots suppressed during volley.",
  "passive": "Continuously fires +3 damage arrows. Each arrow applies momentum to the target on hit. Kites away from close enemies. Missing HP increases crit damage by 1% per lost HP%, capped at +30%."
};
STACK_THRESHOLD.ranger = 4;
STACK_DISPLAY_THRESHOLD.ranger = 4;
SPHERE_AUDIO.ranger = {
  "weaponCollision": "audio/ranger/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.ranger = function(){
  this.volleyDmgBonus=0;
};

ABILITY_HANDLERS.ranger = function(){
  if(this.stacks>=4){
   this.stacks=0;
   this.volleyActive=true;this.volleyBurstsLeft=3;
   this.volleyBurstTimer=0;
   this.volleyWindowT=10.0;
   this.volleyDmgBonus=2;
  }
  this.spreadActive=this.stacks>=4;
};

PASSIVE_HANDLERS.ranger = function(dt){
  const rangerHpLost=this.maxHp>0?Math.max(0,1-(this.hp/this.maxHp)):0;
  this.critChance=Math.min(0.60,rangerHpLost);
  this.critDamageBonus=Math.min(0.30,rangerHpLost);
  this.drawCharge=Math.min(1,this.drawCharge+(dt/0.13));
  if(!this.volleyActive&&this.drawCharge>=1&&this.shotCD<=0){
   this.drawCharge=0;this.shotCD=0.14;
   this._fireArrow();
  }
  this._applyKite(dt);
};

// Arrow stays in projectiles-basic.js because prince bow mode also depends on it.
PROTOTYPE_METHOD_INSTALLERS.ranger = function(proto){
proto._fireArrow = function(){
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
};

proto._fireVolleyBurst = function(){
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
};
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
