'use strict';
// ▓▓▓ MODULE: classes/barbarian.js — Barbarian sphere kit registry ▓▓▓

DEF.barbarian = {"label":"Barbarian","weapon":"Skull Flail","ab":"Ram Charge","color":"#7a2800","dark":"#400c00","rim":"#b04010","out":"#280800","wcol":"#c0c0c0","wdrk":"#808080","mass":13,"spd":240.79,"hp":495.51,"om":6,"dmg":5.4,"arm":80,"magDef":28,"rest":0.78,"reach":2.97,"tipR":0.35,"abilityType":"hybrid","passiveType":"hybrid","wt":"flail"};
CLASS_ROLE.barbarian = "FIGHTER";
CLASS_DESC.barbarian = {
  "ability": "Ram Charge (3 stacks) — Blasts toward the nearest enemy at 3.5× speed for 0.7s with 2× damage. Direction locks on target at cast.",
  "passive": "Bloodlust — Each landed hit adds +6 speed (max +60). Speed decays at 4/s when not hitting. Taking any damage resets all stacks. Glow orange ring brightens with stacks. Punishes passivity but shatters on being touched."
};
STACK_THRESHOLD.barbarian = 3;
STACK_DISPLAY_THRESHOLD.barbarian = 3;
SPHERE_AUDIO.barbarian = {
  "weaponCollision": "audio/barbarian/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
