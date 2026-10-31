'use strict';
// ▓▓▓ MODULE: classes/bard.js — Bard sphere kit registry ▓▓▓

DEF.bard = {"label":"Bard","rangedSphere":true,"weapon":"Lute","ab":"Crescendo Blast","color":"#1a3a6e","dark":"#0d1f40","rim":"#f0c040","out":"#080e20","wcol":"#e040fb","wdrk":"#9c27b0","mass":5,"spd":226,"hp":407.6,"om":6,"dmg":3.9,"arm":65,"magDef":50,"rest":0.8,"reach":2.6,"tipR":0.2,"abilityType":"damage","passiveType":"hybrid","wt":"lute"};
CLASS_ROLE.bard = "SUPPORT";
CLASS_DESC.bard = {
  "ability": "Crescendo Blast (3 stacks) — Fires a +4 damage SonicProjectile. Each wall bounce multiplies damage by (1 + 0.15 × bounce count); speed rises by 1.3× per bounce up to 1100, and hit knockback is 300 + 120 per bounce.",
  "passive": "Discordant Echo — Every standard +4 damage lute shot plants a NoiseTrap at the Bard's feet (3.5s CD). The trap lasts 5s. On trigger it suppresses spin for 2s and slows ranged fire rate to 35% for 3s. Kites away from melee."
};
STACK_THRESHOLD.bard = 3;
STACK_DISPLAY_THRESHOLD.bard = 3;
SPHERE_AUDIO.bard = {
  "weaponCollision": "audio/bard/weaponCollision.wav",
  "damage": "audio/bard/damage.wav",
  "ability": "audio/bard/ability.wav",
  "projectileThrow": "audio/bard/projectileThrow.wav",
  "projectileHit": "audio/bard/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
