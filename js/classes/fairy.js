'use strict';
// ▓▓▓ MODULE: classes/fairy.js — Fairy sphere kit registry ▓▓▓

DEF.fairy = {"label":"Fairy","rangedSphere":true,"weapon":"Pixie Wand","ab":"Wish Granted","color":"#ff5ac8","dark":"#9b1768","rim":"#fff0ff","out":"#42002b","wcol":"#fff0ff","wdrk":"#ff8ce2","mass":4,"spd":295,"hp":376,"om":10.5,"dmg":4.73,"arm":57,"magDef":99,"rest":0.86,"reach":2.4,"tipR":0.14,"abilityType":"hybrid","passiveType":"hybrid","wt":"pixiewand"};
CLASS_ROLE.fairy = "SUPPORT";
CLASS_DESC.fairy = {
  "ability": "Wish Granted (4 stacks) — Rolls invincibility, a heal burst, a triple-speed dash, or a one-hit mirror clone, and grants 2s of faster wand fire rate.",
  "passive": "Pixie Dust Trail — Moving sheds charm dust that reverses enemy spin and slows them; Fairy heals in her own dust."
};
STACK_THRESHOLD.fairy = 4;
STACK_DISPLAY_THRESHOLD.fairy = 4;
SPHERE_AUDIO.fairy = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
