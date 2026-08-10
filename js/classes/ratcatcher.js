'use strict';
// ▓▓▓ MODULE: classes/ratcatcher.js — Ratcatcher sphere kit registry ▓▓▓

DEF.ratcatcher = {"label":"Ratcatcher","weapon":"Catching Pole","ab":"Infestation","color":"#111111","dark":"#050505","rim":"#b7c06a","out":"#000000","wcol":"#b0a070","wdrk":"#5f5230","mass":5.5,"spd":245,"hp":408,"om":6.2,"dmg":2.96,"arm":74,"magDef":27,"rest":0.76,"reach":4.35,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"catchingpole"};
CLASS_ROLE.ratcatcher = "MARKSMAN";
CLASS_DESC.ratcatcher = {
  "ability": "Infestation (3 stacks) — Releases 12 rats in all directions. Rats that reach an enemy bite for damage and apply Gnawed, slowing movement by 6% per stack for 8s, stacking up to 5 times.",
  "passive": "Rat Pack — Each weapon hit releases a rat that hunts the enemy and deals 1 true damage per second for 5 seconds. Rats accumulate into a persistent attrition swarm."
};
STACK_THRESHOLD.ratcatcher = 3;
STACK_DISPLAY_THRESHOLD.ratcatcher = 3;
SPHERE_AUDIO.ratcatcher = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
