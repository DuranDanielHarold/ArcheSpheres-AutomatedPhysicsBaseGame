'use strict';
const ROYALE_CONFIG={
 count:8,phases:10,calm:12,warning:3,event:10,shrink:4,finalTimeout:30,
 shrinkAreaStep:0.10,worldW:2400,worldH:1350,sphereRadius:30,baseVisibleHeight:620,speedScale:2.0,obstacleCount:[30,40],obstacleCooldown:0.25
};
const ROYALE_FACTION_COLORS=[
 {name:'CRIMSON',color:'#a51f2b'},
 {name:'ROYAL BLUE',color:'#244b9b'},
 {name:'VIOLET',color:'#68419a'},
 {name:'FOREST',color:'#176b45'},
 {name:'AMBER',color:'#a64b12'},
 {name:'TEAL',color:'#087e8b'},
 {name:'ROSE',color:'#a12c65'},
 {name:'SLATE',color:'#344054'}
];
const ROYALE_EVENT_IDS=[
 'overgrowth','hurricane','dwarfism','lava','thunderstorm','potions','thornedWalls',
 'ghostSpheres','voidVortex','meteorShower','earthquake','bloodMoon','frostbite',
 'magneticStorm','lowGravity','timeWarp','supplyDrop','riftPortals','plagueFog',
 'glassCannon','kingsBounty'
];
const ROYALE_EVENT_LABELS={
 overgrowth:'Overgrowth',hurricane:'Hurricane',dwarfism:'Dwarfism',lava:'Lava',
 thunderstorm:'Thunderstorm',potions:'Potions',thornedWalls:'Thorned Walls',
 ghostSpheres:'Ghost Spheres',voidVortex:'Void Vortex',meteorShower:'Meteor Shower',
 earthquake:'Earthquake',bloodMoon:'Blood Moon',frostbite:'Frostbite',
 magneticStorm:'Magnetic Storm',lowGravity:'Low Gravity',timeWarp:'Time Warp',
 supplyDrop:'Supply Drop',riftPortals:'Rift Portals',plagueFog:'Plague Fog',
 glassCannon:'Glass Cannon',kingsBounty:"King's Bounty"
};
const ROYALE_EVENT_REGISTRY={};
