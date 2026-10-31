'use strict';
// ▓▓▓ MODULE: classes/prince.js — Prince sphere kit registry ▓▓▓

// Exactly one DEF.prince assignment is permitted in this file.
DEF.prince = {"label":"Prince","weapon":"Dueling Sabre","ab":"Royal Blood","color":"#1747b8","dark":"#08205f","rim":"#8bb7ff","out":"#031032","wcol":"#d8e8ff","wdrk":"#5678b8","mass":6,"spd":250,"hp":412.2,"om":7.8,"dmg":3.7,"arm":83,"magDef":35,"rest":0.8,"reach":3,"tipR":0.2,"abilityType":"utility","passiveType":"hybrid","wt":"duelingsabre"};
CLASS_ROLE.prince = "FIGHTER";
CLASS_DESC.prince = {
  "ability": "Royal Blood (5 stacks) — Gains a 8-damage shield for 5s. While the shield holds, saber mode gains +1 damage and faster omega spin, while bow mode fires more quickly. If enemies break the shield early, gains +20 ARM and MDEF for 3s.",
  "passive": "Weapon Master — Automatically swaps between a dueling sabre for enemies within sabre reach and a silver wood bow for longer range. Only the active weapon is equipped and drawn."
};
STACK_THRESHOLD.prince = 5;
STACK_DISPLAY_THRESHOLD.prince = 5;
SPHERE_AUDIO.prince = {
  "weaponCollision": "audio/prince/weaponCollision.wav",
  "damage": "audio/prince/damage.wav",
  "ability": "audio/prince/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
