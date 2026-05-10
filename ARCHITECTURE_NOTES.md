# Architecture Notes

This file is local-only project memory.
It is intentionally ignored by Git and should not be pushed to GitHub.

## Current Architecture

### Rendering / App Shell

- `index.html` defines the canvas surface and surrounding UI
- `styles.css` defines visual layout and control styling

### Game Data

- `js/data.js` contains:
  - sphere definitions
  - role metadata
  - class descriptions
  - audio config
  - audio volume defaults

### Weapon Drawing

- `js/weapons.js` contains weapon render functions only

### Entities / Behaviors

- `js/entities.js` contains:
  - projectile classes
  - helper entities such as afterimages, traps, terrain zones, and summons
  - sphere behavior
  - class-specific fire / ability methods

### Combat

- `js/combat.js` contains:
  - collision resolution
  - weapon hit handling
  - weapon clash rules
  - skeleton combat interactions

### Effects

- `js/effects.js` contains:
  - particle spawning / updates / drawing
  - blood splats
  - damage and heal number rendering

### Audio

- `js/audio.js` contains:
  - SFX playback helpers
  - audio preloading
  - mute and volume state
  - BGM lifecycle support

### Simulation / Engine

- `js/engine.js` contains:
  - background rendering
  - HUD updates
  - update / draw loop orchestration
  - winner flow

### Boot / State

- `js/main.js` contains:
  - canvas bootstrapping
  - top-level mutable arrays
  - battle creation
  - resize logic

### UI Flow

- `js/ui.js` contains:
  - start screen
  - picker
  - battle launch flow
  - countdown

## Important Technical Decisions

- stay in plain HTML/CSS/JS for now
- do not introduce a framework until UI complexity clearly exceeds current structure
- keep game logic separate from presentation whenever practical
- centralize tunable balance and audio values in `js/data.js`
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
