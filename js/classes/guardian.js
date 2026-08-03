'use strict';
// ▓▓▓ MODULE: classes/guardian.js — Guardian sphere kit registry ▓▓▓

DEF.guardian = {"label":"Guardian","weapon":"Tower Shield","ab":"Phalanx","color":"#37474f","dark":"#1c272c","rim":"#80cbc4","out":"#0d1214","wcol":"#80cbc4","wdrk":"#00897b","mass":7,"spd":204,"hp":395,"om":4.6,"dmg":4.93,"arm":95,"magDef":46,"rest":0.58,"reach":2,"tipR":0.58,"abilityType":"utility","passiveType":"hybrid","wt":"towershield"};
CLASS_ROLE.guardian = "TANK";
CLASS_DESC.guardian = {
  "ability": "Phalanx (2 stacks) — Consumes stacks to raise the tower shield for 3.5s: spin doubles, incoming knockback is reduced by 30%, and physical damage taken drops to 45%.",
  "passive": "Sanctuary — Every 10s, creates an 8s Heater Shield zone. Damage taken inside is completely negated once, consuming the shield. Tower Shield extends from both sides."
};
STACK_THRESHOLD.guardian = 2;
STACK_DISPLAY_THRESHOLD.guardian = 2;
SPHERE_AUDIO.guardian = {
  "weaponCollision": "audio/guardian/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.guardian = function(){
  this.phalanxActive=false;this.phalanxT=0;
  this.guardianSanctuaryTimer=0;
};

ABILITY_HANDLERS.guardian = function(){
  if(this.stacks>=2){
   this.stacks=0;this.phalanxActive=true;this.phalanxT=3.5;
   spawnBurst(this.x,this.y,'#80cbc4','#e0f7fa',14);
  }
};

PASSIVE_HANDLERS.guardian = function(dt){
  this.guardianSanctuaryTimer+=dt;
  if(this.guardianSanctuaryTimer>=10.0){
   this.guardianSanctuaryTimer=0;
   slowZones.push(new GuardianSanctuaryZone(this));
   spawnDmgNum(this.x,this.y-this.radius*1.5,'SANCTUARY','#80cbc4');
  }
};

DRAW_OVERLAY_HANDLERS.guardian = function(ctx,r,p){
  if(this.phalanxActive){ctx.shadowColor='#80cbc4';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(this.x,this.y,r+7,0,Math.PI*2);ctx.strokeStyle='rgba(128,203,196,.75)';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;}
};


ON_HIT_DEALT_MODIFIERS.guardian = function(dmg,def,hx,hy){
  return dmg*1.22;
};

ON_HIT_TAKEN_MODIFIERS.guardian = function(dmg,att,hx,hy){
  this.impactVx*=0.7;this.impactVy*=0.7; // reduce knockback taken
  return dmg;
};


DAMAGE_TAKEN_MODIFIERS.guardian = function(fd,kind){
  if(kind==='physical'&&this.phalanxActive)fd*=0.45;
  return fd;
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
