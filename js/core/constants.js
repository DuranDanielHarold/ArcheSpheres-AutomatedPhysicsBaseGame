'use strict';
// ▓▓▓ MODULE: core/constants.js — extracted from former js/data.js and js/entities.js ▓▓▓
// Shared physics, burn timing, and ranged-class constants.

const GRAVITY_BASE=200;
let GRAVITY=GRAVITY_BASE;
function royaleResetGravity(){GRAVITY=GRAVITY_BASE;}
function royaleSetGravity(mult){if(Number.isFinite(mult))GRAVITY=GRAVITY_BASE*mult;}
const WALL_REST = 1.30;
const DEFAULT_BURN_TICK_INTERVAL=1.5;
const WHELPLING_BURN_TICK_INTERVAL=0.75;
const RANGED_KEYS = new Set(['ranger','wizard','necromancer','sheriff','priest','bard','witch','fairy','sage','arcanist']);
