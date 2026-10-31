'use strict';
// ▓▓▓ MODULE: classes/fairy.js — Fairy sphere kit registry ▓▓▓

// Exactly one DEF.fairy assignment is permitted in this file.
DEF.fairy = {"label":"Fairy","rangedSphere":true,"weapon":"Pixie Wand","ab":"Wish Granted","color":"#ff5ac8","dark":"#9b1768","rim":"#fff0ff","out":"#42002b","wcol":"#fff0ff","wdrk":"#ff8ce2","mass":4,"spd":295,"hp":385.6,"om":10.5,"dmg":4.8,"arm":57,"magDef":100,"rest":0.9,"reach":2.4,"tipR":0.1,"abilityType":"hybrid","passiveType":"hybrid","wt":"pixiewand"};
CLASS_ROLE.fairy = "SUPPORT";
CLASS_DESC.fairy = {
  "ability": "Wish Granted (4 stacks) — Rolls invincibility, a heal burst, a triple-speed dash, or a one-hit mirror clone, and grants 2.6s of faster wand fire.",
  "passive": "Pixie Dust Trail — Moving sheds charm dust that reverses enemy spin and slows them; Fairy heals in her own dust. Wand shots deal +14 damage; cooldown is 0.14s normally and 0.08s during Wish fire-rate boost."
};
STACK_THRESHOLD.fairy = 4;
STACK_DISPLAY_THRESHOLD.fairy = 4;
SPHERE_AUDIO.fairy = {
  "weaponCollision": "audio/fairy/weaponCollision.wav",
  "damage": "audio/fairy/damage.wav",
  "ability": "audio/fairy/ability.wav",
  "projectileThrow": "audio/fairy/projectileThrow.wav",
  "projectileHit": "audio/fairy/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
