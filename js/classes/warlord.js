'use strict';
// ▓▓▓ MODULE: classes/warlord.js — Warlord sphere kit registry ▓▓▓

DEF.warlord = {"label":"Warlord","weapon":"Doom Halberd","ab":"Earthquake","color":"#5d4037","dark":"#3e2723","rim":"#ff8a65","out":"#1c0d0a","wcol":"#ff8a65","wdrk":"#d4622f","mass":14,"spd":186,"hp":440,"om":4.5,"dmg":5.5,"arm":126,"magDef":40,"rest":0.6,"reach":3.1,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"halberd"};
CLASS_ROLE.warlord = "FIGHTER";
CLASS_DESC.warlord = {
  "ability": "Earthquake (5 stacks) — Launches enemy with 320 impact force and deals 14 flat damage. Warlord gains 1.5× spin for 2s after.",
  "passive": "Doom Halberd has the longest reach (3.1×) of all melee weapons. High mass amplifies collision physics."
};
SPHERE_AUDIO.warlord = {
  "weaponCollision": "audio/warlord/weaponCollision.wav",
  "damage": "audio/warlord/damage.wav",
  "ability": "audio/warlord/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
