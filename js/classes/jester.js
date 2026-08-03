'use strict';
// ▓▓▓ MODULE: classes/jester.js — Jester sphere kit registry ▓▓▓

DEF.jester = {"label":"Jester","weapon":"Jingle Flail","ab":"Chaos Lurch","color":"#e91e63","dark":"#880e4f","rim":"#ffd740","out":"#4a0025","wcol":"#ffd740","wdrk":"#c8a000","mass":5,"spd":256,"hp":388,"om":13,"dmg":3.38,"arm":65,"magDef":27,"rest":0.86,"reach":2.6,"tipR":0.28,"abilityType":"damage","passiveType":"hybrid","wt":"jingleflail"};
CLASS_ROLE.jester = "MAGE";
CLASS_DESC.jester = {
  "ability": "Chaos Lurch (3 stacks) — Fires in a completely random direction at 2.2× speed, reverses spin, and gains 2× damage for 1.5s.",
  "passive": "Spin accelerates with stacks (up to 2.5× base spin). Higher speed = wider bell swing = more chaotic hit angles."
};
STACK_THRESHOLD.jester = 3;
STACK_DISPLAY_THRESHOLD.jester = 3;
SPHERE_AUDIO.jester = {
  "weaponCollision": "audio/jester/weaponCollision.wav",
  "damage": "",
  "ability": ""
};

INIT_HANDLERS.jester = function(){
  this.jesterLurchT=0;
};

ABILITY_HANDLERS.jester = function(){
  this.omegaCur=this.d.om*(1+1.5*(this.stacks/5))*Math.sign(this.omegaCur||1);
  if(this.stacks>=3){this.stacks=0;
   const chaosA=Math.random()*Math.PI*2;
   this.vx=Math.cos(chaosA)*this.targetSpd*2.2;
   this.vy=Math.sin(chaosA)*this.targetSpd*2.2;
   this.omegaCur*=-1;
   this.dmgMult=2.0;
   this.jesterLurchT=1.5;
  }
};

// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
