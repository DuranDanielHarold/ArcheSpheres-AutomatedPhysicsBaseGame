'use strict';
// ▓▓▓ MODULE: classes/glassblower.js — Glassblower sphere kit registry ▓▓▓

DEF.glassblower = {"label":"Glassblower","weapon":"Furnace Pipe","ab":"Kiln Detonation","color":"#ffffff","dark":"#dfefff","rim":"#82f4ff","out":"#d8ffff","bodyAlpha":0.5,"wcol":"#ffb060","wdrk":"#b34818","mass":5,"spd":231.1,"hp":373.5,"om":5.8,"dmg":3.5,"arm":58,"magDef":54,"rest":0.8,"reach":3.6,"tipR":0.1,"abilityType":"damage","passiveType":"hybrid","wt":"blowpipe"};
CLASS_ROLE.glassblower = "MAGE";
CLASS_DESC.glassblower = {
  "ability": "Kiln Detonation (4 stacks) — Detonates all surviving Glass Shards into small splinter bursts. Taking 3 or more shard blasts briefly blinds and reverses enemy spin.",
  "passive": "Glass Litter — Wall bounces and weapon clashes drop fragile Glass Shards. High-speed enemies shatter shards, taking true damage and Bleeding Glass."
};
STACK_THRESHOLD.glassblower = 4;
STACK_DISPLAY_THRESHOLD.glassblower = 4;
SPHERE_AUDIO.glassblower = {
  "weaponCollision": "audio/glassblower/weaponCollision.wav",
  "damage": "audio/glassblower/damage.wav",
  "ability": "audio/glassblower/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
