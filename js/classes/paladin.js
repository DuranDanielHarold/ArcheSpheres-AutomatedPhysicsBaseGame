'use strict';
// ▓▓▓ MODULE: classes/paladin.js — Paladin sphere kit registry ▓▓▓

DEF.paladin = {"label":"Paladin","weapon":"Holy Morningstar","ab":"Sacred Wrath","color":"#c0900a","dark":"#806000","rim":"#f0c040","out":"#503800","wcol":"#f0e090","wdrk":"#c0a040","mass":9,"spd":212,"hp":520,"om":4.3,"dmg":3.77,"arm":172,"magDef":54,"rest":0.62,"reach":2.8,"tipR":0.4,"abilityType":"hybrid","passiveType":"hybrid","wt":"morningstar"};
CLASS_ROLE.paladin = "TANK";
CLASS_DESC.paladin = {
  "ability": "Sacred Wrath (5 stacks) — 5s aura dealing 5 dmg/sec to nearby enemies with 1.4× weapon damage. After expiry, briefly slowed to 75% speed for 0.5s.",
  "passive": "550 HP. Holy pulse every 3s: heals 8 HP, fires a 12-damage radial blast, and builds a stack toward Sacred Wrath."
};
SPHERE_AUDIO.paladin = {
  "weaponCollision": "audio/paladin/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
