# Balance Patch 2 — Aggressive Initial Pass

**Status: INCOMPLETE — draft implementation branch only. Do not merge or use for balance evaluation.**

- Requested baseline: `balance-baseline-2026-10-31T05-48-32-534Z`
- Baseline configuration: 50,000 matches, seed 1337, dt 0.05, no overrides; PR #100/#101 live values; hit-buff cap 10; Flagellant wound cap 3.
- Branch: `balance/patch-2-aggressive`
- Target: `main`

This document records what has actually been committed to the branch so far. It is not a declaration that the full specification has been implemented.

## Applied changes

### Telemetry and bug-fix pass

| ID | File | Applied change |
|---|---|---|
| T1 | `js/entities/sphere.js` | Live ability tracker records a stack-consuming activation when entry stacks are greater than zero, rather than requiring entry stacks to meet the default threshold. |
| T1 | `js/tools/balance-runner.js` | Balance-runner wrapper uses the same `before > 0` activation condition. |
| T2 | `js/entities/sphere.js` | Sheriff Bola firing reports an ability use to both balance and live combat trackers. |
| B1 | `js/entities/sphere.js` | Plague Doctor is saved as `virulenceSource` when applying Virulence; wall-bounce ToxicSmear instances use that source as owner. All four matching wall-smear construction sites were updated. |
| B2 | `js/combat/collisions.js` | Courtly Menace damage reduction now checks the attacking sphere's `courtlyT` and applies a 15% reduction. Primary and secondary weapon-hit paths were changed. |
| B3 | `js/entities/zones-and-traps.js`, `js/entities/sphere.js` | SlowZone accepts dt and applies `Math.pow(0.077, dt)` to velocity and impact velocity; Sphere passes dt to the zone. |
| B4 | `js/entities/sphere.js` | Sage Knowledge accumulates damage and grants one Knowledge per 8 accumulated damage, adding +0.5 DMG and +2 MDEF per Knowledge. |
| B5 | `js/combat/collisions.js` | Removed the duplicate Gladiator Favor gain and omega nudge from the weapon-hit path; the gain in `_applyHitBuff` remains. |

### Class registry edits committed

The following base-definition/registry changes have been committed. These are not yet a complete implementation of their associated mechanics.

| Class | Before → after |
|---|---|
| Phoenix | HP 371.72 → 350; DMG 4.13 → 3.9; OM 7.5 → 7.0; stack display threshold 3 → 5 |
| Jester | OM 13 → 11; DMG 3.24 → 3.0 |
| Viking | HP 496.5 → 470; DMG 4.8 → 4.5; ARM 120 → 112; stack threshold/display 4 → 5 |
| Warlord | HP 461 → 440; DMG 6.1 → 5.5; reach 3.4 → 3.1; mass 16 → 14 |
| Knight | HP 445.37 → 430; ARM 128 → 118; stack display threshold 5 → 6 |
| Trickster | SPD 269.89 → 255; HP 377.34 → 365; stack threshold/display 2 → 3 |
| Golem | DMG 7.52 → 6.6 |
| Prince | OM 8.5 → 7.8; stack threshold/display 4 → 5 |
| Gladiator | DMG 4.97 → 4.5; SPD 259 → 245; stack threshold/display 3 → 4 |
| Paladin | ARM 164.5 → 152 |
| Alchemist | stack threshold/display 3 → 4 |
| Pirate | HP 498.92 → 470; OM 8 → 7.4; stack threshold/display 3 → 3 |
| Berserker | DMG 4.38 → 4.1 |
| Stormbringer | DMG 4.07 → 3.8 |
| Crusader | ARM 170.52 → 156 |
| Guardian | stack display threshold 2 → 3 |
| Barbarian | DMG 5.4 → 5.1 |
| Templar | DMG 3.26 → 4.3; OM 4.1 → 4.8 |
| Whelpling | DMG 5.35 → 6.0; OM 5 → 6.0 |
| Locksmith | DMG 3.67 → 4.2 |
| Glassblower | DMG 3.05 → 3.5 |
| Queen | HP 281.89 → 330; stack threshold/display 4 → 3 |
| Ratcatcher | DMG 2.92 → 3.4 |

**Important:** The table above reports committed class-registry values only. It does not imply that the corresponding combat mechanics, class descriptions, or all stack-threshold runtime behavior have been updated.

## Not yet implemented

The following requested work remains incomplete and must be finished before this branch is mergeable:

- Remaining core ability changes for Phoenix, Jester, Viking, Warlord, Knight, Trickster, Golem, Prince, Vampire, Gladiator, Paladin, Alchemist, Pirate, Berserker, Stormbringer, Crusader, Guardian, Barbarian, Templar, Whelpling, Locksmith, Glassblower, Queen, Flagellant, Druid, Gravedigger, Ratcatcher, and Voidwalker.
- Remaining ranged changes for Sage, Wizard, Ranger, Fairy, Witch, Sheriff, Necromancer, Arcanist, and Bard.
- Projectile/zone changes in the projectile roster, including Alchemist miasma and all listed projectile damage/cadence adjustments.
- The full set of class-description corrections and threshold/runtime consistency checks.
- Correct default Flagellant wound cap of 5.
- The Jester dizzy drawback and Fairy clone-scale isolation.
- The requested full before/after table for every specified mechanic.
- README monitoring note is present, but the final monitoring guidance still needs review.

## Baseline invalidation notice

Once the full patch is implemented, all earlier baselines must be considered invalid for abilityUsesPerSec/abilityAction, Plague smear attribution, Queen, Sage, Templar, Gladiator Favor, and every changed class. Until the remaining changes are implemented, this branch must not be treated as the completed Patch 2 baseline.

## Verification status

- GitHub branch creation: completed.
- JavaScript syntax checks: **not run**. The GitHub connector used for these edits does not provide a local Node.js execution environment.
- Escaped-backtick / ${} artifact scan: **not run**.
- DEF single-assignment audit: **not run**.
- Integer ARM/MDEF audit: **not run**.
- Static out-of-scope class-change audit: **not run**.
- Browser tests: **not run**.
- 50,000-match seeded baseline: **owner-executed; not run here**.
- Determinism check: **owner-executed; not run here**.
- Merge: **not authorized**.

The requested owner-executed commands remain:

```js
await runBalanceBaseline({minutes:240,roundsPerPair:1,dt:1/20,targetMatches:50000,chunkSize:100,noVisuals:true,seed:1337});
```

```js
(async()=>{const o={minutes:1,roundsPerPair:1,keys:['phoenix','jester','sage','templar','plague','queen'],exportJson:false,exportCsv:false};const a=await runBalanceBaseline(o),b=await runBalanceBaseline(o);console.assert(JSON.stringify(a.classes)===JSON.stringify(b.classes),'class rows must be identical');console.table(a.classes.map(r=>({key:r.key,winPct:r.winPct,abilityUsesPerSec:r.avgAbilityUsesPerSec})));})();
```
