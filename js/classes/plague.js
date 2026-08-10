'use strict';
// ▓▓▓ MODULE: classes/plague.js — Plague Doc sphere kit registry ▓▓▓

DEF.plague = {"label":"Plague Doc","weapon":"Syringe","ab":"Virulence Inject","color":"#2a3a1a","dark":"#141e0a","rim":"#aadd44","out":"#080e04","wcol":"#ccdd88","wdrk":"#668800","mass":6,"spd":210,"hp":532.55,"om":5.5,"dmg":3.89,"arm":90,"magDef":42.71,"rest":0.68,"reach":3.83,"tipR":0.08,"abilityType":"hybrid","passiveType":"hybrid","wt":"syringe"};
CLASS_ROLE.plague = "MAGE";
CLASS_DESC.plague = {
  "ability": "Virulence Inject (3 stacks) — Injects a Virulence stack into the enemy. Each hit on a wall by a Virulently infected enemy leaves a permanent Toxic Smear for the rest of the match, dealing DoT to anyone passing through it.",
  "passive": "Sepsis — Weapon hits on the same enemy build a counter, resetting when switching targets. At 5 hits, the enemy bursts, takes DoT totaling 8% of current HP, and becomes Weakened to take +15% damage for 5s. The counter then resets."
};
STACK_THRESHOLD.plague = 3;
STACK_DISPLAY_THRESHOLD.plague = 3;
SPHERE_AUDIO.plague = {
  "weaponCollision": "audio/plague/weaponCollision.wav",
  "damage": "",
  "ability": ""
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
