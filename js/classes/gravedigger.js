'use strict';
// ▓▓▓ MODULE: classes/gravedigger.js — Gravedigger sphere kit registry ▓▓▓

DEF.gravedigger = {"label":"Gravedigger","weapon":"Rusty Shovel","ab":"Exhume","color":"#4d6170","dark":"#1d2a31","rim":"#9fc3b3","out":"#0b1518","wcol":"#9a8a72","wdrk":"#5f4b35","mass":10,"spd":202,"hp":509,"om":3.9,"dmg":4.84,"arm":114,"magDef":34,"rest":0.58,"reach":3.22,"tipR":0.42,"abilityType":"utility","passiveType":"hybrid","wt":"rustyshovel"};
CLASS_ROLE.gravedigger = "FIGHTER";
CLASS_DESC.gravedigger = {
  "ability": "Exhume (4 stacks) — Teleports to the oldest surviving Burial Mound, gains 1.8× spin and 0.6s invincibility on arrival. Burial Mounds persist only for the current battle and reset on each new battle.",
  "passive": "Burial Mounds — Every 6th wall contact buries a mound at the current position if it would not overlap an existing mound. Enemies crossing a mound are briefly slowed and lose 3% current HP."
};
STACK_THRESHOLD.gravedigger = 4;
STACK_DISPLAY_THRESHOLD.gravedigger = 4;
SPHERE_AUDIO.gravedigger = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
