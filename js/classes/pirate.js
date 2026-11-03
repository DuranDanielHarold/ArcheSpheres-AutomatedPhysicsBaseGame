'use strict';
// ▓▓▓ MODULE: classes/pirate.js — Pirate sphere kit registry ▓▓▓

DEF.pirate = {"label":"Pirate","weapon":"Cutlass","ab":"Boarding Action","color":"#3e2723","dark":"#1c1008","rim":"#ff7043","out":"#120a04","wcol":"#ffcc02","wdrk":"#e6a800","mass":7.5,"spd":234.11,"hp":498.92,"om":8,"dmg":4.23,"arm":93.06,"magDef":30,"rest":0.74,"reach":2.89,"tipR":0.24,"abilityType":"utility","passiveType":"hybrid","wt":"cutlass"};
CLASS_ROLE.pirate = "FIGHTER";
CLASS_DESC.pirate = {
  "ability": "Boarding Action (3 stacks) — Fires a grappling hook that yanks the enemy toward the Pirate with 380 force, dealing 1.5× DMG on contact. Wall hits hook the Pirate toward the wall.",
  "passive": "Explosive Barrels — Every 4 seconds, drops a barrel at a random arena position. Keeps at most 2 active barrels; each lasts 16 seconds. Pirate weapon hits detonate barrels, damaging, knocking back, and burning enemies. Enemy hits destroy barrels; allies cannot interact with them."
};
STACK_DISPLAY_THRESHOLD.pirate = 3;
SPHERE_AUDIO.pirate = {
  "weaponCollision": "audio/pirate/weaponCollision.wav",
  "damage": "audio/pirate/damage.wav",
  "ability": "audio/pirate/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
