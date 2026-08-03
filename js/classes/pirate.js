'use strict';
// ▓▓▓ MODULE: classes/pirate.js — Pirate sphere kit registry ▓▓▓

DEF.pirate = {"label":"Pirate","weapon":"Cutlass","ab":"Boarding Action","color":"#3e2723","dark":"#1c1008","rim":"#ff7043","out":"#120a04","wcol":"#ffcc02","wdrk":"#e6a800","mass":7.5,"spd":239,"hp":516,"om":8,"dmg":4.35,"arm":95,"magDef":30,"rest":0.74,"reach":2.89,"tipR":0.24,"abilityType":"utility","passiveType":"hybrid","wt":"cutlass"};
CLASS_ROLE.pirate = "FIGHTER";
CLASS_DESC.pirate = {
  "ability": "Boarding Action (3 stacks) — Fires a grappling hook that yanks the enemy toward the Pirate with 380 force, dealing 1.5× DMG on contact. Wall hits hook the Pirate toward the wall.",
  "passive": "While Draining (1+ stacks): heals 0.5 HP/sec passively and leeches 15% of melee damage dealt. Cutlass also pulls enemies on hit rather than pushing them."
};
STACK_THRESHOLD.pirate = 3;
STACK_DISPLAY_THRESHOLD.pirate = 3;
SPHERE_AUDIO.pirate = {
  "weaponCollision": "audio/pirate/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.pirate = function(){
  this.draining=false;
  this.pirateRegenTimer=0; // vampiric aura passive regen tick
  this.grapplingHook=null;
};

ABILITY_HANDLERS.pirate = function(){
  if(this.stacks>=3){
   this.stacks=0;
   this.pirateRegenTimer=0;
   this._fireGrapplingHook();
  }
  this.draining=this.stacks>=1;
};

PASSIVE_HANDLERS.pirate = function(dt){
  if(this.draining){
   if(!this.draining){this.pirateRegenTimer=0;}
   this.pirateRegenTimer+=dt;
   if(this.pirateRegenTimer>=2.0){
    this.pirateRegenTimer=0;
    this.receiveHeal(1);
   }
  }
};

DRAW_OVERLAY_HANDLERS.pirate = function(ctx,r,p){
  if(this.draining){
   ctx.shadowColor='#ff7043';ctx.shadowBlur=12;
   ctx.beginPath();ctx.arc(this.x,this.y,r+3,0,Math.PI*2);
   ctx.strokeStyle=`rgba(255,112,67,${0.4+p*.4})`;ctx.lineWidth=2;ctx.stroke();
   ctx.shadowBlur=0;
  }
};


ON_HIT_DEALT_MODIFIERS.pirate = function(dmg,def,hx,hy){
  if(this.draining){
   this.receiveHeal(dmg*0.15);
   const pullX=this.x-def.x,pullY=this.y-def.y,pullD=Math.hypot(pullX,pullY)||1;
   def.applyImpact((pullX/pullD)*120,(pullY/pullD)*120);
  }
  return dmg;
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
