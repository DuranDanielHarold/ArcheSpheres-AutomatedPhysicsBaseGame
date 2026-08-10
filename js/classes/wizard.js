'use strict';
// ▓▓▓ MODULE: classes/wizard.js — Wizard sphere kit registry ▓▓▓

DEF.wizard = {"label":"Wizard","rangedSphere":true,"weapon":"Arcane Orb","ab":"Rod Cycle","color":"#4a0080","dark":"#2a0050","rim":"#cc88ff","out":"#1a0030","wcol":"#cc88ff","wdrk":"#884499","mass":5,"spd":181.44,"hp":434,"om":4.7,"dmg":6.39,"arm":70,"magDef":62.43,"rest":0.72,"reach":2.95,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"orbstaff"};
CLASS_ROLE.wizard = "MAGE";
CLASS_DESC.wizard = {
  "ability": "Rod Cycle (4 stacks) — Advances to the next elemental rod, activating it for 8s plus staff power and firing 3 +5 damage bolts. Each staff cycle permanently increases rod duration, bolt damage, and stronger elemental effects. Rods cycle: ⚡Lightning (longer weaken) → 🔥Fire (longer, faster burn) → 💧Water (stronger, longer slow) → 🌀Wind (heavier knockback) → 🌍Earth (longer stun + heavier knockback).",
  "passive": "Continuously fires +5 damage elemental bolts. Active staff power strengthens every rod effect, and Wind rod boosts own speed and spin while active. Ranged kiting behavior keeps distance from enemies."
};
STACK_THRESHOLD.wizard = 4;
STACK_DISPLAY_THRESHOLD.wizard = 4;
SPHERE_AUDIO.wizard = {
  "weaponCollision": "audio/wizard/weaponCollision.wav",
  "damage": "",
  "ability": "",
  "projectileThrow": "audio/wizard/projectileThrow.wav",
  "projectileHit": "audio/wizard/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
