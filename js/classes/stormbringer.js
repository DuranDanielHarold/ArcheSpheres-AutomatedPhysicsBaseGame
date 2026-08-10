'use strict';
// ▓▓▓ MODULE: classes/stormbringer.js — Stormbrngr sphere kit registry ▓▓▓

DEF.stormbringer = {"label":"Stormbrngr","weapon":"Lightning Chain","ab":"Thunderclap","color":"#1a1a3a","dark":"#0d0d1e","rim":"#88ccff","out":"#050510","wcol":"#88ccff","wdrk":"#2244aa","mass":5.5,"spd":251.48,"hp":413.92,"om":8,"dmg":4.07,"arm":75,"magDef":42,"rest":0.78,"reach":2.36,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"lightningchain"};
CLASS_ROLE.stormbringer = "MAGE";
CLASS_DESC.stormbringer = {
  "ability": "Thunderclap (3 stacks) — Freezes own position for 0.8s and emits a shockwave in all directions, dealing magic damage and heavy knockback to all enemies.",
  "passive": "Static Charge — The faster the Stormbringer moves, the more electric charge builds. Stored charge (up to 30) discharges as bonus true damage on the next weapon hit, then resets."
};
STACK_THRESHOLD.stormbringer = 3;
STACK_DISPLAY_THRESHOLD.stormbringer = 3;
SPHERE_AUDIO.stormbringer = {
  "weaponCollision": "audio/stormbringer/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
