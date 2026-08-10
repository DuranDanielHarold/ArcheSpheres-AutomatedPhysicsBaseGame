'use strict';
// ▓▓▓ MODULE: classes/warlord.js — Warlord sphere kit registry ▓▓▓

DEF.warlord = {"label":"Warlord","weapon":"Doom Halberd","ab":"Earthquake","color":"#5d4037","dark":"#3e2723","rim":"#ff8a65","out":"#1c0d0a","wcol":"#ff8a65","wdrk":"#d4622f","mass":16,"spd":181.86,"hp":439.02,"om":4.5,"dmg":6.42,"arm":121.59,"magDef":40,"rest":0.56,"reach":3.4,"tipR":0.28,"abilityType":"damage","passiveType":"hybrid","wt":"halberd"};
CLASS_ROLE.warlord = "FIGHTER";
CLASS_DESC.warlord = {
  "ability": "Earthquake (5 stacks) — Launches enemy with 320 impact force and deals 18 flat damage. Warlord gains 2× spin for 3s after.",
  "passive": "Doom Halberd has the longest reach (3.4×) of all melee weapons. High mass amplifies collision physics."
};
SPHERE_AUDIO.warlord = {
  "weaponCollision": "audio/warlord/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
