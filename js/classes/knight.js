'use strict';
// ▓▓▓ MODULE: classes/knight.js — Knight sphere kit registry ▓▓▓

DEF.knight = {"label":"Knight","weapon":"Broadsword","ab":"Shield Bubble","color":"#b0bec8","dark":"#506878","rim":"#d8eaf8","out":"#334455","wcol":"#d0dce8","wdrk":"#88a0b0","mass":12,"spd":210,"hp":422.89,"om":4.8,"dmg":3.12,"arm":133.35,"magDef":34.95,"rest":0.62,"reach":3.2,"tipR":0.22,"abilityType":"hybrid","passiveType":"hybrid","wt":"broadsword"};
CLASS_ROLE.knight = "TANK";
CLASS_DESC.knight = {
  "ability": "Shield Bubble (5 stacks) — Grants full invincibility for 3.6s. During the bubble, spin doubles and damage output increases by 1.5×.",
  "passive": "Stalwart — Every weapon hit permanently stacks +0.6% DMG/ARM/SPIN (max 30 stacks). Buff notifies every 5 hits. Encourages sustained aggressive play rather than burst-and-disengage."
};
SPHERE_AUDIO.knight = {
  "weaponCollision": "audio/knight/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
