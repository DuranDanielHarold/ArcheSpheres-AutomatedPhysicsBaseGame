'use strict';
// ▓▓▓ MODULE: classes/golem.js — Golem sphere kit registry ▓▓▓

DEF.golem = {"label":"Golem","weapon":"Stone Slab","ab":"Fortify","color":"#607d8b","dark":"#37474f","rim":"#b0bec5","out":"#1c2a30","wcol":"#b0bec5","wdrk":"#78909c","mass":14,"spd":155,"hp":530.1,"om":3.3,"dmg":6.6,"arm":140,"magDef":29,"rest":0.4,"reach":1.9,"tipR":0.7,"abilityType":"utility","passiveType":"hybrid","wt":"stoneslab"};
CLASS_ROLE.golem = "TANK";
CLASS_DESC.golem = {
  "ability": "Fortify (3 stacks) — Consumes stacks to fortify for 3s, gaining 1.6× spin and 1.25× damage before the stone surge decays.",
  "passive": "Receives 78% physical damage. Heavier mass, 530 HP, 7.5 DMG, and 140 ARM make it nearly immovable from collision."
};
STACK_DISPLAY_THRESHOLD.golem = 3;
SPHERE_AUDIO.golem = {
  "weaponCollision": "audio/golem/weaponCollision.wav",
  "damage": "audio/golem/damage.wav",
  "ability": "audio/golem/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
