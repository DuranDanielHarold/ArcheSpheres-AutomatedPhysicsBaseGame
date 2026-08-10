'use strict';
// ▓▓▓ MODULE: classes/king.js — King sphere kit registry ▓▓▓

DEF.king = {"label":"King","weapon":"Royal Scepter","ab":"Iron Fist Rage","color":"#d00020","dark":"#66000d","rim":"#ffd35a","out":"#2a0006","wcol":"#ffd35a","wdrk":"#8a5a10","mass":18,"spd":165,"hp":600,"om":3.5,"dmg":6.04,"arm":161,"magDef":51,"rest":0.5,"reach":2.8,"tipR":0.52,"abilityType":"damage","passiveType":"hybrid","wt":"royalscepter"};
CLASS_ROLE.king = "TANK";
CLASS_DESC.king = {
  "ability": "Iron Fist Rage (4 stacks) — Enters a 6s bright rage aura with 1.6× damage and boosted spin, then summons 3 randomized Barbarian Allies that obey normal arena gravity and do not chase. Allies hit harder inside the aura and last 10s.",
  "passive": "Sovereign Weight — Collision wins permanently add ARM and DMG up to a match cap, shown as crown pips."
};
STACK_THRESHOLD.king = 4;
STACK_DISPLAY_THRESHOLD.king = 4;
SPHERE_AUDIO.king = {
  "weaponCollision": "",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
