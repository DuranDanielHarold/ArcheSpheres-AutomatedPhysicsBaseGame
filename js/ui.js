'use strict';
// ▓▓▓ SECTION:UI — Picker, start screen, CLASS_ROLE, CLASS_DESC, countdown ▓▓▓
let pendingSelections={};
let pickerSlot=null;
let pickerDetailMode=false;
let countdownTimer=null;
function makeSphereIcon(key,size=48){
 const d=DEF[key];
 const cv=document.createElement('canvas');cv.width=size;cv.height=size;
 const c=cv.getContext('2d');
 const cx=size/2,cy=size/2,r=size*0.42;
 c.beginPath();c.arc(cx,cy,r+size*0.06,0,Math.PI*2);
 c.fillStyle=d.out||'#000';c.fill();
 const bg=c.createRadialGradient(cx-r*0.28,cy-r*0.28,r*0.05,cx,cy,r);
 bg.addColorStop(0,d.rim);bg.addColorStop(0.55,d.color);bg.addColorStop(1,d.dark);
 c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=bg;c.fill();
 const hi=c.createRadialGradient(cx-r*0.3,cy-r*0.32,0,cx-r*0.18,cy-r*0.18,r*0.45);
 hi.addColorStop(0,'rgba(255,255,255,0.55)');hi.addColorStop(1,'rgba(255,255,255,0)');
 c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fillStyle=hi;c.fill();
 c.beginPath();c.arc(cx+r*0.62,cy,r*0.18,0,Math.PI*2);
 c.fillStyle=d.wcol||d.rim;c.fill();
 c.strokeStyle=d.wdrk||d.dark;c.lineWidth=1;c.stroke();
 return cv.toDataURL();
}
const _sphereIconCache={};
function getSphereIcon(key,size=44){
 const k=key+'_'+size;
 if(!_sphereIconCache[k])_sphereIconCache[k]=makeSphereIcon(key,size);
 return _sphereIconCache[k];
}
const CLASS_ROLE_UNUSED={
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
 whelpling:'BEAST'
};
const ROLE_COLOR_UNUSED={
 TANK:'#6080a8',DUELIST:'#c8a030',BRAWLER:'#b04010',BRUISER:'#8b2000',SUPPORT:'#c8a000',
 ASSASSIN:'#9b59b6',RANGED:'#2a8a8a',JUGGERNAUT:'#8b0000',FIGHTER:'#7a5030',
 CONTROL:'#1b6e20',CHAOS:'#e91e63',EVASION:'#00bcd4',SKIRMISHER:'#5d4037',
 ZEALOT:'#cc3300',PREDATOR:'#880022',MARTIAL:'#c8a040',ALCHEMIST:'#44aa22',LANCER:'#2255aa',BARD:'#9c27b0',
 PESTILENCE:'#668800',ELEMENTAL:'#0088aa',VANGUARD:'#c8a840',SHAPESHIFTER:'#884499',ANOMALY:'#550088',BEAST:'#994400'
};
const CLASS_DESC_UNUSED={
 knight:{
  ability:'Shield Bubble (5 stacks) — Grants full invincibility for 3.6s. During the bubble, spin doubles and damage output increases by 1.5×.',
  passive:'Stalwart — Every weapon hit permanently stacks +0.6% DMG/ARM/SPIN (max 30 stacks). Buff notifies every 5 hits. Encourages sustained aggressive play rather than burst-and-disengage.'
 },
 samurai:{
  ability:'Spiral Rush (3 stacks) — Launches into a 1.2s spiral orbit around the enemy at 4× speed with 2.5× damage.',
  passive:'Iaijutsu — The first weapon hit after a spin-direction reversal deals 2× damage. 3s cooldown between procs. A pulsing silver ring shows when Iaijutsu is ready. Rewards momentum control and deliberate bouncing.'
 },
 viking:{
  ability:'Rage Spin (passive stacks) — Each hit builds rage, increasing spin speed (+4.0ω max) and damage (up to 1.4×). Rage decays if no hit lands for 2.5s.',
  passive:'Battle Axe tip radius is large — hits connect even at slight angles. Rage resets decay timer on every hit.'
 },
 barbarian:{
  ability:'Ram Charge (3 stacks) — Blasts toward the nearest enemy at 3.5× speed for 0.7s with 2× damage. Direction locks on target at cast.',
  passive:'Bloodlust — Each landed hit adds +6 speed (max +60). Speed decays at 4/s when not hitting. Taking any damage resets all stacks. Glow orange ring brightens with stacks. Punishes passivity but shatters on being touched.'
 },
 paladin:{
  ability:'Sacred Wrath (5 stacks) — 3.5s aura dealing 5 dmg/sec to nearby enemies with 1.4× weapon damage. After expiry, briefly slowed to 75% speed for 0.5s.',
  passive:'Holy pulse every 3s: heals 8 HP, fires a 12-damage radial blast, and builds a stack toward Sacred Wrath.'
 },
 ninja:{
  ability:'Blink Strike (5 stacks) — Teleports instantly behind the enemy with a burst of particles.',
  passive:'Shadow Step — On wall bounce (8s CD), fires 2 shurikens (3- or 4-pointed, random) toward the enemy and briefly becomes untargetable for 0.35s. Purple dashed ring marks the active dodge window.'
 },
 wizard:{
  ability:'Rod Cycle (4 stacks) — Advances to the next elemental rod, activating it for 8s and firing 3 bolts. Rods cycle: ⚡Lightning (−1 enemy DMG for 1s) → 🔥Fire (3 true dmg/tick over 3s) → 💧Water (stacking 35% slow) → 🌀Wind (heavy knockback) → 🌍Earth (0.3s stun + massive knockback).',
  passive:'Continuously fires elemental bolts. Wind rod boosts own speed and spin while active. Ranged kiting behavior keeps distance from enemies.'
 },
 berserker:{
  ability:'Orbit Frenzy (5 stacks) — Locks onto enemy and orbits at 3× speed for 2.5s with 1.1× damage boost.',
  passive:'Iron Will — When HP drops below 40%, automatically triggers 0.8s of full knockback immunity (red pulsing shield). 6s cooldown. Lets the Berserker keep swinging at death\'s door instead of being launched away.'
 },
 ranger:{
  ability:'Volley Shot (4 stacks) — Fires 3 bursts of 5 spread arrows (center + 4 flanking) over 10s with +2 bonus damage each. Single shots suppressed during volley.',
  passive:'Continuously fires single arrows. Each arrow applies momentum to the target on hit. Kites away from close enemies.'
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
  ability:'Thorn Patch (3 stacks) — Drops a 4s thorn zone at current position. Enemies inside are near-frozen and take DoT every 0.8s based on Druid\'s DMG. Druid gains 2 stacks per hit for faster ramp.',
  passive:'Auto whip AoE every 4s hits all enemies in reach range for 0.4× DMG, building stacks passively.'
 },
 necromancer:{
  ability:'Death Mark (3 stacks) — Applies 7 delayed damage ticks (0.7× projectile DMG each, every 0.6s) to the nearest enemy.',
  passive:'Skull Orbs apply Death Mark + Wound (halves healing) on hit. Scythe applies Wound. Summons Skeletons after full mark sequences. Kites away from melee.'
 },
 pirate:{
  ability:'Boarding Action (3 stacks) — Fires a grappling hook that yanks the enemy toward the Pirate with 380 force, dealing 1.5× DMG on contact.',
  passive:'While Draining (1+ stacks): heals 0.5 HP/sec passively and leeches 15% of melee damage dealt. Cutlass also pulls enemies on hit rather than pushing them.'
 },
 jester:{
  ability:'Chaos Lurch (3 stacks) — Fires in a completely random direction at 2.2× speed, reverses spin, and gains 2× damage for 1.5s.',
  passive:'Spin accelerates with stacks (up to 2.5× base spin). Higher speed = wider bell swing = more chaotic hit angles.'
 },
 golem:{
  ability:'Fortify (3+ stacks) — While fortified (3+ stacks held), gains 2× spin and up to 1.4× damage scaling with stacks. Stacks persist until discharged.',
  passive:'Receives only 65% physical damage. Hardest hitting melee (10.0 DMG). Enormous mass makes it nearly immovable from collision.'
 },
 phoenix:{
  ability:'Rebirth (once per match) — When HP would reach 0, triggers automatically: restores to 35% HP and grants 1.2s of full invincibility with a burst of particles.',
  passive:'Flame Talons orbit visually. High base speed (202) with moderate mass makes it a fast bruiser.'
 },
 guardian:{
  ability:'Phalanx (2+ stacks) — While holding 2+ stacks: spin doubles, incoming knockback is reduced by 30%, and physical damage taken drops to 45%.',
  passive:'Tower Shield extends from both sides. Extremely high armor (200) and low restitution — absorbs hits instead of deflecting them.'
 },
 trickster:{
  ability:'Phase Out (2 stacks) — Turns semi-transparent, reverses direction at 1.4× speed, and grants 0.5s full invincibility.',
  passive:'Afterimage — Every Phase Out leaves a ghostly decoy at the departure point. The decoy lingers for 1.2s and absorbs the next weapon hit that connects with it, flashing cyan and showing DECOY! on absorption. Baits enemies into swinging at thin air.'
 },
 sheriff:{
  ability:'Bola & Buckshot (2 outgoing hits) — Fires a bola that roots the target for 1s (gravity suspended). Immediately follows with a piercing gold laser dealing 30 true damage + armor penetration bonus. Weapon swaps visually to a shotgun during the sequence.',
  passive:'Fires 6 rapid .44 rounds per cylinder (0.16s CD) then reloads for 1.8s. Reload smoke visible on cylinder. Kites away from melee.'
 },
 priest:{
  ability:'Benediction (4 stacks) — Fires 8 homing Holy Orbs in all directions. Orbs begin homing after 0.18s with a sharp turn rate. Also grants +8 DMG for 10s.',
  passive:'Continuously fires fast homing Holy Orbs (every 0.35s). Enemy hits: deal magic damage and permanently reduce target MDEF by 5 (capped at −30). Ally hits: grant +2 DMG buff for 8s. Builds shield stacks that absorb incoming damage (each stack = 2 HP).'
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
  ability:'Crescendo Blast (3 stacks) — Fires a SonicProjectile that accelerates with every wall bounce (×1.3 speed per bounce, capped at 1100). On enemy hit: minimal magic damage but a massive knockback force (300 + 120 per bounce). More bounces = more devastation.',
  passive:'Discordant Echo — Every standard lute shot plants a NoiseTrap (♩) at the Bard\'s feet (3.5s CD). The trap lasts 3s. When an enemy steps on it: spin (ω) is instantly zeroed for 2s (disabling melee threat). If the enemy is ranged, their fire rate is also slowed to 35% for 3s (SILENCED!). Kites away from melee.'
 },
 plague:{
  ability:'Virulence Inject (3 stacks) — Injects a Virulence stack into the enemy. Each hit on a wall by a Virulently infected enemy leaves a Toxic Smear that lingers for 4s, dealing DoT to anyone passing through it.',
  passive:'Attrition — Every weapon hit permanently reduces the enemy\'s max HP by 3 for the rest of the match (capped at -120). Watching the enemy\'s ceiling collapse over time.'
 },
 tidecaller:{
  ability:'Riptide (3 stacks) — Fires a water bolt that yanks the enemy violently toward the nearest wall. Wall impact deals bonus damage scaled by the speed of impact.',
  passive:'Tidal Momentum — Movement speed scales by 1.4× near walls (within 60px) and 0.85× near the arena center. Favors the edges.'
 },
 crusader:{
  ability:'Holy Charge (3 stacks) — Locks current direction and becomes immune to knockback for 1.5s while dealing 1.8× collision damage. Unstoppable on the charge.',
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
  ability:'Singularity (3 stacks) — Places a black hole at current position for 2.5s that continuously drags all enemies inward while dealing tick damage.',
  passive:'Void Tears — Wall bounces leave lingering void tears for 3s. Enemies passing through a tear are briefly slowed and take a burst of magic damage.'
 },
 whelpling:{
  ability:'Firebreath (3 stacks) — Sprays a cone of fire forward (3 flames) that lingers as a burning zone for 3s. Enemies inside take 2 true dmg/tick (once per 0.5s, no zone stacking) and gain Burning.',
  passive:'Growing Menace — Every 5 seconds, the Whelpling\'s mass, radius, and max HP all grow slightly (+1 mass, +2 radius, +15 maxHP) — becoming harder and harder to launch.'
 },
};
function injectPickerStyles(){
 if(document.getElementById('ss-styles'))return;
 const st=document.createElement('style');st.id='ss-styles';
 st.textContent=`
 .ss-mbtn{font-family:'Press Start 2P',monospace;font-size:clamp(7px,2vw,11px);
  background:#1a2340;color:#e8b430;border:2px solid #8a6000;
  padding:12px 32px;cursor:pointer;letter-spacing:1px;
  box-shadow:4px 4px 0 #000;min-width:200px;text-align:left;}
 .ss-mbtn:hover{background:#243060;border-color:#e8b430;}
 .ss-mbtn:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #000;}
 #picker-screen{position:fixed;inset:0;background:#0d1520;z-index:99;display:flex;flex-direction:column;overflow:hidden;}
 #picker-header{background:#111a2e;border-bottom:2px solid #8a6000;padding:6px 10px;display:flex;align-items:center;gap:6px;flex-shrink:0;flex-wrap:wrap;}
 #picker-slots{display:flex;gap:4px;align-items:center;flex:1;overflow-x:auto;min-width:0;}
 .pslot{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1.1vw,6px);
  padding:4px 6px;border:2px solid #2a3a55;background:#111a2e;color:#4a6080;
  cursor:pointer;min-width:52px;text-align:center;}
 .pslot.active{border-color:#e8b430;color:#e8b430;background:#1e2a40;}
 .pslot-label{font-size:clamp(4px,0.9vw,5px);display:block;margin-bottom:1px;}
 .pslot-name{font-size:clamp(4px,1vw,6px);}
 .pslot.filled .pslot-name{color:#88cc44;}
 #picker-body{flex:1;display:flex;overflow:hidden;min-height:0;}
 #picker-grid{flex:1;overflow-y:auto;padding:8px;display:grid;
  grid-template-columns:repeat(auto-fill,minmax(clamp(80px,16vw,120px),1fr));gap:6px;align-content:start;}
 .pcard{background:#111a2e;border:2px solid #1e2e45;cursor:pointer;padding:8px 6px;
  display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;}
 .pcard:hover{border-color:#8a6000;background:#182030;}
 .pcard.selected{border-color:#e8b430;background:#1c2840;}
 .pcard-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;}
 .pcard-name{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);color:#ccddf0;text-align:center;}
 .pcard-role{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);padding:1px 4px;}
 .pcard-ab{font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#7080a0;text-align:center;line-height:1.2;}
 .pcard-stats{display:flex;gap:5px;margin-top:2px;}
 .pstat{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;text-align:center;}
 .pstat span{display:block;}
 #picker-detail{width:clamp(160px,26vw,240px);background:#0a1018;border-left:2px solid #1e2e45;
  overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;flex-shrink:0;}
 #picker-detail.hidden{display:none;}
 .dbar-wrap{margin-bottom:4px;}
 .dbar-labels{display:flex;justify-content:space-between;}
 .dbar-label{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#5070a0;}
 .dbar-val{font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#ccddf0;}
 .dbar{height:4px;background:#1a2340;margin-top:2px;}
 .dbar-fill{height:100%;}
 .dstat-row{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #1a2340;}
 #detail-toggle{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:4px 8px;cursor:pointer;white-space:nowrap;}
 #detail-toggle.on{border-color:#e8b430;color:#e8b430;}
 #picker-launch{font-family:'Press Start 2P',monospace;font-size:clamp(5px,1.4vw,8px);
  background:#2a5010;color:#88cc44;border:2px solid #1a3008;padding:8px 16px;
  cursor:pointer;box-shadow:3px 3px 0 #000;letter-spacing:.5px;white-space:nowrap;}
 #picker-launch:hover{background:#3a6818;}
 #picker-launch:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #000;}
 #picker-back{font-family:'Press Start 2P',monospace;font-size:clamp(4px,1vw,6px);
  background:#1a2340;color:#6080a8;border:2px solid #2a3a50;padding:6px 10px;cursor:pointer;white-space:nowrap;}
 #picker-back:hover{background:#243060;}
 #countdown-overlay{position:absolute;inset:0;background:rgba(0,0,0,.72);
  display:none;align-items:center;justify-content:center;z-index:30;flex-direction:column;gap:6px;}
 #countdown-overlay.show{display:flex;}
 #countdown-num{font-family:'Press Start 2P',monospace;font-size:clamp(48px,14vw,90px);
  color:#e8b430;text-shadow:0 0 24px #c8920a,4px 4px 0 #000;}
 #countdown-label{font-family:'VT323',monospace;font-size:clamp(14px,3.5vw,22px);color:#ccddf0;letter-spacing:3px;}
 @keyframes cdpop{0%{transform:scale(1.6);opacity:.4;}60%{transform:scale(0.95);}100%{transform:scale(1);opacity:1;}}
 .cd-pop{animation:cdpop .5s ease-out forwards;}
 `;
 document.head.appendChild(st);
}
function showStartScreen(){
 injectPickerStyles();
 document.getElementById('mode-row').style.display='none';
 document.getElementById('sel-row').style.display='none';
 document.getElementById('card').style.display='none';
 document.getElementById('controls').style.display='none';
 let ss=document.getElementById('start-screen');
 if(ss){ss.style.display='flex';return;}
 ss=document.createElement('div');ss.id='start-screen';
 ss.style.cssText='position:fixed;inset:0;background:#0d1520;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;gap:0;overflow:hidden;';
 const bgC=document.createElement('canvas');
 bgC.id='ss-bg';bgC.style.cssText='position:absolute;inset:0;width:100%;height:100%;opacity:.15;pointer-events:none;';
 ss.appendChild(bgC);
 const inner=document.createElement('div');
 inner.style.cssText='position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:26px;padding:20px;';
 inner.innerHTML=`
  <div style="text-align:center;">
   <div style="font-family:'Press Start 2P',monospace;font-size:clamp(20px,5.5vw,42px);color:#e8b430;text-shadow:0 0 30px #c8920a,3px 3px 0 #000;letter-spacing:2px;line-height:1.4;">MEDIEVAL<br>SPHERES</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(13px,2.8vw,20px);color:#4a6080;margin-top:5px;letter-spacing:4px;">SELECT BATTLE MODE</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;">
   <button class="ss-mbtn" onclick="window.startPicker('1v1')">⚔&nbsp;&nbsp;1 V 1</button>
  </div>`;
 ss.appendChild(inner);
 document.body.appendChild(ss);
 const bgCtx=bgC.getContext('2d');let bgT=0;
 function animBg(){
  if(!ss.isConnected||ss.style.display==='none')return;
  bgC.width=window.innerWidth;bgC.height=window.innerHeight;
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  const gs=55;bgCtx.lineWidth=1;
  for(let x=0;x<bgC.width+gs;x+=gs){
   bgCtx.globalAlpha=0.25+0.12*Math.sin(bgT*0.8+x*0.018);
   bgCtx.strokeStyle='#e8b430';bgCtx.beginPath();bgCtx.moveTo(x,0);bgCtx.lineTo(x,bgC.height);bgCtx.stroke();
  }
  for(let y=0;y<bgC.height+gs;y+=gs){
   bgCtx.globalAlpha=0.25+0.12*Math.sin(bgT*0.8+y*0.018);
   bgCtx.strokeStyle='#e8b430';bgCtx.beginPath();bgCtx.moveTo(0,y);bgCtx.lineTo(bgC.width,y);bgCtx.stroke();
  }
  for(let i=0;i<7;i++){
   const bx=bgC.width*(0.08+0.13*i)+Math.sin(bgT*0.35+i)*35;
   const by=bgC.height*(0.18+0.1*i)+Math.cos(bgT*0.28+i*1.4)*45;
   const br=18+i*9;
   bgCtx.globalAlpha=0.06+0.04*Math.sin(bgT*0.9+i);
   bgCtx.beginPath();bgCtx.arc(bx,by,br,0,Math.PI*2);
   bgCtx.fillStyle='#e8b430';bgCtx.fill();
  }
  bgT+=0.016;requestAnimationFrame(animBg);
 }
 animBg();
}
window.startPicker=function(mode){
 pickerDetailMode=false;pendingSelections={};
 const ss=document.getElementById('start-screen');if(ss)ss.style.display='none';
 const old=document.getElementById('picker-screen');if(old)old.remove();
 const defaults=['knight','samurai','barbarian','paladin','wizard','ranger','viking','rogue'];
 const slots=[{id:0,label:'RED',color:'#ff7755'},{id:1,label:'BLUE',color:'#88bbdd'}];
 slots.forEach((s,i)=>{pendingSelections[s.id]=defaults[i%defaults.length];});
 pickerSlot=slots[0].id;
 const ps=document.createElement('div');ps.id='picker-screen';
 const hdr=document.createElement('div');hdr.id='picker-header';
 const backBtn=document.createElement('button');backBtn.id='picker-back';backBtn.textContent='◀ BACK';
 backBtn.onclick=()=>{ps.remove();showStartScreen();};hdr.appendChild(backBtn);
 const slotRow=document.createElement('div');slotRow.id='picker-slots';
 slots.forEach(s=>{
  const btn=document.createElement('div');
  btn.className='pslot'+(s.id===pickerSlot?' active':'')+' filled';
  btn.dataset.slotId=s.id;
  btn.innerHTML=`<span class="pslot-label" style="color:${s.color}">${s.label}</span><span class="pslot-name">${DEF[pendingSelections[s.id]].label}</span>`;
  btn.onclick=()=>selectSlot(s.id);
  slotRow.appendChild(btn);
 });
 hdr.appendChild(slotRow);
 const detToggle=document.createElement('button');detToggle.id='detail-toggle';detToggle.textContent='📋 DETAILS';
 detToggle.onclick=()=>{
  pickerDetailMode=!pickerDetailMode;
  detToggle.classList.toggle('on',pickerDetailMode);
  document.getElementById('picker-detail').classList.toggle('hidden',!pickerDetailMode);
  renderPickerGrid();
 };
 hdr.appendChild(detToggle);
 const launchBtn=document.createElement('button');launchBtn.id='picker-launch';launchBtn.textContent='▶ FIGHT!';
 launchBtn.onclick=launchBattle;hdr.appendChild(launchBtn);
 ps.appendChild(hdr);
 const body=document.createElement('div');body.id='picker-body';
 const grid=document.createElement('div');grid.id='picker-grid';body.appendChild(grid);
 const detail=document.createElement('div');detail.id='picker-detail';detail.classList.add('hidden');body.appendChild(detail);
 ps.appendChild(body);
 document.body.appendChild(ps);
 renderPickerGrid();
 renderDetailPanel(pendingSelections[pickerSlot]);
};
function selectSlot(id){
 pickerSlot=id;
 document.querySelectorAll('.pslot').forEach(b=>b.classList.toggle('active',+b.dataset.slotId===id));
 renderPickerGrid();
 renderDetailPanel(pendingSelections[id]);
}
function statBar(label,val,max,col){
 const pct=Math.min(100,Math.round((val/max)*100));
 const disp=(typeof val==='number'&&val%1!==0)?val.toFixed(1):val;
 return `<div class="dbar-wrap"><div class="dbar-labels"><span class="dbar-label">${label}</span><span class="dbar-val">${disp}</span></div><div class="dbar"><div class="dbar-fill" style="width:${pct}%;background:${col}"></div></div></div>`;
}
function renderPickerGrid(){
 const grid=document.getElementById('picker-grid');if(!grid)return;
 grid.innerHTML='';
 const curKey=pendingSelections[pickerSlot];
 Object.entries(DEF).forEach(([key,d])=>{
  const card=document.createElement('div');
  card.className='pcard'+(key===curKey?' selected':'');
  const role=CLASS_ROLE[key]||'FIGHTER';
  const rolec=ROLE_COLOR[role]||'#6080a8';
  const isRanged=RANGED_KEYS.has(key);
  const iconImg=`<img src="${getSphereIcon(key,40)}" width="40" height="40" style="image-rendering:pixelated;">`;
  if(pickerDetailMode){
   card.innerHTML=`
    <div style="width:100%;display:flex;align-items:center;gap:5px;margin-bottom:3px;">
     ${iconImg}
     <div><div class="pcard-name">${d.label}</div>
     <span class="pcard-role" style="color:${rolec};background:${rolec}22">${role}</span></div>
    </div>
    <div style="width:100%">
     ${statBar('HP',d.hp,900,'#aa4444')}
     ${statBar('ARM',d.arm,280,'#4466aa')}
     ${statBar('MDEF',d.magDef,100,'#8844cc')}
     ${statBar('DMG',d.dmg,10,'#aa8822')}
     ${statBar('SPD',d.spd,255,'#44aa66')}
     ${statBar('SPIN',d.om,13,'#aa44aa')}
     ${statBar('REACH',d.reach,5,'#22aaaa')}
    </div>
    <div style="width:100%;border-top:1px solid #1e2e45;padding-top:3px;margin-top:2px;">
     <div style="font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#e8b430;">${d.weapon}</div>
     <div style="font-family:'VT323',monospace;font-size:clamp(8px,1.6vw,11px);color:#cc88ff;">${d.ab}</div>
     ${isRanged?'<div style="font-family:\'VT323\',monospace;font-size:clamp(7px,1.4vw,10px);color:#2a8a8a;">◎ RANGED</div>':''}
    </div>`;
  } else {
   card.innerHTML=`
    <div class="pcard-icon">${iconImg}</div>
    <div class="pcard-name">${d.label}</div>
    <span class="pcard-role" style="color:${rolec};background:${rolec}22">${role}</span>
    <div class="pcard-ab">${d.ab}</div>
    <div class="pcard-stats">
     <div class="pstat">HP<span style="color:#cc5555">${d.hp}</span></div>
     <div class="pstat">ARM<span style="color:#5577cc">${d.arm}</span></div>
     <div class="pstat">DMG<span style="color:#cc9922">${d.dmg.toFixed(1)}</span></div>
    </div>`;
  }
  card.onclick=()=>{
   pendingSelections[pickerSlot]=key;
   const slotBtn=document.querySelector(`[data-slot-id="${pickerSlot}"] .pslot-name`);
   if(slotBtn)slotBtn.textContent=d.label;
   renderPickerGrid();
   renderDetailPanel(key);
   const allSlots=[...document.querySelectorAll('.pslot')].map(b=>+b.dataset.slotId);
   const cur=allSlots.indexOf(pickerSlot);
   if(cur<allSlots.length-1)selectSlot(allSlots[cur+1]);
  };
  grid.appendChild(card);
 });
}
function renderDetailPanel(key){
 const panel=document.getElementById('picker-detail');if(!panel)return;
 const d=DEF[key];
 const role=CLASS_ROLE[key]||'FIGHTER';
 const rolec=ROLE_COLOR[role]||'#6080a8';
 const isRanged=RANGED_KEYS.has(key);
 const desc=CLASS_DESC[key]||{ability:'—',passive:'—'};
 const iconSrc=getSphereIcon(key,52);
 panel.innerHTML=`
  <div style="text-align:center;padding-bottom:8px;border-bottom:1px solid #1e2e45;">
   <img src="${iconSrc}" width="52" height="52" style="image-rendering:pixelated;">
   <div style="font-family:'Press Start 2P',monospace;font-size:clamp(6px,1.3vw,8px);color:#ccddf0;margin:4px 0;">${d.label}</div>
   <span class="pcard-role" style="color:${rolec};background:${rolec}22;font-size:clamp(10px,2vw,13px);">${role}</span>
   ${isRanged?'<div style="font-family:\'VT323\',monospace;font-size:clamp(9px,1.8vw,12px);color:#2a8a8a;margin-top:2px;">◎ RANGED</div>':''}
  </div>
  <div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#e8b430;margin-bottom:2px;">WEAPON</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(10px,2vw,13px);color:#ccddf0;">${d.weapon}</div>
  </div>
  <div style="border:1px solid #2a1e50;background:#0e0820;padding:6px;border-radius:2px;">
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#cc88ff;margin-bottom:3px;">⚡ ABILITY</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#b0a0d0;line-height:1.35;">${desc.ability}</div>
  </div>
  <div style="border:1px solid #1a2e1a;background:#080e08;padding:6px;border-radius:2px;">
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#88cc88;margin-bottom:3px;">◈ PASSIVE</div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#90b090;line-height:1.35;">${desc.passive}</div>
  </div>
  <div>
   <div style="font-family:'VT323',monospace;font-size:clamp(9px,1.8vw,12px);color:#e8b430;margin-bottom:4px;">STATS</div>
   ${statBar('HP',d.hp,900,'#aa4444')}
   ${statBar('ARMOR',d.arm,280,'#4466aa')}
   ${statBar('MAGIC DEF',d.magDef,100,'#8844cc')}
   ${statBar('DAMAGE',d.dmg,10,'#aa8822')}
   ${statBar('SPEED',d.spd,255,'#44aa66')}
   ${statBar('SPIN ω',d.om,13,'#aa44aa')}
   ${statBar('REACH',d.reach,5,'#22aaaa')}
   ${statBar('MASS',d.mass,22,'#666688')}
   <div class="dstat-row"><span class="dbar-label">RESTITUTION</span><span class="dbar-val">${d.rest.toFixed(2)}</span></div>
  </div>`;
}
function launchBattle(){
 gameMode='1v1';
 document.getElementById('card').className='mode-1v1';
 buildSelRow();
 Object.entries(pendingSelections).forEach(([idx,key])=>{
  const sel=document.getElementById(`sel-${idx}`);if(sel)sel.value=key;
 });
 const ps=document.getElementById('picker-screen');if(ps)ps.remove();
 const ss=document.getElementById('start-screen');if(ss)ss.style.display='none';
 document.getElementById('mode-row').style.display='flex';
 document.getElementById('sel-row').style.display='flex';
 document.getElementById('card').style.display='flex';
 document.getElementById('controls').style.display='flex';
 newBattle();
 paused=true;
 showCountdown(3,()=>{paused=false;lastTime=performance.now();});
}
function showCountdown(n,onDone){
 let ov=document.getElementById('countdown-overlay');
 if(!ov){
  ov=document.createElement('div');ov.id='countdown-overlay';
  ov.innerHTML='<div id="countdown-num"></div><div id="countdown-label">GET READY</div>';
  document.getElementById('arena-border').appendChild(ov);
 }
 ov.classList.add('show');
 const numEl=document.getElementById('countdown-num');
 const lblEl=document.getElementById('countdown-label');
 function tick(r){
  if(r<=0){ov.classList.remove('show');numEl.textContent='FIGHT!';numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
   setTimeout(()=>{numEl.textContent='';lblEl.textContent='GET READY';ov.classList.remove('show');onDone();},600);return;}
  numEl.classList.remove('cd-pop');void numEl.offsetWidth;numEl.classList.add('cd-pop');
  numEl.textContent=r;
  lblEl.textContent=r===1?'LAST CHANCE':'GET READY';
  countdownTimer=setTimeout(()=>tick(r-1),1000);
 }
 tick(n);
}
window.addEventListener('load',()=>setTimeout(showStartScreen,80));
// ▓▓▓ END:UI ▓▓▓
