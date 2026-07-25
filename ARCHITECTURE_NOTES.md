# Architecture Notes

This file is local-only project memory.
It is intentionally ignored by Git and should not be pushed to GitHub.

## Current Architecture

### Rendering / App Shell

- `index.html` defines the canvas surface, surrounding UI, and classic-script load order
- `styles.css` defines visual layout and control styling

### Core Helpers

- `js/core/constants.js` contains shared physics constants, burn tick intervals, and ranged-class keys
- `js/core/rrect.js` contains the rounded-rectangle canvas helper shared by weapons and entities

### Game Data

- `js/data/classDefs.js` contains the `DEF` sphere definitions
- `js/data/classMeta.js` contains role metadata, role colors, and class descriptions
- `js/data/classStacks.js` contains stack thresholds and stack display helpers
- `js/data/audioConfig.js` contains sphere/arena audio paths, defaults, and volume settings

### Weapon Drawing

- `js/weapons/weapons-melee.js` contains melee-oriented weapon render functions
- `js/weapons/weapons-ranged.js` contains ranged weapon render functions
- `js/weapons/weapons-exotic.js` contains exotic and ability-heavy weapon render functions
- `js/weapons/weapons-index.js` reconstructs the global `WEAPONS` map from grouped weapon maps

### Entities / Behaviors

- `js/entities/projectiles-basic.js` contains arrows, bullets, hooks, bolas, and holy-orb style projectiles
- `js/entities/projectiles-roster.js` contains roster-specific projectiles and alchemy flask config
- `js/entities/projectiles-shared.js` contains shared entity/effect classes formerly in the engine
- `js/entities/zones-and-traps.js` contains terrain zones, patches, traps, mounds, shards, and rat minions
- `js/entities/companions.js` contains companions and skeleton-derived allies
- `js/entities/sphere.js` contains the main `Sphere` class and class-specific behavior methods

### Combat

- `js/combat/collisions.js` contains collision resolution, weapon hit/clash rules, faction helpers, lock handling, and skeleton combat interactions

### Effects

- `js/combat/particles-fx.js` contains particle spawning / updates / drawing, blood splats, damage/heal numbers, and background rendering

### Audio

- `js/audio/audio-engine.js` contains SFX playback, audio preloading, mute/volume state, and BGM lifecycle support

### Simulation / Engine

- `js/hud/hud.js` contains HUD stat and ability bar updates
- `js/loop/game-loop.js` contains update/draw loop orchestration and winner flow
- Live 1v1 combat tracking uses `window._liveCombatTracker` in parallel with the balance-runner tracker; 2v2 is intentionally gated off until per-sphere or per-faction attribution exists.
- The Battle Report UI is a presentation-only screen backed by `window._lastMatchReport` after tracked 1v1 matches.

### Boot / State

- `js/main.js` contains canvas bootstrapping, top-level mutable arrays, battle creation, mode controls, and resize logic

### UI Flow

- `js/ui/picker-styles.js` contains picker/start-screen style injection
- `js/ui/start-screen.js` contains start screen rendering and sphere icon generation
- `js/ui/picker-screen.js` contains picker state, slot selection, grid rendering, and detail panel rendering
- `js/ui/battle-launch.js` contains battle launch flow and countdown

## Important Technical Decisions

- stay in plain HTML/CSS/JS for now
- do not introduce a framework until UI complexity clearly exceeds current structure
- keep game logic separate from presentation whenever practical
- centralize tunable balance and audio values in `js/data/`
- future balance systems should consume structured logs rather than scrape UI state

## Risks To Watch

- large monolithic entity logic becoming harder to tune
- audio wiring spreading across too many gameplay branches
- balancing without repeatable seeds or logs
- hidden coupling between battle flow and UI flow

## Next Structural Improvement

Current split foundations now exist:

- `js/logging.js` for match and event serialization
- `js/simulation.js` for future seeded / batch battle tools

Next useful improvement is wiring logging into combat events without changing match behavior.
