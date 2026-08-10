'use strict';
// ▓▓▓ MODULE: classes/whelpling.js — Whelpling sphere kit registry ▓▓▓

DEF.whelpling = {"label":"Whelpling","weapon":"Dragon Bite","ab":"Firebreath","color":"#5a1010","dark":"#2a0808","rim":"#ff6600","out":"#1a0400","wcol":"#ff6600","wdrk":"#cc2200","mass":8,"spd":229.27,"hp":527.71,"om":5,"dmg":5.35,"arm":103,"magDef":35,"rest":0.62,"reach":2.25,"tipR":0.5,"abilityType":"damage","passiveType":"hybrid","wt":"dragonbite"};
CLASS_ROLE.whelpling = "FIGHTER";
CLASS_DESC.whelpling = {
  "ability": "Firebreath (3 stacks) — Sprays a cone of fire forward (3 flames) that lingers as a burning zone for 5s and grows slightly wider with each Growing Menace stack. Enemies inside take 2 true dmg/tick (once per 0.5s, no zone stacking) and gain faster Burning that ticks every 0.75s.",
  "passive": "Growing Menace — Every 4 seconds, the Whelpling's mass, radius, and max HP all grow slightly (+1 mass, +2 radius, +15 maxHP) — becoming harder and harder to launch."
};
STACK_THRESHOLD.whelpling = 3;
STACK_DISPLAY_THRESHOLD.whelpling = 3;
SPHERE_AUDIO.whelpling = {
  "weaponCollision": "audio/whelpling/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
