# Balance Harness Audit

## Phase 0 — source-of-truth cleanup

- **`js/data/classDefs.js`, `js/data/classMeta.js`, `js/data/classStacks.js`:** stale pre-refactor snapshots could mislead tooling. **Fixed:** removed after confirming they are absent from `index.html` and have no repository references.
- **`js/classes/{beastmaster,berserker,crusader,dragoon,fairy,flagellant,locksmith,necromancer,paladin,prince}.js`:** each file assigned its `DEF` entry twice. **Fixed:** removed the first superseded assignment, retained the runtime-winning second assignment unchanged, and documented the single-assignment rule.

## Remaining phases

Phases 1–4 are intentionally deferred to the next bounded implementation session. No measurement, simulation, or gameplay behavior was changed in Phase 0.

## Baseline invalidation notice

All pre-existing balance CSVs, including the 2026-08-08 and 2026-08-10 cycles, were produced by the broken harness and must not be used as a comparison baseline for future patches. Capture a fresh full baseline after the harness-repair session is complete.

## Phase 1 — Real-clock coupling

- **`js/entities/sphere.js:Sphere._firePiercingShot`:** the piercing round used a 220 ms real-clock timeout, so fast-forward simulation reset the match before it fired. **Fixed:** the existing simulated-time `sheriffPiercingTimer` and `sheriffPiercingTarget` now defer projectile creation by 0.22 seconds and `_resolvePiercingShot` re-aims at the live target position.
- **`js/entities/sphere.js:Sphere._checkAbilityTrigger` (ninja):** Blink Strike used a real-clock reset, leaving `blinking` active through a simulation. **Fixed:** `blinkVisualT` now expires through `Sphere.update(dt)`.
- **`js/entities/sphere.js:Sphere._passiveAbility` (dragoon):** landing ring particles were queued by real-clock timers. **Fixed:** all three visual bursts spawn in the landing frame, and are skipped under `_balanceNoVisuals`.
- **`js/entities/zones-and-traps.js:FireBreathZone.update`:** the cross-zone anti-stack gate compared `performance.now()` values, making its 0.45-second simulated interval depend on wall time. **Fixed:** each sphere owns a `_fireZoneCooldown` decremented once per `Sphere.update(dt)`.
- **`js/tools/balance-runner.js:clearPendingBalanceTimeouts`:** retained as a safety net and now warns with the exact pending-timeout count when it clears anything.

### Real-clock sweep classification

| Site | Classification | Disposition |
| --- | --- | --- |
| `Sphere._firePiercingShot`, ninja Blink Strike, dragoon landing rings | Gameplay | Converted to simulated-time state / same-frame visual spawn. |
| `FireBreathZone.update` anti-stack gate | Gameplay | Converted to `_fireZoneCooldown` seconds. |
| `Sphere.hpBarLastUpdate`, `_syncHpBarVisual`, `_drawHpBar` | Visual-only | Annotated `// visual-only: safe under fast-forward`. |
| `Sphere._drawPowerOverlay` `Date.now()` calls | Visual-only | Annotated `// visual-only: safe under fast-forward`. |
| Monk chi trail and dragoon leap-shadow pulse | Visual-only | Annotated; no game state depends on them. |
| `js/main.js` / `js/loop/game-loop.js` frame pacing | Correct as-is | Wall clock is required for browser frame pacing. |
| `js/tools/balance-runner.js` elapsed-time budget/export cleanup | Correct as-is | Wall clock is intentionally used for the run budget and deferred URL cleanup. |
| `js/weapons/*` draw functions and UI telemetry throttle | Correct as-is | Draw paths are not invoked by no-visual balance simulation; UI is out of scope. |

**Deferred — render inside update:** `Sphere._passiveAbility` still draws the Dragoon leap shadow through direct `ctx` calls from update logic. Those calls run during `_balanceNoVisuals` simulation. It is a render-architecture issue rather than a real-clock gameplay dependency and is deferred.

### Phase 1 baseline invalidation notice

Phase 1 restores intended gameplay timing. Any baseline captured after Phase 0 but before this change is also invalid. Sheriff, Whelpling, and Ninja win rates are expected to move, with Sheriff expected to move the most.

### Owner-executed runtime verification

Paste this complete block into the browser console after loading the game:

```js
(async()=>{
  const options={minutes:1,roundsPerPair:1,keys:['sheriff','whelpling','ninja','dragoon','knight'],exportJson:false,exportCsv:false};
  const warnings=[];
  const originalWarn=console.warn;
  console.warn=(...args)=>{if(String(args[0]).includes('[balance] cleared'))warnings.push(args);originalWarn(...args);};
  try{
    const first=await runBalanceBaseline(options);
    const rows=first.classRows||first.classes||first.rows;
    const row=key=>rows.find(entry=>entry.key===key||entry.classKey===key);
    const sheriff=row('sheriff'),whelpling=row('whelpling');
    console.table([{
      key:'sheriff',avgProjectilesFiredPerMatch:sheriff.avgProjectilesFiredPerMatch,
      avgProjectileHitRate:sheriff.avgProjectileHitRate,avgProjectileDmgPct:sheriff.avgProjectileDmgPct,
      avgDmgDealt:sheriff.avgDmgDealt,winPct:sheriff.winPct
    },{key:'whelpling',avgDmgDealt:whelpling.avgDmgDealt,winPct:whelpling.winPct}]);
    console.log('clearPendingBalanceTimeouts warnings (expected 0):',warnings.length);
    const second=await runBalanceBaseline(options);
    const secondRows=second.classRows||second.classes||second.rows;
    console.assert(JSON.stringify(rows)===JSON.stringify(secondRows),'Class rows must be byte-identical for the default seed');
  } finally { console.warn=originalWarn; }
})();
```

Expected direction: Sheriff's projectile share and total damage should rise substantially; Whelpling's fire-zone contribution should rise; Ninja and Dragoon should be near-unchanged; Knight is the control and should be unchanged except for opponent effects.

### Owner-executed live-play checklist

- Sheriff 1v1: land two weapon hits; verify the bola, the gold piercing laser about 0.2 seconds later, the full shotgun-swap window, and armour penetration.
- Whelpling 1v1: trigger Firebreath and verify the lingering zone retains its visible tick cadence.
- Ninja 1v1: trigger Blink Strike and verify its purple blink ring clears.
- Dragoon 1v1: trigger Wyrm's Descent and verify the landing shockwave rings render.
- Complete one 2v2 and one Testing Ground launch with no console errors.

## Phase 2 — Stall/timeout unification

- **Pre-flight:** branch history is a squash commit (`1be0a8`) containing the prior Phase 0/1 work; no unexplained working-tree changes were present. Phase 1 warning text is exactly ``[balance] cleared ${pendingBalanceTimeouts.size} pending real-clock timeout(s)``. Added the required UI-only annotations to the orientation resize debounce and winner long-press callback.
- **Ramp calibration:** `computeStallRampDps(matchSpheres)`, `applyStallRampDamage(matchSpheres, damageThisTick)`, and `resolveStallTimeoutWinner(matchSpheres)` now replace duplicated live/runner math. The runner caches the computed DPS per match at the stall threshold. A Vampire/Flagellant-only matchup formerly used roster-max approximately 594–609 / 24 = 24.75–25.4 DPS; it now uses that match's maximum HP / 24.
- **Sudden-death labeling:** `applyStallRampDamage` is the sole setter of `_killedBySuddenDeath`. The runner labels a deciding all-ramp death `sudden_death_kill` or `sudden_death_double_ko`; ordinary combat decisions retain their existing labels. Deliberate asymmetry: live still displays ramp kills as `elimination`.
- **Report fields:** class rows/CSV add `suddenDeathWinRate`; matchup rows/CSV add `suddenDeathKills`.
- **Baseline invalidation:** all prior baselines, including Phase-1-era captures, use the wrong HP pool for ramp DPS in stall-reaching matches. Capture a fresh full baseline before making stall-affected balance decisions.

### Owner runtime verification

```js
(async()=>{const o={minutes:1,roundsPerPair:1,keys:['vampire','flagellant','templar','golem'],includeMirrors:true,exportJson:false,exportCsv:false,debugStall:true,targetMatches:200};const a=await runBalanceBaseline(o),counts=a.results.reduce((m,r)=>(m[r.endReason]=(m[r.endReason]||0)+1,m),{});console.table(counts);for(const r of a.classes)console.assert(Math.abs((r.eliminationWinRate+r.suddenDeathWinRate+r.tiebreakWinRate)-r.winRate)<.0005,r.key);const b=await runBalanceBaseline(o);console.assert(JSON.stringify(a.classes)===JSON.stringify(b.classes),'deterministic class rows');})();
```

Expected: debug output for a ramping Vampire/Flagellant match shows its own max-HP / 24 DPS, rather than 24.75–25.4; sudden-death labels appear in sufficiently long matches. Live check: Knight vs Templar still shows the warning/banner/pulse/ramp and Battle Report still says elimination; complete a 2v2 without console errors.

## Phase 3 — Damage attribution

- **Pre-flight:** Phase 0 → Phase 1 → Phase 2 (`5fd36dc`, “Unify live and simulated stall resolution”) is the trusted starting point. Phase 2's `computeStallRampDps`, `applyStallRampDamage`, and `resolveStallTimeoutWinner` remain closed; Phase 3 starts with no prior attribution artifact.
- **Foundational tracking:** `recordDamageEvent(sourceKey, sourceType, amount)` routes explicit, positive post-mitigation HP deltas to both live and balance trackers. It deliberately does not extend the fragile inference-global pattern. Each new call is either a direct HP write or a victim/passive-frame `receiveDamage` call where the globals are unset, so it does not duplicate ordinary hit/projectile accounting. Stack gains now use `onStackGain`; `_applyLowHpBuff()`'s two zero-damage `onPassiveTrigger` calls were removed rather than misclassified. `CombatTracker` now exposes `stackGains` and `abilityBlocked` only through `getSummary()`.
- **Tier B — DoT sources/ticks:** burn sources are stamped by FlameBolt, BreathFlame, FireBreathZone, LingeringMiasma, and fire rod applications (`projectiles-basic.js`, `projectiles-roster.js`, `zones-and-traps.js`); burn, bleed, glass-bleed, death-mark, sepsis, and inquisitor heat-trail ticks explicitly report `dot` in `sphere.js`. Rogue stamps `bleedSourceKey`; plague stamps `sepsisSourceKey`; GlassShard stamps `glassBleedSourceKey`; SkullOrb (both branches) and necromancer stamp `deathMarkSourceKey`.
- **Tier C — passive damage:** paladin holy pulse in `_passiveAbility`, plus druid auto-whip AoE and vampire ghost-bat ticks in `Sphere.update()` (not `_passiveAbility`) report post-damage deltas as passive damage.
- **Tier D — bypass writes:** PiercingBullet (ability), BurialMound (passive), GlassShard contact (passive) / detonation (ability), stormbringer static discharge (passive) and thunderclap discharge (ability), dragoon impact AoE (ability), flagellant enemy Penitence shockwave (ability), and Queen's Gambit (ability) now use explicit routes. `GlassShard.shatter(target,dmg,sourceType='passive')` preserves contact behavior while `detonate(sourceType='ability')` threads ability typing to every shatter call.
- **Remaining corrections:** melee attempts have an independent per-defender latch that is cleared with the existing swing-contact latch. Ability-blocked events cover crusader, whelpling, gladiator, gravedigger, and dragoon (the leap and no-enemy branches). Projectile-fire tracking now includes every owned projectile. The dragoon branch still clears stacks before discovering no enemy: **observed, not fixed** to preserve gameplay behavior.
- **Mirror matches:** the full identity/faction attribution fix remains deferred because it requires threading side identity through all event call sites. `CombatTracker` now warns once and marks mirror match construction defensively; pairing code documents the limitation.
- **Baseline invalidation #4:** every earlier baseline, including Phase 2, undercounted or dropped DoT and several ability/passive mechanics and over-counted melee attempts. Rogue, plague, whelpling, inquisitor, sheriff, gravedigger, glassblower, stormbringer, dragoon, flagellant, paladin, druid, vampire, and queen are most affected. Capture a fresh full baseline before a patch decision.

### Owner-executed runtime verification

Paste the Session 5 verification block supplied for this phase into the browser console. Expected direction: rogue/plague/whelpling/inquisitor show material `dotDmgPct`; sheriff/gravedigger/glassblower/stormbringer/dragoon/flagellant/paladin/druid/vampire/queen gain ability/passive attribution; melee hit rate rises and `VISUAL_OUTPACING_HITBOX` drops well below the prior approximately 36/50; knight is the control. The block must report no damage-share sum failures and byte-identical repeated seeded class rows.

### Owner-executed live-play checklist

- Rogue bleed ticks with no console error.
- Paladin holy pulse heal/damage/knockback remains unchanged.
- Sheriff bola then piercing-shot sequence remains unchanged.
- Glassblower Kiln Detonation and passive shard shatter remain visually unchanged.
- Run one 2v2 with no console errors.

### Implemented attribution map (source/tick references)

| Tier | Mechanics | Implemented references |
|---|---|---|
| B | burn, bleed, glass-bleed, death-mark, sepsis, heat trail | `sphere.js`: 951, 1056, 1115, 1205, 1289, 1298; source stamps: `collisions.js`: 268, 289; `projectiles-basic.js`: 616, 619; `zones-and-traps.js`: 112, 330; `projectiles-roster.js`: 141, 208. |
| C | paladin pulse, druid whip, vampire bats | `sphere.js`: 1394, 1080, 1157. |
| D | Queen, static/thunderclap, piercing, mound, glass shard, dragoon impact, Penitence | `collisions.js`: 216, 308; `sphere.js`: 685, 741, 1828–1829; `projectiles-basic.js`: 260; `zones-and-traps.js`: 32, 108–123. |

## Phase 3 follow-up — Zone and companion attribution gaps

- **Root cause:** `thornPatches`, `slowZones`, `miasmaClouds`, and `noiseTraps` do not receive the `_balanceDamageSource` wrapper used by the `projectiles` loop. Phase 3's Tier B/C/D review therefore missed damage that occurs wholly inside classes updated from those arrays.
- **Fix 1 — `projectiles-roster.js: RosterBolt._hit` (witch Jinx burn):** stamps `burnSourceKey=this.owner.key`; the status burn remains a DoT and is now attributed to the witch.
- **Fix 2 — `zones-and-traps.js: FireBreathZone.update`:** reports the zone's direct hit as `ability`; it is the persistent effect of Whelpling's named Firebreath ability.
- **Fix 3 — `projectiles-roster.js: LingeringMiasma.update` (purple vial):** reports its magic tick as `ability`; Unstable Concoction creates the miasma.
- **Fix 4 — `zones-and-traps.js: ArcaneBurnZone.update`:** reports its tick as `passive`; the zone is created by Arcanist's Volatile-Charge/arcane-cannon mechanic.
- **Fix 5 — `zones-and-traps.js: ThornPatch.update`:** reports its tick as `ability`; Thorn Patch is Druid's named 3-stack ability.
- **Fix 6 — `zones-and-traps.js: ToxicSmear.update`:** reports its tick as `passive`; it comes from Plague Doctor's Virulence wall-hit effect.
- **Fix 7 — `zones-and-traps.js: VoidTear.update`:** reports its tick as `passive`; Void Tears are wall-bounce passive effects.
- **Fix 8 — `zones-and-traps.js: RatMinion.update`:** gnaw rats report `ability` (Infestation), and ordinary rats report `passive` (Rat Pack/Wild Bond per-hit effects).
- **Fix 9 — `companions.js: BeastCompanion.update`:** ferrets report `passive` (Wild Bond); wolf, boar, and hawk report `ability` (Pack Hunt).
- **Fix 10 — `sphere.js: Sphere._passiveAbility` voidwalker Singularity tick:** reports `ability`; Singularity is the named 3-stack active window.
- **Skeleton deferral:** skeleton-derived damage needs an owner-key field on `Skeleton` itself. None of `Skeleton`, `BarbAlly`, or `ArcherAlly` expose a form `_skeletonWeaponHit` can read, so this remains reserved for a dedicated session.
- **Open question for owner:** nothing in the current ability logic appears to set `queenInvisible = true`, so the Archer-Ally spawn path in `_passiveAbility`'s queen case may be unreachable dead code; flagged for the owner to confirm, not fixed here.
- **Baseline invalidation #5:** any baseline captured before this follow-up, including immediately after Phase 3 landed, still undercounts witch (Jinx burn), whelpling (Firebreath direct tick), alchemist (Miasma purple tick), arcanist (burn zone), druid (Thorn Patch), plague (Toxic Smear), voidwalker (Void Tears and Singularity), ratcatcher (both rat types), and beastmaster (all four companion kinds).

### Owner-executed runtime verification

```js
(async()=>{
  const keys=['witch','whelpling','alchemist','arcanist','druid','plague','voidwalker','ratcatcher','beastmaster','knight'];
  const first=await runBalanceBaseline({minutes:2,roundsPerPair:1,keys,exportJson:false,exportCsv:false});
  console.table(first.classes.map(r=>({key:r.key,avgDmgDealt:r.avgDmgDealt,ability:r.avgAbilityDmgPct,passive:r.avgPassiveDmgPct,dot:r.avgDotDmgPct})));
  const second=await runBalanceBaseline({minutes:2,roundsPerPair:1,keys,exportJson:false,exportCsv:false});
  console.assert(JSON.stringify(first.classes)===JSON.stringify(second.classes),'Class rows must be byte-identical for the default seed');
})();
```

Expected direction: ability/passive damage share rises for every listed class compared with a pre-follow-up capture; knight is the control. Live checks: trigger witch Jinx burn, keep an enemy in Whelpling Firebreath for its full duration, then run one 2v2 without console errors.

## Phase 4 — Statistical hygiene and export discipline

- **Item 1 — Wilson confidence:** `js/tools/balance-runner.js` now defines `wilsonInterval(wins,n,z=1.96)` and derives class confidence from the 95% interval width rather than raw game count. Class rows expose `winRateCI95Low`/`winRateCI95High`; the interval uses elimination-only wins (`wins - tiebreakWins - suddenDeathWins`) over decisive games (`games - draws`). `NEEDS_MORE_DATA` now gates on Wilson interval width `> 0.15` at the class-row action site in `summarizeClassRow`, and the suggestion text reports the interval width.
- **Item 2 — normalized HP margin:** `avgHpMarginPct` is `avgHpMargin / DEF[key].hp`, while raw `avgHpMargin` remains in the output. The pressure term uses the normalized value multiplied by the class HP and the existing `0.08` coefficient, preserving the old `avgHpMargin * 0.08` contribution exactly. `weightedStatAdjustment` accepts the normalized margin and reconstructs the equivalent raw scale only for the legacy pressure magnitude, so patch behavior is not silently shifted. `avgHpMarginPct` is exported in the class CSV.
- **Item 3 — retention:** `DEFAULTS.maxRetainedResults` is `5000`. `buildReport` performs deterministic reservoir sampling with a dedicated `mulberry32` stream derived from `options.seed`, after full class/matchup aggregation is complete. Runs at or below the cap retain every result; larger runs retain exactly the cap. `totalMatches` records the unsampled count and `retainedResults` records the retained count. `matchCount` remains the true total for backward compatibility.
- **Item 4 — identity/versioning:** report headers now include integer `schemaVersion: 1` and a seed-traceable `runId` built from the seed and ISO timestamp. No `tools/balance-ml/` directory exists; no separate DEF-stat CSV serialization was added.
- **Item 5 — replica winner rule:** `js/loop/game-loop.js:checkEliminationWin()` and `js/tools/balance-runner.js:livingPrimaryFactions()/resolveWinnerFromLivingFactions()` now derive living factions from non-replica spheres and only return a non-replica winner. When a faction has only replicas alive, it no longer counts as an alive faction; if both sides have no primary survivor, the runner falls through to `double_ko`, while a surviving primary opponent yields elimination/sudden-death classification according to the existing deciding-sphere logic. This changes future Trickster/Fairy outcomes where their replica was previously eligible to carry a win; live HUD/reporting now receives `null` rather than a replica when no primary winner exists.

### HP-margin coefficient check

The normalization preserves the previous score influence algebraically: `avgHpMarginPct * DEF[key].hp * 0.08 == avgHpMargin * 0.08`. For a comparable +20 HP margin, Vampire (181 HP), a representative mid-HP class (400 HP), and King (609 HP) contribute `+1.60`, `+1.60`, and `+1.60` to pressure before confidence/matchup terms. The new percentage values are approximately `0.1105`, `0.0500`, and `0.0328`, respectively; this makes the exported metric comparable while keeping the existing balance-score contribution unchanged.

### Aggregation and sampling verification

Aggregation remains over the complete `results` array. Reservoir sampling is applied only when constructing `report.results`, so class and matchup rows cannot change merely because the retention cap changes. The reservoir stream is separate from per-match `Math.random`, preserving simulation determinism.

### Trickster/Fairy end-reason trace-through

With replicas excluded from `livingPrimaryFactions()`, a phase replica can no longer keep a faction alive or be returned as winner. If the opposing primary is also gone, `factions.length` becomes zero and the existing runner branch produces a draw (`double_ko` unless the surviving deciding objects are all marked by sudden death, in which case `sudden_death_double_ko`). If the opposing faction still has a primary survivor, the remaining primary faction resolves the match rather than the replica. Live `checkEliminationWin()` follows the same non-replica rule; its `concludeMatch(null, 'elimination')` path displays a draw rather than a replica winner when the condition is reached without a primary winner.

### Baseline invalidation notice — final harness-repair notice

Every baseline captured before this Phase 4 session used a degenerate confidence metric, an unnormalized HP-margin term in patch recommendations, and the replica-winner bug. This is the **fifth and final invalidation notice** in the harness-repair arc. Once a fresh baseline is captured after this session, the harness is trusted; future invalidation notices should be issued only for genuine new regressions, not accumulated backlog.
## Phase 4 follow-up — HP-margin normalization correction (2026-10-07)

The original Phase 4 Item 2 implementation was verified after merge and found to cancel its own normalization. It computed `avgHpMarginPct = avgHpMargin / DEF[key].hp` correctly, but then multiplied that value by `DEF[key].hp * 0.08` in `summarizeClassRow` and reconstructed `avgHpMargin` again inside `weightedStatAdjustment`. Therefore a fixed raw +20 HP margin produced the same pressure contribution for low-, mid-, and high-HP classes. The previous audit wording that described this cancellation as intentional was incorrect and is retained only as history.

### Corrected coefficient derivation

Use real roster values spanning the requested HP range: Vampire = **179.11 HP**, Bard = **407.64 HP**, King = **594 HP**. The old raw-margin coefficient was `0.08`. For a representative fixed raw margin of +20 HP, the mid-HP Bard has `20 / 407.64 = 0.04906`. The old mid-class pressure contribution was `20 * 0.08 = 1.60`. Choosing the new normalized coefficient as `1.60 / 0.04906 ≈ 32.61` preserves that representative mid-HP magnitude while making fixed raw margins scale inversely with each class's HP pool. This follow-up uses **32.61** rather than the rough 32 starting point suggested by the prompt.

The resulting fixed-raw +20 contributions are approximately:

| Class | HP | `avgHpMarginPct` | New pressure contribution (`pct × 32.61`) |
| --- | ---: | ---: | ---: |
| Vampire | 179.11 | 0.11166 | 3.64 |
| Bard | 407.64 | 0.04906 | 1.60 |
| King | 594.00 | 0.03367 | 1.10 |

This is the required divergence: the same +20 raw HP margin is a much larger fraction of Vampire's pool than King's. For a fixed `avgHpMarginPct = 0.10`, all three classes contribute `0.10 × 32.61 = 3.261`, independent of HP pool.

### Corrected `weightedStatAdjustment` derivation

The old `200` raw-HP denominator is anchored to the same 400-HP midpoint used by the original design intent. Converted to a fraction: `200 / 400 = 0.50`. Therefore `marginPressure = clamp(abs(avgHpMarginPct) / 0.50, 0, 0.45)` uses the normalized metric directly and preserves the old notion of 200 raw HP being near the top of the pressure range for a midpoint class.

The old meaningful-margin branch threshold of 40 raw HP similarly becomes `40 / 400 = 0.10`. The corrected implementation treats ±10% as the meaningful-margin boundary: NERF uses the defensive branch at `avgHpMarginPct >= 0.10` and BUFF at `avgHpMarginPct <= -0.10`. This is identical across HP pools. At +10% margin, `marginPressure = 0.10 / 0.50 = 0.20`, so the same branch and pressure apply to Vampire, Bard, and King. `hpMax` was removed from `weightedStatAdjustment` and from its call site because it has no remaining purpose.

### Fixed-pct verification for `weightedStatAdjustment`

For Vampire, Bard, and King at +10% HP margin:

| Class | HP | `avgHpMarginPct` | `marginPressure` | NERF branch |
| --- | ---: | ---: | ---: | --- |
| Vampire | 179.11 | 0.10 | 0.20 | defensive (`>= 0.10`) |
| Bard | 407.64 | 0.10 | 0.20 | defensive (`>= 0.10`) |
| King | 594.00 | 0.10 | 0.20 | defensive (`>= 0.10`) |

The computation and CSV export of `avgHpMarginPct` remain unchanged; only its consumption changed. `patchTargets` continues to use raw `avgHpMargin` for its existing ±80 thresholds, as explicitly required.

### Verification scope

Items 1, 3, 4, and 5 are untouched. No `DEF` values, stall/timeout logic, damage attribution, report fields, build/dependency configuration, or `patchTargets` thresholds were changed. The only code changes are the two HP-relative weighting formulas and removal of the now-dead `hpMax` parameter.

**Baseline notice:** the merged Phase 4 baseline remains invalid for HP-margin-driven patch recommendations. Capture a fresh baseline after this correction before using balance-score patch recommendations. This correction does not invalidate the other four Phase 4 fixes.

## Phase 5 — Melee instrumentation correction (2026-10-08)

- **Melee attempt definition:** `_weaponHit` now records at most one attempt per attacker/defender approach while the pair is inside `def.radius + att.radius * att.d.reach * 1.15`. The attempt latch is cleared only after the pair leaves that engagement range; the existing `_hitDefenders` contact latch remains separate for damage deduplication.
- **Known suspect:** confirmed on the pre-Phase-5 implementation. Because `_weaponHit` runs every frame and the attempt latch was cleared whenever the blade was not touching the defender, the old code could record attempts on repeated out-of-contact frames. PR #85 fixes that accounting bug.
- **Outcome neutrality:** the change only gates tracker calls and changes instrumentation latches. It does not modify damage, knockback, `_hitDefenders`, `weaponHitCD`, omega flips, or any RNG call/order.
- **Other Phase-5 reporting fixes:** ability verdicts account for DoT contribution when the direct ability bucket is near zero; projectile `OVERHAUL` requires both low hit rate and low damage share, with suggestions distinguishing reliability from contribution.

### Baseline invalidation

Because the melee attempt denominator and attempt-distance sample definition changed, older values for **`avgMeleeHitRate`, `avgMeleeAttemptDistance`, `reachUtilizationRatio`, and `meleeHitboxAction` are not directly comparable** with Phase-5 results. Other outcome fields and non-melee metrics remain comparable where their underlying instrumentation did not change. Capture a fresh baseline before using the four melee fields for balance decisions.

### Verification status

The branch was rebased onto current `main` as a merge commit. Repository inspection verified the intended three-file Phase-5 scope and preserved the current Test Ground diagnostic/hardening changes. Browser/runtime execution, `node --check`, seeded baseline runs, outcome-neutrality runs, metric samples, diagnostic export/live-view checks, and 10-class `VISUAL_OUTPACING_HITBOX` counts are **not verified in this environment** and must be run before merge.

### Phase 5 follow-up — engagement-state correction (2026-10-08)

The first Phase-5 latch fix was still too coarse: it opened an attempt from **center distance** alone and immediately logged the attempt, even though the blade could be nowhere near the defender. That made the denominator contain non-contact frames and measured distance before the blade actually entered strike range. It also evaluated `hit` only on the opening frame, so a later hit in the same engagement could never credit that attempt.

The corrected instrumentation uses an explicit per-attacker/per-defender engagement state:

- **Open:** when the closest blade point enters the defender strike envelope, `def.radius + tipR + 0.08 * attacker.radius`.
- **Distance sample:** captured once at opening as `(centerDistance - defender.radius) / attacker.radius`, so it is measured at strike-range entry rather than on an arbitrary earlier frame.
- **Stay open:** while the blade remains inside the larger separation threshold (`engagementThreshold + 0.18 * attacker.radius`).
- **Close:** when the actual combat-hit path succeeds, with `hit=true`; or after 3 consecutive frames outside the larger separation threshold with `hit=false`. A geometric blade overlap that is rejected by `_hitDefenders` or the existing blind miss does not count as a hit.
- **Exactly one attempt:** `onMeleeAttempt` is called only when the engagement closes; therefore a later hit credits the same attempt and no far-apart frame creates an attempt.

The existing `_hitDefenders` map and its combat-hit code were not changed. No RNG calls were added, removed, or reordered.

**Evidence supplied by owner before this correction:**

| Class | Main hit rate | Main distance | Main ratio | #85 hit rate | #85 distance | #85 ratio |
|---|---:|---:|---:|---:|---:|---:|
| Knight | 0.0155 | 4.99 | 1.56 | 0.0076 | 3.50 | 1.09 |
| Samurai | 0.0253 | 6.53 | 1.52 | 0 | 4.71 | 1.09 |

These values were not plausible because #85 was still opening from center-distance geometry and logging immediately. Fresh after-patch runtime metrics must be captured by the owner; they are not claimed here.


**Correction to the follow-up implementation:** the first engagement-state patch initially treated geometric overlap as `hit=true` before the existing `_hitDefenders` gate. That could credit repeated contacts without a new combat hit. The current patch credits `hit=true` only inside the existing successful melee-hit path, after the unchanged blind-miss gate and before the unchanged combat outcome code. The `_hitDefenders` logic itself is unchanged.
