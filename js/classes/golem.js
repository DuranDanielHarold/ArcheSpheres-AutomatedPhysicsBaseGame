'use strict';
// ▓▓▓ MODULE: classes/golem.js — Golem sphere kit registry ▓▓▓

DEF.golem = {"label":"Golem","weapon":"Stone Slab","ab":"Fortify","color":"#607d8b","dark":"#37474f","rim":"#b0bec5","out":"#1c2a30","wcol":"#b0bec5","wdrk":"#78909c","mass":14,"spd":155,"hp":538,"om":3.3,"dmg":7.56,"arm":142,"magDef":30,"rest":0.42,"reach":1.9,"tipR":0.65,"abilityType":"utility","passiveType":"hybrid","wt":"stoneslab"};
CLASS_ROLE.golem = "TANK";
CLASS_DESC.golem = {
  "ability": "Fortify (3 stacks) — Consumes stacks to fortify for 4s, gaining 2× spin and 1.4× damage before the stone surge decays.",
  "passive": "Receives only 65% physical damage. Heavier mass, 530 HP, 7.5 DMG, and 140 ARM make it nearly immovable from collision."
};
STACK_DISPLAY_THRESHOLD.golem = 3;
SPHERE_AUDIO.golem = {
  "weaponCollision": "audio/golem/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
