# ArcheSpheres — Initial Balance Investigation Report

**Report version:** 0.1  
**Baseline:** October 8, 2026 — 50,000 matches  
**Seed:** 1337  
**Configuration:** Default stat modifiers OFF; arena modifiers OFF  
**Purpose:** Identify high-priority balance questions and establish an evidence-based first-patch investigation plan.

> **Scope:** This is an investigation report, not a balance patch. It makes no gameplay/stat changes and does not treat the runner's automated BUFF/NERF recommendations as decisions.

## 1. Executive Summary

The baseline shows a wide spread in class outcomes despite the average class win rate being approximately 49.8%.

- **Highest overall win rate:** Phoenix — **90.15%**
- **Lowest overall win rate:** Sage — **3.40%**
- **Other extreme upper outliers:** Knight — **85.40%**; Warlord — **83.25%**
- **Other extreme lower outliers:** Templar — **4.65%**; Locksmith — **14.65%**; Arcanist — **17.45%**
- **Classes above 65%:** 12 of 50
- **Classes below 35%:** 12 of 50
- **Classes within 45–55%:** 6 of 50
- **Matchups flagged as impossible by the harness:** 417 of 1,225

These results justify targeted investigation. They do **not** independently prove which stats or mechanics should change. The first patch should test one specific hypothesis, use a small change, and be evaluated against the entire roster and matchup matrix.

## 2. Dataset and Method

The exported JSON records:

- 50,000 completed matches, with the planned run marked complete.
- Seed 1337, timestep 0.05 seconds, no visuals.
- 50 class summaries, with 2,000 games per class.
- 1,225 unique non-mirror matchup summaries, with 40 or 41 games per pairing.
- 724 entries in the exported `hardMatchups` collection; 417 matchups have `impossibleMatch: true`.
- 5,000 retained individual match results out of the 50,000 completed matches.

### Important interpretation limits

1. Class-level aggregates summarize the full run; only 5,000 individual match records are retained in the JSON. Do not assume the retained individual results are a random or fully representative sample unless the export implementation confirms that.
2. Each class pairing has only 40–41 matches. One-sided results are important warning signals, but the sample is not enough to prove a matchup is permanently unwinnable.
3. The runner's `impossibleMatch` label is a diagnostic flag, not proof of literal impossibility.
4. The new Phase-5 melee attempt definition changes the meaning of melee attempt metrics. Do not compare `avgMeleeHitRate`, `avgMeleeAttemptDistance`, `reachUtilizationRatio`, or `meleeHitboxAction` directly with pre-fix runs.
5. The stat and arena modifiers were intentionally disabled for this baseline. Preserve this configuration for like-for-like comparisons.
6. The average class win rate near 50% does not imply the roster is balanced. Wins and losses are shared between opponents; severe class disparities can coexist with a near-50% average.

## 3. Overall Class Outliers

The target bands below are working investigation thresholds, not final rules:
- **45–55%:** target range / monitor.
- **40–45% or 55–60%:** inspect matchup spread.
- **35–40% or 60–65%:** investigate.
- **Below 35% or above 65%:** highest priority for investigation.

### 3.1 Highest-performing classes

| Rank | Class | Win rate | Average damage dealt | Average match duration | Dominant matchups | Hard counters |
|---:|---|---:|---:|---:|---:|---:|
| 1 | Phoenix | 90.15% | 393.63 | 26.66 s | 44 | 0 |
| 2 | Knight | 85.40% | 429.45 | 28.51 s | 38 | 1 |
| 3 | Warlord | 83.25% | 429.52 | 21.97 s | 40 | 0 |
| 4 | Jester | 79.25% | 428.79 | 21.21 s | 33 | 1 |
| 5 | Viking | 76.35% | 427.07 | 38.69 s | 28 | 1 |
| 6 | Paladin | 71.45% | 423.18 | 38.94 s | 25 | 4 |
| 7 | Dragoon | 71.40% | 425.16 | 33.01 s | 23 | 1 |
| 8 | Prince | 69.15% | 422.45 | 27.45 s | 23 | 3 |
| 9 | Flagellant | 67.95% | 394.58 | 16.23 s | 20 | 0 |
| 10 | Plague Doc | 67.45% | 311.05 | 30.28 s | 24 | 6 |
| 11 | Priest | 66.40% | 358.48 | 25.39 s | 25 | 7 |
| 12 | Trickster | 65.55% | 418.66 | 28.10 s | 20 | 4 |

**Initial interpretation:** Phoenix is the first upper-outlier investigation, followed by Knight and Warlord. High average damage appears in several strong classes, but it is not a sufficient cause by itself: damage dealt, damage received, matchup distribution, ending HP, and combat mechanics must be examined together.

### 3.2 Lowest-performing classes

| Rank from bottom | Class | Win rate | Average damage dealt | Average match duration | Hard counters | Dominant matchups |
|---:|---|---:|---:|---:|---:|---:|
| 1 | Sage | 3.40% | 143.05 | 56.47 s | 47 | 0 |
| 2 | Templar | 4.65% | 235.80 | 42.35 s | 46 | 0 |
| 3 | Locksmith | 14.65% | 324.17 | 46.88 s | 41 | 2 |
| 4 | Arcanist | 17.45% | 259.14 | 30.63 s | 36 | 2 |
| 5 | Wizard | 22.30% | 267.36 | 36.75 s | 32 | 3 |
| 6 | Ranger | 23.95% | 293.07 | 36.08 s | 30 | 1 |
| 7 | Crusader | 24.65% | 303.11 | 56.84 s | 32 | 4 |
| 8 | Fairy | 25.05% | 260.73 | 51.10 s | 30 | 5 |
| 9 | Queen | 27.10% | 340.19 | 22.51 s | 30 | 4 |
| 10 | Witch | 28.55% | 318.94 | 41.48 s | 29 | 4 |
| 11 | Bard | 30.10% | 335.82 | 41.08 s | 29 | 7 |
| 12 | Whelpling | 33.30% | 364.82 | 48.73 s | 26 | 9 |

**Initial interpretation:** Sage and Templar are the most severe lower outliers. Locksmith and Arcanist also warrant high priority. The number of hard counters suggests that broad matchup weakness may be contributing, but those flags must be interpreted with their 40–41-game samples and checked against the underlying matchup rows.

## 4. Primary Investigation — Phoenix

**Observed win rate:** 90.15%  
**Average damage dealt:** 393.63  
**Average ending HP:** 103.83  
**Average match duration:** 26.66 seconds  
**Dominant matchups:** 44  
**Worst reported matchup:** Knight at 48.8%  
**Best reported matchup:** Necromancer at 100%

### Observations

- Phoenix is an extreme upper outlier across the full baseline.
- Its average damage is high but not the highest among the top performers.
- Its passive is reported as triggering approximately 0.0136 times per second and contributing approximately 0.18% of damage.
- The runner flags the passive for overhaul and suggests checking whether its trigger condition is too restrictive or rarely met in 1v1.
- Its reported worst matchup against Knight is much closer to even than its overall win rate.

### Hypotheses to test

1. Phoenix may have a broad advantage across many matchups rather than one single favorable counter pattern.
2. Survivability, damage uptime, or ability/passive behavior may contribute to its performance.
3. Its low passive damage share may indicate a passive that is rarely activated, but that observation does not explain Phoenix's overall dominance by itself.

### Required evidence

- Inspect Phoenix's complete matchup row, including wins, draws, duration, damage dealt/received, and opponent ending HP.
- Compare its damage received and survival profile against both strong and weak opponents.
- Inspect the actual passive trigger path and intended passive behavior.
- Separate direct damage from healing, defense, invulnerability, or other non-damage value.

**Decision:** Phoenix is the first investigation target. Do not apply the runner's suggested stat adjustment without confirming the cause.

## 5. Secondary Upper-Outlier Investigations

### Knight

**Win rate:** 85.40%  
**Average damage dealt:** 429.45  
**Average ending HP:** 180.64  
**Average melee hit rate:** 81.47%  
**Dominant matchups:** 38  
**Worst reported matchup:** Vampire at 17.1%  
**Best reported matchup:** Locksmith at 100%

Knight combines high damage, high melee hit rate, and high ending HP. That supports investigating both offensive pressure and survivability. However, the Vampire matchup is a notable exception and should be checked before assuming Knight is uniformly strong against every class.

The runner's ability/passive flags should be treated as prompts for inspection, not proof that the kit is broken.

### Warlord

**Win rate:** 83.25%  
**Average damage dealt:** 429.52  
**Average match duration:** 21.97 seconds  
**Dominant matchups:** 40  
**Worst reported matchup:** Knight at 30%  
**Best reported matchup:** Bard at 100%

Warlord's high damage and relatively short average matches make damage pressure and engagement effectiveness useful investigation areas. Its losses to Knight and strong result against Bard also show why matchup-level evidence matters.

**Decision:** Investigate Knight and Warlord after or alongside Phoenix. Do not assume the same nerf should be applied to all three.

## 6. Lower-Outlier Investigations

### 6.1 Sage — possible projectile reliability problem

- Win rate: 3.40%.
- Average damage dealt: 143.05.
- Average match duration: 56.47 seconds.
- Average projectile hit rate: 6.88%.
- Projectiles fired per match: approximately 159.62.
- Projectile damage share: approximately 98.11%.
- Reported hard counters: 47.

Sage's very low overall win rate, low damage output, low projectile hit rate, and heavy reliance on projectile damage make projectile effectiveness a strong hypothesis to investigate.

Check projectiles fired, hits, damage per hit, time to first impact, target tracking, and damage received before deciding whether this is a stats problem or a projectile/kit problem.

### 6.2 Templar — severe overall underperformance

- Win rate: 4.65%.
- Average damage dealt: 235.80.
- Average ending HP: approximately 3.
- Average match duration: 42.35 seconds.
- Reported hard counters: 46.
- Reported dominant matchups: 0.

Templar is losing broadly in this baseline. Its ending HP and damage profile make survivability and damage effectiveness worth inspecting. The result does not identify a particular stat to change.

### 6.3 Locksmith — losses not explained by damage alone

- Win rate: 14.65%.
- Average damage dealt: 324.17.
- Average ending HP: 12.61.
- Average match duration: 46.88 seconds.
- Reported hard counters: 41.

Locksmith deals more average damage than Sage, yet also has a very low win rate. This suggests that damage dealt alone is not enough to explain the result. Check damage received, whether its control effects meaningfully prevent damage, its ability to finish fights, and its matchup distribution.

### 6.4 Arcanist, Wizard, Fairy, and Ranger — projectile investigation cluster

| Class | Win rate | Average projectile hit rate | Projectiles fired per match | Projectile damage share |
|---|---:|---:|---:|---:|
| Arcanist | 17.45% | 10.79% | 90.92 | 59.13% |
| Wizard | 22.30% | 8.22% | 153.31 | 96.80% |
| Fairy | 25.05% | 7.59% | 324.09 | 98.84% |
| Ranger | 23.95% | 7.99% | 267.85 | 99.27% |

These classes combine low win rates with low projectile hit rates and heavy projectile-damage dependence. They are strong candidates for a shared reliability investigation.

**Important counterexample:** Prince has a reported projectile hit rate of only 6.71% while maintaining a 69.15% overall win rate. Therefore, a low projectile hit rate is not, by itself, sufficient evidence that a class is weak or that projectile tuning is the correct fix. Damage per hit, non-projectile damage, defenses, and kit interactions must be considered.

## 7. Matchup-Matrix Investigation

There are 1,225 unique class pairings, with 40–41 games per pairing. The harness flags 417 as impossible matchups. Treat these as the first set to inspect, not as 417 proven design failures.

Examples of fully one-sided observed pairings include:

| Pairing | Games | Observed result | Average duration |
|---|---:|---|---:|
| Bard vs Warlord | 41 | Warlord won 41 | 21.43 s |
| Gravedigger vs Sage | 41 | Gravedigger won 41 | 61.22 s |
| Locksmith vs Priest | 41 | Priest won 41 | 29.23 s |
| Necromancer vs Phoenix | 41 | Phoenix won 41 | 22.88 s |
| Arcanist vs Warlord | 41 | Warlord won 41 | 15.80 s |
| Fairy vs Samurai | 41 | Samurai won 41 | 16.25 s |

These pairings are useful examples for follow-up testing, but each has only 41 games. The next step is to verify the pairing's damage and combat profile, then run a targeted larger sample if the result remains suspicious.

### Questions to answer

1. Does Phoenix's dominance persist across most opponents?
2. Are Knight and Warlord winning broadly or primarily through a smaller set of highly favorable interactions?
3. Are Sage, Templar, and Locksmith losing broadly, or does a subset of matchups dominate their overall results?
4. Do projectile-dependent classes share a verified reliability issue?
5. Which matchup improvements could benefit more than one weak class without creating a new upper outlier?

## 8. Initial Patch Strategy

**Proposed patch name:** Initial Outlier Investigation Patch

**Patch scope:** One confirmed problem and the smallest change that tests its cause.

### Recommended sequence

1. Validate Phoenix's dominance through its matchup and combat data.
2. Inspect Sage and Templar's failure patterns in parallel.
3. Investigate Knight and Warlord to determine whether their causes overlap with Phoenix's.
4. Compare the projectile reliability profiles of Sage, Fairy, Wizard, Ranger, and Arcanist.
5. Choose one specific hypothesis with evidence.
6. Make a small change limited to the stat or mechanic implicated by that hypothesis.
7. Rerun the same baseline configuration.
8. Compare all class win rates, matchup results, draws, duration, and relevant combat telemetry.
9. Keep, revise, or revert the change based on the result.

### Changed values

**None selected yet.** The current evidence identifies investigation targets but does not establish a defensible numerical adjustment.

### Expected outcome

- Reduce one verified source of extreme imbalance.
- Improve the targeted result without introducing new severe outliers.
- Move the roster toward the provisional 45–55% target range where practical.
- Preserve meaningful class identity and reasonable combat duration.

## 9. Post-Patch Evaluation Template

| Evaluation area | Baseline | After patch | Decision question |
|---|---|---|---|
| Target class win rate | Record original value | Record new value | Did the intended outlier improve? |
| Lowest class win rate | Record original value | Record new value | Did the lower tail improve? |
| Other class win rates | Full baseline | New results | Did the change create new outliers? |
| Largest matchup advantages | Baseline matrix | New matrix | Did matchup balance improve? |
| Draw rate | Baseline | New value | Did stalemates increase? |
| Average match duration | Baseline | New value | Did combat become healthier? |
| Relevant combat metrics | Baseline | New values | Does the evidence support the hypothesis? |
| New extreme outliers | Baseline | New results | Did the patch transfer the problem? |

## 10. Final Decision Record

**Decision:** Keep / revise / revert

**Hypothesis tested:**

**Values changed:**

**Evidence supporting the decision:**

**Unexpected side effects:**

**Remaining issues:**

**Next investigation:**

## 11. Final Assessment

This baseline shows major class-performance disparities despite an average class win rate near 50%. Phoenix is the strongest overall outlier, Sage is the weakest, and Knight, Warlord, Templar, Locksmith, and Arcanist also deserve priority investigation.

The projectile data supports a focused reliability investigation for several low-performing classes, but Prince is a counterexample to treating hit rate alone as the cause. Matchup flags also reveal many one-sided observed pairings, although their per-pair sample sizes remain limited.

The appropriate first patch is not a broad automated pass. It is a small, evidence-backed experiment designed to test one hypothesis while measuring the effect on the entire roster.
