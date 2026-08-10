'use strict';
// ▓▓▓ MODULE: classes/prince.js — Prince sphere kit registry ▓▓▓

DEF.prince = {"label":"Prince","weapon":"Dueling Sabre","ab":"Royal Blood","color":"#1747b8","dark":"#08205f","rim":"#8bb7ff","out":"#031032","wcol":"#d8e8ff","wdrk":"#5678b8","mass":6,"spd":249.98,"hp":412.15,"om":8.5,"dmg":3.68,"arm":83.16,"magDef":35,"rest":0.78,"reach":2.99,"tipR":0.18,"abilityType":"utility","passiveType":"hybrid","wt":"duelingsabre"};
CLASS_ROLE.prince = "FIGHTER";
CLASS_DESC.prince = {
  "ability": "Royal Blood (4 stacks) — Gains a 10-damage shield for 6s. While the shield holds, saber mode gains +2 damage and faster omega spin, while bow mode fires more quickly. If enemies break the shield early, gains +30 ARM and MDEF for 3s.",
  "passive": "Weapon Master — Automatically swaps between a dueling sabre for enemies within sabre reach and a silver wood bow for longer range. Only the active weapon is equipped and drawn."
};
STACK_THRESHOLD.prince = 4;
STACK_DISPLAY_THRESHOLD.prince = 4;
SPHERE_AUDIO.prince = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
