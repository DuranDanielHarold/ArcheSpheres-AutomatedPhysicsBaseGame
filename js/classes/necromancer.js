'use strict';
// ▓▓▓ MODULE: classes/necromancer.js — Necro sphere kit registry ▓▓▓

// Exactly one DEF.necromancer assignment is permitted in this file.
DEF.necromancer = {"label":"Necro","rangedSphere":true,"weapon":"Soul Scythe","ab":"Death Mark","color":"#1a0a2e","dark":"#0d0518","rim":"#7c4dff","out":"#080310","wcol":"#7c4dff","wdrk":"#512da8","mass":6,"spd":196,"hp":404.7,"om":5.5,"dmg":5.6,"arm":85,"magDef":51,"rest":0.7,"reach":3.8,"tipR":0.2,"abilityType":"damage","passiveType":"hybrid","wt":"scythe"};
CLASS_ROLE.necromancer = "MAGE";
CLASS_DESC.necromancer = {
  "ability": "Death Mark (3 stacks) — Applies 7 fast delayed damage ticks (0.90× projectile DMG +1.5 each, every 0.18s). A Skull Orb hitting an already marked enemy adds 7 ticks, up to 14.",
  "passive": "Skull Orbs deal +5 damage and fire every 0.20s. They apply Death Mark and Wound (halves healing) on hit. Scythe applies Wound; full mark sequences summon Skeletons. Kites away from melee."
};
STACK_THRESHOLD.necromancer = 3;
STACK_DISPLAY_THRESHOLD.necromancer = 3;
SPHERE_AUDIO.necromancer = {
  "weaponCollision": "audio/necromancer/weaponCollision.wav",
  "damage": "audio/necromancer/damage.wav",
  "ability": "audio/necromancer/ability.wav",
  "projectileThrow": "audio/necromancer/projectileThrow.wav",
  "projectileHit": "audio/necromancer/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
