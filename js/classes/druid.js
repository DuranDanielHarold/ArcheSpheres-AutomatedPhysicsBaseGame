'use strict';
// ▓▓▓ MODULE: classes/druid.js — Druid sphere kit registry ▓▓▓

DEF.druid = {"label":"Druid","weapon":"Thornwhip","ab":"Thorn Patch","color":"#1b5e20","dark":"#0d3310","rim":"#69f0ae","out":"#081a08","wcol":"#69f0ae","wdrk":"#2e7d32","mass":7,"spd":194,"hp":497,"om":4.7,"dmg":4.08,"arm":130,"magDef":46,"rest":0.64,"reach":4.11,"tipR":0.2,"abilityType":"hybrid","passiveType":"hybrid","wt":"thornwhip"};
CLASS_ROLE.druid = "MAGE";
CLASS_DESC.druid = {
  "ability": "Thorn Patch (3 stacks) — Drops a 7s thorn zone at current position. Enemies inside are near-frozen and take DoT every 0.8s based on Druid's DMG. Druid gains 2 stacks per hit for faster ramp.",
  "passive": "Auto whip AoE every 4s hits all enemies in reach range for 0.4× DMG, building stacks passively."
};
STACK_THRESHOLD.druid = 3;
STACK_DISPLAY_THRESHOLD.druid = 3;
SPHERE_AUDIO.druid = {
  "weaponCollision": "audio/druid/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
