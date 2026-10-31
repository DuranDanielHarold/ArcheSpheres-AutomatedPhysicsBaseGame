'use strict';
// ▓▓▓ MODULE: classes/ranger.js — Ranger sphere kit registry ▓▓▓

DEF.ranger = {"label":"Ranger","rangedSphere":true,"weapon":"Longbow","ab":"Volley Shot","color":"#2d5a1b","dark":"#1a3610","rim":"#88cc44","out":"#0f1f0a","wcol":"#88cc44","wdrk":"#557733","mass":6,"spd":218,"hp":436,"om":5,"dmg":5.6,"arm":90,"magDef":33,"rest":0.7,"reach":3.3,"tipR":0.1,"abilityType":"hybrid","passiveType":"hybrid","wt":"longbow"};
CLASS_ROLE.ranger = "MARKSMAN";
CLASS_DESC.ranger = {
  "ability": "Volley Shot (4 stacks) — Fires 4 bursts of 5 spread arrows (center + 4 flanking) every 0.6s, each with +4 bonus damage. Single shots are suppressed during the volley.",
  "passive": "Continuously fires +7 damage arrows. Missing HP increases critical-hit chance by 1.2× lost-HP fraction (capped at 60%); critical hits deal 2× damage plus up to 30% bonus. Kites away from close enemies."
};
STACK_THRESHOLD.ranger = 4;
STACK_DISPLAY_THRESHOLD.ranger = 4;
SPHERE_AUDIO.ranger = {
  "weaponCollision": "audio/ranger/weaponCollision.wav",
  "damage": "audio/ranger/damage.wav",
  "ability": "audio/ranger/ability.wav",
  "projectileThrow": "audio/ranger/projectileThrow.wav",
  "projectileHit": "audio/ranger/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
