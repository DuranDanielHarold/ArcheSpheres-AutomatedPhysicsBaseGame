# Feature & Retention Roadmap

Public-facing roadmap for ArcheSpheres — committed to the repo, unlike
`PROJECT_ROADMAP.md`, `ARCHITECTURE_NOTES.md`, `BALANCE_PLAN.md`, and
`CLASS_REFACTOR_PLAN.md`, which stay local-only and gitignored. Safe to delete
once the items below are shipped or superseded.

## Purpose

ArcheSpheres today is match-in, match-out: nothing persists between sessions
except audio settings. This doc collects ideas for turning single matches into
something players come back for — new modes, a meta layer, and presentation
polish — grouped and roughly prioritized, for reference when picking the next
initiative.

## Status Legend

- Not started
- In progress
- Shipped

## Priority Picks

1. **Player profile / meta-progression layer** — Not started. Foundation for
   almost everything else below (achievements, tier list, career stats). Only
   1v1/testing can feed it today since `_liveCombatTracker` is intentionally
   disabled for 2v2 pending per-faction attribution.
2. **A real event mode (Tournament Bracket or Battle Royale)** — In progress. A
   single 1v1 match is a moment; a bracket or a shrinking-arena FFA is something
   you sit through and root for someone in. See "Battle Royale" below for the
   active build plan.
3. **Juice pass (hit-stop, camera punch, slow-mo finisher)** — Not started.
   Cheap relative to new systems, high ROI for "this feels like a real game."
   Builds on existing `hitFlash`, damage numbers, and burst particles.

## Battle Royale — Active Build Plan

Direction: N-sphere free-for-all (each sphere its own faction), launched from
the start screen with random class selection (no picker yet). Distinct visual
identity from 1v1/2v2 — much larger arena footprint (~90% of viewport) with
proportionally smaller spheres and weapons, applied uniformly across devices
rather than gated to the existing mobile-landscape media queries.

Split into two Codex sessions per the project's existing one-task-per-session
discipline:

- **Session 1 (core logic)** — 8-faction FFA, N-way win/timeout resolution,
  minimal "N REMAINING" HUD, start-screen entry point. Arena size and sphere
  scale unchanged from 1v1 — purely mechanical correctness.
- **Session 2 (visual treatment)** — `#card.mode-royale` CSS sized to ~90% of
  viewport on all devices, plus a reduced sphere-radius fraction in the
  `Sphere` constructor for royale specifically. Weapon scale follows sphere
  radius automatically since every weapon draw function already takes `r`
  (sphere radius) as its base unit, so no separate weapon-scale change is
  needed. Planned once Session 1 is verified.

Known landmines addressed in Session 1 (all currently hardcoded to exactly two
factions — faction 0 = red / faction 1 = blue):

- `checkMatchTimeout()` in `js/loop/stall-resolution.js` — only checks factions
  0 and 1; would silently ignore factions 2-7 in an FFA that runs past the hard
  timeout.
- `showWinner()` in `js/loop/game-loop.js` — winner label color is `faction===0
  ? red : blue`.
- Win-screen rematch gesture — quick-tap/long-press routing assumes
  `randomModeActive` always means "re-roll a 1v1," and long-press assumes a
  working picker exists for the current mode.
- `newBattle()`'s spawn math in `js/main.js` — positions spheres by splitting
  the arena into a left (faction 0) / right (faction 1) half.

`STALL_CONFIG` in `js/data/stallConfig.js` is also read directly by
`js/tools/balance-runner.js`'s defaults, so royale gets its own sibling config
(`ROYALE_STALL_CONFIG`) rather than modified values in place.

## Progression & Meta

- **Player profile** — matches played, per-class win/loss, biggest hit, fastest
  KO, longest match. Status: not started.
- **Achievements / milestones** — win with 10 different classes, win at <5% HP,
  cause a double KO. Cheap once the profile exists. Status: not started.
- **Cosmetic unlocks** — alt weapon palettes tied to achievements. Zero balance
  risk, pure collection hook. Status: not started.
- **In-game Tier List / Meta Report** — `balance-runner.js` already computes
  `balanceScore` and win rates; expose a simplified S/A/B/C view to players.
  Free content from data already produced. Status: not started.

## New Modes

- **Battle Royale** — see above. Status: in progress.
- **Tournament Bracket** — single-elimination, 8/16 spheres. Status: not
  started.
- **Draft / pick-ban** — alternating picks and bans from the 50-class pool
  before a match. Status: not started.
- **Survival Gauntlet** — one sphere, a scaling run of opponents with partial
  heal between rounds, local high score. Status: not started.
- **Boss Rumble** — one stat-scaled "boss" sphere vs. a swarm of normal ones.
  Status: not started.

## Presentation

- **Juice pass** — see above. Status: not started.
- **Arena themes / hazards** — lava tick zones, ice friction, a shrinking ring
  (also doubles as part of the Battle Royale toolkit). Status: not started.
- **Shareable result card** — auto-generate a small image after a match
  ("Warlord defeated Priest in 0:47"). No backend needed. Status: not started.
- **Replay save** — matches are already seeded (the balance runner proves
  determinism); "save seed + picks" for re-watch/share is relatively cheap.
  Status: not started.

## UI / UX

- **Champion-select-style picker** — lean the detail panel more toward
  hype/flavor (bigger portrait, one-liner), with stat bars as a toggle for the
  crunchy version. Status: not started.
- **Post-match polish** — MVP callout, "biggest hit of the match" line, more
  prominent share/report buttons. Status: not started.
- **Home screen redesign** — fit Tournament / Battle Royale / Gauntlet / Career
  into the mode row without cluttering the current 1v1/2v2/Random/Testing set.
  Status: not started.

## Roster

50 classes is already a lot; more headcount has diminishing balance-surface
returns. Better ROI: **ability variants ("runes")** — 2-3 selectable
ability/passive variants per class, chosen pre-match, so existing classes get
build diversity without growing the balance matrix. Status: not started.

If new fantasy gaps are wanted later: a pure control class (near-zero damage,
all CC), a true anti-heal/anti-shield duelist, or a terrain-manipulator that
reshapes the arena instead of fighting directly. Status: not started.

## Session Log

- 2026-08-17 — Drafted this roadmap. Chose Battle Royale as the next build
  target, scoped as two sequential Codex sessions (core logic, then visual
  treatment).
