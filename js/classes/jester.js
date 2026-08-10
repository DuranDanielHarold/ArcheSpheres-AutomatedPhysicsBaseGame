'use strict';
// ▓▓▓ MODULE: classes/jester.js — Jester sphere kit registry ▓▓▓

DEF.jester = {"label":"Jester","weapon":"Jingle Flail","ab":"Chaos Lurch","color":"#e91e63","dark":"#880e4f","rim":"#ffd740","out":"#4a0025","wcol":"#ffd740","wdrk":"#c8a000","mass":5,"spd":256,"hp":377,"om":13,"dmg":3.29,"arm":65,"magDef":27,"rest":0.86,"reach":2.56,"tipR":0.28,"abilityType":"damage","passiveType":"hybrid","wt":"jingleflail"};
CLASS_ROLE.jester = "MAGE";
CLASS_DESC.jester = {
  "ability": "Chaos Lurch (3 stacks) — Fires in a completely random direction at 2.2× speed, reverses spin, and gains 2× damage for 1.5s.",
  "passive": "Spin accelerates with stacks (up to 2.5× base spin). Higher speed = wider bell swing = more chaotic hit angles."
};
STACK_DISPLAY_THRESHOLD.jester = 3;
SPHERE_AUDIO.jester = {
  "weaponCollision": "audio/jester/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
