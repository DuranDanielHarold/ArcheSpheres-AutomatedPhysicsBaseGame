'use strict';
// ▓▓▓ MODULE: classes/guardian.js — Guardian sphere kit registry ▓▓▓

DEF.guardian = {"label":"Guardian","weapon":"Tower Shield","ab":"Phalanx","color":"#37474f","dark":"#1c272c","rim":"#80cbc4","out":"#0d1214","wcol":"#80cbc4","wdrk":"#00897b","mass":7,"spd":204,"hp":413.7,"om":4.6,"dmg":5,"arm":98,"magDef":47,"rest":0.6,"reach":2,"tipR":0.6,"abilityType":"utility","passiveType":"hybrid","wt":"towershield"};
CLASS_ROLE.guardian = "TANK";
CLASS_DESC.guardian = {
  "ability": "Phalanx (3 stacks) — Consumes stacks to raise the tower shield for 2.5s: spin doubles, incoming knockback is reduced by 30%, and physical damage taken drops to 60%.",
  "passive": "Sanctuary — Every 10s, creates an 8s Heater Shield zone. Damage taken inside is completely negated once, consuming the shield. Tower Shield extends from both sides."
};
STACK_THRESHOLD.guardian = 3;
STACK_DISPLAY_THRESHOLD.guardian = 3;
SPHERE_AUDIO.guardian = {
  "weaponCollision": "audio/guardian/weaponCollision.wav",
  "damage": "audio/guardian/damage.wav",
  "ability": "audio/guardian/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
