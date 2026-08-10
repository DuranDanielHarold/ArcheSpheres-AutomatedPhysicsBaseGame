'use strict';
// ▓▓▓ MODULE: classes/priest.js — Priest sphere kit registry ▓▓▓

DEF.priest = {"label":"Priest","rangedSphere":true,"weapon":"Holy Censer","ab":"Benediction","color":"#e8e0d0","dark":"#b0a898","rim":"#fff8e8","out":"#888070","wcol":"#f0e8c8","wdrk":"#c8b880","mass":6.5,"spd":204,"hp":384.84,"om":5,"dmg":4.57,"arm":92.57,"magDef":62.99,"rest":0.7,"reach":3.2,"tipR":0.18,"abilityType":"damage","passiveType":"hybrid","wt":"censer"};
CLASS_ROLE.priest = "SUPPORT";
CLASS_DESC.priest = {
  "ability": "Benediction (4 stacks) — Fires 8 homing Holy Orbs in all directions. Orbs begin homing after 0.18s with a sharp turn rate. Also grants +8 DMG for 10s.",
  "passive": "Continuously fires fast +2 damage homing Holy Orbs (every 0.35s). Enemy hits: deal magic damage and permanently reduce target MDEF by 5 (capped at −30). Ally hits: grant +2 DMG buff for 8s. Builds shield stacks that absorb incoming damage (each stack = 2 HP)."
};
STACK_THRESHOLD.priest = 8;
STACK_DISPLAY_THRESHOLD.priest = 8;
SPHERE_AUDIO.priest = {
  "weaponCollision": "audio/priest/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
