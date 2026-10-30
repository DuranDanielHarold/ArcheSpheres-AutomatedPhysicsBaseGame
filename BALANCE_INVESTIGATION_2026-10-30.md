# Balance Investigation — 2026-10-30

## Purpose

This report preserves the October 30, 2026 balance investigation that informed the initial Sage damage experiment in PR #100. It prioritizes the strongest and weakest observed outcomes, records the supporting combat signals retained from that analysis, and separates measured findings from mechanical hypotheses that still need controlled testing.

**This is a retained investigation summary, not a complete raw-data export.** The exact 50-row class-summary CSV and full matchup CSV are not embedded here. The figures below are the values retained from the completed analysis; no missing per-class values have been reconstructed or guessed. The report therefore does not claim to provide a complete ranking or exact statistics for all 50 classes.

## Dataset and interpretation

The October 30 analysis covered:

- 50 classes, with 2,000 matches per class in the class summary.
- 1,225 distinct matchup pairings, with approximately 40–41 games per pairing.
- The target balance band is 45–55% win rate.
- Only 7 of 50 classes were inside that band; 18 were below it and 25 were above it.

A 40–41 game individual matchup is a useful signal for prioritizing investigation, not conclusive proof by itself. Overall win rate, damage, survival, combat resolution, and class mechanics should be considered together. Do not apply blanket buffs or nerfs from win rate alone.

## Priority 1 — strongest outliers to investigate for nerfs

| Priority | Class | Win rate | Average damage | Investigation signal |
|---:|---|---:|---:|---|
| 1 | Phoenix | 91.9% | 403.68 | Won more than 65% against 46 of 49 opponents; major outlier |
| 2 | Viking | 85.4% | 431.99 | Very high damage and survival; strong across most matchups |
| 3 | Jester | 84.9% | 429.91 | High damage and melee hit rate |
| 4 | Knight | 83.5% | 420.37 | High damage, ending HP, and melee hit rate |

Additional high performers worth reviewing after the top four:

| Class | Win rate |
|---|---:|
| Warlord | 77.6% |
| Flagellant | 76.1% |
| Trickster | 73.0% |
| Golem | 70.8% |
| Vampire | 70.8% |

### Supporting combat signals

- **Phoenix:** +31.1% average HP margin; approximately 403.68 average damage; 87.0% melee hit rate. It exceeded 65% wins against 46/49 opponents, but was weaker against Viking (39.0%) and Knight (41.5%).
- **Viking:** +19.0% average HP margin; approximately 431.99 average damage; 77.6% melee hit rate.
- **Jester:** +39.5% average HP margin; approximately 429.91 average damage; 87.6% melee hit rate.
- **Knight:** +36.7% average HP margin; approximately 420.37 average damage; average ending HP 187.69; 87.4% melee hit rate.

### Mechanical investigation targets (not automatic nerf prescriptions)

- **Phoenix:** inspect Cinder Wing/Ember burst and Rebirth together. Rebirth's once-per-match lethal-damage recovery, temporary invulnerability, and flare may be a major contributor to its broad matchup dominance. Test the contribution of each mechanic separately.
- **Viking:** inspect Last Stand's lethal-damage prevention, six-second invulnerability window, and Rage Spin damage window. Separate the value of the survival effect from the damage effect.
- **Jester:** inspect Chaos Lurch's burst window and its interaction with high melee hit rate. Reconcile the class metadata's stated spin multiplier with the implementation's effective multiplier before tuning.
- **Knight:** inspect Stalwart's hit-based scaling and Shield Bubble. Verify whether the stacking behavior and defensive/offensive uptime explain its high ending HP and damage before changing stack caps or coefficients.

## Priority 2 — weakest performers to investigate for buffs or mechanic fixes

| Priority | Class | Win rate | Average damage | Investigation signal |
|---:|---|---:|---:|---|
| 1 | Sage | 1.7% | 120.14 | Lowest retained result; very low damage |
| 2 | Bard | 11.3% | 252.25 | Control effects may not convert into enough damage |
| 3 | Wizard | 12.8% | 213.57 | Straight-line projectile hit rate is low |
| 4 | Templar | 14.9% | 279.50 | Low outcomes despite high reach utilization |
| 5 | Ranger | 15.7% | 247.90 | Straight-line arrow hit rate is low |

### Supporting combat signals and mechanic-specific cautions

- **Sage:** average damage 120.14; average duration 49.61 seconds; average HP margin −51.0%. Inspect Wisdom Word damage and Foresight's delayed Wisdom Wave. The original Wave was only 2 × base DMG before magic defense, which made its contribution easy to underestimate. Ancient Patience's physical-damage conversion and the distinction between physical and magic damage intake also deserve explicit telemetry review.
- **Bard:** average damage 252.25; projectile hit rate 62.2%; average projectile damage per hit 5.10. Its projectile accuracy is not the obvious problem. Investigate whether NoiseTrap's control/disruption creates enough follow-up damage and whether its duration and uptime are effective.
- **Wizard:** average damage 213.57; 135.56 projectiles fired on average; projectile hit rate 7.2%; average damage per projectile hit 21.09. Wizard projectiles are intended to be straight-line. Do not add homing or aim assist merely to inflate hit rate; investigate projectile travel, encounter geometry, firing opportunities, and whether the intended elemental effects contribute as designed.
- **Templar:** average damage 279.50; average ending HP 12.80; melee hit rate 65.9%; reach utilization 96.1%. Since reach utilization is already high, simply increasing attack reach is not supported by this evidence. Investigate survival, damage mitigation, and damage conversion over a full fight.
- **Ranger:** average damage 247.90; 236.93 projectiles fired on average; projectile hit rate 7.4%; average damage per hit 13.98. Preserve its straight-line arrow identity. Inspect firing opportunities, projectile speed/trajectory against movement, and whether Volley and momentum mechanics are functioning as intended before considering damage changes.

## Priority 3 — other weak performers requiring individual investigation

| Class | Win rate | Average damage | Retained signal / investigation direction |
|---|---:|---:|---|
| Fairy | 18.3% | 227.85 | Inspect Pixie Dust control, healing value, and Wish utility conversion |
| Arcanist | 18.4% | 244.46 | Inspect area/hybrid utility and actual damage contribution; avoid generic buffs |
| Whelpling | 21.6% | 318.07 | Damage is comparatively high but outcomes are poor; investigate survival and combat resolution |
| Necromancer | 22.1% | Not retained | 82.6% of damage came from DoT; inspect DoT uptime, timing, and whether damage resolves before fights end |

These classes should not receive the same generic damage increase. Their retained signals point to different possible causes: utility conversion, survivability, damage timing, or combat resolution.

## Cross-class findings and guardrails

1. **Do not optimize projectile hit rate in isolation.** Sage, Wizard, and Ranger use straight-line projectile behavior. Their identity should remain intact; test trajectory and encounter behavior before considering any targeting change.
2. **Respect intended projectile mechanics.** Priest projectiles track; Bard projectiles ricochet. Fairy and Arcanist have area/hybrid utility. Necromancer relies heavily on damage over time. These mechanics require class-specific evaluation.
3. **Do not treat Templar as a reach problem by default.** Its retained reach utilization was already 96.1%.
4. **Separate damage from survival.** Whelpling's high average damage paired with a low win rate is a reason to inspect survival and combat resolution rather than immediately adding damage.
5. **Check telemetry before interpreting ability metrics.** Missing ability/passive registration or incorrect damage-source attribution can make a class mechanic appear ineffective or distort its measured contribution.
6. **Use the same seeded baseline and settings for comparisons.** Keep stat modifiers and arena modifiers OFF unless a test explicitly says otherwise. Compare win rate, matchup profile, damage, survival, and ability/passive contribution together.

## Prioritized action plan

| Order | Action | Evidence required before tuning |
|---:|---|---|
| 1 | Investigate Phoenix, Viking, Jester, and Knight individually | Repeated seeded baseline; mechanic uptime; damage and survival contribution; matchup distribution |
| 2 | Run the initial Sage damage experiment in PR #100 | Same-seed before/after roster run; Sage win rate, damage, Wave contribution, and matchup changes |
| 3 | Investigate Bard, Wizard, Templar, and Ranger by their intended mechanics | Projectile/control/mitigation telemetry and representative matchup replays |
| 4 | Investigate Fairy, Arcanist, Whelpling, and Necromancer separately | Utility contribution, survival, DoT timing, and combat-resolution metrics |
| 5 | Review the other high performers listed above | Confirm whether their elevated win rates persist across repeated seeds before proposing changes |

## PR #100 — Sage initial damage experiment

PR #100 implements a deliberately narrow first experiment:

- Wisdom Word raw projectile damage changes from `(base DMG + 8)` to `(base DMG + 12)`. At base DMG 2.85, this is 10.85 → 14.85 raw damage per projectile (+36.9%).
- Foresight's delayed Wisdom Wave changes from `2 × base DMG` to `6 × base DMG`. At base DMG 2.85, this is 5.7 → 17.1 raw magic damage before target magic defense.
- Existing straight-line projectile behavior, two-second Foresight timing, and Wave radius remain unchanged.
- Wave damage is attributed to Sage's ability telemetry and records actual HP removed.

This is an initial test value, not a claim that Sage is balanced. No browser simulation or seeded roster rerun had been performed when this report was prepared. Keep the patch isolated until the before/after results are available.

## Data coverage and limitations

The original investigation covered all 50 classes and 1,225 matchup pairings, but this report only reproduces the exact class-level figures retained in the investigation summary. It intentionally does not invent the remaining class rows or individual matchup percentages. The complete raw class-summary and matchup CSVs are required to regenerate an exhaustive 50-row table and validate every matchup-level claim.

**Recommendation:** use this report to prioritize the next controlled balance investigations, not as a patch list. Make one class-specific change at a time, rerun the same seeded baseline, and retain changes only when the measured outcome improves without damaging class identity or creating new matchup outliers.


## First-pass strongest-outlier tuning added to PR #100

The four highest retained win-rate outliers now have conservative, class-specific reductions in the same branch as the Sage buff. These values are an initial experiment, not final balance targets.

| Class | Mechanic | Before | PR #100 first pass | Intended effect |
|---|---|---:|---:|---|
| Phoenix | Rebirth health restore | 35% max HP | 30% max HP | Reduce the effective extra-life recovery without removing Rebirth |
| Phoenix | Rebirth invulnerability | 1.2s | 1.0s | Shorten the protected recovery window |
| Viking | Last Stand duration | 6.0s | 4.5s | Reduce the once-per-match invulnerability window; its automatic Rage Spin is cut short when Last Stand ends |
| Jester | Chaos Lurch damage multiplier | 2.0× | 1.7× | Reduce burst damage while preserving the 1.5s window, random launch, and spin reversal |
| Knight | Shield Bubble invulnerability | 3.6s | 3.0s | Reduce repeated full-invulnerability uptime |
| Knight | Shield Bubble damage multiplier | 1.5× | 1.4× | Slightly reduce the offensive payoff during the defensive window |

### What remains unchanged

- Phoenix keeps full Ember on Rebirth, the 1.4s Ashwing recovery effect, the knockback flare, and its normal Cinder Wing ability.
- Viking keeps the normal six-second Rage Spin and 1.6× damage multiplier; only the Last Stand window is shortened. When the Last Stand timer ends, its current update path also ends the linked Rage Spin.
- Jester keeps its three-stack trigger, 2.2× launch speed, random direction, spin reversal, and 1.5s duration.
- Knight keeps the five-stack trigger, doubled spin during Shield Bubble, and the existing Stalwart passive (+0.6% per successful hit, capped at 30 stacks). Stalwart is deliberately unchanged in this first pass so its contribution can be isolated from the Shield Bubble adjustment.
- No base class stats, weapon reach, targeting, projectile behavior, cooldowns, or unrelated class mechanics were changed.

### Validation status

These edits were made from the retained October 30 results and direct source inspection. They have **not** yet been validated by a browser run or a seeded 50-class simulation. The next comparison should use the same seed, 2,000 matches per class, and the same settings as the October 30 baseline (stat modifiers and arena modifiers OFF). Review both overall win rates and matchup-level changes; do not merge the tuning as final until that comparison is complete.
