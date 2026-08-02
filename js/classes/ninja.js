'use strict';
// ▓▓▓ MODULE: classes/ninja.js — Ninja sphere kit registry ▓▓▓

DEF.ninja = {"label":"Ninja","weapon":"Kusarigama","ab":"Blink Strike","color":"#1a1a2e","dark":"#0d0d1a","rim":"#9b59b6","out":"#050510","wcol":"#9b59b6","wdrk":"#6c3483","mass":4,"spd":321,"hp":394,"om":10,"dmg":2.04,"arm":60,"magDef":30,"rest":0.84,"reach":3.74,"tipR":0.2,"abilityType":"utility","passiveType":"hybrid","wt":"kusarigama"};
CLASS_ROLE.ninja = "ASSASSIN";
CLASS_DESC.ninja = {
  "ability": "Blink Strike (5 stacks) — Teleports instantly behind the enemy with a burst of particles.",
  "passive": "Shadow Step — On wall bounce (3s CD), fires 2 shurikens (3- or 4-pointed, random) toward the enemy and briefly becomes untargetable for 0.35s. Purple dashed ring marks the active dodge window."
};
SPHERE_AUDIO.ninja = {
  "weaponCollision": "audio/ninja/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
