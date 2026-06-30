'use strict';
// ▓▓▓ MODULE: data/audioConfig.js — extracted from former js/data.js ▓▓▓
// Sphere and arena audio path and volume configuration.

const SPHERE_AUDIO = {
  knight: {
    weaponCollision: 'audio/knight/weaponCollision.wav', // already added by you
    damage: '', // add audio file path here, example: 'audio/knight/damage.wav'
    ability: '', // add audio file path here, example: 'audio/knight/ability.wav'
  },
  samurai: {
    weaponCollision: 'audio/samurai/weaponCollision.wav', // already added by you
    damage: '', // add audio file path here, example: 'audio/samurai/damage.wav'
    ability: '', // add audio file path here, example: 'audio/samurai/ability.wav'
  },
  viking: {
    weaponCollision: 'audio/viking/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  barbarian: {
    weaponCollision: 'audio/barbarian/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  paladin: {
    weaponCollision: 'audio/paladin/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  ninja: {
    weaponCollision: 'audio/ninja/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  wizard: {
    weaponCollision: 'audio/wizard/weaponCollision.wav', // wizard melee weapon clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
    projectileThrow: 'audio/wizard/projectileThrow.wav', // wizard projectile cast audio
    projectileHit: 'audio/wizard/projectileHit.wav', // wizard projectile hit audio
  },
  berserker: {
    weaponCollision: 'audio/berserker/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  ranger: {
    weaponCollision: 'audio/ranger/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  templar: {
    weaponCollision: 'audio/templar/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  rogue: {
    weaponCollision: 'audio/rogue/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  warlord: {
    weaponCollision: 'audio/warlord/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  druid: {
    weaponCollision: 'audio/druid/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  necromancer: {
    weaponCollision: 'audio/necromancer/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  pirate: {
    weaponCollision: 'audio/pirate/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  jester: {
    weaponCollision: 'audio/jester/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  golem: {
    weaponCollision: 'audio/golem/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  phoenix: {
    weaponCollision: 'audio/phoenix/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  guardian: {
    weaponCollision: 'audio/guardian/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  trickster: {
    weaponCollision: 'audio/trickster/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  sheriff: {
    weaponCollision: 'audio/sheriff/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  priest: {
    weaponCollision: 'audio/priest/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  inquisitor: {
    weaponCollision: 'audio/inquisitor/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  vampire: {
    weaponCollision: 'audio/vampire/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  monk: {
    weaponCollision: 'audio/monk/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  alchemist: {
    weaponCollision: 'audio/alchemist/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  dragoon: {
    weaponCollision: 'audio/dragoon/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  bard: {
    weaponCollision: 'audio/bard/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  plague: {
    weaponCollision: 'audio/plague/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  tidecaller: {
    weaponCollision: 'audio/tidecaller/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  crusader: {
    weaponCollision: 'audio/crusader/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  mimic: {
    weaponCollision: 'audio/mimic/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  stormbringer: {
    weaponCollision: 'audio/stormbringer/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  voidwalker: {
    weaponCollision: 'audio/voidwalker/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  whelpling: {
    weaponCollision: 'audio/whelpling/weaponCollision.wav', // shared clash audio
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  gravedigger: {
    weaponCollision: '', // add audio file path here
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  flagellant: {
    weaponCollision: '', // add audio file path here
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  ratcatcher: {
    weaponCollision: '', // add audio file path here
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  locksmith: {
    weaponCollision: '', // add audio file path here
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  glassblower: {
    weaponCollision: '', // add audio file path here
    damage: '', // add audio file path here
    ability: '', // add audio file path here
  },
  witch: {weaponCollision: '', damage: '', ability: ''},
  spartan: {weaponCollision: '', damage: '', ability: ''},
  gladiator: {weaponCollision: '', damage: '', ability: ''},
  king: {weaponCollision: '', damage: '', ability: ''},
  queen: {weaponCollision: '', damage: '', ability: ''},
  prince: {weaponCollision: '', damage: '', ability: ''},
  fairy: {weaponCollision: '', damage: '', ability: ''},
  beastmaster: {weaponCollision: '', damage: '', ability: ''},
  sage: {weaponCollision: '', damage: '', ability: ''},
  arcanist: {weaponCollision: '', damage: '', ability: ''},
};

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
  knight: {
    weaponCollision: 0.72,
  },
  samurai: {
    weaponCollision: 0.72,
  },
  wizard: {
    weaponCollision: 0.60,
    projectileThrow: 0.10,
    projectileHit: 0.68,
  },
  arena: {
    bgm: 0.45,
  },
};

