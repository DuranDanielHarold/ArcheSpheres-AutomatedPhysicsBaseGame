'use strict';
// ▓▓▓ MODULE: classes/voidwalker.js — Void Walker sphere kit registry ▓▓▓

DEF.voidwalker = {"label":"Void Walker","weapon":"Gravity Spike","ab":"Singularity","color":"#080808","dark":"#000000","rim":"#aa44ff","out":"#000000","wcol":"#aa44ff","wdrk":"#550088","mass":6,"spd":229.82,"hp":474,"om":6,"dmg":4.89,"arm":85,"magDef":53.37,"rest":0.7,"reach":3.21,"tipR":0.2,"abilityType":"damage","passiveType":"hybrid","wt":"gravityspike"};
CLASS_ROLE.voidwalker = "MAGE";
CLASS_DESC.voidwalker = {
  "ability": "Singularity (3 stacks) — Places a black hole at current position for 2.5s, continuously pulling enemies inward and dealing 0.45× DMG magic ticks every 0.35s.",
  "passive": "Void Tears — Wall bounces leave 3s tears. Enemies passing through take 0.55× DMG magic damage every 0.45s and are briefly slowed."
};
STACK_THRESHOLD.voidwalker = 3;
STACK_DISPLAY_THRESHOLD.voidwalker = 3;
SPHERE_AUDIO.voidwalker = {
  "weaponCollision": "audio/voidwalker/weaponCollision.wav",
  "damage": "audio/voidwalker/damage.wav",
  "ability": "audio/voidwalker/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
