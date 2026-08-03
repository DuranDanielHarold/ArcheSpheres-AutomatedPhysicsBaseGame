'use strict';
// ▓▓▓ MODULE: classes/ranger.js — Ranger sphere kit registry ▓▓▓

DEF.ranger = {"label":"Ranger","rangedSphere":true,"weapon":"Longbow","ab":"Volley Shot","color":"#2d5a1b","dark":"#1a3610","rim":"#88cc44","out":"#0f1f0a","wcol":"#88cc44","wdrk":"#557733","mass":6,"spd":216,"hp":434,"om":5,"dmg":5.49,"arm":90,"magDef":33,"rest":0.72,"reach":3.24,"tipR":0.12,"abilityType":"hybrid","passiveType":"hybrid","wt":"longbow"};
CLASS_ROLE.ranger = "MARKSMAN";
CLASS_DESC.ranger = {
  "ability": "Volley Shot (4 stacks) — Rapidly fires 3 bursts of 5 spread arrows (center + 4 flanking) every 0.6s with +2 volley bonus damage each. Single shots suppressed during volley.",
  "passive": "Continuously fires +3 damage arrows. Each arrow applies momentum to the target on hit. Kites away from close enemies. Missing HP increases crit damage by 1% per lost HP%, capped at +30%."
};
STACK_THRESHOLD.ranger = 4;
STACK_DISPLAY_THRESHOLD.ranger = 4;
SPHERE_AUDIO.ranger = {
  "weaponCollision": "audio/ranger/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
