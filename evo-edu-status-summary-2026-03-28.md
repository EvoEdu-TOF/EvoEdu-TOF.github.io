# evo-edu.org Status Summary

Date: 2026-03-28

## Overall Assessment

`evo-edu.org` is now materially more coherent, usable, and extensible than it was at the start of this remediation cycle. It no longer reads primarily as a loose federation of legacy components. It now has:

- a consistent public shell and shared navigation
- a clearer house style
- a mission-first homepage
- a generated public apps catalog driven by per-app metadata
- pathway pages for middle school, high school, and self-learners
- a curriculum hub and a working NGSS mapping page
- multiple concrete study packs with support materials

The site is no longer just a collection of tools. It is becoming an educational platform.

## Current Strengths

### Public structure

- The top-level site identity is now owned by `evo-edu.org` rather than by any one legacy project.
- The `/evo/` subtree now provides a clear place for site-owned pages such as:
  - About
  - Curriculum
  - Notebook
  - Roadmap
  - Scientific Virtues
  - Pathways
  - NGSS mapping
- Shared shell/navigation work has reduced drift across public-facing pages.

### App organization

- The public `/apps/` page is now metadata-driven.
- Published and unpublished status is explicit in per-app `app.json` files.
- Public app descriptions are more user-facing and less implementation-oriented.
- Provenance is now surfaced more explicitly, especially in remediated app families.
- Some weaker or incomplete apps have appropriately been withheld from public publication.

### App remediation

The strongest families now have a better public contract:

- landing page
- application page
- study guide
- curriculum alignment page
- provenance/about treatment

This has been done most clearly for:

- population genetics
- ecology core
- artificial life

PopG / Allele Tracker also moved closer to the newer architectural expectations through API-facing logic and test coverage.

### Pathways and packs

The biggest positive shift is that the site now has actual pathway and pack structure rather than only a collection of app pages.

Current pathway pages:

- middle school
- high school
- self-learners

Current packs:

- Population Change
- Ecology and Environmental Response
- Visible Change
- Evidence Trail

Current support materials:

- student handouts
- teacher notes
- study log

This is the clearest sign that the site is moving from component remediation into instructional design.

### EcoSpecies integration

EcoSpecies is in a better state as part of the evo-edu.org ecosystem:

- its shell and navigation are better aligned
- AST-derived structured content is now primary in public display
- legacy content is demoted into collapsible review context
- species pages expose cleaner bibliography rendering
- a public site-wide bibliography now exists
- BibTeX download is supported
- citation backfill is now automated in bounded scheduled runs

EcoSpecies is no longer just a separate app sitting nearby. It is now functioning more clearly as a biodiversity and evidence component within the broader site.

### Framing of inquiry

The addition of Scientific Virtues is important. The site now has a clearer intellectual posture:

- evidence matters
- source judgment matters
- revision matters
- scientific learning is not reduced to clicking through tools

That framing now appears in the public shell, the roadmap, and some app and pack content.

## Current Weaknesses and Gaps

### Notebook is still too thin

The Notebook is still more of a placeholder spine than a mature explanatory backbone. The site now has enough pathways and packs that the lack of corresponding conceptual pages is more visible.

### Pack depth is uneven

The high-school packs are ahead of the newer middle-school and self-learner packs. `Visible Change` and `Evidence Trail` are now real, but they are still earlier-stage than `Population Change` and `Ecology and Environmental Response`.

### Standards coverage is still strongest in a narrow band

The site is currently strongest in:

- LS4 evolution
- LS2 ecology
- science practices involving models, evidence, comparison, and revision

Coverage outside that band is still more aspirational than complete.

### Public app quality still varies

The published set is much better curated now, but not every public app feels equally mature in:

- documentation depth
- pedagogical specificity
- runtime polish
- provenance detail
- testability/API exposure

The metadata and contract structure are now in place, but some public pages still need deeper content and some tools still need deeper technical remediation.

### Didactopus is still conceptual in site integration

The site now has a clearer place for Didactopus, but that integration is mostly design guidance and pathway language, not yet a fully realized guided-study workflow.

## Recommended Next Directions

### 1. Deepen packs before broadening the public surface again

The current pack/pathway architecture is the best new part of the site. It should be strengthened before adding more public complexity.

Priority order:

- Visible Change: add teacher notes, pacing, and assessment criteria
- Evidence Trail: add instructor/seminar guidance and reflective checkpoints
- Population Change and Ecology Response: continue maturing as the main high-school exemplars

### 2. Expand the Notebook to match the packs

Every pack should have:

- a matching conceptual entry point
- misconceptions or interpretation guidance
- a short follow-up reading path

Without that, the site risks becoming polished but still too tool-centered.

### 3. Make Didactopus operational through pack flows

Didactopus should be connected to:

- prediction prompts
- evidence comparison prompts
- revision prompts
- source-checking prompts
- pack-by-pack reflective study flows

That is the best way to make it useful without turning it into a generic answer engine.

### 4. Continue selective app publication discipline

The current metadata-driven publication model is working. Keep using it.

Do not publish or keep published any app that still lacks:

- a coherent public landing page
- a usable application page
- a study guide
- curriculum alignment
- provenance clarity
- adequate runtime quality

### 5. Use EcoSpecies more directly inside packs

EcoSpecies should increasingly appear not only as a destination app, but as:

- organism evidence for ecology packs
- biodiversity context for environmental response
- a source/evidence exercise within guided study
- a bridge from model behavior to literature and bibliography work

## Bottom Line

`evo-edu.org` is now in a strong transitional state.

It is not finished, but it has crossed an important threshold:

- before, it was mainly a reorganized collection of tools and legacy materials
- now, it is starting to function as an integrated educational platform

The highest-value next work is no longer basic shell cleanup. It is instructional deepening:

- better Notebook support
- deeper pack materials
- stronger Didactopus integration
- disciplined publication and continued remediation of the public app set
