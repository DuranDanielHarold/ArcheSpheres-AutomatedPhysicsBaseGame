'use strict';
// ▓▓▓ MODULE: classes/witch.js — Witch sphere kit registry ▓▓▓

DEF.witch = {"label":"Witch","rangedSphere":true,"weapon":"Hex Staff","ab":"Hex Converge","color":"#5b1f86","dark":"#2a0c46","rim":"#d77bff","out":"#12051f","wcol":"#d77bff","wdrk":"#6b2a90","mass":5,"spd":202,"hp":411,"om":5.2,"dmg":6.65,"arm":65,"magDef":90,"rest":0.72,"reach":3.07,"tipR":0.18,"abilityType":"damage","passiveType":"hybrid","wt":"hexstaff"};
CLASS_ROLE.witch = "MAGE";
CLASS_DESC.witch = {
  "ability": "Hex Convergence (3 stacks) — Staff snaps toward the nearest enemy and fires 3 lower-damage warping Hex Bolts before returning to normal rotation. Repeated hits briefly halve enemy damage and reverse spin; bolts now fizzle on wall impact.",
  "passive": "Jinx — Hex Bolt hits stack Jinx up to 4, then trigger a random blind, burn, slow, or spin-reverse debuff for 3s."
};
STACK_THRESHOLD.witch = 3;
STACK_DISPLAY_THRESHOLD.witch = 3;
SPHERE_AUDIO.witch = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
