'use strict';
// ▓▓▓ MODULE: classes/bard.js — Bard sphere kit registry ▓▓▓

DEF.bard = {"label":"Bard","rangedSphere":true,"weapon":"Lute","ab":"Crescendo Blast","color":"#1a3a6e","dark":"#0d1f40","rim":"#f0c040","out":"#080e20","wcol":"#e040fb","wdrk":"#9c27b0","mass":5,"spd":226,"hp":399,"om":6,"dmg":3.87,"arm":65,"magDef":50,"rest":0.76,"reach":2.6,"tipR":0.18,"abilityType":"damage","passiveType":"hybrid","wt":"lute"};
CLASS_ROLE.bard = "SUPPORT";
CLASS_DESC.bard = {
  "ability": "Crescendo Blast (3 stacks) — Fires a +2 damage SonicProjectile that accelerates with every wall bounce (×1.3 speed per bounce, capped at 1100). On enemy hit: minimal magic damage but a massive knockback force (300 + 120 per bounce). More bounces = more devastation.",
  "passive": "Discordant Echo — Every standard +2 damage lute shot plants a larger, longer-lived NoiseTrap (♩) at the Bard's feet (3.5s CD). The trap lasts 5s. When an enemy steps on it: spin (ω) is instantly zeroed for 2s (disabling melee threat). If the enemy is ranged, their fire rate is also slowed to 35% for 3s (SILENCED!). Kites away from melee."
};
STACK_THRESHOLD.bard = 3;
STACK_DISPLAY_THRESHOLD.bard = 3;
SPHERE_AUDIO.bard = {
  "weaponCollision": "audio/bard/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
