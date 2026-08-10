'use strict';
// ▓▓▓ MODULE: classes/beastmaster.js — Beastmaster sphere kit registry ▓▓▓

DEF.beastmaster = {"label":"Beastmaster","weapon":"Beast Whip","ab":"Pack Hunt","color":"#b85a13","dark":"#5a2608","rim":"#ffb060","out":"#220c02","wcol":"#c08a50","wdrk":"#6a3510","mass":7,"spd":209,"hp":452,"om":5.8,"dmg":3.61,"arm":92,"magDef":38,"rest":0.68,"reach":4.59,"tipR":0.16,"abilityType":"damage","passiveType":"hybrid","wt":"beastwhip"};
CLASS_ROLE.beastmaster = "FIGHTER";
CLASS_DESC.beastmaster = {
  "ability": "Pack Hunt (4 stacks) — Releases wolf, boar, and hawk companions that hunt enemies for 10s; damage rises while beasts live.",
  "passive": "Wild Bond — Whip hits spawn ferrets; three ferrets on a target trigger an ARM-stripping Frenzy burst."
};
STACK_THRESHOLD.beastmaster = 4;
STACK_DISPLAY_THRESHOLD.beastmaster = 4;
SPHERE_AUDIO.beastmaster = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
