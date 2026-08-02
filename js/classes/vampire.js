'use strict';
// ▓▓▓ MODULE: classes/vampire.js — Vampire sphere kit registry ▓▓▓

DEF.vampire = {"label":"Vampire","weapon":"Crimson Claws","ab":"Swarm of the Night","color":"#1a0020","dark":"#0d000f","rim":"#cc0044","out":"#080008","wcol":"#cc0044","wdrk":"#880022","mass":5.5,"spd":275,"hp":181,"om":9,"dmg":3.82,"arm":0,"magDef":0,"rest":0.78,"reach":2.01,"tipR":0.42,"abilityType":"damage","passiveType":"hybrid","wt":"crimsonclaws"};
CLASS_ROLE.vampire = "ASSASSIN";
CLASS_DESC.vampire = {
  "ability": "Swarm of the Night (3 stacks) — Enters a spectral ghost state for 2.5s. Becomes fully untargetable: all weapon hits and body collisions pass through. Spawns a thick bat cloud — enemies overlapping take 0.55× DMG ticks every 0.28s, and each tick heals the Vampire for 40% of damage dealt.",
  "passive": "Sanguine Thirst — Every melee strike from the Crimson Claws heals the Vampire for 25% of damage dealt while in physical (non-ghost) form. Twin rotating sickles hit from both angles."
};
STACK_THRESHOLD.vampire = 6;
STACK_DISPLAY_THRESHOLD.vampire = 6;
SPHERE_AUDIO.vampire = {
  "weaponCollision": "audio/vampire/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
