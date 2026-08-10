'use strict';
// ▓▓▓ MODULE: classes/rogue.js — Rogue sphere kit registry ▓▓▓

DEF.rogue = {"label":"Rogue","weapon":"Twin Daggers","ab":"Backstab","color":"#2c3e50","dark":"#1a252f","rim":"#e74c3c","out":"#0d1117","wcol":"#e74c3c","wdrk":"#c0392b","mass":4.5,"spd":297,"hp":365,"om":10.5,"dmg":2.85,"arm":55,"magDef":28,"rest":0.82,"reach":1.61,"tipR":0.22,"abilityType":"hybrid","passiveType":"hybrid","wt":"daggers"};
CLASS_ROLE.rogue = "ASSASSIN";
CLASS_DESC.rogue = {
  "ability": "Backstab (3 stacks) — Charges daggers for 3s with 3× damage on next hit. Spin direction reverses on activation.",
  "passive": "Hemorrhage — Every weapon hit applies a Bleed stack on the target (max 3). Each stack deals 18% of Rogue's DMG every 0.5s for 1.8s, refreshed on new hits. Stacks show as BLEED x# above the victim."
};
STACK_THRESHOLD.rogue = 3;
STACK_DISPLAY_THRESHOLD.rogue = 3;
SPHERE_AUDIO.rogue = {
  "weaponCollision": "audio/rogue/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
