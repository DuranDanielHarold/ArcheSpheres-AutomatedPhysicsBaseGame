'use strict';
// ▓▓▓ MODULE: classes/jester.js — Jester sphere kit registry ▓▓▓

DEF.jester = {"label":"Jester","weapon":"Jingle Flail","ab":"Chaos Lurch","color":"#e91e63","dark":"#880e4f","rim":"#ffd740","out":"#4a0025","wcol":"#ffd740","wdrk":"#c8a000","mass":5,"spd":256,"hp":372.9,"om":11,"dmg":3,"arm":65,"magDef":26,"rest":0.9,"reach":2.5,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"jingleflail"};
CLASS_ROLE.jester = "MAGE";
CLASS_DESC.jester = {
  "ability": "Chaos Lurch (3 stacks) — Fires in a completely random direction at 2.0× speed, reverses spin, and gains 1.35× damage for 1.2s.",
  "passive": "Spin accelerates with stacks (up to 1.9× base spin). Higher speed = wider bell swing = more chaotic hit angles."
};
STACK_DISPLAY_THRESHOLD.jester = 3;
SPHERE_AUDIO.jester = {
  "weaponCollision": "audio/jester/weaponCollision.wav",
  "damage": "audio/jester/damage.wav",
  "ability": "audio/jester/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
