'use strict';
// ▓▓▓ MODULE: classes/knight.js — Knight sphere kit registry ▓▓▓

DEF.knight = {"label":"Knight","weapon":"Broadsword","ab":"Shield Bubble","color":"#b0bec8","dark":"#506878","rim":"#d8eaf8","out":"#334455","wcol":"#d0dce8","wdrk":"#88a0b0","mass":12,"spd":210,"hp":472,"om":4.8,"dmg":3.19,"arm":145,"magDef":37,"rest":0.62,"reach":3.2,"tipR":0.22,"abilityType":"hybrid","passiveType":"hybrid","wt":"broadsword"};
CLASS_ROLE.knight = "TANK";
CLASS_DESC.knight = {
  "ability": "Shield Bubble (5 stacks) — Grants full invincibility for 3.6s. During the bubble, spin doubles and damage output increases by 1.5×.",
  "passive": "Stalwart — Every weapon hit permanently stacks +0.6% DMG/ARM/SPIN (max 30 stacks). Buff notifies every 5 hits. Encourages sustained aggressive play rather than burst-and-disengage."
};
SPHERE_AUDIO.knight = {
  "weaponCollision": "audio/knight/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.knight = function(){
  this.stalwartStacks=0;
};

ABILITY_HANDLERS.knight = function(){
  if(this.stacks>=5){
   this.stacks=0;
   this.invincible=true;this.invincibleT=3.6;
   this.dmgMult=1.5; // offensive surge during the bubble
   spawnBurst(this.x,this.y,'#ffffff',this.d.rim,16);
  }
};

ON_HIT_LANDED.knight = function(def,hx,hy,dmg){
  if(this.stalwartStacks>=30)return;
  this.stalwartStacks++;
  this.d=Object.assign({},this.d);
  this.d.dmg*=1.006;this.d.arm=Math.round(this.d.arm*1.006);this.d.om*=1.006;
  this.omegaCur=Math.abs(this.omegaCur)*1.006*Math.sign(this.omegaCur||1);
  if(this.stalwartStacks%5===0)spawnDmgNum(this.x,this.y-this.radius*1.5,'STALWART','#d8eaf8');
};

DRAW_OVERLAY_HANDLERS.knight = function(ctx,r,p){
  if(this.stalwartStacks>0){const sf=this.stalwartStacks/30;ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);ctx.strokeStyle=`rgba(216,234,248,${0.2+sf*0.5})`;ctx.lineWidth=1.5+sf*2;ctx.stroke();}
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
