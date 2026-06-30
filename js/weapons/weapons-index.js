'use strict';
// ▓▓▓ MODULE: weapons/weapons-index.js — extracted from former js/weapons.js ▓▓▓
// Reconstructs the global WEAPONS map from grouped weapon render files.

const WEAPONS = Object.assign({}, MELEE_WEAPONS, RANGED_WEAPONS, EXOTIC_WEAPONS);
