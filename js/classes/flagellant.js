'use strict';
// ▓▓▓ MODULE: classes/flagellant.js — Flagellant sphere kit registry ▓▓▓

DEF.flagellant = {"label":"Flagellant","sphereMelee":true,"weapon":"Knotted Scourge","ab":"Penitence","color":"#4a1116","dark":"#210609","rim":"#d8b06a","out":"#120304","wcol":"#c49a62","wdrk":"#6b3020","mass":6,"spd":231,"hp":205,"om":6.8,"dmg":1.18,"arm":25,"magDef":18,"rest":0.78,"reach":3.07,"tipR":0.18,"abilityType":"damage","passiveType":"hybrid","wt":"knottedscourge"};
CLASS_ROLE.flagellant = "FIGHTER";
CLASS_DESC.flagellant = {
  "ability": "Penitence (3 stacks) — Deals 10 true self-damage, grants 1.5s invincibility during the ritual, and releases a contact-range shockwave that deals the same 10 damage to enemies.",
  "passive": "Sacred Wounds — Every 15 HP lost permanently increases damage output by +0.8 and spin by +0.4. Losing health turns the Flagellant into a mounting offensive threat."
};
STACK_THRESHOLD.flagellant = 3;
STACK_DISPLAY_THRESHOLD.flagellant = 3;
SPHERE_AUDIO.flagellant = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
