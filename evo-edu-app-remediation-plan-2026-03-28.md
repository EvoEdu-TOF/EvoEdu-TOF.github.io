# evo-edu.org App Remediation Plan

Date: March 28, 2026

This plan covers the `evo-edu.org` app portfolio with emphasis on the non-Avida
apps. It derives from the generated audit at:

- [/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit.json](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit.json)

It also reflects the current app metadata and publishing model under:

- [/mnt/data/www/dev/evo-edu.org/wordpress_data/apps](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps)

## Scope

Primary remediation scope:

- `allele-tracker`
- `gene-flow-mapper`
- `life-cycle-modeler`
- `ecobalance`
- `climate-range-shifter`
- `shape-evolver`
- `route-optimizer`
- `network-builder`
- `cumulative-selection-explorer`
- `grid-world-survival`
- `literature-explorer`
- `ecospecies` (external to `./apps`, but part of the public portfolio)

Secondary scope:

- `digital-evolution-lab`
- `avida-ed`

Those remain important, but the current batch should prioritize everything other
than Avida-ED as requested.

## Current State

From the generated audit:

- Published apps audited: `13`
- Every published app currently has a public landing route.
- Every published app currently has an application entry route or wrapper.
- Almost none of the published apps have a teacher/learner study guide page.
- Almost none of the published apps have a curriculum alignment page.
- Only two app families currently have identifiable API and test infrastructure:
  - `Literature Explorer` through [CiteGeist](/opt/www/dev/CiteGeist)
  - `EcoSpecies` through [EcoSpecies-Atlas](/opt/www/dev/EcoSpecies-Atlas)
- The rest of the public app set is mostly legacy client-side JavaScript or thin
  wrappers over older implementation directories without exposed APIs or tests.

## Required Standard Per App

Every public app should converge on this minimum surface:

1. Landing page
   - purpose, core question, target learners, quick launch, links to guide and curriculum
2. Application page
   - the runnable surface with evo-edu navigation and consistent theming
3. Study guide page
   - teacher and learner entry points, suggested prompts, expected observations, common pitfalls
4. Curriculum alignment page
   - NGSS links, concepts, practices, likely grade bands, and adjacent resources

All four pages should:

- use the evo-edu.org site navigation
- use the shared theming
- link cleanly to one another
- derive from metadata instead of being hand-maintained drift

Recommended page layout per app:

- `/apps/<slug>/index.html`
- `/apps/<slug>/app/index.html` or `/apps/<slug>/launch.html`
- `/apps/<slug>/study-guide.html`
- `/apps/<slug>/curriculum-alignment.html`

## API and Test Strategy

The requirement to expose APIs should not be implemented as twelve unrelated
microservices. Most of these apps are deterministic simulations or interactive
exploration tools. The right pattern is:

1. Extract simulation logic from UI code into testable modules.
2. Expose stable JSON APIs for simulation state, parameter validation, and run
   execution where useful.
3. Add tests at two levels:
   - engine/module tests for core logic
   - API tests for request and response contracts
4. Keep browser/UI tests for launch pages and smoke flows only after the engine
   and API layers exist.

Recommended architecture:

- one shared evo-edu app service layer, likely under a future `apps/api`
- modules grouped by family, not one service per route:
  - population genetics
  - ecology and systems
  - artificial life and search/optimization
  - research support

This avoids duplicated infrastructure while still giving each app an API surface.

## Per-App Matrix

### Wave 1: Missing guides, curriculum pages, APIs, and tests

`Allele Tracker`
- Current implementation: [popg](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/popg)
- Current public route: [allele-tracker](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/allele-tracker)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - extract allele-frequency step logic into a tested module
  - expose parameterized simulation runs via JSON
  - build guide around drift, selection, mutation, migration, and comparison runs

`Gene Flow Mapper`
- Current implementation: [landgen](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/landgen)
- Current public route: [gene-flow-mapper](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/gene-flow-mapper)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - isolate landscape and movement calculations
  - expose run configuration and output summaries via API
  - align guide to movement, barriers, gene flow, and fragmentation

`Life Cycle Modeler`
- Current implementation: [popdyn](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/popdyn)
- Current public route: [life-cycle-modeler](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/life-cycle-modeler)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - extract matrix update logic
  - expose matrix input and projection API
  - build guide around survivorship, fecundity, stable structure, and growth/decline

`EcoBalance`
- Current implementation: [popdyn-predator-prey](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/popdyn-predator-prey)
- Current public route: [ecobalance](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/ecobalance)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - extract predator-prey system equations and parameters
  - expose simulation runs and chart-ready output
  - build guide around cycles, feedback, carrying capacity, and intervention scenarios

`Climate Range Shifter`
- Current implementations:
  - [climate-range-shifter](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/climate-range-shifter)
  - [crs](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/crs)
- Missing:
  - study guide
  - API
  - tests
- Recommended remediation:
  - consolidate duplicated routes
  - extract range-shift model and scenario validation
  - keep or rewrite any existing alignment material into the standard page format

`Shape Evolver`
- Current implementation: [biomorphs](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/biomorphs)
- Current public route: [shape-evolver](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/shape-evolver)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - separate genotype-to-form generation into a tested engine
  - expose form-generation API for a given genome/parameter set
  - build guide around selection, variation, and representation limits

`Route Optimizer`
- Current implementation: [tsp](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/tsp)
- Current public route: [route-optimizer](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/route-optimizer)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - isolate evolutionary search logic
  - expose route generation and scoring API
  - position as optimization and search, not as direct biology content alone

`Network Builder`
- Current implementation: [steiner](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/steiner)
- Current public route: [network-builder](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/network-builder)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - isolate graph scoring and network construction logic
  - expose graph input and candidate output API
  - position as systems thinking and optimization support

`Cumulative Selection Explorer`
- Current implementation: [weasel](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/weasel)
- Current public route: [cumulative-selection-explorer](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/cumulative-selection-explorer)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - extract mutation/selection iteration logic
  - expose run configuration API
  - use guide to explain why the demonstration is limited and what it does or does not show

`Grid-World Survival`
- Current implementation: [gw](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/gw)
- Current public route: [grid-world-survival](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/grid-world-survival)
- Missing:
  - study guide
  - curriculum alignment
  - API
  - tests
- Recommended remediation:
  - extract grid update and survival logic
  - expose scenario-run API
  - build guide around fitness landscapes, selection, and environment interaction

### Wave 2: Already has external API/test foundation, but public evo surface is incomplete

`Literature Explorer`
- Current public route: [literature-explorer](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/literature-explorer)
- Current implementation: [CiteGeist](/opt/www/dev/CiteGeist)
- Existing foundation:
  - tests exist
  - implementation is not just a static placeholder
- Missing:
  - full application integration into evo-edu
  - study guide
  - curriculum alignment
- Recommended remediation:
  - connect the real CiteGeist surface into the public route
  - add teacher workflows and evidence-building guide material
  - define its curriculum role as research literacy and source expansion support

`EcoSpecies`
- Current implementation: [EcoSpecies-Atlas](/opt/www/dev/EcoSpecies-Atlas)
- Existing foundation:
  - API present
  - tests present
  - theming/navigation partly aligned already
- Missing:
  - explicit evo-edu study guide surface
  - explicit curriculum alignment surface
  - tighter integration with the new `/evo/` shell and page standards
- Recommended remediation:
  - treat EcoSpecies as a first-class app family even though it is external to `./apps`
  - standardize its landing, guide, and curriculum pages to the same contract as the local app set

### Wave 3: Secondary or deferred for this batch

`Digital Evolution Lab`
- Public route: [digital-evolution-lab](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/digital-evolution-lab)
- Reason to defer:
  - current request prioritizes non-Avida work
  - Avida-ED already has a larger legacy support surface than the other apps
- Still needed later:
  - standardized guide page
  - standardized curriculum alignment page
  - consistent shell treatment under the same metadata contract

## Execution Order

### Phase A: Metadata and page contract

1. Extend each public app metadata file with:
   - `pages`
   - `implementation`
   - `api`
   - `tests`
   - `status`
2. Generate missing page stubs for every public app:
   - landing
   - application
   - study guide
   - curriculum alignment
3. Ensure every generated page uses evo-edu shell navigation and theming.

### Phase B: Family-by-family app remediation

1. Population genetics:
   - Allele Tracker
   - Gene Flow Mapper
2. Ecology:
   - Life Cycle Modeler
   - EcoBalance
   - Climate Range Shifter
3. Artificial life and search:
   - Shape Evolver
   - Cumulative Selection Explorer
   - Grid-World Survival
   - Route Optimizer
   - Network Builder
4. Research support:
   - Literature Explorer
5. External app family integration:
   - EcoSpecies

### Phase C: API and testing baseline

1. Create shared app-service structure.
2. Port one family first, preferably population genetics.
3. Add:
   - engine tests
   - API tests
   - smoke UI tests
4. Repeat by family instead of app-by-app from scratch.

## Practical Recommendation

The first implementation slice should be:

1. `Allele Tracker`
2. `Gene Flow Mapper`
3. `Life Cycle Modeler`

That group is coherent, educationally central, and likely the easiest place to
prove the full pattern:

- generated landing page
- generated app page
- generated study guide
- generated curriculum alignment page
- extracted simulation engine
- API endpoints
- tests

Once that works, the same framework can be reused across the rest of the app set.

## Artifacts Added In This Pass

- audit script:
  - [/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit_apps.py](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit_apps.py)
- generated audit:
  - [/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit.json](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/audit.json)
- metadata doc update:
  - [/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/APP_METADATA.md](/mnt/data/www/dev/evo-edu.org/wordpress_data/apps/APP_METADATA.md)

## Next Best Step

Implement the page contract and metadata extension for one family first, not all
apps at once. The population-genetics family is the best starting point.
