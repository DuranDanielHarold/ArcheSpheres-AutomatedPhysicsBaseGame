'use strict';
// ▓▓▓ MODULE: classes/sheriff.js — Sheriff sphere kit registry ▓▓▓

DEF.sheriff = {"label":"Sheriff","rangedSphere":true,"weapon":".44 Magnum","ab":"Bola & Buckshot","color":"#5c4a2a","dark":"#2e2210","rim":"#d4a83a","out":"#1a1008","wcol":"#d4a83a","wdrk":"#8a6010","mass":6,"spd":240,"hp":472,"om":5.5,"dmg":5.28,"arm":88,"magDef":30,"rest":0.74,"reach":3.14,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"magnum"};
CLASS_ROLE.sheriff = "MARKSMAN";
CLASS_DESC.sheriff = {
  "ability": "Bola & Buckshot (2 outgoing hits) — Fires a bola that roots the target for 1s (gravity suspended). Immediately follows with a piercing gold laser dealing 32 true damage + armor penetration bonus. Weapon swaps visually to a shotgun during the sequence.",
  "passive": "Fires 6 rapid +2 damage .44 rounds per cylinder (0.16s CD) then reloads. Every lost HP% reduces reload time by 0.05s, capped at 0.4s faster. Reload smoke visible on cylinder. Kites away from melee."
};
STACK_THRESHOLD.sheriff = 2;
STACK_DISPLAY_THRESHOLD.sheriff = 2;
SPHERE_AUDIO.sheriff = {
  "weaponCollision": "audio/sheriff/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
