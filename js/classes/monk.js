'use strict';
// ▓▓▓ MODULE: classes/monk.js — Monk sphere kit registry ▓▓▓

DEF.monk = {"label":"Monk","weapon":"Quarterstaff","ab":"100-Fist Nirvana","color":"#c8a870","dark":"#7a5a28","rim":"#ffe0a0","out":"#3a2808","wcol":"#ffe0a0","wdrk":"#c8a040","mass":5,"spd":272.7,"hp":388.46,"om":11,"dmg":1.48,"arm":33,"magDef":18,"rest":0.76,"reach":2.92,"tipR":0.15,"abilityType":"hybrid","passiveType":"hybrid","wt":"quarterstaff"};
CLASS_ROLE.monk = "FIGHTER";
CLASS_DESC.monk = {
  "ability": "100-Fist Nirvana (3 stacks) — For 3s, spin multiplies to 4× base omega. Every weapon hit during Nirvana launches the enemy with +400 flat impact force on top of normal physics — enemies become leaves in a divine hurricane.",
  "passive": "Water Emptying the Teapot — Every wall bounce accelerates the Monk by 1.4×. The Monk is the ricochet made flesh, gaining speed from every wall until the arena cannot contain the storm."
};
STACK_DISPLAY_THRESHOLD.monk = 3;
SPHERE_AUDIO.monk = {
  "weaponCollision": "audio/monk/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
