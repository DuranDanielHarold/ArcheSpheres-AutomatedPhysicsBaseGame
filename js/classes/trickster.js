'use strict';
// ▓▓▓ MODULE: classes/trickster.js — Trickster sphere kit registry ▓▓▓

DEF.trickster = {"label":"Trickster","weapon":"Illusory Blade","ab":"Phase Out","color":"#00bcd4","dark":"#006064","rim":"#e0f7fa","out":"#002025","wcol":"#e0f7fa","wdrk":"#80deea","mass":5,"spd":255,"hp":365,"om":9,"dmg":2.9,"arm":70,"magDef":35,"rest":0.8,"reach":3.3,"tipR":0.2,"abilityType":"utility","passiveType":"hybrid","wt":"illusoryblade"};
CLASS_ROLE.trickster = "ASSASSIN";
CLASS_DESC.trickster = {
  "ability": "Phase Out (3 stacks) - Turns semi-transparent, reverses direction at 1.25x speed, and gains 0.35s invincibility. After Phase Out ends, leaves a fragile 1 HP replica with no ARM/MDEF that can damage enemies, then vanishes when it hits or takes damage.",
  "passive": "Mirror Break - The first time Trickster falls below 30% HP, creates an 60% stat replica of its current combat state. Replicas can fight, but cannot trigger abilities, passives, or further clones."
};
STACK_THRESHOLD.trickster = 3;
STACK_DISPLAY_THRESHOLD.trickster = 3;
SPHERE_AUDIO.trickster = {
  "weaponCollision": "audio/trickster/weaponCollision.wav",
  "damage": "audio/trickster/damage.wav",
  "ability": "audio/trickster/ability.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
