'use strict';
// ▓▓▓ MODULE: classes/queen.js — Queen sphere kit registry ▓▓▓

DEF.queen = {"label":"Queen","weapon":"Regal Rapier","ab":"Queen's Gambit","color":"#b01872","dark":"#5b0838","rim":"#ff8bd1","out":"#220016","wcol":"#ffb8e6","wdrk":"#a02a70","mass":5,"spd":313.02,"hp":281.89,"om":7,"dmg":4.56,"arm":44,"magDef":34,"rest":0.82,"reach":3.76,"tipR":0.09,"abilityType":"hybrid","passiveType":"hybrid","wt":"regalrapier"};
CLASS_ROLE.queen = "ASSASSIN";
CLASS_DESC.queen = {
  "ability": "Queen's Gambit (4 stacks) — Rapier glows with royal color for 3s, converting Queen's weapon hits to true damage while reducing both defenses by one-third.",
  "passive": "Courtly Menace — Nearby enemies lose damage and speed. Back hits permanently raise the Queen's damage."
};
STACK_THRESHOLD.queen = 4;
STACK_DISPLAY_THRESHOLD.queen = 4;
SPHERE_AUDIO.queen = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
