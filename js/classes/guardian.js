'use strict';
// ▓▓▓ MODULE: classes/guardian.js — Guardian sphere kit registry ▓▓▓

DEF.guardian = {"label":"Guardian","weapon":"Bastion Tower Shield","ab":"Aegis Slam","color":"#37474f","dark":"#1c272c","rim":"#80cbc4","out":"#0d1214","wcol":"#80cbc4","wdrk":"#00897b","mass":7,"spd":204,"hp":460,"om":4.6,"dmg":5.8,"arm":98.45,"magDef":47.38,"rest":0.68,"reach":2.4,"tipR":0.58,"abilityType":"offensive","passiveType":"utility","wt":"towershield"};
CLASS_ROLE.guardian = "TANK";
CLASS_DESC.guardian = {
  "ability": "Aegis Slam (2 stacks) — Guardian slams its Tower Shield into the ground, dealing 1.0× base damage to enemies within 3.0× its radius and knocking them away.",
  "passive": "Bastion Field — Every 10s, creates an 8s moving field with 40 shared shield capacity. Guardian and allies inside take 15% less damage; prevented damage consumes the shared capacity. The field breaks when depleted."
};
STACK_DISPLAY_THRESHOLD.guardian = 2;
SPHERE_AUDIO.guardian = {
  "weaponCollision": "audio/guardian/weaponCollision.wav",
  "damage": "audio/guardian/damage.wav",
  "ability": "audio/guardian/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
