'use strict';
// ▓▓▓ MODULE: classes/locksmith.js — Locksmith sphere kit registry ▓▓▓

DEF.locksmith = {"label":"Locksmith","weapon":"Prison Keys","ab":"Master Key","color":"#24313a","dark":"#101920","rim":"#d0b45a","out":"#071014","wcol":"#d6c06a","wdrk":"#6a5320","mass":6.5,"spd":257,"hp":516,"om":7.6,"dmg":3.63,"arm":92,"magDef":42,"rest":0.72,"reach":2.35,"tipR":0.3,"abilityType":"utility","passiveType":"utility","wt":"keyring"};
CLASS_ROLE.locksmith = "ASSASSIN";
CLASS_DESC.locksmith = {
  "ability": "Master Key (3 stacks) — Consumes Locks on the enemy for haste and stack denial. At 2 Locks it forces a longer weapon jam.",
  "passive": "Jammed Mechanism — Weapon clashes add Locks to the enemy. At 2 Locks, the enemy weapon jams: spin is heavily reduced for 1s, then Locks clear."
};
STACK_THRESHOLD.locksmith = 3;
STACK_DISPLAY_THRESHOLD.locksmith = 3;
SPHERE_AUDIO.locksmith = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
