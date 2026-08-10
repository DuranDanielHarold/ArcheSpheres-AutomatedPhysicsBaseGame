'use strict';
// ▓▓▓ MODULE: classes/dragoon.js — Dragoon sphere kit registry ▓▓▓

DEF.dragoon = {"label":"Dragoon","weapon":"Dragon Lance","ab":"Wyrm's Descent","color":"#1a2a3a","dark":"#0d1520","rim":"#4488cc","out":"#060d14","wcol":"#88bbdd","wdrk":"#2255aa","mass":8,"spd":181.71,"hp":451.6,"om":5,"dmg":3.14,"arm":67.07,"magDef":60,"rest":0.58,"reach":5.5,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"dragonlance"};
DEF.dragoon = {"label":"Dragoon","weapon":"Dragon Lance","ab":"Wyrm's Descent","color":"#1a2a3a","dark":"#0d1520","rim":"#4488cc","out":"#060d14","wcol":"#88bbdd","wdrk":"#2255aa","mass":8,"spd":185.5,"hp":472.29,"om":5,"dmg":3.24,"arm":69.3,"magDef":60,"rest":0.58,"reach":5.5,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"dragonlance"};
CLASS_ROLE.dragoon = "FIGHTER";
CLASS_DESC.dragoon = {
  "ability": "Wyrm's Descent (3 stacks) — Leaps into the air for 1.5s. While airborne: fully untargetable, ignores all collisions. A warning shadow tracks the enemy's position during the leap. On landing: snaps to target, deals 2.2× true damage in a radius and launches all enemies within range with 520 knockback.",
  "passive": "Wyrmscale (Magic Mitigation) — The dragoon is clad in dragon scales that absorb one incoming magic hit completely. After absorbing a hit, the shield recharges over 8 seconds. The Dragon Lance has the longest reach in the game (4.8×) but a narrow tip — precision over sweep."
};
STACK_THRESHOLD.dragoon = 3;
STACK_DISPLAY_THRESHOLD.dragoon = 3;
SPHERE_AUDIO.dragoon = {
  "weaponCollision": "audio/dragoon/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
