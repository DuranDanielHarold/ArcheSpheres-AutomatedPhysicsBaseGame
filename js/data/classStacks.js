'use strict';
// ▓▓▓ MODULE: data/classStacks.js — extracted from former js/data.js ▓▓▓
// Stack thresholds and display threshold helpers.

const STACK_THRESHOLD = {
  trickster: 2,
  sheriff: 2,
  vampire: 6,
  wizard: 4,
  ranger: 4,
  priest: 8,
  samurai: 3,
  barbarian: 3,
  rogue: 3,
  templar: 3,
  druid: 3,
  necromancer: 3,
  alchemist: 3,
  dragoon: 3,
  bard: 3,
  plague: 3,
  tidecaller: 3,
  viking: 4,
  crusader: 3,
  mimic: 3,
  stormbringer: 3,
  voidwalker: 3,
  whelpling: 3,
  gravedigger: 4,
  flagellant: 3,
  ratcatcher: 3,
  locksmith: 3,
  glassblower: 4,
  witch: 3, spartan: 3, gladiator: 3, king: 4, queen: 6, prince: 4, fairy: 4, beastmaster: 4, sage: 3, arcanist: 3,
};
function getStackThreshold(key){
  return STACK_THRESHOLD[key] ?? 5;
}
const STACK_DISPLAY_THRESHOLD = Object.assign({}, STACK_THRESHOLD, {
  guardian: 2,
  pirate: 3,
  jester: 3,
  golem: 3,
  phoenix: 3,
  inquisitor: 4,
  monk: 3,
});
function getStackDisplayThreshold(key){
  return STACK_DISPLAY_THRESHOLD[key] ?? getStackThreshold(key);
}
// ▓▓▓ END:DATA ▓▓▓
