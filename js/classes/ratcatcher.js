'use strict';
// ▓▓▓ MODULE: classes/ratcatcher.js — Ratcatcher sphere kit registry ▓▓▓

DEF.ratcatcher = {"label":"Ratcatcher","weapon":"Catching Pole","ab":"Infestation","color":"#111111","dark":"#050505","rim":"#b7c06a","out":"#000000","wcol":"#b0a070","wdrk":"#5f5230","mass":5.5,"spd":243,"hp":406.4,"om":6.2,"dmg":3.4,"arm":74,"magDef":27,"rest":0.8,"reach":4.3,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"catchingpole"};
CLASS_ROLE.ratcatcher = "MARKSMAN";
CLASS_DESC.ratcatcher = {
  "ability": "Infestation (3 stacks) — Releases 12 rats in all directions. Rats that reach an enemy bite for 3 damage and apply Gnawed, slowing movement by 8% per stack for 8s, stacking up to 5 times.",
  "passive": "Rat Pack — Each weapon hit releases a rat that hunts the enemy for up to 6s and deals 1.5 damage per second. Rats accumulate into a persistent attrition swarm."
};
STACK_THRESHOLD.ratcatcher = 3;
STACK_DISPLAY_THRESHOLD.ratcatcher = 3;
SPHERE_AUDIO.ratcatcher = {
  "weaponCollision": "audio/ratcatcher/weaponCollision.wav",
  "damage": "audio/ratcatcher/damage.wav",
  "ability": "audio/ratcatcher/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
