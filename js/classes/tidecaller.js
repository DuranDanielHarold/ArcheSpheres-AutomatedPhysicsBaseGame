'use strict';
// ▓▓▓ MODULE: classes/tidecaller.js — Tidecaller sphere kit registry ▓▓▓

DEF.tidecaller = {"label":"Tidecaller","rangedSphere":true,"weapon":"Water Whip","ab":"Riptide","color":"#0a2a4a","dark":"#04101e","rim":"#44ccff","out":"#020810","wcol":"#44ccff","wdrk":"#0066aa","mass":5.5,"spd":245,"hp":431,"om":6.5,"dmg":3.93,"arm":80,"magDef":49,"rest":0.72,"reach":3.92,"tipR":0.15,"abilityType":"damage","passiveType":"hybrid","wt":"waterwhip"};
CLASS_ROLE.tidecaller = "MAGE";
CLASS_DESC.tidecaller = {
  "ability": "Riptide (3 stacks) — Fires a water bolt that yanks the enemy violently toward the nearest wall. Wall impact deals bonus damage scaled by the speed of impact.",
  "passive": "Tidal Momentum — Movement speed scales by 1.4× near walls (within 60px) and 0.85× near the arena center. Favors the edges."
};
STACK_THRESHOLD.tidecaller = 3;
STACK_DISPLAY_THRESHOLD.tidecaller = 3;
SPHERE_AUDIO.tidecaller = {
  "weaponCollision": "audio/tidecaller/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
