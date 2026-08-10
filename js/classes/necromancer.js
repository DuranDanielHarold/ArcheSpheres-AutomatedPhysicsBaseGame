'use strict';
// ▓▓▓ MODULE: classes/necromancer.js — Necro sphere kit registry ▓▓▓

DEF.necromancer = {"label":"Necro","rangedSphere":true,"weapon":"Soul Scythe","ab":"Death Mark","color":"#1a0a2e","dark":"#0d0518","rim":"#7c4dff","out":"#080310","wcol":"#7c4dff","wdrk":"#512da8","mass":6,"spd":196,"hp":410,"om":5.5,"dmg":5.63,"arm":85,"magDef":52,"rest":0.7,"reach":3.86,"tipR":0.24,"abilityType":"damage","passiveType":"hybrid","wt":"scythe"};
CLASS_ROLE.necromancer = "MAGE";
CLASS_DESC.necromancer = {
  "ability": "Death Mark (3 stacks) — Applies 7 fast delayed damage ticks (0.7× projectile DMG +1 each, every 0.18s) to the nearest enemy.",
  "passive": "Skull Orbs gain +2 damage and apply faster Death Mark + Wound (halves healing) on hit. Scythe applies Wound. Summons Skeletons after full mark sequences. Kites away from melee."
};
STACK_THRESHOLD.necromancer = 3;
STACK_DISPLAY_THRESHOLD.necromancer = 3;
SPHERE_AUDIO.necromancer = {
  "weaponCollision": "audio/necromancer/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
