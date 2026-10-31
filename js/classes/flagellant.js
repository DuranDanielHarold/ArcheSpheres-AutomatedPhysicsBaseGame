'use strict';
// ▓▓▓ MODULE: classes/flagellant.js — Flagellant sphere kit registry ▓▓▓

// Exactly one DEF.flagellant assignment is permitted in this file.
DEF.flagellant = {"label":"Flagellant","sphereMelee":true,"weapon":"Knotted Scourge","ab":"Penitence","color":"#4a1116","dark":"#210609","rim":"#d8b06a","out":"#120304","wcol":"#c49a62","wdrk":"#6b3020","mass":6,"spd":228.7,"hp":203.2,"om":6.8,"dmg":1.2,"arm":25,"magDef":18,"rest":0.8,"reach":3.1,"tipR":0.2,"abilityType":"damage","passiveType":"hybrid","wt":"knottedscourge"};
CLASS_ROLE.flagellant = "FIGHTER";
CLASS_DESC.flagellant = {
  "ability": "Penitence (3 stacks) — Deals 10 true self-damage, grants 1.5s invincibility during the ritual, and releases a contact-range shockwave that deals the same 10 damage to enemies.",
  "passive": "Sacred Wounds — Every 15 HP lost permanently increases damage output by +0.8 and spin by +0.4, up to 5 wound tiers. Losing health turns the Flagellant into a mounting offensive threat."
};
STACK_THRESHOLD.flagellant = 3;
STACK_DISPLAY_THRESHOLD.flagellant = 3;
SPHERE_AUDIO.flagellant = {
  "weaponCollision": "audio/flagellant/weaponCollision.wav",
  "damage": "audio/flagellant/damage.wav",
  "ability": "audio/flagellant/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
