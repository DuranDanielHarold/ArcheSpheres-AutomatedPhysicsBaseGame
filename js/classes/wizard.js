'use strict';
// ▓▓▓ MODULE: classes/wizard.js — Wizard sphere kit registry ▓▓▓

DEF.wizard = {"label":"Wizard","rangedSphere":true,"weapon":"Arcane Orb","ab":"Rod Cycle","color":"#4a0080","dark":"#2a0050","rim":"#cc88ff","out":"#1a0030","wcol":"#cc88ff","wdrk":"#884499","mass":5,"spd":181.4,"hp":434,"om":4.7,"dmg":6.4,"arm":70,"magDef":62,"rest":0.7,"reach":3,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"orbstaff"};
CLASS_ROLE.wizard = "MAGE";
CLASS_DESC.wizard = {
  "ability": "Rod Cycle (4 stacks) — Advances to the next elemental rod, activates it for 8s plus staff power, and fires 3 +11 damage bolts. Each cycle permanently increases rod duration, bolt damage, and elemental effect power.",
  "passive": "Continuously fires +11 damage elemental bolts every 0.17s. Active staff power strengthens each rod effect; Wind rod boosts own speed and spin."
};
STACK_THRESHOLD.wizard = 4;
STACK_DISPLAY_THRESHOLD.wizard = 4;
SPHERE_AUDIO.wizard = {
  "weaponCollision": "audio/wizard/weaponCollision.wav",
  "damage": "audio/wizard/damage.wav",
  "ability": "audio/wizard/ability.wav",
  "projectileThrow": "audio/wizard/projectileThrow.wav",
  "projectileHit": "audio/wizard/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
