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

## Patch Record — Cycle 2026-08-08 Severity-Scaled Full Pass

Patch Name: Cycle 2026-08-08 severity-scaled full-pass stat patch
Reason: The 50,000-match baseline from `balance-class-summary-2026-08-08T02-25-12-583Z.csv` and `balance-matchup-summary-2026-08-08T02-25-12-583Z.csv` flagged 44 of 50 classes as `NERF` or `BUFF`, with win rates spanning 2.3% Plague to 95.8% Warlord and 494 of 1,225 matchups resolving as impossible. The matchup concentration points to raw power skew rather than matchup-specific kit failures, so this cycle applies severity-scaled versions of the runner's role-weighted `statAdjustments` to live per-class `DEF` files only.
Changed Values: Applied every NERF and BUFF row from the Cycle 2026-08-08 baseline patch table to `js/classes/<key>.js` for 44 classes. Neutral WATCH classes (`witch`, `glassblower`, `alchemist`, `gladiator`, `ninja`, `mimic`) and dead monolith data files were left untouched.
Expected Outcome: `balanceScore` magnitude should shrink for all 44 touched classes, with the ≥35-point tier (`warlord`, `priest`, `templar`, `plague`, `locksmith`, `sage`) likely still requiring additional cycles. Follow-up findings remain open for ranged projectile hit rates, melee hitbox metric definition, and post-patch validation; Crusader and T4 stall/draw monitoring items should be considered resolved by the source baseline.
Simulation Summary:
Decision:
