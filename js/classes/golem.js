'use strict';
// ▓▓▓ MODULE: classes/golem.js — Golem sphere kit registry ▓▓▓

DEF.golem = {"label":"Golem","weapon":"Twin Primordial Fists","ab":"Primal Reformation","color":"#607d8b","dark":"#26343b","rim":"#b0bec5","out":"#111b20","wcol":"#aebbc4","wdrk":"#52636d","mass":14,"spd":155,"hp":530.12,"om":3.3,"dmg":7.52,"arm":140.24,"magDef":29.83,"rest":0.42,"reach":1.9,"tipR":0.65,"abilityType":"offensive","passiveType":"hybrid","wt":"golemfists"};
CLASS_ROLE.golem = "TANK";
CLASS_DESC.golem = {"ability":"Primal Reformation (3 stacks) — Consumes stored adaptation: Ironstone delivers a crushing focused punch; Crystalline releases a close-range burst.","passive":"Geological Adaptation — Incoming physical or magical damage shapes Golem into Ironstone or Crystalline form. The dominant form grants resistance and a matching damage bonus, then gradually fades."};
STACK_DISPLAY_THRESHOLD.golem = 3;
SPHERE_AUDIO.golem = {
  "weaponCollision": "audio/golem/weaponCollision.wav",
  "damage": "audio/golem/damage.wav",
  "ability": "audio/golem/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
