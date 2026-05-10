# Balance Plan

This file is local-only project memory.
It is intentionally ignored by Git and should not be pushed to GitHub.

## Goal

Turn ArcheSpheres from a playable arena battler into a measurable combat simulation that supports repeatable balancing patches.

## Core Balance Questions

- Which spheres are overperforming across many seeds?
- Which matchups are too one-sided?
- Are ranged spheres too safe relative to melee spheres?
- Are abilities deciding matches too often or too rarely?
- Are specific mechanics causing runaway wins?

## Proposed Balance Metrics

### Match Outcome Metrics

- win rate by class
- win rate by matchup
- mirror match stability
- average match duration
- shortest and longest match duration

### Combat Metrics

- total damage dealt
- total damage taken
- projectile hit rate
- weapon hit rate
- ability activation count
- ability hit effectiveness
- healing total
- survivability time

### Control / Feel Metrics

- stun frequency
- knockback pressure
- wall interaction frequency
- time spent near target / kiting distance

## Initial Balance Targets

These are working targets, not final rules.

- average class win rate should not sit far above the pack over large samples
- hard-counter matchups should exist, but not create near-unwinnable outcomes
- match duration should avoid both instant stomps and overly long stalemates
- ranged classes should trade survivability for pressure, not get both for free
- high-impact abilities should feel meaningful without deciding every match by themselves

## Required Tooling

### Before serious balancing

- structured match result output
- combat event logging
- repeatable seeded battles
- batch simulation mode

### Nice to have

- live balance dashboard
- exported CSV / JSON summaries
- local patch history comparison

## Patch Workflow Vision

1. choose a balance hypothesis
2. change a small set of values
3. run a simulation batch
4. compare against previous baseline
5. record results and notes
6. keep or revert

## Example Patch Record Format

```text
Patch Name:
Reason:
Changed Values:
Expected Outcome:
Simulation Summary:
Decision:
```

## Immediate Next Balance-Tech Step

Add structured combat logging and a reusable match result object.
