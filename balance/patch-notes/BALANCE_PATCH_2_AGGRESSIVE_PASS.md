# Balance Patch 2 — Aggressive Initial Pass

**Status: IMPLEMENTATION IN PROGRESS — keep PR #102 in draft; do not merge or use as a new balance baseline yet.**

- Requested baseline: `balance-baseline-2026-10-31T05-48-32-534Z`
- Baseline configuration: 50,000 matches, seed 1337, dt 0.05, no overrides; includes PR #100/#101 live values; hit-buff cap 10; original Flagellant wound cap 3.
- Branch: `balance/patch-2-aggressive`
- Target: `main`

This is a progress record, not a claim that all gameplay changes have passed simulation review. The implementation is deliberately unmerged.

## Applied telemetry and bug-fix pass

| ID | File | Applied change |
|---|---|---|
| T1 | `js/entities/sphere.js`, `js/tools/balance-runner.js` | Stack-consuming activations are counted when entry stacks are greater than zero, including non-default stack thresholds. |
| T2 | `js/entities/sphere.js` | Sheriff Bola firing reports an ability use to both balance and live combat trackers. |
| B1 | `js/entities/sphere.js` | Plague Doctor is retained as the source of wall-bounce ToxicSmear zones. |
| B2 | `js/combat/collisions.js` | Courtly Menace applies 15% less outgoing damage to attackers affected by the Queen's aura in primary and secondary weapon-hit paths. |
| B3 | `js/entities/zones-and-traps.js`, `js/entities/sphere.js` | SlowZone velocity decay is dt-based (`Math.pow(0.077, dt)`); Sphere passes dt into the zone. |
| B4 | `js/entities/sphere.js` | Sage Knowledge accumulates damage; each 8 accumulated damage grants +0.5 DMG and +2 MDEF. |
| B5 | `js/combat/collisions.js` | Removed duplicate Gladiator Favor gain/omega nudge from the weapon-hit path; the gain in `_applyHitBuff` remains. |

## Applied class and combat changes

### Core melee, passive, and zone mechanics

| Class/system | Applied values or behavior |
|---|---|
| Phoenix | Rebirth heal 18%, invulnerability 0.6s; Ashwing lasts 1.4s. |
| Jester | Chaos Lurch damage multiplier reduced to 1.35; 1.0s dizzy recovery at 45% spin; stack threshold/display adjusted. |
| Viking | Last Stand duration 4.5s; registry and threshold changes committed. |
| Templar | Anchor threshold uses 0.65× base speed; anchor gains 0.9/s normally or 1.5/s during Slow Field, decays 0.4/s; physical mitigation is `0.85 - 0.40 × anchor`; Slow Field lasts 4.5s, has 3.2× radius, and uses 1.3 damage multiplier. |
| Whelpling | Growth every 3s; each growth adds +1 mass, +2 radius, +15 max HP, +8 current HP, +0.25 DMG, and +0.12 OM; BreathFlame uses 1.0× DMG. |
| Queen | 3-stack Gambit lasts 4s; successful back hits add 1% base DMG; Courtly Menace reduces affected attackers' outgoing damage by 15%; HP registry value set to 330. |
| Locksmith | Two clash Locks cause a 1.6s jam; Master Key extends a two-Lock jam to 1.8s. |
| Glassblower | Shards deal 12 true damage on contact and 9 on detonation; shatter speed threshold 130; Bleeding Glass deals 2.5 damage per tick for up to 4s; shard cap remains 18; shards drop on wall bounces and weapon hits. |
| Druid | Thorn Patch uses 2.8× radius, 8s duration, and 1.1× DMG ticks every 2.5s; passive whip sweep is every 2.5s at 0.8× DMG. |
| Gravedigger | Burial Mound every fourth wall contact; mound trigger damage is `max(1, targetHP × 0.045)`. |
| Ratcatcher | Gnaw bite deals 3; normal rat tick deals 1.5; rat lifetime 6s; Gnawed speed multiplier is `max(0.6, 1 - stacks × 0.08)`, capped at 5 stacks. |
| Voidwalker | Singularity damage is 0.45× DMG on its 0.35s tick; Void Tear damage is 0.55× DMG every 0.45s. |
| Flagellant | Sacred Wounds cap is 5 tiers; each 15 HP lost adds +0.8 DMG and +0.4 OM/spin. |

### Ranged class mechanics

| Class | Applied values or behavior |
|---|---|
| Sage | Wisdom Word cooldown 0.26s and +26 DMG; Foresight Wisdom Wave uses 12× DMG and 5.5× sphere-radius range. |
| Wizard | Flame Bolt cooldown 0.17s; standard and Rod bolts receive +11 DMG. |
| Ranger | Volley uses 4 bursts and +4 volley damage; critical chance scales at 1.2× lost-HP fraction (60% cap); arrow bonus +7. |
| Fairy | Wand damage +14; cooldown 0.14s normally / 0.08s during Wish; Wish clone scale remains 0.8 while the generic mirror default is 0.6. |
| Witch | Hex Bolt cooldown 0.19s and +15 DMG; convergence bolts receive +9 DMG. |
| Sheriff | Standard bullet +5 DMG; reload 0.60s with 0.30s floor; Bola root 1.4s; piercing shot 46 plus 7% target max HP. |
| Necromancer | Skull Orb cooldown 0.20s and +5 DMG; Death Mark uses 0.90× projectile DMG + 1.5 raw damage per tick, with each tick mitigated by target MDEF, and can extend to 14 ticks. Completed mark sequences summon Skeletons, capped at 3 living Skeletons per Necromancer; death or lifespan expiry frees a slot. Wound halves healing received. |
| Arcanist | Charge builds at 1.5× rate and loses 50% on damage; Shell +12 DMG, 2.1× radius, 3s burn zone (6s Overloaded), 4 magic damage per tick. |
| Bard | Note cooldown 0.45s and +4 DMG; Crescendo uses +4 DMG at 2.6× multiplier; Sonic damage scales by 1 + 0.15 per bounce. |

### Class registry and description work

Registry edits and one-decimal/integer defense normalization have been applied to the 37 class files changed in this PR. Touched class descriptions have been revised for the updated abilities and passives, including the Jester dizzy drawback and Fairy clone-scale distinction. The class files remain subject to gameplay and description review against the original request.

## Verification completed

- All 37 changed class JavaScript files passed syntax parsing via the JavaScript function parser.
- All 37 changed class registries passed the single-`DEF` assignment and numeric precision audit after correcting Flagellant and Void Walker values: ARM/MDEF are integers; other numeric stats have at most one decimal.
- The seven shared runtime files (`sphere.js`, `collisions.js`, `zones-and-traps.js`, the three projectile files, and `balance-runner.js`) passed syntax parsing.
- Escaped-backtick / escaped-`${}` scan across those seven shared runtime files found no artifacts.

These checks are not a substitute for running `node --check` in the project environment or exercising the game in a browser.

## Still required before review

- Reconcile every remaining class-specific before/after value and behavior against the complete original Balance Patch 2 request; this document is not yet a full exhaustive change ledger.
- Run a complete static out-of-scope diff audit and review every changed class description/threshold against runtime behavior.
- Run `node --check` (or the project's actual syntax/test scripts) in a local/CI Node environment.
- Run browser smoke tests for melee, ranged projectiles, status effects, and zones.
- Run the requested 50,000-match seeded baseline and determinism comparison; no balance conclusion can be made from code edits alone.
- Keep PR #102 as draft and do not merge until those checks and the simulation comparison are complete.

## Baseline invalidation

The requested baseline is no longer comparable once the complete patch is applied. Re-run the same 50,000-match configuration (seed 1337, dt 0.05, no overrides) after all code changes are complete. Until then, do not treat this branch as the completed Patch 2 baseline.

## Owner-executed simulation commands

```js
await runBalanceBaseline({minutes:240,roundsPerPair:1,dt:1/20,targetMatches:50000,chunkSize:100,noVisuals:true,seed:1337});
```

```js
(async()=>{const o={minutes:1,roundsPerPair:1,keys:['phoenix','jester','sage','templar','plague','queen'],exportJson:false,exportCsv:false};const a=await runBalanceBaseline(o),b=await runBalanceBaseline(o);console.assert(JSON.stringify(a.classes)===JSON.stringify(b.classes),'class rows must be identical');console.table(a.classes.map(r=>({key:r.key,winPct:r.winPct,abilityUsesPerSec:r.avgAbilityUsesPerSec})));})();
```


## Additional regression audit fixes

| Area | Finding | Correction |
|---|---|---|
| Knight | Ability condition was raised to 6 stacks, but its registry inherited the default stack cap of 5, making activation unreachable. | Set both `STACK_THRESHOLD.knight` and `STACK_DISPLAY_THRESHOLD.knight` to 6. |
| Plague Doctor | ToxicSmear used `sameFaction` as the enemy test, so it selected allies and damaged its own source team. | Reverse the faction predicate; smears now slow/damage opposing spheres only. |
| Warlord | The 2s Earthquake spin window did not actually set the promised 1.5× spin rate. | Set `omegaCur` to 1.5× base spin when Earthquake activates. |
| Prince | Royal Bulwark applied +20 ARM/MDEF but displayed `BULWARK +30`. | Correct the floating combat label to +20. |

These are code-review corrections, not evidence of a completed balance simulation. ToxicSmear's faction predicate was also wrong on `main`; this draft now carries the correction.
