'use strict';

// ▓▓▓ SECTION:DATA — Edit here to add/change classes, stats, descriptions ▓▓▓

const GRAVITY   = 200;
const WALL_REST = 1.30;

const DEF = {
  knight:     {label:'Knight',    weapon:'Broadsword',      ab:'Shield Bubble',   color:'#b0bec8',dark:'#506878',rim:'#d8eaf8',out:'#334455',wcol:'#d0dce8',wdrk:'#88a0b0', mass:12,  spd:210, hp:500, om:4.8, dmg:3.2, arm:152, magDef:38, rest:.62, reach:3.2, tipR:0.22, wt:'broadsword'},
  samurai:    {label:'Samurai',   weapon:'Nodachi',         ab:'Spiral Rush',     color:'#5a0f18',dark:'#320008',rim:'#8a1f28',out:'#200008',wcol:'#c8c0a8',wdrk:'#807050', mass:5.5, spd:268, hp:500, om:7.0, dmg:2.5, arm:88,  magDef:32, rest:.75, reach:4.3, tipR:0.16, wt:'nodachi'},
  viking:     {label:'Viking',    weapon:'Battle Axe',      ab:'Rage Spin',       color:'#3a5070',dark:'#1a2a40',rim:'#6080a8',out:'#102030',wcol:'#c8a030',wdrk:'#886010', mass:8.5, spd:220, hp:500, om:4.8, dmg:4.8, arm:120, magDef:35, rest:.66, reach:2.6, tipR:0.45, wt:'battleaxe'},
  barbarian:  {label:'Barbarian', weapon:'Skull Flail',     ab:'Ram Charge',      color:'#7a2800',dark:'#400c00',rim:'#b04010',out:'#280800',wcol:'#c0c0c0',wdrk:'#808080', mass:13,  spd:244, hp:500, om:6.0, dmg:5.5, arm:80,  magDef:28, rest:.78, reach:3.0, tipR:0.35, wt:'flail'},
  paladin:    {label:'Paladin',   weapon:'Holy Morningstar',ab:'Sacred Wrath',    color:'#c0900a',dark:'#806000',rim:'#f0c040',out:'#503800',wcol:'#f0e090',wdrk:'#c0a040', mass:9,   spd:212, hp:550, om:4.3, dmg:3.8, arm:180, magDef:55, rest:.62, reach:2.8, tipR:0.40, wt:'morningstar'},
  ninja:      {label:'Ninja',     weapon:'Kusarigama',      ab:'Blink Strike',    color:'#1a1a2e',dark:'#0d0d1a',rim:'#9b59b6',out:'#050510',wcol:'#9b59b6',wdrk:'#6c3483', mass:4,   spd:310, hp:380, om:10.0,dmg:2.0, arm:60,  magDef:30, rest:.84, reach:3.7, tipR:0.20, wt:'kusarigama'},
  wizard:     {label:'Wizard',    weapon:'Arcane Orb',      ab:'Rod Cycle',       color:'#4a0080',dark:'#2a0050',rim:'#cc88ff',out:'#1a0030',wcol:'#cc88ff',wdrk:'#884499', mass:5,   spd:180, hp:420, om:4.7, dmg:6.0, arm:70,  magDef:60, rest:.72, reach:2.8, tipR:0.30, wt:'orbstaff'},
  berserker:  {label:'Berserker', weapon:'Blood Maul',      ab:'Orbit Frenzy',    color:'#8b0000',dark:'#5a0000',rim:'#ff4444',out:'#3a0000',wcol:'#cc2200',wdrk:'#880000', mass:9,   spd:195, hp:450, om:7.0, dmg:4.5, arm:45,  magDef:25, rest:.80, reach:2.4, tipR:0.55, wt:'maul'},
  ranger:     {label:'Ranger',    weapon:'Longbow',         ab:'Volley Shot',     color:'#2d5a1b',dark:'#1a3610',rim:'#88cc44',out:'#0f1f0a',wcol:'#88cc44',wdrk:'#557733', mass:6,   spd:216, hp:440, om:5.0, dmg:5.5, arm:90,  magDef:33, rest:.72, reach:3.2, tipR:0.12, wt:'longbow'},
  templar:    {label:'Templar',   weapon:'Sacred Warhammer',ab:'Slow Field',      color:'#daa520',dark:'#b8860b',rim:'#ffe680',out:'#8b6914',wcol:'#ffe680',wdrk:'#ccaa00', mass:9,   spd:196, hp:380, om:4.1, dmg:3.2, arm:100, magDef:28, rest:.52, reach:2.2, tipR:0.48, wt:'warhammer'},
  rogue:      {label:'Rogue',     weapon:'Twin Daggers',    ab:'Backstab',        color:'#2c3e50',dark:'#1a252f',rim:'#e74c3c',out:'#0d1117',wcol:'#e74c3c',wdrk:'#c0392b', mass:4.5, spd:290, hp:360, om:10.5,dmg:2.8, arm:55,  magDef:28, rest:.82, reach:1.6, tipR:0.22, wt:'daggers'},
  warlord:    {label:'Warlord',   weapon:'Doom Halberd',    ab:'Earthquake',      color:'#5d4037',dark:'#3e2723',rim:'#ff8a65',out:'#1c0d0a',wcol:'#ff8a65',wdrk:'#d4622f', mass:16,  spd:200, hp:580, om:4.5, dmg:8.0, arm:140, magDef:40, rest:.56, reach:3.4, tipR:0.28, wt:'halberd'},
  druid:      {label:'Druid',     weapon:'Thornwhip',       ab:'Thorn Patch',     color:'#1b5e20',dark:'#0d3310',rim:'#69f0ae',out:'#081a08',wcol:'#69f0ae',wdrk:'#2e7d32', mass:7,   spd:192, hp:480, om:4.7, dmg:3.8, arm:130, magDef:45, rest:.64, reach:3.9, tipR:0.20, wt:'thornwhip'},
  necromancer:{label:'Necro',     weapon:'Soul Scythe',     ab:'Death Mark',      color:'#1a0a2e',dark:'#0d0518',rim:'#7c4dff',out:'#080310',wcol:'#7c4dff',wdrk:'#512da8', mass:6,   spd:196, hp:450, om:5.5, dmg:6.2, arm:85,  magDef:55, rest:.70, reach:4.1, tipR:0.24, wt:'scythe'},
  pirate:     {label:'Pirate',    weapon:'Cutlass',         ab:'Boarding Action', color:'#3e2723',dark:'#1c1008',rim:'#ff7043',out:'#120a04',wcol:'#ffcc02',wdrk:'#e6a800', mass:7.5, spd:240, hp:520, om:8.0, dmg:4.4, arm:95,  magDef:30, rest:.74, reach:2.9, tipR:0.24, wt:'cutlass'},
  jester:     {label:'Jester',    weapon:'Jingle Flail',    ab:'Chaos Lurch',     color:'#e91e63',dark:'#880e4f',rim:'#ffd740',out:'#4a0025',wcol:'#ffd740',wdrk:'#c8a000', mass:5,   spd:256, hp:400, om:13.0,dmg:3.5, arm:65,  magDef:28, rest:.86, reach:2.6, tipR:0.28, wt:'jingleflail'},
  golem:      {label:'Golem',     weapon:'Stone Slab',      ab:'Fortify',         color:'#607d8b',dark:'#37474f',rim:'#b0bec5',out:'#1c2a30',wcol:'#b0bec5',wdrk:'#78909c', mass:14,  spd:155, hp:530, om:3.3, dmg:7.5, arm:140, magDef:30, rest:.42, reach:1.9, tipR:0.65, wt:'stoneslab'},
  phoenix:    {label:'Phoenix',   weapon:'Ashwing Talons',  ab:'Cinder Wing',     color:'#e65100',dark:'#bf360c',rim:'#ffcc02',out:'#6d1900',wcol:'#ffcc02',wdrk:'#f9a825', mass:6.5, spd:252, hp:420, om:7.5, dmg:4.5, arm:85,  magDef:42, rest:.76, reach:3.1, tipR:0.30, wt:'talon'},
  guardian:   {label:'Guardian',  weapon:'Tower Shield',    ab:'Phalanx',         color:'#37474f',dark:'#1c272c',rim:'#80cbc4',out:'#0d1214',wcol:'#80cbc4',wdrk:'#00897b', mass:7,   spd:204, hp:370, om:4.6, dmg:4.8, arm:90,  magDef:45, rest:.58, reach:2.0, tipR:0.58, wt:'towershield'},
  trickster:  {label:'Trickster', weapon:'Illusory Blade',  ab:'Phase Out',       color:'#00bcd4',dark:'#006064',rim:'#e0f7fa',out:'#002025',wcol:'#e0f7fa',wdrk:'#80deea', mass:5,   spd:284, hp:390, om:9.0, dmg:3.0, arm:70,  magDef:35, rest:.80, reach:3.3, tipR:0.20, wt:'illusoryblade'},
  sheriff:    {label:'Sheriff',   weapon:'.44 Magnum',      ab:'Bola & Buckshot', color:'#5c4a2a',dark:'#2e2210',rim:'#d4a83a',out:'#1a1008',wcol:'#d4a83a',wdrk:'#8a6010', mass:6,   spd:235, hp:460, om:5.5, dmg:5.0, arm:88,  magDef:30, rest:.74, reach:3.0, tipR:0.10, wt:'magnum'},
  priest:     {label:'Priest',    weapon:'Holy Censer',     ab:'Benediction',     color:'#e8e0d0',dark:'#b0a898',rim:'#fff8e8',out:'#888070',wcol:'#f0e8c8',wdrk:'#c8b880', mass:6.5, spd:204, hp:470, om:5.0, dmg:4.8, arm:105, magDef:70, rest:.70, reach:3.2, tipR:0.18, wt:'censer'},
  inquisitor: {label:'Inquisitor',weapon:'Branding Iron',   ab:"Heretic's Pyre",  color:'#2a0a00',dark:'#150400',rim:'#ff6600',out:'#0a0200',wcol:'#ff4400',wdrk:'#8a2000', mass:9,   spd:224, hp:520, om:5.0, dmg:4.5, arm:140, magDef:45, rest:.64, reach:2.8, tipR:0.38, wt:'brandingiron'},
  vampire:    {label:'Vampire',   weapon:'Crimson Claws',   ab:'Swarm of the Night',color:'#1a0020',dark:'#0d000f',rim:'#cc0044',out:'#080008',wcol:'#cc0044',wdrk:'#880022', mass:5.5, spd:274, hp:180, om:9.0, dmg:3.8, arm:0,   magDef:0,  rest:.78, reach:2.0, tipR:0.42, wt:'crimsonclaws'},
  monk:       {label:'Monk',      weapon:'Quarterstaff',    ab:'100-Fist Nirvana',  color:'#c8a870',dark:'#7a5a28',rim:'#ffe0a0',out:'#3a2808',wcol:'#ffe0a0',wdrk:'#c8a040', mass:5,   spd:260, hp:360, om:11.0,dmg:1.4, arm:32,  magDef:18, rest:.76, reach:2.9, tipR:0.15, wt:'quarterstaff'},
  alchemist:  {label:'Alchemist', weapon:'Vial Sling',      ab:'Unstable Concoction',color:'#1a3a1a',dark:'#0a1e0a',rim:'#66ff44',out:'#081008',wcol:'#44cc22',wdrk:'#226610', mass:6,   spd:218, hp:440, om:6.5, dmg:3.6, arm:90,  magDef:38, rest:.66, reach:2.6, tipR:0.25, wt:'flasklauncher'},
  dragoon:    {label:'Dragoon',   weapon:'Dragon Lance',    ab:"Wyrm's Descent",    color:'#1a2a3a',dark:'#0d1520',rim:'#4488cc',out:'#060d14',wcol:'#88bbdd',wdrk:'#2255aa', mass:8,   spd:195, hp:520, om:5.0, dmg:3.5, arm:75,  magDef:60, rest:.58, reach:5.5, tipR:0.10, wt:'dragonlance'},
  bard:       {label:'Bard',       weapon:'Lute',            ab:'Crescendo Blast',   color:'#1a3a6e',dark:'#0d1f40',rim:'#f0c040',out:'#080e20',wcol:'#e040fb',wdrk:'#9c27b0', mass:5,   spd:226, hp:400, om:6.0, dmg:3.8, arm:65,  magDef:50, rest:.76, reach:2.6, tipR:0.18, wt:'lute'},
  plague:     {label:'Plague Doc',weapon:'Syringe',         ab:'Virulence Inject',  color:'#2a3a1a',dark:'#141e0a',rim:'#aadd44',out:'#080e04',wcol:'#ccdd88',wdrk:'#668800', mass:6,   spd:210, hp:480, om:5.5, dmg:3.5, arm:90,  magDef:40, rest:.68, reach:3.6, tipR:0.08, wt:'syringe'},
  tidecaller: {label:'Tidecaller',weapon:'Water Whip',      ab:'Riptide',           color:'#0a2a4a',dark:'#04101e',rim:'#44ccff',out:'#020810',wcol:'#44ccff',wdrk:'#0066aa', mass:5.5, spd:242, hp:430, om:6.5, dmg:3.8, arm:80,  magDef:48, rest:.72, reach:3.8, tipR:0.15, wt:'waterwhip'},
  crusader:   {label:'Crusader',  weapon:'Flail+Shield',    ab:'Holy Charge',       color:'#c8b870',dark:'#806020',rim:'#fffacc',out:'#403010',wcol:'#fffacc',wdrk:'#c8a040', mass:11,  spd:205, hp:540, om:4.3, dmg:4.0, arm:165, magDef:52, rest:.58, reach:2.5, tipR:0.40, wt:'flailshield'},
  mimic:      {label:'Mimic',     weapon:'Copycat Blade',   ab:'Perfect Copy',      color:'#2a1a4a',dark:'#14091f',rim:'#cc88ff',out:'#08040f',wcol:'#cc88ff',wdrk:'#664488', mass:5,   spd:248, hp:400, om:7.5, dmg:3.0, arm:70,  magDef:35, rest:.80, reach:2.8, tipR:0.25, wt:'mimicblade'},
  stormbringer:{label:'Stormbrngr',weapon:'Lightning Chain',ab:'Thunderclap',       color:'#1a1a3a',dark:'#0d0d1e',rim:'#88ccff',out:'#050510',wcol:'#88ccff',wdrk:'#2244aa', mass:5.5, spd:255, hp:420, om:8.0, dmg:4.2, arm:75,  magDef:42, rest:.78, reach:2.4, tipR:0.30, wt:'lightningchain'},
  voidwalker: {label:'Void Walker',weapon:'Gravity Spike', ab:'Singularity',        color:'#080808',dark:'#000000',rim:'#aa44ff',out:'#000000',wcol:'#aa44ff',wdrk:'#550088', mass:6,   spd:228, hp:450, om:6.0, dmg:4.5, arm:85,  magDef:50, rest:.70, reach:3.0, tipR:0.20, wt:'gravityspike'},
  whelpling:  {label:'Whelpling', weapon:'Dragon Bite',     ab:'Firebreath',        color:'#5a1010',dark:'#2a0808',rim:'#ff6600',out:'#1a0400',wcol:'#ff6600',wdrk:'#cc2200', mass:8,   spd:222, hp:500, om:5.0, dmg:5.0, arm:100, magDef:35, rest:.62, reach:2.2, tipR:0.50, wt:'dragonbite'},
  gravedigger:{label:'Gravedigger',weapon:'Rusty Shovel',   ab:'Exhume',            color:'#4d6170',dark:'#1d2a31',rim:'#9fc3b3',out:'#0b1518',wcol:'#9a8a72',wdrk:'#5f4b35', mass:10,  spd:198, hp:500, om:3.9, dmg:4.6, arm:115, magDef:34, rest:.58, reach:3.1, tipR:0.42, wt:'rustyshovel'},
  flagellant: {label:'Flagellant', weapon:'Knotted Scourge',ab:'Penitence',         color:'#4a1116',dark:'#210609',rim:'#d8b06a',out:'#120304',wcol:'#c49a62',wdrk:'#6b3020', mass:6,   spd:238, hp:210, om:6.8, dmg:1.2, arm:25,  magDef:18, rest:.78, reach:3.2, tipR:0.18, wt:'knottedscourge'},
  ratcatcher: {label:'Ratcatcher', weapon:'Catching Pole',  ab:'Infestation',       color:'#111111',dark:'#050505',rim:'#b7c06a',out:'#000000',wcol:'#b0a070',wdrk:'#5f5230', mass:5.5, spd:246, hp:410, om:6.2, dmg:3.0, arm:74,  magDef:27, rest:.76, reach:4.4, tipR:0.10, wt:'catchingpole'},
  locksmith:  {label:'Locksmith',  weapon:'Prison Keys',    ab:'Master Key',        color:'#24313a',dark:'#101920',rim:'#d0b45a',out:'#071014',wcol:'#d6c06a',wdrk:'#6a5320', mass:6.5, spd:226, hp:440, om:7.6, dmg:3.4, arm:92,  magDef:42, rest:.72, reach:2.3, tipR:0.30, wt:'keyring'},
  glassblower:{label:'Glassblower',weapon:'Furnace Pipe',   ab:'Kiln Detonation',  color:'#ffffff',dark:'#dfefff',rim:'#82f4ff',out:'#d8ffff',bodyAlpha:.52,wcol:'#ffb060',wdrk:'#b34818', mass:5,   spd:232, hp:390, om:5.8, dmg:3.2, arm:58,  magDef:55, rest:.80, reach:3.7, tipR:0.13, wt:'blowpipe'},
  witch:     {label:'Witch',     weapon:'Hex Staff',       ab:'Hex Converge',    color:'#5b1f86',dark:'#2a0c46',rim:'#d77bff',out:'#12051f',wcol:'#d77bff',wdrk:'#6b2a90', mass:5,   spd:200, hp:420, om:5.2, dmg:6.7, arm:65,  magDef:90, rest:.72, reach:3.1, tipR:0.18, wt:'hexstaff'},
  spartan:   {label:'Spartan',   weapon:'Doru+Aspis',     ab:'Phalanx Thrust', color:'#5b1a16',dark:'#260807',rim:'#d24634',out:'#120302',wcol:'#d8b060',wdrk:'#7a4a20', mass:7,   spd:225, hp:360, om:2.6, dmg:3.4, arm:82,  magDef:20, rest:.58, reach:2.8, tipR:0.18, wt:'doruaspis'},
  gladiator: {label:'Gladiator', weapon:'Gladius+Net',    ab:"Arena's Verdict",color:'#b98152',dark:'#6b3f24',rim:'#f0c08a',out:'#2a1408',wcol:'#d8d0c0',wdrk:'#7a6048', mass:6,   spd:255, hp:240, om:6.5, dmg:4.8, arm:75,  magDef:28, rest:.78, reach:2.2, tipR:0.26, wt:'gladiusnet'},
  king:      {label:'King',      weapon:'Royal Scepter',  ab:'Iron Fist Rage',    color:'#d00020',dark:'#66000d',rim:'#ffd35a',out:'#2a0006',wcol:'#ffd35a',wdrk:'#8a5a10', mass:18,  spd:165, hp:600, om:3.5, dmg:6.0, arm:160, magDef:50, rest:.50, reach:2.8, tipR:0.52, wt:'royalscepter'},
  queen:     {label:'Queen',     weapon:'Regal Rapier',   ab:"Queen's Gambit",      color:'#b01872',dark:'#5b0838',rim:'#ff8bd1',out:'#220016',wcol:'#ffb8e6',wdrk:'#a02a70', mass:5,   spd:292, hp:260, om:6.0, dmg:2.3, arm:44,  magDef:34, rest:.82, reach:3.6, tipR:0.09, wt:'regalrapier'},
  prince:    {label:'Prince',    weapon:'Dueling Sabre',  ab:'Royal Blood',     color:'#1747b8',dark:'#08205f',rim:'#8bb7ff',out:'#031032',wcol:'#d8e8ff',wdrk:'#5678b8', mass:6,   spd:265, hp:460, om:8.5, dmg:4.0, arm:90,  magDef:35, rest:.78, reach:3.0, tipR:0.18, wt:'duelingsabre'},
  fairy:     {label:'Fairy',     weapon:'Pixie Wand',     ab:'Wish Granted',    color:'#ff5ac8',dark:'#9b1768',rim:'#fff0ff',out:'#42002b',wcol:'#fff0ff',wdrk:'#ff8ce2', mass:4,   spd:295, hp:360, om:10.5,dmg:4.6, arm:55,  magDef:96, rest:.86, reach:2.4, tipR:0.14, wt:'pixiewand'},
  beastmaster:{label:'Beastmaster',weapon:'Beast Whip',   ab:'Pack Hunt',       color:'#b85a13',dark:'#5a2608',rim:'#ffb060',out:'#220c02',wcol:'#c08a50',wdrk:'#6a3510', mass:7,   spd:215, hp:480, om:5.8, dmg:3.8, arm:95,  magDef:38, rest:.68, reach:4.6, tipR:0.16, wt:'beastwhip'},
  sage:      {label:'Sage',      weapon:'Ancient Tome',   ab:'Foresight',       color:'#6c8f52',dark:'#304525',rim:'#d6f0b2',out:'#132010',wcol:'#e6d8a0',wdrk:'#7a6040', mass:9,   spd:195, hp:500, om:4.8, dmg:2.8, arm:110, magDef:60, rest:.62, reach:2.4, tipR:0.48, wt:'ancienttome'},
  arcanist:  {label:'Arcanist',  weapon:'Arcane Cannon',  ab:'Overload',        color:'#78d8ff',dark:'#1d6b92',rim:'#e8fbff',out:'#083044',wcol:'#e8fbff',wdrk:'#3388bb', mass:5,   spd:190, hp:450, om:4.2, dmg:8.5, arm:70,  magDef:65, rest:.72, reach:3.2, tipR:0.28, wt:'arcanecannon'},
};

// Audio placeholder map for future asset wiring.
// How to use:
// 1. Put your audio files inside the /audio folder.
// 2. Replace the empty strings below with relative file paths.
// 3. Keep the path format like: 'audio/knight/weaponCollision.wav'
// 4. weaponCollision is now wired in the engine.
// 5. damage, ability, and bgm are still placeholders until we wire them next.
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

const RANGED_KEYS = new Set(['ranger','wizard','necromancer','sheriff','priest','bard','witch','fairy','sage','arcanist']);

const CLASS_ROLE = {
  knight:'TANK',samurai:'DUELIST',viking:'BRAWLER',barbarian:'BRUISER',paladin:'SUPPORT',
  ninja:'ASSASSIN',wizard:'RANGED',berserker:'JUGGERNAUT',ranger:'RANGED',templar:'TANK',
  rogue:'ASSASSIN',warlord:'FIGHTER',druid:'CONTROL',necromancer:'RANGED',pirate:'SKIRMISHER',
  jester:'CHAOS',golem:'TANK',phoenix:'FIGHTER',guardian:'TANK',trickster:'EVASION',
  sheriff:'RANGED',priest:'RANGED',
  inquisitor:'ZEALOT',
  vampire:'PREDATOR',
  monk:'MARTIAL',
  alchemist:'ALCHEMIST',
  dragoon:'LANCER',
  bard:'BARD',
  plague:'PESTILENCE',
  tidecaller:'ELEMENTAL',
  crusader:'VANGUARD',
  mimic:'SHAPESHIFTER',
  stormbringer:'ELEMENTAL',
  voidwalker:'ANOMALY',
  whelpling:'BEAST',
  gravedigger:'ATTRITION',
  flagellant:'MARTYR',
  ratcatcher:'VERMIN',
  locksmith:'DENIAL',
  glassblower:'TRAP BURST',witch:'HEXER',spartan:'VANGUARD',gladiator:'DUELIST',king:'SOVEREIGN',queen:'SOVEREIGN',prince:'SKIRMISHER',fairy:'SUPPORT',beastmaster:'SUMMONER',sage:'WISDOM',arcanist:'ANOMALY'
};

const ROLE_COLOR = {
  TANK:'#6080a8',DUELIST:'#c8a030',BRAWLER:'#b04010',BRUISER:'#8b2000',SUPPORT:'#c8a000',
  ASSASSIN:'#9b59b6',RANGED:'#2a8a8a',JUGGERNAUT:'#8b0000',FIGHTER:'#7a5030',
  CONTROL:'#1b6e20',CHAOS:'#e91e63',EVASION:'#00bcd4',SKIRMISHER:'#5d4037',
  ZEALOT:'#cc3300',PREDATOR:'#880022',MARTIAL:'#c8a040',ALCHEMIST:'#44aa22',LANCER:'#2255aa',BARD:'#9c27b0',
  PESTILENCE:'#668800',ELEMENTAL:'#0088aa',VANGUARD:'#c8a840',SHAPESHIFTER:'#884499',ANOMALY:'#550088',BEAST:'#994400',
  ATTRITION:'#8a6a40',MARTYR:'#b84a40',VERMIN:'#9aa050',DENIAL:'#d0b45a','TRAP BURST':'#82f4ff',HEXER:'#d77bff',SOVEREIGN:'#ffd35a',SUMMONER:'#ff9a38',WISDOM:'#d6f0b2'
};

const CLASS_DESC = {
  knight:{
    ability:'Shield Bubble (5 stacks) — Grants full invincibility for 3.6s. During the bubble, spin doubles and damage output increases by 1.5×.',
    passive:'Stalwart — Every weapon hit permanently stacks +0.6% DMG/ARM/SPIN (max 30 stacks). Buff notifies every 5 hits. Encourages sustained aggressive play rather than burst-and-disengage.'
  },
  samurai:{
    ability:'Spiral Rush (3 stacks) — Launches into a 1.2s spiral orbit around the enemy at 4× speed with 2.5× damage.',
    passive:'Iaijutsu — The first weapon hit after a spin-direction reversal deals 2× damage. 3s cooldown between procs. A pulsing silver ring shows when Iaijutsu is ready. Rewards momentum control and deliberate bouncing.'
  },
  viking:{
    ability:'Rage Spin (4 stacks) — Enters Berserker mode for 6s: spin locks at max rage, damage becomes 1.6×, and collision knockback dealt is doubled.',
    passive:'Last Stand — When Viking would die, he instead becomes invulnerable for 6s. During Last Stand, full rage automatically triggers Rage Spin without spending stacks. After the 6s stand, he falls.'
  },
  barbarian:{
    ability:'Ram Charge (3 stacks) — Blasts toward the nearest enemy at 3.5× speed for 0.7s with 2× damage. Direction locks on target at cast.',
    passive:'Bloodlust — Each landed hit adds +6 speed (max +60). Speed decays at 4/s when not hitting. Taking any damage resets all stacks. Glow orange ring brightens with stacks. Punishes passivity but shatters on being touched.'
  },
  paladin:{
    ability:'Sacred Wrath (5 stacks) — 5s aura dealing 5 dmg/sec to nearby enemies with 1.4× weapon damage. After expiry, briefly slowed to 75% speed for 0.5s.',
    passive:'550 HP. Holy pulse every 3s: heals 8 HP, fires a 12-damage radial blast, and builds a stack toward Sacred Wrath.'
  },
  ninja:{
    ability:'Blink Strike (5 stacks) — Teleports instantly behind the enemy with a burst of particles.',
    passive:'Shadow Step — On wall bounce (3s CD), fires 2 shurikens (3- or 4-pointed, random) toward the enemy and briefly becomes untargetable for 0.35s. Purple dashed ring marks the active dodge window.'
  },
  wizard:{
    ability:'Rod Cycle (4 stacks) — Advances to the next elemental rod, activating it for 8s plus staff power and firing 3 +5 damage bolts. Each staff cycle permanently increases rod duration, bolt damage, and stronger elemental effects. Rods cycle: ⚡Lightning (longer weaken) → 🔥Fire (longer, faster burn) → 💧Water (stronger, longer slow) → 🌀Wind (heavier knockback) → 🌍Earth (longer stun + heavier knockback).',
    passive:'Continuously fires +5 damage elemental bolts. Active staff power strengthens every rod effect, and Wind rod boosts own speed and spin while active. Ranged kiting behavior keeps distance from enemies.'
  },
  berserker:{
    ability:'Orbit Frenzy (5 stacks) — Locks onto enemy and orbits at 3× speed for 2.5s with 1.1× damage boost.',
    passive:'Iron Will — When HP drops below 40%, automatically triggers 0.8s of full knockback immunity (red pulsing shield). 6s cooldown. Lets the Berserker keep swinging at death\'s door instead of being launched away.'
  },
  ranger:{
    ability:'Volley Shot (4 stacks) — Rapidly fires 3 bursts of 5 spread arrows (center + 4 flanking) every 0.6s with +2 volley bonus damage each. Single shots suppressed during volley.',
    passive:'Continuously fires +3 damage arrows. Each arrow applies momentum to the target on hit. Kites away from close enemies. Missing HP increases crit damage by 1% per lost HP%, capped at +30%.'
  },
  templar:{
    ability:'Slow Field (3 stacks) — Drops a slow zone at current position for 3s with 2.5× sphere radius. Enemies inside are heavily decelerated each frame. Templar spins 2× while active.',
    passive:'Immovable — All incoming collision knockback is halved (50% reduction). Combined with 65% physical damage reduction and the highest armor in the game, the Templar is nearly impossible to bully off a position.'
  },
  rogue:{
    ability:'Backstab (3 stacks) — Charges daggers for 3s with 3× damage on next hit. Spin direction reverses on activation.',
    passive:'Hemorrhage — Every weapon hit applies a Bleed stack on the target (max 3). Each stack deals 18% of Rogue\'s DMG every 0.5s for 1.8s, refreshed on new hits. Stacks show as BLEED x# above the victim.'
  },
  warlord:{
    ability:'Earthquake (5 stacks) — Launches enemy with 320 impact force and deals 18 flat damage. Warlord gains 2× spin for 3s after.',
    passive:'Doom Halberd has the longest reach (3.4×) of all melee weapons. High mass amplifies collision physics.'
  },
  druid:{
    ability:'Thorn Patch (3 stacks) — Drops a 7s thorn zone at current position. Enemies inside are near-frozen and take DoT every 0.8s based on Druid\'s DMG. Druid gains 2 stacks per hit for faster ramp.',
    passive:'Auto whip AoE every 4s hits all enemies in reach range for 0.4× DMG, building stacks passively.'
  },
  necromancer:{
    ability:'Death Mark (3 stacks) — Applies 7 fast delayed damage ticks (0.7× projectile DMG +1 each, every 0.18s) to the nearest enemy.',
    passive:'Skull Orbs gain +2 damage and apply faster Death Mark + Wound (halves healing) on hit. Scythe applies Wound. Summons Skeletons after full mark sequences. Kites away from melee.'
  },
  pirate:{
    ability:'Boarding Action (3 stacks) — Fires a grappling hook that yanks the enemy toward the Pirate with 380 force, dealing 1.5× DMG on contact. Wall hits hook the Pirate toward the wall.',
    passive:'While Draining (1+ stacks): heals 0.5 HP/sec passively and leeches 15% of melee damage dealt. Cutlass also pulls enemies on hit rather than pushing them.'
  },
  jester:{
    ability:'Chaos Lurch (3 stacks) — Fires in a completely random direction at 2.2× speed, reverses spin, and gains 2× damage for 1.5s.',
    passive:'Spin accelerates with stacks (up to 2.5× base spin). Higher speed = wider bell swing = more chaotic hit angles.'
  },
  golem:{
    ability:'Fortify (3 stacks) — Consumes stacks to fortify for 4s, gaining 2× spin and 1.4× damage before the stone surge decays.',
    passive:'Receives only 65% physical damage. Heavier mass, 530 HP, 7.5 DMG, and 140 ARM make it nearly immovable from collision.'
  },
  phoenix:{
    ability:'Cinder Wing (3 stacks) — Ignites the Ashwing Talons for 2.2s, granting +18% speed, +35% spin, and a burst of Ember charge.',
    passive:'Kindling Flight — Speed and wall bounces build Ember. At full Ember, the next weapon hit releases a compact flame burst for bonus damage. Once per match, lethal damage triggers Rebirth: 35% HP, 1.2s invincibility, full Ember, and a short knockback flare.'
  },
  guardian:{
    ability:'Phalanx (2 stacks) — Consumes stacks to raise the tower shield for 3.5s: spin doubles, incoming knockback is reduced by 30%, and physical damage taken drops to 45%.',
    passive:'Sanctuary — Every 10s, creates an 8s Heater Shield zone. Damage taken inside is completely negated once, consuming the shield. Tower Shield extends from both sides.'
  },
  trickster:{
    ability:'Phase Out (2 stacks) - Turns semi-transparent, reverses direction at 1.4x speed, and gains 0.5s invincibility. After Phase Out ends, leaves a fragile 1 HP replica with no ARM/MDEF that can damage enemies, then vanishes when it hits or takes damage.',
    passive:'Mirror Break - The first time Trickster falls below 40% HP, creates an 80% stat replica of its current combat state. Replicas can fight, but cannot trigger abilities, passives, or further clones.'
  },
  sheriff:{
    ability:'Bola & Buckshot (2 outgoing hits) — Fires a bola that roots the target for 1s (gravity suspended). Immediately follows with a piercing gold laser dealing 32 true damage + armor penetration bonus. Weapon swaps visually to a shotgun during the sequence.',
    passive:'Fires 6 rapid +2 damage .44 rounds per cylinder (0.16s CD) then reloads. Every lost HP% reduces reload time by 0.05s, capped at 0.4s faster. Reload smoke visible on cylinder. Kites away from melee.'
  },
  priest:{
    ability:'Benediction (4 stacks) — Fires 8 homing Holy Orbs in all directions. Orbs begin homing after 0.18s with a sharp turn rate. Also grants +8 DMG for 10s.',
    passive:'Continuously fires fast +2 damage homing Holy Orbs (every 0.35s). Enemy hits: deal magic damage and permanently reduce target MDEF by 5 (capped at −30). Ally hits: grant +2 DMG buff for 8s. Builds shield stacks that absorb incoming damage (each stack = 2 HP).'
  },
  inquisitor:{
    ability:"Heretic's Pyre (4 stacks) — Ignites a 4s burning aura around the Inquisitor. Enemies inside take heavy DoT every 0.4s. Armor grows by +8 every second the pyre burns — judgment tempers iron.",
    passive:'Speed is Judgment — damage scales with current movement speed. The faster the Inquisitor moves, the harder the Branding Iron burns. Also leaves scorching heat trails that briefly damage enemies who cross them.'
  },
  vampire:{
    ability:"Swarm of the Night (3 stacks) — Enters a spectral ghost state for 2.5s. Becomes fully untargetable: all weapon hits and body collisions pass through. Spawns a thick bat cloud — enemies overlapping take 0.55× DMG ticks every 0.28s, and each tick heals the Vampire for 40% of damage dealt.",
    passive:'Sanguine Thirst — Every melee strike from the Crimson Claws heals the Vampire for 25% of damage dealt while in physical (non-ghost) form. Twin rotating sickles hit from both angles.'
  },
  monk:{
    ability:'100-Fist Nirvana (3 stacks) — For 3s, spin multiplies to 4× base omega. Every weapon hit during Nirvana launches the enemy with +400 flat impact force on top of normal physics — enemies become leaves in a divine hurricane.',
    passive:'Water Emptying the Teapot — Every wall bounce accelerates the Monk by 1.4×. The Monk is the ricochet made flesh, gaining speed from every wall until the arena cannot contain the storm.'
  },
  alchemist:{
    ability:"Unstable Concoction (3 stacks) — Lobs a glass flask in an arc toward the enemy. Shatters on floor or enemy contact into a LingeringMiasma zone lasting 4.5s. Every 0.55s inside the zone, enemies are randomly: Slowed (55% velocity drain), ArmorMelted (−8 ARM), or Burned (2s DoT).",
    passive:"Catalytic Corrosion — Every melee strike from the Vial Sling applies a Corrosion stack (max 6). Each stack strips 5 ARM from the target for 4s, resetting on each new hit. At 6 stacks the enemy's armor is completely dissolved."
  },
  dragoon:{
    ability:"Wyrm's Descent (3 stacks) — Leaps into the air for 1.5s. While airborne: fully untargetable, ignores all collisions. A warning shadow tracks the enemy's position during the leap. On landing: snaps to target, deals 2.2× true damage in a radius and launches all enemies within range with 520 knockback.",
    passive:"Wyrmscale (Magic Mitigation) — The dragoon is clad in dragon scales that absorb one incoming magic hit completely. After absorbing a hit, the shield recharges over 8 seconds. The Dragon Lance has the longest reach in the game (4.8×) but a narrow tip — precision over sweep."
  },
  bard:{
    ability:'Crescendo Blast (3 stacks) — Fires a +2 damage SonicProjectile that accelerates with every wall bounce (×1.3 speed per bounce, capped at 1100). On enemy hit: minimal magic damage but a massive knockback force (300 + 120 per bounce). More bounces = more devastation.',
    passive:'Discordant Echo — Every standard +2 damage lute shot plants a larger, longer-lived NoiseTrap (♩) at the Bard\'s feet (3.5s CD). The trap lasts 5s. When an enemy steps on it: spin (ω) is instantly zeroed for 2s (disabling melee threat). If the enemy is ranged, their fire rate is also slowed to 35% for 3s (SILENCED!). Kites away from melee.'
  },
  plague:{
    ability:'Virulence Inject (3 stacks) — Injects a Virulence stack into the enemy. Each hit on a wall by a Virulently infected enemy leaves a permanent Toxic Smear for the rest of the match, dealing DoT to anyone passing through it.',
    passive:'Sepsis — Weapon hits on the same enemy build a counter, resetting when switching targets. At 5 hits, the enemy bursts, takes DoT totaling 8% of current HP, and becomes Weakened to take +15% damage for 5s. The counter then resets.'
  },
  tidecaller:{
    ability:'Riptide (3 stacks) — Fires a water bolt that yanks the enemy violently toward the nearest wall. Wall impact deals bonus damage scaled by the speed of impact.',
    passive:'Tidal Momentum — Movement speed scales by 1.4× near walls (within 60px) and 0.85× near the arena center. Favors the edges.'
  },
  crusader:{
    ability:'Holy Charge (3 stacks) — Starts at 2.2s and becomes immune to knockback while dealing 2.0× collision damage. Each collision extends the charge by 0.4s, capped at 5s total.',
    passive:'Retribution — Incoming damage charges a Retribution counter. The next weapon hit discharges all stored damage as a bonus, then resets. Big hits pay dividends.'
  },
  mimic:{
    ability:'Perfect Copy (3 stacks) — For 4s, copies the enemy\'s current DMG and SPEED on top of its own, temporarily becoming a more powerful version of the foe.',
    passive:'Essence Drain — Each weapon hit permanently steals 0.04 DMG from the enemy and adds it to the Mimic\'s own DMG (capped at +3.0 total steal).'
  },
  stormbringer:{
    ability:'Thunderclap (3 stacks) — Freezes own position for 0.8s and emits a shockwave in all directions, dealing magic damage and heavy knockback to all enemies.',
    passive:'Static Charge — The faster the Stormbringer moves, the more electric charge builds. Stored charge (up to 30) discharges as bonus true damage on the next weapon hit, then resets.'
  },
  voidwalker:{
    ability:'Singularity (3 stacks) — Places a black hole at current position for 2.5s with stronger suction that continuously drags all enemies inward while dealing faster tick damage.',
    passive:'Void Tears — Wall bounces leave lingering void tears for 3s. Enemies passing through a tear are briefly slowed and take a burst of magic damage.'
  },
  whelpling:{
    ability:'Firebreath (3 stacks) — Sprays a cone of fire forward (3 flames) that lingers as a burning zone for 5s and grows slightly wider with each Growing Menace stack. Enemies inside take 2 true dmg/tick (once per 0.5s, no zone stacking) and gain faster Burning that ticks every 0.75s.',
    passive:'Growing Menace — Every 4 seconds, the Whelpling\'s mass, radius, and max HP all grow slightly (+1 mass, +2 radius, +15 maxHP) — becoming harder and harder to launch.'
  },
  gravedigger:{
    ability:'Exhume (4 stacks) — Teleports to the oldest surviving Burial Mound, gains 1.8× spin and 0.6s invincibility on arrival. Burial Mounds persist only for the current battle and reset on each new battle.',
    passive:'Burial Mounds — Every 6th wall contact buries a mound at the current position if it would not overlap an existing mound. Enemies crossing a mound are briefly slowed and lose 3% current HP.'
  },
  flagellant:{
    ability:'Penitence (3 stacks) — Deals 10 true self-damage, grants 1.5s invincibility during the ritual, and releases a contact-range shockwave that deals the same 10 damage to enemies.',
    passive:'Sacred Wounds — Every 15 HP lost permanently increases damage output by +0.8 and spin by +0.4. Losing health turns the Flagellant into a mounting offensive threat.'
  },
  ratcatcher:{
    ability:'Infestation (3 stacks) — Releases 12 rats in all directions. Rats that reach an enemy bite for damage and apply Gnawed, reducing armor by 6 for 8s, stacking up to 5 times.',
    passive:'Rat Pack — Each weapon hit releases a rat that hunts the enemy and deals 1 true damage per second for 5 seconds. Rats accumulate into a persistent attrition swarm.'
  },
  locksmith:{
    ability:'Master Key (3 stacks) — Consumes Locks on the enemy for haste and stack denial. At 2 Locks it forces a longer weapon jam.',
    passive:'Jammed Mechanism — Weapon clashes add Locks to the enemy. At 2 Locks, the enemy weapon jams: spin is heavily reduced for 1s, then Locks clear.'
  },
  glassblower:{
    ability:'Kiln Detonation (4 stacks) — Detonates all surviving Glass Shards into small splinter bursts. Taking 3 or more shard blasts briefly blinds and reverses enemy spin.',
    passive:'Glass Litter — Wall bounces and weapon clashes drop fragile Glass Shards. High-speed enemies shatter shards, taking true damage and Bleeding Glass.'
  },
  witch:{ability:'Hex Convergence (3 stacks) — Staff snaps toward the nearest enemy and fires 3 lower-damage warping Hex Bolts before returning to normal rotation. Repeated hits briefly halve enemy damage and reverse spin; bolts now fizzle on wall impact.',passive:'Jinx — Hex Bolt hits stack Jinx up to 4, then trigger a random blind, burn, slow, or spin-reverse debuff for 3s.'},
  spartan:{ability:'Phalanx Thrust (3 stacks) — Spear snaps toward the nearest enemy, then charges for 0.7s with only 1 true contact damage while the rear shield lightly reflects melee pressure.',passive:'Iron Formation — Shield-side hits build stacks that reduce physical damage; at 5 stacks the next ability is primed for free.'},
  gladiator:{ability:"Arena's Verdict (3 stacks) — Throws the net to root the enemy and heavily weaken armor; gladius attacks during the window deal 1.8× damage with extra reach.",passive:'Crowd Favor — Gladius hits build Favor more slowly for speed/spin. Taking damage removes Favor; at 10 Favor the next hit deals double damage.'},
  king:{ability:'Iron Fist Rage (4 stacks) — Enters a 6s bright rage aura with 1.6× damage and boosted spin, then summons 3 randomized Barbarian Allies that obey normal arena gravity and do not chase. Allies hit harder inside the aura and last 10s.',passive:'Sovereign Weight — Collision wins permanently add ARM and DMG up to a match cap, shown as crown pips.'},
  queen:{ability:"Queen's Gambit (6 stacks) — Rapier glows with royal color for 3s, converting Queen's weapon hits to true damage while reducing both defenses by one-third.",passive:"Courtly Menace — Nearby enemies lose damage and speed. Back hits permanently raise the Queen's damage."},
  prince:{ability:'Royal Blood (4 stacks) — Gains a 10-damage shield for 6s. While the shield holds, saber mode gains +2 damage and faster omega spin, while bow mode fires more quickly. If enemies break the shield early, gains +30 ARM and MDEF for 3s.',passive:'Weapon Master — Automatically swaps between a dueling sabre for enemies within sabre reach and a silver wood bow for longer range. Only the active weapon is equipped and drawn.'},
  fairy:{ability:'Wish Granted (4 stacks) — Rolls invincibility, a heal burst, a triple-speed dash, or a one-hit mirror clone, and grants 2s of faster wand fire rate.',passive:'Pixie Dust Trail — Moving sheds charm dust that reverses enemy spin and slows them; Fairy heals in her own dust.'},
  beastmaster:{ability:'Pack Hunt (4 stacks) — Releases wolf, boar, and hawk companions that hunt enemies for 10s; damage rises while beasts live.',passive:'Wild Bond — Whip hits spawn ferrets; three ferrets on a target trigger an ARM-stripping Frenzy burst.'},
  sage:{ability:'Foresight (3 stacks) — Becomes untargetable for 2s, mirrors enemy motion in reverse, then releases a 2× Wisdom Wave.',passive:'Ancient Patience — Fires ranged gibberish wisdom words. Damage taken converts into permanent DMG and MDEF Knowledge, displayed above the sphere.'},
  arcanist:{ability:'Overload (3 stacks) — For 4s shells fly faster, explode wider, and leave longer burn zones; each explosion now deals reduced true self-harm.',passive:'Volatile Charge — Avoiding damage builds charge; at full charge the next shell detonates on the enemy position. Taking damage resets charge and knocks self back.'},
};

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
