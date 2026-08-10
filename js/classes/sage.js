'use strict';
// ▓▓▓ MODULE: classes/sage.js — Sage sphere kit registry ▓▓▓

DEF.sage = {"label":"Sage","rangedSphere":true,"weapon":"Ancient Tome","ab":"Foresight","color":"#6c8f52","dark":"#304525","rim":"#d6f0b2","out":"#132010","wcol":"#e6d8a0","wdrk":"#7a6040","mass":9,"spd":195,"hp":548.64,"om":4.8,"dmg":2.85,"arm":116.15,"magDef":63.63,"rest":0.62,"reach":2.4,"tipR":0.48,"abilityType":"utility","passiveType":"hybrid","wt":"ancienttome"};
CLASS_ROLE.sage = "SUPPORT";
CLASS_DESC.sage = {
  "ability": "Foresight (3 stacks) — Becomes untargetable for 2s, mirrors enemy motion in reverse, then releases a 2× Wisdom Wave.",
  "passive": "Ancient Patience — Fires ranged gibberish wisdom words. Damage taken converts into permanent DMG and MDEF Knowledge, displayed above the sphere."
};
STACK_THRESHOLD.sage = 3;
STACK_DISPLAY_THRESHOLD.sage = 3;
SPHERE_AUDIO.sage = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
