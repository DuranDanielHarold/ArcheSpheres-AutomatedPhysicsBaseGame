'use strict';
// ▓▓▓ MODULE: classes/sheriff.js — Sheriff sphere kit registry ▓▓▓

DEF.sheriff = {"label":"Sheriff","rangedSphere":true,"weapon":".44 Magnum","ab":"Bola & Buckshot","color":"#5c4a2a","dark":"#2e2210","rim":"#d4a83a","out":"#1a1008","wcol":"#d4a83a","wdrk":"#8a6010","mass":6,"spd":246.2,"hp":487.3,"om":5.5,"dmg":5.5,"arm":88,"magDef":30,"rest":0.7,"reach":3.3,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"magnum"};
CLASS_ROLE.sheriff = "MARKSMAN";
CLASS_DESC.sheriff = {
  "ability": "Bola & Buckshot (2 outgoing hits) — Fires a bola that roots the target for 1.4s (gravity suspended), then follows with a piercing gold laser dealing 46 true damage plus 7% of target max HP and armor-penetration bonus.",
  "passive": "Fires 6 rapid +5 damage .44 rounds per cylinder (0.16s CD), then reloads. Reload starts at 0.60s and can fall to 0.30s as HP is lost. Reload smoke is visible on the cylinder; kites away from melee."
};
STACK_THRESHOLD.sheriff = 2;
STACK_DISPLAY_THRESHOLD.sheriff = 2;
SPHERE_AUDIO.sheriff = {
  "weaponCollision": "audio/sheriff/weaponCollision.wav",
  "damage": "audio/sheriff/damage.wav",
  "ability": "audio/sheriff/ability.wav",
  "projectileThrow": "audio/sheriff/projectileThrow.wav",
  "projectileHit": "audio/sheriff/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
