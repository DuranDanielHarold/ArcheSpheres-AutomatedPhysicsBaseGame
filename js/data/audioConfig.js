'use strict';
// ▓▓▓ MODULE: data/audioConfig.js — extracted from former js/data.js ▓▓▓
// Sphere and arena audio path and volume configuration.

const ARENA_AUDIO = {
  bgm: '', // add audio file path here, example: 'audio/arena/bgm.wav'
};

const AUDIO_SETTINGS_DEFAULTS = {
  masterVolume: 1.0,
  sfxVolume: 0.85,
  bgmVolume: 0.45,
  muted: false,
};

const AUDIO_VOLUMES = {
  default: {
    weaponCollision: 0.72,
    damage: 0.65,
    ability: 0.70,
    projectileThrow: 0.32,
    projectileHit: 0.68,
  },
  arena: {
    bgm: 0.45,
  },
};

