'use strict';
// ▓▓▓ MODULE: classes/inquisitor.js — Inquisitor sphere kit registry ▓▓▓

DEF.inquisitor = {"label":"Inquisitor","weapon":"Branding Iron","ab":"Heretic's Pyre","color":"#2a0a00","dark":"#150400","rim":"#ff6600","out":"#0a0200","wcol":"#ff4400","wdrk":"#8a2000","mass":9,"spd":221,"hp":509,"om":5,"dmg":4.41,"arm":138,"magDef":45,"rest":0.64,"reach":2.79,"tipR":0.38,"abilityType":"damage","passiveType":"hybrid","wt":"brandingiron"};
CLASS_ROLE.inquisitor = "FIGHTER";
CLASS_DESC.inquisitor = {
  "ability": "Heretic's Pyre (4 stacks) — Ignites a 4s burning aura around the Inquisitor. Enemies inside take heavy DoT every 0.4s. Armor grows by +8 every second the pyre burns — judgment tempers iron.",
  "passive": "Speed is Judgment — damage scales with current movement speed. The faster the Inquisitor moves, the harder the Branding Iron burns. Also leaves scorching heat trails that briefly damage enemies who cross them."
};
STACK_DISPLAY_THRESHOLD.inquisitor = 4;
SPHERE_AUDIO.inquisitor = {
  "weaponCollision": "audio/inquisitor/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
