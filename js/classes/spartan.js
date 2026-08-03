'use strict';
// ▓▓▓ MODULE: classes/spartan.js — Spartan sphere kit registry ▓▓▓

DEF.spartan = {"label":"Spartan","weapon":"Doru+Aspis","ab":"Phalanx Thrust","color":"#5b1a16","dark":"#260807","rim":"#d24634","out":"#120302","wcol":"#d8b060","wdrk":"#7a4a20","mass":7,"spd":227,"hp":376,"om":5.2,"dmg":3.54,"arm":84,"magDef":20,"rest":0.58,"reach":2.8,"tipR":0.18,"abilityType":"damage","passiveType":"hybrid","wt":"doruaspis"};
CLASS_ROLE.spartan = "FIGHTER";
CLASS_DESC.spartan = {
  "ability": "Phalanx Thrust (3 stacks) — Spear snaps toward the nearest enemy, then makes a shorter 0.55s formation charge at 2.6× speed that shoves enemies on hit while keeping damage normal.",
  "passive": "Iron Formation — Shield-side hits build stacks that reduce physical damage; at 5 stacks the next ability is primed for free."
};
STACK_THRESHOLD.spartan = 3;
STACK_DISPLAY_THRESHOLD.spartan = 3;
SPHERE_AUDIO.spartan = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
