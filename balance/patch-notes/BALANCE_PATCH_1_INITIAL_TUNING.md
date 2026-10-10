# ArcheSpheres — Balance Patch 1: First Tuning Pass

**Status:** Proposed patch notes / reference design  
**Baseline:** October 8, 2026 — 50,000 matches, seed 1337  
**Baseline configuration:** Stat modifiers OFF; arena modifiers OFF  
**Gameplay implementation:** Not included in this document  
**Purpose:** Provide a small, measurable first-pass tuning proposal that can be accepted, revised, or replaced after review.

> These are proposed changes, not proven fixes. The baseline establishes severe class-outcome disparities, but it does not isolate the exact cause of every result. This patch deliberately avoids ability rewrites and shared projectile-system changes so that the first test stays narrow.

## Patch goals

1. Reduce the most extreme upper-end results without flattening class identity.
2. Give the most extreme lower-end classes a modest damage-output test.
3. Keep the first pass limited to five class-specific numeric values.
4. Re-run the same baseline and judge the results across the whole roster, not only the edited classes.

## Proposed changes

### Phoenix — slight speed reduction

| Stat | Before | Proposed | Change |
|---|---:|---:|---:|
| Speed (`spd`) | 238.08 | 226.00 | -5.1% |

**Baseline result:** 90.15% win rate; 44 dominant matchups; average match duration 26.66 s.

**Reasoning:** Phoenix is the highest-performing class in the baseline. A small speed reduction tests whether its broad advantage is partly driven by movement, engagement control, and damage uptime. The data does not prove speed is the root cause, so this is a deliberately modest first experiment.

**Watch for:** Phoenix's matchup spread, time to first hit, damage dealt/received, average ending HP, and whether its win rate falls without creating new bad matchups.

### Knight — modest armor reduction

| Stat | Before | Proposed | Change |
|---|---:|---:|---:|
| Armor (`arm`) | 138.88 | 128.00 | -7.8% |

**Baseline result:** 85.40% win rate; average damage dealt 429.45; average ending HP 180.64.

**Reasoning:** Knight combines a very high win rate with high damage and high ending HP. Reducing armor tests the survivability side of that profile while preserving its weapon, active ability, and passive.

**Watch for:** Damage received, ending HP, ability uptime, and especially the reported Vampire matchup. Avoid interpreting a lower overall win rate as success if it creates an extreme new counter.

### Warlord — moderate base-damage reduction

| Stat | Before | Proposed | Change |
|---|---:|---:|---:|
| Damage (`dmg`) | 6.65 | 6.10 | -8.3% |

**Baseline result:** 83.25% win rate; average damage dealt 429.52; average match duration 21.97 s; 40 dominant matchups.

**Reasoning:** Warlord combines high damage with short matches and broad matchup dominance. This test reduces one direct offensive stat without changing its high-mass identity, weapon reach, or Earthquake ability.

**Watch for:** Damage per hit, match duration, win rate against the roster, and whether the change meaningfully affects one-sided pairings such as Bard vs Warlord.

### Sage — modest damage increase

| Stat | Before | Proposed | Change |
|---|---:|---:|---:|
| Damage (`dmg`) | 2.85 | 3.15 | +10.5% |

**Baseline result:** 3.40% win rate; average damage dealt 143.05; average projectile hit rate 6.88%; approximately 159.62 projectiles fired per match.

**Reasoning:** Sage is the lowest-performing class and deals little average damage. A small damage increase tests whether damage output is a meaningful limiting factor. However, its low projectile hit rate and heavy projectile-damage dependence may indicate a reliability or kit issue instead. This numeric change is not expected to solve a confirmed projectile problem.

**Watch for:** Damage per projectile hit, total projectile hits, damage dealt, and matchup outcomes. If shots still rarely connect, do not keep stacking damage increases; investigate projectile behavior separately.

### Templar — modest damage increase

| Stat | Before | Proposed | Change |
|---|---:|---:|---:|
| Damage (`dmg`) | 3.26 | 3.60 | +10.4% |

**Baseline result:** 4.65% win rate; average damage dealt 235.80; average ending HP approximately 3; zero dominant matchups.

**Reasoning:** Templar is the second-lowest-performing class and appears unable to convert its tank-oriented kit into wins. A modest damage increase tests whether it lacks finishing pressure. The baseline does not prove damage is the cause; survivability interactions and the Slow Field / Immovable kit must also be examined if results remain poor.

**Watch for:** Damage dealt, damage received, ending HP, match duration, and whether Templar becomes more effective without creating a new set of dominant matchups.

## Deliberately unchanged in this patch

- No ability or passive rewrites.
- No shared projectile, targeting, or tracking changes.
- No weapon geometry or melee reach changes.
- No changes to arena physics, sudden-death rules, or match-resolution logic.
- No stat or arena test modifiers enabled.
- No changes to classes outside the five listed above.

This is intentional: a first patch is more informative when it tests a limited set of hypotheses. If multiple systems change together, it becomes harder to explain the result.

## Validation plan

Run the same 50,000-match baseline after implementing the proposal:

- Same seed: **1337**
- Same timestep: **0.05 s**
- Same match cap and timeout configuration
- Stat modifiers: **OFF**
- Arena modifiers: **OFF**
- Keep the same roster and matchup scheduling

Compare before and after:

1. Overall win rate for all 50 classes.
2. Full matchup matrix, especially the edited classes' strongest and weakest matchups.
3. Draw rate and average match duration.
4. Damage dealt and received, ending HP, and decisive-win rate.
5. Relevant telemetry: Phoenix engagement/survival, Knight damage received, Warlord damage per hit, Sage projectile hit count and damage per hit, and Templar damage/ending HP.
6. Newly created extreme outliers and any increase in one-sided matchups.

Use **45–55%** as a working target band, not a requirement that every class must reach immediately. A change is not automatically successful just because the edited class moves toward 50%; it must also avoid creating larger problems elsewhere.

## Keep, revise, or revert criteria

**Keep** a change when the intended outlier moves in the right direction, the relevant combat telemetry supports the hypothesis, and the wider matchup matrix does not show a damaging new imbalance.

**Revise** when the result improves but remains extreme, or when the telemetry shows that the chosen stat only partly addresses the problem.

**Revert** when the target does not improve, a new severe outlier appears, or the change worsens the matchup ecosystem without a clear compensating benefit.

If Sage's projectile hit rate remains very low after the damage test, treat that as evidence to investigate reliability—not as automatic permission for another damage buff.

## Patch decision record

Fill this in after the test run:

- **Implemented values:**
- **Baseline run / export:**
- **Post-patch run / export:**
- **Target classes that improved:**
- **Unexpectedly affected classes:**
- **Matchups improved:**
- **Matchups worsened:**
- **Telemetry supporting the hypothesis:**
- **Decision:** Keep / revise / revert
- **Next patch hypothesis:**

## Final note

This is a conservative first-pass reference, not a claim that these five values are definitively optimal. The strongest evidence in the current baseline is that Phoenix, Knight, and Warlord are extreme upper outliers while Sage and Templar are extreme lower outliers. The proposed values are intentionally small enough to test, then re-evaluate. The next balance decision should come from the post-patch data—not from assuming that this first proposal must be right.
