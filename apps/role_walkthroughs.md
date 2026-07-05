# evo-edu.org App Role Walkthroughs

- Review roles: `student`, `casual learner`, `teacher`, `administrator`, `scientist`
- Apps with completed role walkthroughs: `2`
- Apps still pending role walkthroughs: `9`
- Seed reference app: `Shape Evolver`
- Recommended next walkthroughs: `EcoBalance`, `Climate Range Shifter`, `Gene Flow Mapper`

## Why this layer exists

- Structural audits show which public surfaces exist.
- Role walkthroughs show whether those surfaces are actually usable, trustworthy, and coherent for real audiences.
- The remediation process should use both.

## Shape Evolver

- Slug: `shape-evolver`
- Status: `reviewed`
- Public route: `/apps/shape-evolver/`

### Overall findings

- Shape Evolver is now the clearest example of the newer evo-edu public app contract in the artificial-life family.
- The direct handoff to the Biomorphs runtime removes one major learner-friction source: the old iframe wrapper.
- The route is much stronger for teachers than most of the published app set because it now has separate learner, teacher, standards, and provenance surfaces.
- The remaining weaknesses are less about missing pages and more about cross-surface coherence, runtime onboarding, and administrative/accessibility confidence.

### Student walkthrough

- Strengths:
  - The landing page names a concrete question about visible change over repeated selection.
  - The route to the app is short and no longer hidden inside an iframe wrapper.
  - The learner guide gives specific comparison tasks rather than only general background prose.
- Frictions:
  - The app page still behaves mostly as a handoff surface rather than an onboarding lesson.
  - The runtime itself may still require the learner to infer which visible controls matter most first.
  - There is no explicit beginner challenge card on the app page.
- Priority actions:
  - Add a one-minute `try this first` block directly on the app page.
  - Add one visible beginner challenge.
  - Link the runtime more directly to related Notebook concepts.

### Casual learner walkthrough

- Strengths:
  - The landing page explains why the tool exists in ordinary language.
  - The route exposes learner guide, teacher guide, standards, and about pages in a coherent set.
  - The provenance note makes the Biomorphs replacement relationship explicit.
- Frictions:
  - The app handoff is still a transition rather than a richly framed activity page.
  - A casual learner may not know whether to read the learner guide first or start experimenting immediately.
  - The API link is visible on the landing page even though it is not the primary concern for most casual learners.
- Priority actions:
  - Demote API emphasis on the main landing page relative to learner-facing next steps.
  - Add a post-run next-step block linking to one Notebook concept and one related app.
  - Clarify whether a newcomer should start with the app or the learner guide.

### Teacher walkthrough

- Strengths:
  - Teacher guide and standards pages now exist as separate surfaces.
  - The teacher guide clearly distinguishes useful classroom uses from common misuse.
  - The standards page is honest about model limits and does not overclaim biological realism.
- Frictions:
  - The lesson flow is good but still compact.
  - Teacher evidence expectations are present but not yet paired with printable prompts or rubrics.
  - The route does not yet show estimated class time, preparation time, or device assumptions.
- Priority actions:
  - Add quick-start lesson metadata: duration, setup, and recommended grade band.
  - Add one downloadable observation or CER worksheet.
  - Link Shape Evolver into a larger artificial-life or evolution pathway.

### Administrator walkthrough

- Strengths:
  - The route now has the expected public support surfaces instead of only a launcher.
  - Standards framing and provenance notes make the app easier to justify institutionally.
  - The replacement runtime is responsive and better aligned with a modern public-facing standard.
- Frictions:
  - There is no explicit publication-readiness summary or accessibility note.
  - Browser and device assumptions are not summarized in administrator-friendly terms.
  - There is no one-page status view that says this app has cleared the current public contract.
- Priority actions:
  - Add a brief public-readiness and accessibility note.
  - Expose portfolio readiness status consistently across the app family.
  - Record browser and device assumptions clearly on the public route.

### Scientist walkthrough

- Strengths:
  - The teacher and standards pages explicitly warn against confusing artificial selection here with full biological evolution in populations.
  - Model limitations are named instead of hidden.
  - The route encourages evidence from repeated runs and saved artifacts rather than single flashy outcomes.
- Frictions:
  - The public route does not yet summarize the runtime's core representation or evaluator assumptions for technical readers.
  - There is no direct test or implementation-status page tied to the public route.
  - The distinction between visible phenotype manipulation and broader population-level evolution could still be reinforced more often.
- Priority actions:
  - Add a short technical note summarizing model representation and evaluation assumptions.
  - Link more explicitly to population-level tools or Notebook concepts that cover what this route leaves out.
  - Surface implementation or testing status for technically oriented reviewers.

### Shared remediation actions

- Add a first-run challenge block on the app page itself.
- Clarify the learner's next step after the first session.
- Add quick-start metadata and downloadable classroom artifacts for teachers.
- Add a concise readiness/accessibility note for institutional reviewers.
- Tie the route more visibly into related Notebook concepts and broader artificial-life pathways.

## Allele Tracker

- Slug: `allele-tracker`
- Status: `reviewed`
- Public route: `/apps/allele-tracker/`

### Overall findings

- Allele Tracker has the deepest educational lineage in the current evo-edu app set, but that same history is visible as fragmentation across old and new public surfaces.
- The landing page and newer study-guide/curriculum pages are strong, and the public app route now uses a direct responsive workbench instead of an iframe wrapper.
- Teacher and standards support technically exist, but two of those pages are still older standalone documents outside the shared site shell, which weakens coherence and trust.
- Attribution exists in the legacy PopG route, but fairness and scientific-virtues expectations are not yet carried forward cleanly enough into the main public evo-edu route.

### Student walkthrough

- Strengths:
  - The landing page gives a concrete conceptual question and useful first moves.
  - The study guide gives good mechanism-comparison tasks and encourages repeated runs.
  - The simulation has real depth because it allows drift, selection, mutation, and migration comparisons.
- Frictions:
  - The runtime interface is still fairly dense even after the direct responsive replacement.
  - The route still depends on a legacy simulation lineage under the hood, so some model and interface limits remain visible.
  - Learners can now start more easily, but they may still need help deciding which force to vary next after the first comparison.
- Priority actions:
  - Keep the first recommended parameter changes explicit on the app page itself.
  - Add a stronger second-step suggestion after the initial drift-only comparison.
  - Keep direct links to Notebook pages on allele frequency change, population thinking, and genetic drift prominent.

### Casual learner walkthrough

- Strengths:
  - The landing page explains why the app matters and what phenomena it can compare.
  - The study guide and curriculum pages frame the app as an investigation rather than a toy.
  - The historical lineage gives the route authority when handled well.
- Frictions:
  - The direct responsive workbench is much better than the iframe route, but the interface still carries some inherited density from the legacy model family.
  - The route includes multiple guidance surfaces, but it is not always obvious which one is the main learner-facing companion.
  - The visible API link is still higher-profile than it should be for a casual learner.
- Priority actions:
  - Clarify the recommended companion-page sequence for self-study.
  - Add a short origin-and-adaptation note on the landing page that explains what was inherited from PopG and what evo-edu added.
  - Keep the legacy archive available, but visually subordinate it to the main public workbench.

### Teacher walkthrough

- Strengths:
  - The study guide has strong prompts around evidence, competing explanations, and revision.
  - The app has a long history as a teaching tool and supports several authentic comparison tasks.
  - The curriculum alignment page already reinforces scientific-virtues language.
- Frictions:
  - The teacher guide and standards page are still older standalone pages instead of integrated public route pages.
  - The route does not clearly distinguish the canonical newer support pages from inherited older ones.
  - There is still no quick classroom metadata block for time, setup, and recommended grade band.
- Priority actions:
  - Rebuild teacher guide and standards pages into the shared evo-edu shell.
  - Add teacher quick-start metadata and downloadable observation/CER sheets.
  - Tie the teacher route explicitly to Notebook concepts and related population-genetics tools.

### Administrator walkthrough

- Strengths:
  - The route has real support materials, not just an app launcher.
  - The about page acknowledges legacy implementation and current limits.
  - The app's long educational history is an asset when presented transparently.
- Frictions:
- The route now looks much more coherent, but the historical mixture of older and newer assets still requires explicit readiness and provenance explanation.
  - The public route does not yet summarize accessibility or device assumptions.
  - There is no concise administrative statement of what attribution has been preserved and how the route differs from the older source implementation.
- Priority actions:
  - Add a concise public-readiness/provenance note for institutional reviewers.
  - Document browser and device assumptions on the app route.
  - Make the attribution chain and current modification responsibility explicit.

### Scientist walkthrough

- Strengths:
  - The study guide and curriculum pages encourage repeated runs, competing explanations, and revision.
  - The public route keeps drift, selection, migration, and mutation distinct instead of collapsing everything into adaptive storytelling.
  - The about page acknowledges that the legacy PopG implementation still supplies the runtime.
- Frictions:
  - The public route does not yet summarize key runtime assumptions and simplifications prominently enough.
  - The lineage from original PopG to the current JavaScript runtime and evo-edu framing still needs to remain explicit across all public pages.
  - The route does not yet make fully explicit which additions are educational framing versus model implementation changes.
- Priority actions:
  - Add a technical/provenance note describing model assumptions, source lineage, and adaptation responsibility.
  - Carry attribution forward consistently across landing, about, teacher, and standards pages.
  - Link the route explicitly to population-level Notebook concepts that explain what the model is for and what it omits.

### Fairness and scientific-virtues attribution review

- Strengths:
  - The legacy PopG route names Prof. Joe Felsenstein and Wesley R. Elsberry.
  - The public evo-edu about page acknowledges that the legacy PopG implementation still supplies the runtime.
- Gaps:
  - The main public Allele Tracker route does not yet carry forward the full source lineage clearly enough.
  - Attribution is not yet integrated into the same shared-shell provenance language used elsewhere on evo-edu.
  - The route does not yet clearly distinguish original model lineage from current evo-edu framing and adaptation work.
- Required follow-through:
  - Name original source lineage, later porting, and current evo-edu modifications explicitly on the public route.
  - State model limits and known simplifications in the same provenance surface as the attribution.
  - Avoid presenting the current route as if evo-edu originated the underlying historical model.

### Shared remediation actions

- Keep improving the direct responsive workbench so the next-step guidance remains as strong as the first-step guidance.
- Rebuild the teacher guide and standards pages into the shared evo-edu shell.
- Add a first-run challenge and clearer app-page onboarding.
- Create a single attribution/provenance block that preserves origin, modifications, and limits fairly and transparently.
- Tie the route more explicitly into the Notebook population-genetics concept sequence.

### UI lessons to carry forward

- Keep run, save, export, and import controls grouped separately from configuration parameters.
- Preserve adjacency between the main display and the controls that immediately affect it.
- On smaller screens, keep the primary graph or simulation surface visible together with the next most important controls instead of forcing long context-breaking jumps.
- Use the app page to name the first useful experiment before the learner enters a dense control surface.

## Next apps to review

- `EcoBalance`
- `Climate Range Shifter`
- `Gene Flow Mapper`
