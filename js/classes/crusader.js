'use strict';
// ▓▓▓ MODULE: classes/crusader.js — Crusader sphere kit registry ▓▓▓

DEF.crusader = {"label":"Crusader","weapon":"Flail+Shield","ab":"Holy Charge","color":"#c8b870","dark":"#806020","rim":"#fffacc","out":"#403010","wcol":"#fffacc","wdrk":"#c8a040","mass":11,"spd":204,"hp":533,"om":4.3,"dmg":3.98,"arm":163,"magDef":52,"rest":0.58,"reach":2.5,"tipR":0.4,"abilityType":"hybrid","passiveType":"hybrid","wt":"flailshield"};
CLASS_ROLE.crusader = "TANK";
CLASS_DESC.crusader = {
  "ability": "Holy Charge (3 stacks) — Starts at 2.2s and becomes immune to knockback while dealing 2.0× collision damage. Each collision extends the charge by 0.4s, capped at 5s total.",
  "passive": "Retribution — Incoming damage charges a Retribution counter. The next weapon hit discharges all stored damage as a bonus, then resets. Big hits pay dividends."
};
STACK_THRESHOLD.crusader = 3;
STACK_DISPLAY_THRESHOLD.crusader = 3;
SPHERE_AUDIO.crusader = {
  "weaponCollision": "audio/crusader/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
