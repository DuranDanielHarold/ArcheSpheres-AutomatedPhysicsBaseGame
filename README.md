# ArcheSpheres

ArcheSpheres is a browser-based HTML5 canvas combat sandbox built around automated physics battles between weaponized spheres. Each sphere has its own stats, weapon geometry, class role, passive behavior, and active ability. The game runs entirely on the client with plain HTML, CSS, and JavaScript.

The project started as a single-file prototype and was later separated into modular files for maintainability. The current structure keeps the original gameplay style intact while making it easier to expand classes, abilities, weapons, visuals, and audio.

## Highlights

- Automated 1v1 arena battles with physics-driven movement and collisions
- Large playable class roster with unique weapons, passives, and active abilities
- HTML5 canvas rendering with custom sprite-like weapon drawing
- Split-file architecture for data, entities, rendering, UI, and engine behavior
- Per-sphere audio placeholders with live support for weapon clash and Wizard projectile audio
- No backend, no database, no account system, no analytics dependency

## Play Locally

Because this project is plain frontend code, you can run it directly in a browser.

### PowerShell

```powershell
start index.html
```

If you prefer a specific browser:

```powershell
Start-Process chrome.exe .\index.html
```

```powershell
Start-Process msedge.exe .\index.html
```

## Project Structure

```text
.
├── index.html
├── styles.css
├── README.md
├── PRIVACY.md
├── .gitignore
├── audio/
│   ├── README.md
│   └── <sphere-name>/
└── js/
    ├── core/
    ├── classes/
    ├── data/
    ├── weapons/
    ├── entities/
    ├── combat/
    ├── audio/
    ├── hud/
    ├── loop/
    ├── ui/
    └── main.js
```

## Code Map

`js/core/constants.js`
Defines shared physics constants, burn tick intervals, and `RANGED_KEYS`.

`js/core/rrect.js`
Defines the shared rounded-rectangle canvas helper used by weapons and entities.

`js/core/class-registry.js`
Declares the classic-script class registries (`DEF`, `CLASS_ROLE`, `CLASS_DESC`, stack thresholds, sphere audio, and behavior hook maps) populated by `js/classes/<key>.js`.

`js/classes/<key>.js`
Owns each sphere class's stats, role, descriptions, stack thresholds, sphere audio entry, and behavior registry hooks as they are migrated out of core Sphere/combat code.

`js/data/audioConfig.js`
Defines arena audio paths, audio defaults, and non-class volume settings.

`js/weapons/weapons-melee.js`
Contains melee-oriented weapon drawing functions.

`js/weapons/weapons-ranged.js`
Contains ranged weapon drawing functions.

`js/weapons/weapons-exotic.js`
Contains exotic and ability-heavy weapon drawing functions.

`js/weapons/weapons-index.js`
Reconstructs the single global `WEAPONS` map from the grouped weapon maps.

`js/entities/projectiles-basic.js`
Contains basic projectile classes such as arrows, bullets, hooks, bolas, and holy orbs.

`js/entities/projectiles-roster.js`
Contains roster-specific projectile classes and alchemy flask configuration.

`js/entities/projectiles-shared.js`
Contains shared entity-style projectile/effect classes formerly housed in the engine.

`js/entities/zones-and-traps.js`
Contains slow zones, patches, miasmas, void/singularity effects, burial mounds, shards, and rat minions.

`js/entities/companions.js`
Contains companion and summon classes, including skeleton-derived allies.

`js/entities/sphere.js`
Contains the main `Sphere` class and class-specific behavior methods.

`js/combat/collisions.js`
Handles collision resolution, faction helpers, weapon hits/clashes, locksmith locks, and skeleton combat interactions.

`js/combat/particles-fx.js`
Handles particle/effect spawning, damage and heal numbers, blood splats, and background drawing.

`js/audio/audio-engine.js`
Handles audio state, preloading, playback helpers, mute/volume controls, and arena BGM lifecycle.

`js/hud/hud.js`
Updates the ability bar and stat panel.

`js/loop/game-loop.js`
Runs the update/draw loop and winner/rematch overlay flow.

`js/ui/picker-styles.js`
Injects picker and start-screen styles.

`js/ui/start-screen.js`
Controls start-screen rendering and cached sphere icon generation.

`js/ui/picker-screen.js`
Controls class picker state, slot selection, card grid rendering, stat bars, and detail panels.

`js/ui/battle-launch.js`
Controls battle launch handoff and countdown overlays.

`js/main.js`
Bootstraps canvas state, mutable game arrays, battle creation, mode controls, and resize handling.

## Audio System

Audio paths are configured in `js/data/audioConfig.js` under:

- `SPHERE_AUDIO`
- `ARENA_AUDIO`

Current supported live hooks include:

- weapon clash audio
- Wizard projectile throw audio
- Wizard projectile hit audio

Future audio categories already scaffolded in the data map include:

- sphere damage audio
- sphere ability audio
- arena background music

See [audio/README.md](audio/README.md) for folder guidance.

## Customization Workflow

### Add or edit a class

Update one class registry file: `js/classes/<key>.js`. That file owns the class's `DEF` stats, `CLASS_ROLE`, `CLASS_DESC`, stack thresholds, `SPHERE_AUDIO`, and any class-specific handler registrations. Shared role colors remain in `js/core/class-registry.js`.

Class roles are intentionally normalized to six balance baselines only: `TANK`, `FIGHTER`, `ASSASSIN`, `MAGE`, `MARKSMAN`, and `SUPPORT`. Use these roles as the first-pass stat basis before making class-specific exceptions.

### Add audio

1. Put the audio file into the matching `audio/<sphere-name>/` folder.
2. Add or update the relative path in `SPHERE_AUDIO`.
3. Wire the event in the relevant `js/entities/`, `js/combat/`, or `js/audio/` file if that audio type is not already connected.

### Tune gameplay

Common balance values live in `DEF`:

- `mass`
- `spd`
- `hp`
- `om`
- `dmg`
- `arm`
- `magDef`
- `rest`
- `reach`
- `tipR`

## Design Intent

The game is built around spectacle from simple rules: elastic motion, rotating weapon arcs, ranged pressure, impact bursts, and class-specific ability spikes. Even though the presentation is compact, the class roster is meant to feel expressive and readable rather than purely random.

## Privacy and Safety

This project is local-first and client-only.

- No user accounts
- No telemetry
- No cookies
- No remote API calls for gameplay
- No personal data storage by default

See [PRIVACY.md](PRIVACY.md) for a short privacy statement you can keep in the repository.

## Recommended Next Steps

- Wire damage and ability audio for more classes
- Add arena BGM support
- Add mute and volume controls in the UI
- Add explicit changelog/version tracking
- Add gameplay capture screenshots or GIFs to this README

## License

This project is released under the [MIT License](LICENSE).

## Balance baseline automation

Click **BALANCE TEST** in the control bar to run the background baseline preset. It uses the live sudden-death timing from `js/data/stallConfig.js`, targets up to 50,000 evenly distributed matches by fast-forwarding simulation steps without drawing particles, updates the status text as a lightweight loading indicator, then downloads JSON and CSV reports.

The browser runtime also exposes a console helper for custom baseline runs:

```js
await runBalanceBaseline({ minutes: 20, roundsPerPair: 6, targetGamesPerClass: 200, noVisuals: true });
```

For deeper overnight-style sampling, raise the wall-clock budget and remove the match cap:

```js
await runBalanceBaseline({ minutes: 120, roundsPerPair: 10, targetMatches: 0, noVisuals: true });
```

The runner fast-forwards deterministic 1v1 battles in the loaded page without drawing particles by default, schedules matchups in round-robin order so capped runs stay evenly distributed across classes, rotates both red/blue sides for each matchup, and downloads JSON plus class/matchup CSV summaries. The class CSV includes weighted `balanceScore`, `action` (NERF/BUFF/WATCH/NEEDS_MORE_DATA), `magnitude`, `totalAdjustmentPct`, `statAdjustments`, `patchTarget`, normalized role, confidence, decisive win rate, draw rate, HP-margin columns, hard-counter counts, and best/worst matchup columns. The matchup CSV includes decisive games, draw rate, leader win rate, hard-counter flags, and impossible-match flags. The latest in-page report is also available as `window.lastBalanceReport` for manual inspection.

Useful shorter smoke-test command:

```js
await runBalanceBaseline({ minutes: 1, roundsPerPair: 1, keys: ['knight', 'samurai', 'wizard', 'ranger'], exportJson: false, exportCsv: false });
```

## Balance patch monitoring notes

- 2026-08-08 baseline cycle: applied a severity-scaled numeric pass to 44 of 50 live `js/classes/<key>.js` definitions, leaving only WATCH classes (`witch`, `glassblower`, `alchemist`, `gladiator`, `ninja`, `mimic`) unchanged. The source baseline used 50,000 matches with confidence 1.0 for every class and showed systemic raw-power skew, so this pass scales the runner's role-weighted stat suggestions by distance from 50% win rate rather than making kit changes.
- Crusader draw-rate monitoring is resolved for this cycle. The new baseline shows Crusader at 0.3% draw rate, 19.9% win rate, and no roster-wide tiebreak-win masking, so Crusader's underperformance is now treated as a true stat-balance signal rather than a stale stall artifact.
- T4 stall review for `viking`, `king`, `alchemist`, and `golem` is closed for this cycle: all four show draw rates under 0.5% after the shared `STALL_CONFIG` timeout/ramp sync.
- Ranged projectile hit rates remain a flagged follow-up. Nine of ten ranged classes connect on under 15% of fired projectiles (`necromancer`, `ranger`, `wizard`, `fairy`, `sheriff`, `arcanist`, `sage`, `witch`, plus the broader archetype pattern), while `priest` and especially `bard` connect more reliably; if these classes remain bottom-tier after the next like-for-like baseline, investigate projectile targeting/tracking before stacking more stat buffs onto near-zero hit rates.
- Melee `VISUAL_OUTPACING_HITBOX` flags remain a balance-runner metric follow-up, not per-class content work. Because the flag fires across roughly 36 of 50 classes, including both top and bottom performers, review `computeMeleeHitboxAction`/`avgMeleeHitRate` sampling before making individual hitbox changes from that signal.
- T3 kit-integrity review (Sage, Locksmith, Templar, Queen): no obvious broken wiring was found in the current ability paths during the prior numeric patch. Sage fires wisdom-word projectiles and resolves Foresight, Locksmith applies lock/jam through weapon hits and clashes, Templar creates a SlowZone that is applied during sphere updates, and Queen's Gambit true-damage path is wired; revisit kit design only after the next post-patch baseline confirms stats alone are insufficient.
- 2026-08-10 baseline cycle: applied a severity-scaled numeric pass (2–18% per stat, scaled by distance from balanced win rate rather than the prior cycle's flat 5% cap) to 37 of 50 live `js/classes/<key>.js` definitions, sourced from `balance-class-summary-2026-08-10T04-43-50-368Z.csv` / `balance-matchup-summary-2026-08-10T04-43-50-368Z.csv` (10,000 games/class, confidence 1.0). Win rates this baseline spanned 3.1% (Templar) to 92% (Priest), a wider spread than the prior cycle despite that pass, indicating either compounding snowball dynamics or kit-level issues beyond what stat tuning can fix. 18 classes crossed the severity cap (|balanceScore| >= 100 or hit the 18% ceiling): templar, plague, priest, sage, locksmith, phoenix, warlord, paladin, dragoon, queen, crusader, knight, arcanist, prince, jester, sheriff, beastmaster, necromancer. Priest in particular shows 44 dominant matchups, 0 hard counters against it, and OVERHAUL-flagged ability/passive damage share — this is very likely a kit issue (Benediction/Holy Orb uptime + shield stacking), not just raw stats, and should get a T3-style kit-integrity pass before the next numeric cycle. Templar and Plague sit at the opposite extreme (near-0% win rate against most of the roster, "VISUAL_OUTPACING_HITBOX"/"OVERHAUL" flags) and likely need the same kind of review rather than further stat buffs. 12 WATCH classes left untouched this cycle: alchemist, barbarian, druid, gladiator, inquisitor, king, mimic, ninja, ratcatcher, rogue, tidecaller, witch.
