'use strict';
// ▓▓▓ MODULE: data/classMeta.js — extracted from former js/data.js ▓▓▓
// Class role, color, and description metadata.

const CLASS_ROLE = {
  knight:'TANK',samurai:'FIGHTER',viking:'FIGHTER',barbarian:'FIGHTER',paladin:'TANK',
  ninja:'ASSASSIN',wizard:'MAGE',berserker:'FIGHTER',ranger:'MARKSMAN',templar:'TANK',
  rogue:'ASSASSIN',warlord:'FIGHTER',druid:'MAGE',necromancer:'MAGE',pirate:'FIGHTER',
  jester:'MAGE',golem:'TANK',phoenix:'FIGHTER',guardian:'TANK',trickster:'ASSASSIN',
  sheriff:'MARKSMAN',priest:'SUPPORT',
  inquisitor:'FIGHTER',
  vampire:'ASSASSIN',
  monk:'FIGHTER',
  alchemist:'MAGE',
  dragoon:'FIGHTER',
  bard:'SUPPORT',
  plague:'MAGE',
  tidecaller:'MAGE',
  crusader:'TANK',
  mimic:'ASSASSIN',
  stormbringer:'MAGE',
  voidwalker:'MAGE',
  whelpling:'FIGHTER',
  gravedigger:'FIGHTER',
  flagellant:'FIGHTER',
  ratcatcher:'MARKSMAN',
  locksmith:'ASSASSIN',
  glassblower:'MAGE',witch:'MAGE',spartan:'FIGHTER',gladiator:'FIGHTER',king:'TANK',queen:'ASSASSIN',prince:'FIGHTER',fairy:'SUPPORT',beastmaster:'FIGHTER',sage:'SUPPORT',arcanist:'MAGE'
};

const ROLE_COLOR = {
  TANK:'#6080a8',
  FIGHTER:'#c07838',
  ASSASSIN:'#9b59b6',
  MAGE:'#8844cc',
  MARKSMAN:'#2a8a8a',
  SUPPORT:'#c8a000'
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

