'use strict';
// ▓▓▓ MODULE: classes/gladiator.js — Gladiator sphere kit registry ▓▓▓

DEF.gladiator = {"label":"Gladiator","weapon":"Gladius+Net","ab":"Arena's Verdict","color":"#b98152","dark":"#6b3f24","rim":"#f0c08a","out":"#2a1408","wcol":"#d8d0c0","wdrk":"#7a6048","mass":6,"spd":259,"hp":247,"om":6.5,"dmg":4.97,"arm":76,"magDef":28,"rest":0.78,"reach":2.2,"tipR":0.26,"abilityType":"hybrid","passiveType":"hybrid","wt":"gladiusnet"};
CLASS_ROLE.gladiator = "FIGHTER";
CLASS_DESC.gladiator = {
  "ability": "Arena's Verdict (3 stacks) — Throws the net to root the enemy and heavily weaken armor; gladius attacks during the window deal 1.8× damage with extra reach.",
  "passive": "Crowd Favor — Gladius hits build Favor more slowly for speed/spin. Taking damage removes Favor; at 10 Favor the next hit deals double damage."
};
STACK_THRESHOLD.gladiator = 3;
STACK_DISPLAY_THRESHOLD.gladiator = 3;
SPHERE_AUDIO.gladiator = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
