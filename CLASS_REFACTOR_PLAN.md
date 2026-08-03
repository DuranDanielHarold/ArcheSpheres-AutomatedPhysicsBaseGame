# Sphere Class Refactor Plan

## Phase inventory

This plan tracks the remaining class-keyed behavior that still lives in `js/entities/sphere.js` and `js/combat/collisions.js` after the data registry split.

### Constructor / init state (`INIT_HANDLERS`)
Move per-class state fields out of `Sphere` construction when they only exist for a single class. Shared state flags and victim-side status fields stay core.

- Migrated in Phase 1: `knight` stalwart stacks; `ranger` volley damage bonus; `phoenix` rebirth/ember/ashwing state.
- Remaining examples: vampire ghost/swarm state, monk nirvana state, dragoon leap/shield state, bard crescendo/noise state, plague virulence/sepsis state, prince weapon/shield state, and new-roster per-class counters.

### Ability trigger (`ABILITY_HANDLERS`)
Each `case '<key>'` in `_checkAbilityTrigger()` should become a registry dispatch preserving its original stack threshold, stack reset timing, tracker annotations, random call order, and side effects.

- Migrated in Phase 1: `knight`, `ranger`, `phoenix`.
- Threshold telemetry bug fixed for: `guardian`, `pirate`, `jester`, `golem`, `phoenix`, `inquisitor`, `monk`.
- Remaining cases: all other class-keyed branches in `_checkAbilityTrigger()`.

### Passive tick (`PASSIVE_HANDLERS`)
Each `_passiveAbility(dt)` branch that runs because the current sphere is a specific class moves to that class file. Generic ticking for statuses such as burn, bleed, corrosion, slow, stun, blind, death mark, sepsis, wound, and gnawed armor stays in core `update()`.

- Migrated in Phase 1: `ranger`, `phoenix`.
- Shared helpers that stay core/shared: `_applyKite()`, `_applyLowHpBuff()`, and shared projectile/minion classes used by multiple kits.

### Wall bounce (`WALL_BOUNCE_HANDLERS`)
Wall-bounce behavior currently appears in four wall-collision blocks. Route class-specific wall-bounce side effects through `_onWallBounce()` to avoid duplicated updates.

- Migrated in Phase 1: `phoenix` ember gain and wall spark.
- Remaining candidates: monk wall boost, ninja shadow step, voidwalker void tear, and plague/virulence toxic smear.

### Weapon hit: pre-application (`ON_HIT_DEALT_MODIFIERS` / `ON_HIT_TAKEN_MODIFIERS`)
Move class-specific damage mutation or side effects that happen before hit application while preserving the exact original gates. Do not normalize trait checks.

- Remaining attacker examples: pirate drain/pull, necromancer, guardian, rogue, samurai, gladiator crowd double, prince wall/rush bonus, queen courtly modifiers, spartan iron-stack reduction.
- Remaining defender examples: guardian-side interactions and other class-keyed pre-application defender modifiers.

### Weapon hit: post-application (`ON_HIT_LANDED`)
Move effects that only happen after damage passes the gate and lands.

- Migrated in Phase 1: `knight` stalwart stacking, `phoenix` ember release.
- Remaining examples: barbarian bloodlust, rogue bleed application, alchemist corrosion, ratcatcher/beastmaster minion releases, gladiator favor, queen/prince post-hit stacking, plague sepsis, sage knowledge gain, and other landed-hit effects.

### Weapon clash (`ON_CLASH_HANDLERS`)
Move class-specific clash blocks while preserving current variable usage exactly, including the spartan branch that checks `a.canTriggerTraits` while mutating `b`.

### Damage taken (`DAMAGE_TAKEN_MODIFIERS`)
Split pre-reduction/absorption logic from post-application logic in `receiveDamage()` and `receiveMagicDamage()` without adding trait gates that do not exist today.

- Pre/post examples: templar, golem, guardian phalanx, crusader, prince shield, priest shield, barbarian, flagellant, sage, arcanist, gladiator.

### Pre-death override (`PRE_DEATH_HANDLERS`)
Run only when HP first reaches zero and before normal death processing. A handler may cancel death.

- Migrated in Phase 1: `phoenix` rebirth.
- Remaining: `viking` last stand.

### Draw overlay (`DRAW_OVERLAY_HANDLERS`)
Move state-flag and class-keyed visual rings that belong to a class kit.

- Migrated in Phase 1: `knight` stalwart ring; `phoenix` ember/ashwing/rebirth rings.
- Remaining: the other class identity overlays in `_drawPowerOverlay()`.
