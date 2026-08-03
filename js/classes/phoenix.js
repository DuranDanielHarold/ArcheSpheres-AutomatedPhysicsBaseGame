'use strict';
// ▓▓▓ MODULE: classes/phoenix.js — Phoenix sphere kit registry ▓▓▓

DEF.phoenix = {"label":"Phoenix","weapon":"Ashwing Talons","ab":"Cinder Wing","color":"#e65100","dark":"#bf360c","rim":"#ffcc02","out":"#6d1900","wcol":"#ffcc02","wdrk":"#f9a825","mass":6.5,"spd":245,"hp":395,"om":7.5,"dmg":4.32,"arm":81,"magDef":42,"rest":0.76,"reach":3.1,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"talon"};
CLASS_ROLE.phoenix = "FIGHTER";
CLASS_DESC.phoenix = {
  "ability": "Cinder Wing (3 stacks) — Ignites the Ashwing Talons for 2.2s, granting +18% speed, +35% spin, and a burst of Ember charge.",
  "passive": "Kindling Flight — Speed and wall bounces build Ember. At full Ember, the next weapon hit releases a compact flame burst for bonus damage. Once per match, lethal damage triggers Rebirth: 35% HP, 1.2s invincibility, full Ember, and a short knockback flare."
};
STACK_DISPLAY_THRESHOLD.phoenix = 3;
SPHERE_AUDIO.phoenix = {
  "weaponCollision": "audio/phoenix/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
