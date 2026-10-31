'use strict';
// ▓▓▓ MODULE: classes/knight.js — Knight sphere kit registry ▓▓▓

DEF.knight = {"label":"Knight","weapon":"Broadsword","ab":"Shield Bubble","color":"#b0bec8","dark":"#506878","rim":"#d8eaf8","out":"#334455","wcol":"#d0dce8","wdrk":"#88a0b0","mass":12,"spd":210,"hp":430,"om":4.8,"dmg":3.2,"arm":118,"magDef":35,"rest":0.6,"reach":3.2,"tipR":0.2,"abilityType":"hybrid","passiveType":"hybrid","wt":"broadsword"};
CLASS_ROLE.knight = "TANK";
CLASS_DESC.knight = {
  "ability": "Shield Bubble (6 stacks) — Grants full invincibility for 2.0s. During the bubble, spin increases by 1.5× and damage output increases by 1.25×.",
  "passive": "Stalwart — Every weapon hit permanently stacks +0.4% DMG/ARM/SPIN (max 25 stacks). Buff notifies every 5 hits. Encourages sustained aggressive play rather than burst-and-disengage."
};
SPHERE_AUDIO.knight = {
  "weaponCollision": "audio/knight/weaponCollision.wav",
  "damage": "audio/knight/damage.wav",
  "ability": "audio/knight/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
