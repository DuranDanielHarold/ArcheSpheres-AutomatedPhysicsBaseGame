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

`js/data/classDefs.js`
Defines the `DEF` class stat, weapon, and ability configuration block.

`js/data/classMeta.js`
Defines class role metadata, role colors, and class descriptions.

`js/data/classStacks.js`
Defines stack thresholds and stack display threshold helpers.

`js/data/audioConfig.js`
Defines sphere audio paths, arena audio paths, audio defaults, and volume settings.

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

Update the split data files:

- `DEF` in `js/data/classDefs.js`
- `CLASS_ROLE` in `js/data/classMeta.js`
- `ROLE_COLOR` in `js/data/classMeta.js`
- `CLASS_DESC` in `js/data/classMeta.js`
- `SPHERE_AUDIO` in `js/data/audioConfig.js`

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

- Crusader: monitor next cycle. Decisive win rate was 67.7%, masked by a 50.5% draw rate; re-evaluate after anti-stall changes because fixing draw-heavy matches may raise practical win rate without Crusader stat changes.
- T3 kit-integrity review (Sage, Locksmith, Templar, Queen): no obvious broken wiring was found in the current ability paths during this numeric patch. Sage fires wisdom-word projectiles and resolves Foresight, Locksmith applies lock/jam through weapon hits and clashes, Templar creates a SlowZone that is applied during sphere updates, and Queen's Gambit true-damage path is wired. These kits still need a design/ability review beyond stat tuning because near-0% decisive win rates are unlikely to be solved by numbers alone.
- T4 stall review (Viking, King, Alchemist, Golem): live matches and balance baselines now share sudden-death timing from `STALL_CONFIG`; re-evaluate high-draw classes against the synced timeout/ramp before relying on stat buffs alone.
