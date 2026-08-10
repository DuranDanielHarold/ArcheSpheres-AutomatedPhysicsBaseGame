'use strict';
// ▓▓▓ MODULE: classes/arcanist.js — Arcanist sphere kit registry ▓▓▓

DEF.arcanist = {"label":"Arcanist","rangedSphere":true,"weapon":"Arcane Cannon","ab":"Overload","color":"#78d8ff","dark":"#1d6b92","rim":"#e8fbff","out":"#083044","wcol":"#e8fbff","wdrk":"#3388bb","mass":5,"spd":190,"hp":506.96,"om":4.2,"dmg":9.66,"arm":70,"magDef":70.17,"rest":0.72,"reach":3.49,"tipR":0.28,"abilityType":"damage","passiveType":"hybrid","wt":"arcanecannon"};
CLASS_ROLE.arcanist = "MAGE";
CLASS_DESC.arcanist = {
  "ability": "Overload (3 stacks) — For 4s shells fly faster, explode wider, and leave longer burn zones; each explosion now deals reduced true self-harm.",
  "passive": "Volatile Charge — Avoiding damage builds charge; at full charge the next shell detonates on the enemy position. Taking damage resets charge and knocks self back."
};
STACK_THRESHOLD.arcanist = 3;
STACK_DISPLAY_THRESHOLD.arcanist = 3;
SPHERE_AUDIO.arcanist = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
