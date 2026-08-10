'use strict';
// ▓▓▓ MODULE: classes/mimic.js — Mimic sphere kit registry ▓▓▓

DEF.mimic = {"label":"Mimic","weapon":"Copycat Blade","ab":"Perfect Copy","color":"#2a1a4a","dark":"#14091f","rim":"#cc88ff","out":"#08040f","wcol":"#cc88ff","wdrk":"#664488","mass":5,"spd":259.06,"hp":415.66,"om":7.5,"dmg":3.15,"arm":70,"magDef":35,"rest":0.8,"reach":2.83,"tipR":0.25,"abilityType":"utility","passiveType":"hybrid","wt":"mimicblade"};
CLASS_ROLE.mimic = "ASSASSIN";
CLASS_DESC.mimic = {
  "ability": "Perfect Copy (3 stacks) — For 4s, copies the enemy's current DMG and SPEED on top of its own, temporarily becoming a more powerful version of the foe.",
  "passive": "Essence Drain — Each weapon hit permanently steals 0.04 DMG from the enemy and adds it to the Mimic's own DMG (capped at +3.0 total steal)."
};
STACK_THRESHOLD.mimic = 3;
STACK_DISPLAY_THRESHOLD.mimic = 3;
SPHERE_AUDIO.mimic = {
  "weaponCollision": "audio/mimic/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
