'use strict';
// ▓▓▓ MODULE: core/class-registry.js — shared sphere class registries ▓▓▓
// Classic-script registries populated by js/classes/<key>.js files.
// Keep phases separate so pre-application modifiers and post-application
// landed effects preserve existing combat timing.

const DEF = {};
const CLASS_ROLE = {};
const CLASS_DESC = {};
const ROLE_COLOR = {
  TANK:'#6080a8',
  FIGHTER:'#c07838',
  ASSASSIN:'#9b59b6',
  MAGE:'#8844cc',
  MARKSMAN:'#2a8a8a',
  SUPPORT:'#c8a000'
};
const STACK_THRESHOLD = {};
const STACK_DISPLAY_THRESHOLD = {};
const SPHERE_AUDIO = {};
const INIT_HANDLERS = {};
const ABILITY_HANDLERS = {};
const PASSIVE_HANDLERS = {};
const ON_HIT_DEALT_MODIFIERS = {};
const ON_HIT_TAKEN_MODIFIERS = {};
const ON_HIT_LANDED = {};
const ON_CLASH_HANDLERS = {};
const DAMAGE_TAKEN_MODIFIERS = {};
const DRAW_OVERLAY_HANDLERS = {};

function getStackThreshold(key){
  return STACK_THRESHOLD[key] ?? 5;
}
function getStackDisplayThreshold(key){
  return STACK_DISPLAY_THRESHOLD[key] ?? getStackThreshold(key);
}
// ▓▓▓ END:CORE ▓▓▓
