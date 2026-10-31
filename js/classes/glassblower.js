'use strict';
// ▓▓▓ MODULE: classes/glassblower.js — Glassblower sphere kit registry ▓▓▓

DEF.glassblower = {"label":"Glassblower","weapon":"Furnace Pipe","ab":"Kiln Detonation","color":"#ffffff","dark":"#dfefff","rim":"#82f4ff","out":"#d8ffff","bodyAlpha":0.5,"wcol":"#ffb060","wdrk":"#b34818","mass":5,"spd":231.1,"hp":373.5,"om":5.8,"dmg":3.5,"arm":58,"magDef":54,"rest":0.8,"reach":3.6,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"blowpipe"};
CLASS_ROLE.glassblower = "MAGE";
CLASS_DESC.glassblower = {
  "ability": "Kiln Detonation (4 stacks) — Detonates all surviving Glass Shards for 9 damage each. Three or more shard blasts briefly blind and reverse enemy spin.",
  "passive": "Glass Litter — Wall bounces and weapon hits drop shards (18-shard cap). Enemies moving above 130 speed shatter shards for 12 true damage; each shard blast applies Bleeding Glass for 4s, dealing 2.5 damage per tick."
};
STACK_THRESHOLD.glassblower = 4;
STACK_DISPLAY_THRESHOLD.glassblower = 4;
SPHERE_AUDIO.glassblower = {
  "weaponCollision": "audio/glassblower/weaponCollision.wav",
  "damage": "audio/glassblower/damage.wav",
  "ability": "audio/glassblower/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
