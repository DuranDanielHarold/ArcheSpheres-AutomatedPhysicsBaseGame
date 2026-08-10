'use strict';
// ▓▓▓ MODULE: classes/templar.js — Templar sphere kit registry ▓▓▓

DEF.templar = {"label":"Templar","weapon":"Sacred Warhammer","ab":"Slow Field","color":"#daa520","dark":"#b8860b","rim":"#ffe680","out":"#8b6914","wcol":"#ffe680","wdrk":"#ccaa00","mass":9,"spd":196,"hp":463,"om":4.1,"dmg":3.25,"arm":117,"magDef":29,"rest":0.52,"reach":2.2,"tipR":0.48,"abilityType":"utility","passiveType":"utility","wt":"warhammer"};
CLASS_ROLE.templar = "TANK";
CLASS_DESC.templar = {
  "ability": "Slow Field (3 stacks) — Drops a slow zone at current position for 3s with 2.5× sphere radius. Enemies inside are heavily decelerated each frame. Templar spins 2× while active.",
  "passive": "Immovable — All incoming collision knockback is halved (50% reduction). Gains increasing physical damage mitigation while holding ground, scaling up further during Slow Field."
};
STACK_THRESHOLD.templar = 3;
STACK_DISPLAY_THRESHOLD.templar = 3;
SPHERE_AUDIO.templar = {
  "weaponCollision": "audio/templar/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
