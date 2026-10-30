# PR #101 — Flagellant stacking-cap hypothesis

## Status

Experimental balance hypothesis only. This patch is not a validated final balance decision. No seeded browser simulation has been run for this patch yet.

## Evidence from the October 31 summary

Flagellant:
- Win rate: 70.3% (1,405 wins / 2,000 games)
- Average match duration: 15.71 seconds
- Average damage dealt: 405.78
- Average end HP: 38.11
- Average HP margin: -1.68
- Average melee hit rate: 76.7%
- Average rotation: 9.8426; peak: 9.9998
- Damage shares: 98.69% base, 1.11% ability, 0.06% passive

The summary indicates a highly effective melee kit with near-maximum rotation and very high melee hit reliability. It does not isolate the contribution of each stacking mechanic. The supplied 30–60 second visual estimate differs from the summary's 15.71-second average; confirm that both refer to the same simulation mode before comparing duration targets.

## Relevant live values

Flagellant base definition:
- HP: 203.16
- Armor: 25
- Magic defense: 18
- Damage: 1.16
- Spin: 6.8
- Movement speed: 228.69

Sacred Wounds grants +0.8 damage and +0.4 spin per 15 HP lost. The natural maximum at 203.16 HP is 13 tiers (floor(203.16 / 15)), or +10.4 damage and +5.2 spin before death if no healing changes the effective HP loss. Therefore, the prior 9-tier suggestion was not conservative.

The shared successful-melee-hit buff multiplies damage and spin by 1.004 per hit. Its current implementation also rounds armor after each stack. At Flagellant's base armor of 25, that rounded armor value may not increase on each small increment; damage and spin are the more relevant growth channels.

## Live hypothesis in this PR — conservative

1. Shared permanent hit-buff stat growth is capped at **10 successful hits**. This limits the mechanic's damage/spin multiplier to approximately 1.0407x (1.004^10).
2. Flagellant Sacred Wounds is capped at **3 tiers**. This limits its permanent additions to +2.4 damage and +1.2 spin.
3. The shared hit counter still records every successful hit. The cap only prevents further shared permanent stat growth.
4. Class-specific on-hit effects inside the same method continue to execute after the shared stat-growth cap. This preserves effects such as Gladiator Favor and Beastmaster companion spawning.
5. Flagellant's low-HP buff (17% below 30% HP) and Penitence (10 self-damage, 1.5 seconds invulnerability, 10 contact damage) remain unchanged to isolate the stacking hypothesis.

These caps are deliberately conservative experimental values, not a claim that the resulting win rate will land at 50%.

## Alternative hypothesis for A/B testing

A moderate alternative is:
- Shared hit-buff cap: **15 hits** (approximately 1.0618x from that mechanic).
- Sacred Wounds cap: **4 tiers** (+3.2 damage and +1.6 spin).

The balance runner now accepts per-run cap overrides. Use the exact same keys, seed, and simulation settings for each scenario:

```js
const common = {
  keys: ['flagellant', 'jester', 'warlord'],
  targetGamesPerClass: 2000,
  seed: 1337,
  minutes: 240,
  noVisuals: true,
  exportJson: true,
  exportCsv: true
};

// Current uncapped behavior (Sacred Wounds remains naturally limited by HP loss).
await runBalanceBaseline({
  ...common,
  stackingCaps: { hitBuffStackCap: false, flagellantWoundTierCap: false }
});

// Conservative live PR hypothesis.
await runBalanceBaseline({
  ...common,
  stackingCaps: { hitBuffStackCap: 10, flagellantWoundTierCap: 3 }
});

// Moderate alternative.
await runBalanceBaseline({
  ...common,
  stackingCaps: { hitBuffStackCap: 15, flagellantWoundTierCap: 4 }
});
```

For three classes, 2,000 games per class plans 3,000 unique matches. The same seed and keys produce the same matchup/round seed schedule across the three runs. Keep stat modifiers and arena modifiers OFF, matching the October 31 baseline configuration.

## Evaluation criteria

Compare each class and matchup across all three runs:
- win rate and 95% confidence interval
- average duration and end HP / HP margin
- average damage dealt
- average rotation and peak rotation
- melee hit rate
- Flagellant's relative results against Jester and Warlord

The shared hit cap affects every class that uses the common successful-melee-hit buff, not just Flagellant. The targeted three-class test checks Flagellant, Jester, and Warlord, but it is not a replacement for a full 50-class rerun before merge.

## Verification

- Static source review: performed.
- Runtime syntax/browser verification: not yet performed.
- Seeded A/B simulations: not yet performed.
- Merge: not authorized; keep this PR open for review and testing.


---

# October 31 roster findings — expanded PR #101 hypothesis pass

## Why this was added

This section records the earlier October 31 post-PR #100 analysis, immediately after reviewing the Gemini proposal and before the focused Flagellant investigation. It is deliberately not a reproduction of Gemini's broad patch. The October 31 results show that PR #100 moved several extreme classes in the right direction, but the roster remains heavily polarized.

## October 31 result snapshot

All class-summary rows reported 2,000 games per class. The working target remains 45–55%.

- **24/50 classes above 55%**
- **8/50 inside 45–55%**
- **18/50 below 45%**

### Classes above the target band

| Class | Win rate | Retained combat evidence |
|---|---:|---|
| Phoenix | 88.3% | Still the highest outlier after the PR #100 Rebirth reduction |
| Warlord | 82.7% | 428.66 avg damage; 83.18% melee hit rate; 93.23% reach utilization; 5.78% ability damage share; 95.65% ability hit rate |
| Knight | 77.2% | Still high after PR #100 Shield Bubble reductions |
| Viking | 74.7% | Still high after PR #100 Last Stand reduction |
| Jester | 74.4% | Still high after PR #100 Chaos Lurch reduction |
| Paladin | 70.9% | 422.42 avg damage; passive contributes 25.3% of damage; 0.333 passive triggers/sec |
| Prince | 70.5% | Elevated win rate; more matchup/source telemetry is needed before choosing a mechanic |
| Flagellant | 70.3% | 405.78 avg damage; 15.71s avg duration; 38.11 avg end HP; -1.68 avg HP margin; 76.7% melee hit rate; 9.8426 avg / 9.9998 peak rotation |
| Dragoon | 69.3% | Elevated win rate; isolate leap/true-damage and defensive magic-shield contributions before tuning |
| Trickster | 68.8% | Elevated win rate; isolate replica contribution and defensive uptime before tuning |

The user's separate visual estimate of roughly 30–60 seconds should not be conflated with Flagellant's 15.71-second average from the exported class summary until the run mode and duration definition are confirmed.

### Classes inside the target band

| Class | Win rate |
|---|---:|
| Inquisitor | 54.0% |
| Rogue | 52.6% |
| King | 51.6% |
| Tidecaller | 51.3% |
| Guardian | 49.1% |
| Ninja | 47.8% |
| Ratcatcher | 45.9% |
| Spartan | 45.8% |

### Classes below the target band

| Class | Win rate | Retained combat evidence |
|---|---:|---|
| Templar | 5.0% | 237.09 avg damage; 3.32 avg end HP; -210.06 avg HP margin; 41.55s avg duration; 51.38% melee hit rate; 95.45% reach utilization; `VISUAL_OUTPACING_HITBOX` warning |
| Sage | 7.4% | 249.14 avg damage; 54.8s avg duration; 6.95% projectile hit rate; 77.8% projectile damage share; 154.86 projectiles/match; 16.17 avg damage per projectile hit; 20.64% ability damage share |
| Arcanist | 16.4% | 256.52 avg damage; 40.81% passive / 59.19% projectile damage share; 10.69% projectile hit rate; 1.99 passive triggers/sec |
| Locksmith | 16.4% | Very low win rate; no additional October 31 source split retained here |
| Wizard | 20.2% | 260.79 avg damage; 8.07% projectile hit rate |
| Fairy | 20.9% | 260.39 avg damage |
| Ranger | 22.7% | 289.76 avg damage; 7.94% projectile hit rate |
| Witch | 25.6% | Low win rate; investigate hex-bolt hit conversion and Jinx uptime before changing damage |
| Queen | 28.3% | Low win rate despite back-hit scaling and Gambit true damage; inspect ability/passive uptime and matchup profile |
| Bard | 29.3% | 335.50 avg damage; inspect control-to-damage conversion rather than assuming raw damage is too low |
| Sheriff | 34.4% | Low win rate; inspect shot hit conversion, reload downtime, and piercing-shot contribution |
| Whelpling | 34.6% | Low win rate despite relatively high damage in earlier analysis; prioritize survival and damage conversion over a generic damage buff |
| Glassblower | 37.1% | Inspect shard contact/detonation and bleed damage attribution |
| Necromancer | 37.3% | DoT-heavy class; evaluate mark/burn/bleed uptime and whether damage resolves before match end |
| Druid | 40.7% | Inspect passive/whip and thorn-patch contribution |
| Voidwalker | 41.4% | Inspect survivability and ability conversion |
| Gravedigger | 42.1% | Inspect mound/DoT contribution and survival |
| Monk | 43.3% | Inspect Nirvana uptime, melee conversion, and survivability |

The October 31 export's exact per-class telemetry is retained above only where it was available in the earlier analysis. Missing values are intentionally not reconstructed.

## What the Gemini proposal got wrong

The earlier Gemini proposal was rejected because it treated unlike class mechanics as one shared problem. PR #101 explicitly does **not** apply:

- blanket 3.5–5% damage nerfs to all elite classes;
- blanket 2% HP/armor cuts;
- universal +15% projectile speed or hitbox increases;
- generic +10% damage to Sage and Templar;
- relaxed passive activation thresholds.

Those changes would mix unrelated hypotheses and risk erasing class identity.

## New live hypothesis edits in PR #101

These are deliberately limited test values, not validated final balance values.

| Class | Live value before this PR pass | PR #101 hypothesis | Reason |
|---|---:|---:|---|
| Phoenix speed | 238.08 | 226.00 (-5.1%) | Phoenix remains at 88.3% after Rebirth was already reduced in PR #100. Test engagement control / uptime without further changing Rebirth. |
| Knight armor | 138.88 | 128.00 (-7.8%) | Knight remains at 77.2% after Shield Bubble was already reduced in PR #100. Test survivability without another Shield Bubble change. |
| Warlord damage | 6.65 | 6.10 (-8.3%) | Warlord is at 82.7%, with 428.66 avg damage, high melee hit rate, and high reach utilization. Preserve its high-mass halberd identity, reach, and Earthquake; trim only base damage. |
| Paladin passive pulse | 12 raw | 9 raw (-25% pulse coefficient) | Passive damage is 25.3% of Paladin's total damage. Reduce only the pulse's raw damage; keep its 3s interval, 8 HP heal, knockback, and Sacred Wrath ability unchanged. |
| Shared successful-hit stat growth | +0.4% per hit, uncapped | Cap at 10 successful hits | Limits the shared permanent growth channel to approximately 1.0407x for damage/spin from this mechanic. Hit counting and class-specific on-hit effects remain active. |
| Flagellant Sacred Wounds | +0.8 DMG / +0.4 spin per 15 HP lost | Cap at 3 tiers | Limits Flagellant's added stats from this mechanic to +2.4 DMG / +1.2 spin. |

The Phoenix speed and Knight armor values reuse conservative numeric hypotheses previously documented in the repository's initial tuning reference; the October 31 results justify retesting those hypotheses after the PR #100 ability changes. They are not claimed to be proven root causes.

### Explicitly held unchanged

- **Viking and Jester:** no second direct nerf in this pass. PR #100 already reduced Last Stand and Chaos Lurch; the shared hit-growth cap is itself a new variable that can affect both.
- **Prince, Dragoon, Trickster:** no numeric change yet. Their win rates are elevated, but the retained telemetry does not isolate the responsible mechanic well enough to choose a value.
- **Templar:** no reach increase. Its reach utilization is already 95.45%; the low hit rate and `VISUAL_OUTPACING_HITBOX` warning require a visual/collision and telemetry audit, not a blind reach buff.
- **Sage:** no homing or aim assist. Preserve its straight-line Wisdom Word identity. Its projectile hit rate remains only 6.95%, so investigate trajectory/encounter geometry and the actual damage conversion before another damage increase.
- **Wizard and Ranger:** preserve straight-line projectile identity. Their low hit rates (8.07% and 7.94%) are diagnostic signals, not permission to add tracking.
- **Arcanist:** do not apply a generic damage buff. Its passive already accounts for 40.81% of damage and triggers 1.99 times/sec; inspect whether charge, self-knockback, area coverage, and passive attribution convert into wins.
- **Fairy, Locksmith, Witch, Queen, Bard, Sheriff, Whelpling, Glassblower, Necromancer, Druid, Voidwalker, Gravedigger, Monk:** investigation-only in this pass. Their low win rates point to different possible causes; no shared buff is justified by win rate alone.

### Preserve class projectile and combat identities

- Sage, Wizard, and Ranger remain straight-line projectile classes.
- Priest retains tracking projectiles.
- Bard retains ricocheting projectiles.
- Fairy and Arcanist retain their area/hybrid utility identities.
- Necromancer retains its DoT-focused damage identity.
- Do not change projectile targeting globally.

## A/B test runner additions

The runner now supports temporary overrides that are restored after each run:

- `stackingCaps`: existing shared hit-buff / Flagellant wound cap overrides. `false` disables a cap; a number sets a cap.
- `classStatOverrides`: temporarily overrides numeric fields in `DEF` for a run, then restores the live values.
- `classOverrides`: currently supports the Paladin passive pulse coefficient through `paladinPulseDamage`.

Example test matrix (same seed and schedule in every run):

```js
const common = {
  keys: ['phoenix', 'knight', 'warlord', 'paladin', 'flagellant', 'jester', 'viking'],
  targetGamesPerClass: 2000,
  seed: 1337,
  minutes: 240,
  noVisuals: true,
  exportJson: true,
  exportCsv: true
};

const oldClassValues = {
  phoenix: { spd: 238.08 },
  knight: { arm: 138.88 },
  warlord: { dmg: 6.65 }
};

// A — October 31-style control: old class values, old Paladin pulse, uncapped stacking.
await runBalanceBaseline({
  ...common,
  classStatOverrides: oldClassValues,
  classOverrides: { paladinPulseDamage: 12 },
  stackingCaps: { hitBuffStackCap: false, flagellantWoundTierCap: false }
});

// B — isolate stacking caps only.
await runBalanceBaseline({
  ...common,
  classStatOverrides: oldClassValues,
  classOverrides: { paladinPulseDamage: 12 },
  stackingCaps: { hitBuffStackCap: 10, flagellantWoundTierCap: 3 }
});

// C — isolate the class-specific numeric hypotheses only.
await runBalanceBaseline({
  ...common,
  classOverrides: { paladinPulseDamage: 9 },
  stackingCaps: { hitBuffStackCap: false, flagellantWoundTierCap: false }
});

// D — combined conservative PR #101 hypothesis.
await runBalanceBaseline({
  ...common,
  classOverrides: { paladinPulseDamage: 9 },
  stackingCaps: { hitBuffStackCap: 10, flagellantWoundTierCap: 3 }
});

// E — moderate stacking alternative with the class-specific hypotheses.
await runBalanceBaseline({
  ...common,
  classOverrides: { paladinPulseDamage: 9 },
  stackingCaps: { hitBuffStackCap: 15, flagellantWoundTierCap: 4 }
});
```

Seven classes at 2,000 games/class plans 7,000 unique matches per scenario. The focused set includes the direct class edits plus Jester and Viking as controls for the shared hit-growth cap. Keep stat modifiers and arena modifiers OFF, matching the October 31 baseline. These focused tests are not a substitute for a full 50-class rerun before merge.

## Evaluation and decision rules

Compare all five scenarios using:
- win rate and 95% confidence interval;
- matchup results, especially Phoenix/Knight/Warlord/Paladin and Flagellant vs Jester/Viking;
- duration, end HP, HP margin, damage dealt and received;
- melee hit rate, reach utilization, rotation and peak rotation;
- Paladin passive damage share and triggers/sec;
- Flagellant wound tier reached and shared hit-buff stack count where available.

A lower win rate alone is not sufficient. Keep an edit only if the targeted class moves toward the target band, the relevant mechanic telemetry supports the hypothesis, and the wider matchup profile does not create a new severe outlier.

## Verification status after the expanded edits

- GitHub source edits applied to the PR #101 branch.
- Static review of the changed source and runner override paths is still required.
- Runtime/browser verification: not yet performed.
- Seeded A/B simulations: not yet performed.
- Full 50-class rerun: not yet performed.
- Merge: not authorized; keep PR #101 open.
