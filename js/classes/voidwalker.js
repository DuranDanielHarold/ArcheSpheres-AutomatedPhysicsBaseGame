'use strict';
// ▓▓▓ MODULE: classes/voidwalker.js — Void Walker sphere kit registry ▓▓▓

DEF.voidwalker = {"label":"Void Walker","weapon":"Gravity Spike","ab":"Singularity","color":"#080808","dark":"#000000","rim":"#aa44ff","out":"#000000","wcol":"#aa44ff","wdrk":"#550088","mass":6,"spd":228,"hp":467,"om":6,"dmg":4.7,"arm":85,"magDef":52,"rest":0.7,"reach":3.14,"tipR":0.2,"abilityType":"damage","passiveType":"hybrid","wt":"gravityspike"};
CLASS_ROLE.voidwalker = "MAGE";
CLASS_DESC.voidwalker = {
  "ability": "Singularity (3 stacks) — Places a black hole at current position for 2.5s with stronger suction that continuously drags all enemies inward while dealing faster tick damage.",
  "passive": "Void Tears — Wall bounces leave lingering void tears for 3s. Enemies passing through a tear are briefly slowed and take a burst of magic damage."
};
STACK_THRESHOLD.voidwalker = 3;
STACK_DISPLAY_THRESHOLD.voidwalker = 3;
SPHERE_AUDIO.voidwalker = {
  "weaponCollision": "audio/voidwalker/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
