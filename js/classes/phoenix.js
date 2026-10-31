'use strict';
// ▓▓▓ MODULE: classes/phoenix.js — Phoenix sphere kit registry ▓▓▓

DEF.phoenix = {"label":"Phoenix","weapon":"Ashwing Talons","ab":"Cinder Wing","color":"#e65100","dark":"#bf360c","rim":"#ffcc02","out":"#6d1900","wcol":"#ffcc02","wdrk":"#f9a825","mass":6.5,"spd":226,"hp":350,"om":7,"dmg":3.9,"arm":77.22,"magDef":42,"rest":0.76,"reach":3.1,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"talon"};
CLASS_ROLE.phoenix = "FIGHTER";
CLASS_DESC.phoenix = {
  "ability": "Cinder Wing (5 stacks) — Ignites the Ashwing Talons for 1.6s, granting +10% speed, +20% spin, and a burst of Ember charge.",
  "passive": "Kindling Flight — Speed and wall bounces build Ember. At full Ember, the next weapon hit releases a compact flame burst for bonus damage. Once per match, lethal damage triggers Rebirth: 18% HP, 0.6s invincibility, full Ember, and a short knockback flare."
};
STACK_THRESHOLD.phoenix = 5;
STACK_DISPLAY_THRESHOLD.phoenix = 5;
SPHERE_AUDIO.phoenix = {
  "weaponCollision": "audio/phoenix/weaponCollision.wav",
  "damage": "audio/phoenix/damage.wav",
  "ability": "audio/phoenix/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
