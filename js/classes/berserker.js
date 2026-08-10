'use strict';
// ▓▓▓ MODULE: classes/berserker.js — Berserker sphere kit registry ▓▓▓

DEF.berserker = {"label":"Berserker","weapon":"Blood Maul","ab":"Orbit Frenzy","color":"#8b0000","dark":"#5a0000","rim":"#ff4444","out":"#3a0000","wcol":"#cc2200","wdrk":"#880000","mass":9,"spd":189.64,"hp":440.64,"om":7,"dmg":4.33,"arm":45,"magDef":25,"rest":0.8,"reach":2.35,"tipR":0.55,"abilityType":"hybrid","passiveType":"hybrid","wt":"maul"};
DEF.berserker = {"label":"Berserker","weapon":"Blood Maul","ab":"Orbit Frenzy","color":"#8b0000","dark":"#5a0000","rim":"#ff4444","out":"#3a0000","wcol":"#cc2200","wdrk":"#880000","mass":9,"spd":191.07,"hp":443.97,"om":7,"dmg":4.38,"arm":45,"magDef":25,"rest":0.8,"reach":2.36,"tipR":0.55,"abilityType":"hybrid","passiveType":"hybrid","wt":"maul"};
CLASS_ROLE.berserker = "FIGHTER";
CLASS_DESC.berserker = {
  "ability": "Orbit Frenzy (5 stacks) — Locks onto enemy and orbits at 3× speed for 2.5s with 1.1× damage boost.",
  "passive": "Iron Will — When HP drops below 40%, automatically triggers 0.8s of full knockback immunity (red pulsing shield). 6s cooldown. Lets the Berserker keep swinging at death's door instead of being launched away."
};
SPHERE_AUDIO.berserker = {
  "weaponCollision": "audio/berserker/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
