'use strict';
// ▓▓▓ MODULE: classes/arcanist.js — Arcanist sphere kit registry ▓▓▓

DEF.arcanist = {"label":"Arcanist","rangedSphere":true,"weapon":"Arcane Cannon","ab":"Overload","color":"#78d8ff","dark":"#1d6b92","rim":"#e8fbff","out":"#083044","wcol":"#e8fbff","wdrk":"#3388bb","mass":5,"spd":190,"hp":490.8,"om":4.2,"dmg":9.3,"arm":70,"magDef":68,"rest":0.7,"reach":3.4,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"arcanecannon"};
CLASS_ROLE.arcanist = "MAGE";
CLASS_DESC.arcanist = {
  "ability": "Overload (3 stacks) — For 4s shells fly faster, explode wider, and leave longer burn zones. Normal Shell blast radius is 2.1× sphere radius; burn zones last 3s (6s while Overloaded) and deal 4 magic damage every 0.5s.",
  "passive": "Volatile Charge — Charge builds 1.5× faster while avoiding damage. Taking damage removes only 50% of stored charge and knocks Arcanist back. At full charge the next shell detonates at the enemy position."
};
STACK_THRESHOLD.arcanist = 3;
STACK_DISPLAY_THRESHOLD.arcanist = 3;
SPHERE_AUDIO.arcanist = {
  "weaponCollision": "audio/arcanist/weaponCollision.wav",
  "damage": "audio/arcanist/damage.wav",
  "ability": "audio/arcanist/ability.wav",
  "projectileThrow": "audio/arcanist/projectileThrow.wav",
  "projectileHit": "audio/arcanist/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
