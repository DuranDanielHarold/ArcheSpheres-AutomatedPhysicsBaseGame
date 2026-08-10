'use strict';
// ▓▓▓ MODULE: classes/viking.js — Viking sphere kit registry ▓▓▓

DEF.viking = {"label":"Viking","weapon":"Battle Axe","ab":"Rage Spin","color":"#3a5070","dark":"#1a2a40","rim":"#6080a8","out":"#102030","wcol":"#c8a030","wdrk":"#886010","mass":8.5,"spd":221,"hp":500,"om":4.8,"dmg":4.85,"arm":120,"magDef":35,"rest":0.66,"reach":2.59,"tipR":0.45,"abilityType":"hybrid","passiveType":"hybrid","wt":"battleaxe"};
CLASS_ROLE.viking = "FIGHTER";
CLASS_DESC.viking = {
  "ability": "Rage Spin (4 stacks) — Enters Berserker mode for 6s: spin locks at max rage, damage becomes 1.6×, and collision knockback dealt is doubled.",
  "passive": "Last Stand — When Viking would die, he instead becomes invulnerable for 6s. During Last Stand, full rage automatically triggers Rage Spin without spending stacks. After the 6s stand, he falls."
};
STACK_THRESHOLD.viking = 4;
STACK_DISPLAY_THRESHOLD.viking = 4;
SPHERE_AUDIO.viking = {
  "weaponCollision": "audio/viking/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
