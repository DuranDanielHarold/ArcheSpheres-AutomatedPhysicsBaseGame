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
