'use strict';
// ▓▓▓ MODULE: data/audioConfig.js — extracted from former js/data.js ▓▓▓
// Audio paths, voice priorities, limits, and per-slot tuning.

const ARENA_AUDIO = {
  bgm: 'audio/arena/bgm.wav',
};

const AUDIO_SETTINGS_DEFAULTS = {
  masterVolume: 1.0,
  sfxVolume: 0.85,
  bgmVolume: 0.45,
  muted: false,
};

const AUDIO_PRIORITY = {
  ability: 100,
  damage: 70,
  weaponCollision: 60,
  projectileHit: 50,
  projectileThrow: 30,
};

const AUDIO_VOICE_LIMITS = {
  total: 24,
  perSlot: {
    ability: 8,
    damage: 8,
    weaponCollision: 8,
    projectileHit: 8,
    projectileThrow: 4,
  },
};

const AUDIO_TUNING = {
  default: {
    weaponCollision: { volume: 0.72, rate: 1, minInterval: 0 },
    damage: { volume: 0.65, rate: 1, minInterval: 0 },
    ability: { volume: 0.70, rate: 1, minInterval: 0 },
    projectileThrow: { volume: 0.32, rate: 1, minInterval: 0.14 },
    projectileHit: { volume: 0.68, rate: 1, minInterval: 0 },
  },
  ranger: {
    projectileThrow: { volume: 0.18, rate: 1, minInterval: 0.28 },
  },
  prince: {
    projectileThrow: { volume: 0.2, rate: 1, minInterval: 0.28 },
  },
  arena: {
    bgm: { volume: 0.45, rate: 1, minInterval: 0 },
  },
};
