'use strict';
// ▓▓▓ MODULE: classes/alchemist.js — Alchemist sphere kit registry ▓▓▓

DEF.alchemist = {"label":"Alchemist","rangedSphere":true,"weapon":"Vial Sling","ab":"Unstable Concoction","color":"#1a3a1a","dark":"#0a1e0a","rim":"#66ff44","out":"#081008","wcol":"#44cc22","wdrk":"#226610","mass":6,"spd":221,"hp":440,"om":6.5,"dmg":3.7,"arm":90,"magDef":38,"rest":0.7,"reach":2.7,"tipR":0.3,"abilityType":"damage","passiveType":"hybrid","wt":"flasklauncher"};
CLASS_ROLE.alchemist = "MAGE";
CLASS_DESC.alchemist = {
  "ability": "Unstable Concoction (4 stacks) — Lobs a glass flask in an arc toward the enemy. Shatters on floor or enemy contact into a LingeringMiasma zone lasting 4.5s. Every 0.50s inside the zone, enemies are randomly: Slowed (55% velocity drain), ArmorMelted (−8 ARM), or Burned (2s DoT).",
  "passive": "Catalytic Corrosion — Every melee strike from the Vial Sling applies a Corrosion stack (max 6). Each stack strips 5 ARM from the target for 4s, resetting on each new hit. At 6 stacks the enemy's armor is completely dissolved."
};
STACK_THRESHOLD.alchemist = 4;
STACK_DISPLAY_THRESHOLD.alchemist = 4;
SPHERE_AUDIO.alchemist = {
  "weaponCollision": "audio/alchemist/weaponCollision.wav",
  "damage": "audio/alchemist/damage.wav",
  "ability": "audio/alchemist/ability.wav",
  "projectileThrow": "audio/alchemist/projectileThrow.wav",
  "projectileHit": "audio/alchemist/projectileHit.wav"
};
// Class-specific constructor, ability, passive, hit, damage, and overlay handlers live in this registry file when extracted from core Sphere/combat machinery.
