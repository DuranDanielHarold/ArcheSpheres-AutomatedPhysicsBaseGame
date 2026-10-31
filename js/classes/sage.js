'use strict';
// ▓▓▓ MODULE: classes/sage.js — Sage sphere kit registry ▓▓▓

DEF.sage = {"label":"Sage","rangedSphere":true,"weapon":"Ancient Tome","ab":"Foresight","color":"#6c8f52","dark":"#304525","rim":"#d6f0b2","out":"#132010","wcol":"#e6d8a0","wdrk":"#7a6040","mass":9,"spd":195,"hp":548.6,"om":4.8,"dmg":2.9,"arm":116,"magDef":63,"rest":0.6,"reach":2.4,"tipR":0.5,"abilityType":"utility","passiveType":"hybrid","wt":"ancienttome"};
CLASS_ROLE.sage = "SUPPORT";
CLASS_DESC.sage = {
  "ability": "Foresight (3 stacks) — Becomes untargetable for 2s, mirrors enemy motion in reverse, then releases a 12× DMG Wisdom Wave to enemies within 5.5× sphere radius.",
  "passive": "Ancient Patience — Fires +26 DMG wisdom words every 0.26s. Damage taken accumulates; every 8 damage grants +0.5 DMG and +2 MDEF permanently."
};
STACK_THRESHOLD.sage = 3;
STACK_DISPLAY_THRESHOLD.sage = 3;
SPHERE_AUDIO.sage = {
  "weaponCollision": "audio/sage/weaponCollision.wav",
  "damage": "audio/sage/damage.wav",
  "ability": "audio/sage/ability.wav",
  "projectileThrow": "audio/sage/projectileThrow.wav",
  "projectileHit": "audio/sage/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
