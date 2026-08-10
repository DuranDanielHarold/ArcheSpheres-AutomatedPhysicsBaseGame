'use strict';
// ▓▓▓ MODULE: classes/samurai.js — Samurai sphere kit registry ▓▓▓

DEF.samurai = {"label":"Samurai","weapon":"Nodachi","ab":"Spiral Rush","color":"#5a0f18","dark":"#320008","rim":"#8a1f28","out":"#200008","wcol":"#c8c0a8","wdrk":"#807050","mass":5.5,"spd":253.25,"hp":446.2,"om":7,"dmg":2.24,"arm":82.07,"magDef":32,"rest":0.75,"reach":4.3,"tipR":0.16,"abilityType":"hybrid","passiveType":"hybrid","wt":"nodachi"};
CLASS_ROLE.samurai = "FIGHTER";
CLASS_DESC.samurai = {
  "ability": "Spiral Rush (3 stacks) — Launches into a 1.2s spiral orbit around the enemy at 4× speed with 2.5× damage.",
  "passive": "Iaijutsu — The first weapon hit after a spin-direction reversal deals 2× damage. 3s cooldown between procs. A pulsing silver ring shows when Iaijutsu is ready. Rewards momentum control and deliberate bouncing."
};
STACK_THRESHOLD.samurai = 3;
STACK_DISPLAY_THRESHOLD.samurai = 3;
SPHERE_AUDIO.samurai = {
  "weaponCollision": "audio/samurai/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
