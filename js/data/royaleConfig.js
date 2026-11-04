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

const ROYALE_EVENT_CONFIG={
 overgrowth:{mult:1.5,tween:0.6},dwarfism:{mult:0.6,tween:0.6},
 hurricane:{strength:170,gustPeriod:3.2,gustMin:0.55,driftRate:0.35,projectileFactor:0.5,streaks:70},
 lava:{countMin:3,countMax:6,radiusMin:80,radiusMax:140,tick:0.5,dmgPct:0.03,burnSecs:1.5,fadeSecs:0.5},
 thunderstorm:{interval:0.7,perVolley:2,targetedChance:0.5,telegraph:1.0,radius:75,dmgPct:0.06,stun:0.8,shock:2.5,shake:3,impactLife:1.0,impactParticles:34,particleLife:0.72,branchCount:4,boltSegments:12,groundCrackCount:9},
 potions:{count:6,pickupPad:14,minSpacing:150,effectSecs:6},
 thornedWalls:{growSecs:1.0,contactCooldown:0.6,dmgPct:0.03,bleedStacks:1,thornLen:22,spacing:34},
 ghostSpheres:{count:2,hpFraction:0.35,lifeSecs:10},
 voidVortex:{countMin:2,countMax:4,pullRadius:260,pullMax:320,coreRadius:46,coreDmgPct:0.04,coreTick:0.5,growSecs:1.0,minSeparation:300}
};
