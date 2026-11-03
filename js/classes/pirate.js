'use strict';
// ▓▓▓ MODULE: classes/pirate.js — Pirate sphere kit registry ▓▓▓

DEF.pirate = {"label":"Pirate","weapon":"Cutlass","ab":"Boarding Action","color":"#3e2723","dark":"#1c1008","rim":"#ff7043","out":"#120a04","wcol":"#ffcc02","wdrk":"#e6a800","mass":7.5,"spd":234.11,"hp":498.92,"om":8,"dmg":4.23,"arm":93.06,"magDef":30,"rest":0.74,"reach":2.89,"tipR":0.24,"abilityType":"utility","passiveType":"hybrid","wt":"cutlass"};
CLASS_ROLE.pirate = "FIGHTER";
CLASS_DESC.pirate = {
  "ability": "Boarding Action (3 stacks) — Fires a grappling hook with 380 enemy-pull force and 1200 wall-pull force. If an enemy is within an active owned barrel's 10.0× explosion radius, prioritizes the nearest wall to that barrel to pull the Pirate toward it; otherwise targets the nearest enemy. Deals 1.5× DMG on enemy contact.",
  "passive": "Explosive Barrels — Every 4 seconds, drops a barrel at a random safe arena position, at least 1.1× beyond enemy weapon-tip reach. Keeps at most 2 active barrels; each lasts 16 seconds. Pirate weapon hits detonate barrels, damaging, knocking back, and burning enemies; each enemy hit grants the Pirate 1 ability stack. Enemy hits destroy barrels; allies cannot interact with them."
};
STACK_DISPLAY_THRESHOLD.pirate = 3;
SPHERE_AUDIO.pirate = {
  "weaponCollision": "audio/pirate/weaponCollision.wav",
  "damage": "audio/pirate/damage.wav",
  "ability": "audio/pirate/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
