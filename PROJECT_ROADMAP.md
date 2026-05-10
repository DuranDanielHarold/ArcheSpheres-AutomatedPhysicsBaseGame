# Project Roadmap

This file is local-only project memory.
It is intentionally ignored by Git and should not be pushed to GitHub.

## Current State

- Core game runs in plain HTML/CSS/JS
- Modular file split is already in place
- Initial per-sphere audio support exists
- Weapon clash audio is wired
- Wizard projectile throw and projectile hit audio are wired
- Audio UI now exists for mute, SFX, and BGM volume
- Centralized audio volume defaults live in `js/data.js`

## Active Direction

Primary near-term focus:

1. finish audio support
2. build testing ground
3. build automated battle/simulation support
4. support balancing workflows and patch tracking

## Recommended Implementation Order

### Phase 1 - Audio Stability

- verify mute / SFX / BGM controls behave correctly
- add arena BGM asset and confirm playback lifecycle
- wire more class ability and damage sounds
- move remaining sound-specific values into config if needed

### Phase 2 - Match Logging Foundation

- add structured match result object
- add structured combat event logging
- log:
  - winner
  - loser
  - duration
  - total damage dealt/taken
  - weapon clashes
  - projectile hits
  - ability usage
  - deaths

### Phase 3 - Testing Ground

- create a dedicated sandbox/test mode
- choose any two spheres quickly
- expose:
  - restart
  - pause
  - frame-step or slow motion
  - seed
  - arena size
  - stat overrides
  - live telemetry panel

### Phase 4 - Automated Battles

- add auto-run battle mode
- allow repeated runs per matchup
- allow round-robin testing
- output summary results for balancing

### Phase 5 - Balance Data Storage

- local storage format for patch notes
- local storage format for match result history
- start with JSON files
- consider SQLite later only if needed

### Phase 6 - AI-Assisted Analysis

- summarize match result files
- identify win-rate outliers
- suggest likely overtuned/undertuned stats
- draft human-readable patch note language

## Local File Structure To Add Later

Potential future local folders:

```text
balance/
  patches/
  results/
  baselines/
tools/
```

## Session Resume Prompt

When starting a new session, use:

```text
Continue from PROJECT_ROADMAP.md, BALANCE_PLAN.md, and ARCHITECTURE_NOTES.md.
```
