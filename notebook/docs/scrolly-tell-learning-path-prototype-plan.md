# Scrolly-tell learning path prototype plan

Status: proposal for a bounded local prototype. This plan does not authorize
publication or change the status of existing Notebook content.

## Topic and rationale

Prototype the **population-change mechanisms** strand, using the existing
`Foundations First Ring` path and the public **Allele Tracker** app.

This is a good first exercise because it has an existing sequence of connected
concepts (allele-frequency change, Hardy-Weinberg equilibrium, genetic drift,
natural selection, mutation, adaptation, speciation, and common descent), a
prelude on evidence and cause, source trails and retrieval questions, and an
interactive simulation that can support a real investigation. The public app
currently serves `/apps/allele-tracker/app/` with controls for population size,
selection, migration, and mutation, and supports repeated runs for comparing
drift outcomes. Its supporting study guide gives the path a second connection
to the app.

Start with a **four-concept slice** rather than trying to turn the whole path
into one long story:

1. Allele Frequency Change — define the population-level observation.
2. Hardy-Weinberg Equilibrium — establish a null-model baseline.
3. Genetic Drift — explore chance with repeated app runs.
4. Natural Selection — compare biased reproductive success with chance.

Mutation, adaptation, speciation, and common descent remain visible as later
path destinations, but are outside the first prototype's gated narrative. This
slice is long enough to exercise prerequisites, a conceptual contrast, app
handoff and return, and more than one checkpoint while staying reviewable.

## Intended learning experience

The learner follows a short narrative from observation to baseline to competing
mechanisms. Each narrative scene offers optional detail links to the reviewed
Notebook page, source trail, or app guide. Opening detail preserves the exact
scene and scroll position; returning restores the learner there. The main path
and scene selector remain available throughout.

At two transition points, a brief checkpoint asks the learner to apply the
distinction just introduced. A correct response advances the narrative. An
incorrect response explains the distinction, offers a hint or relevant detail
link, and allows another attempt. The activity does not require a perfect score
to access the path's reference material or continue studying.

The app scene asks learners to run two drift-only simulations with identical
settings, record what changed and what stayed similar, then compare with a run
that adds selection. A return link takes them back to the same prompt. The
story asks them to describe the observed change before attributing its cause.

## Prototype scope

### In scope

- One responsive scrolly-tell, with four concept scenes and two checkpoints.
- An app investigation based on the currently published Allele Tracker.
- Caller-aware detail navigation and return, following the BEACON presentation
  pattern.
- Data-driven scene and question content, with deterministic client-side
  checking for restricted response types.
- A linear reading/print view, path overview, keyboard navigation, and usable
  behavior with JavaScript disabled.
- A Didactopus synthetic learner walkthrough followed by a grounded evaluator
  pass and a documented correction round.
- A human review packet; learner telemetry or cross-site progress storage is
  not part of this prototype.

### Out of scope

- Converting all Notebook paths or changing the official concept order.
- Account-based tracking, credentials, grades, or production analytics.
- Free-form model-judged answers as progression gates.
- OpenJev or another model in the first gate implementation.
- Treating a synthetic learner's performance as evidence of human learning.

## Content and evidence inputs

Use the current path artifacts as sequencing inputs, not as automatically
approved publication. Before authoring, reconcile the prototype against the
current reviewed Notebook pages, relevant source trails, retrieval questions,
and app study guide. For each scene and checkpoint, retain an explicit link to
the concept and source support. Flag any source or question still in staging;
do not present staging status as review approval.

Useful starting artifacts:

- `learning-paths/foundations-first-ring.json`
- `learning-paths/foundations-first-ring.didactopus.json`
- `reviewed-elements/allele-frequency-change.json`
- `reviewed-elements/hardy-weinberg-equilibrium.json`
- `reviewed-elements/genetic-drift.json`
- `reviewed-elements/natural-selection.json`
- `staging/source-trails/` and `staging/questions/` for selected, provenance-
  checked support
- `/apps/allele-tracker/`, `/apps/allele-tracker/app/`, and
  `/apps/allele-tracker/study-guide.html`

## Navigation and interaction design

- Main scenes use stable IDs and direct links, with normal scrolling and
  previous/next navigation.
- Detail links record their caller. Return restores that scene, including after
  reload and browser-history navigation.
- Checkpoints use multiple choice, ordering, or numeric answers only where the
  answer can be checked deterministically and the distractors diagnose a
  specific misconception.
- Keep explanations available without requiring a correct answer. Avoid timers,
  punitive language, and hidden content that impairs reference use.
- Progress indicates which scenes have been visited or checkpointed; it is not
  labeled mastery.
- Store no learner identity. If local progress is useful in the prototype,
  store only scene/checkpoint IDs in session storage and make that behavior
  optional.

## Didactopus agent walkthrough

Run a structured synthetic walkthrough after the first content-complete build
and again after corrections. Use the existing Didactopus learner role to
simulate a learner, and the evaluator role to critique the session against
reviewed concepts, source anchors, and explicit checkpoint criteria.

The walkthrough packet should contain only the prototype, relevant reviewed
source fragments, concept prerequisites, the learner's initial-knowledge
profile, and the task instructions. Do not preload answer keys into the learner
role. Use at least three starting profiles:

1. Novice who conflates any allele-frequency change with selection.
2. Learner who knows the vocabulary but treats Hardy-Weinberg as a prediction
   that every real population must meet.
3. Learner who can name drift and selection but struggles to distinguish their
   evidence in a scenario.

For each profile, capture scene-by-scene: what the learner believes is being
asked, any unsupported inference, confusion about controls or navigation,
checkpoint response and confidence, use of a detail link, and whether the
feedback supports a next attempt. Ask the evaluator to classify each finding
as content accuracy, missing prerequisite, ambiguous prompt, misleading
feedback, navigation/interaction, or accessibility risk; include the exact
scene and source anchor, severity, and a reproducible sequence.

The agent may draft low-risk wording fixes when it can cite the supporting
source. A maintainer reviews every finding and patch. Changes to scientific
claims, source interpretation, concept order, checkpoint answer keys, or
unlock behavior require human approval. Rerun the walkthrough after fixes and
keep both the original findings and the resolution log. Synthetic walkthroughs
are a defect-finding pass, not a substitute for human learner testing.

## Evaluation plan

### Stage 1: content and interaction review

Check that every scene has a learning purpose, prerequisite, source anchor,
checkpoint feedback, and next step. Verify app controls and prompts against the
published app. Walk through all detail links, return links, retries, refresh,
browser history, keyboard operation, narrow-screen layout, reduced motion,
screen-reader labels, no-JavaScript reading, and print output. The agent pass
feeds this review but does not sign it off.

### Stage 2: small human usability pilot

Have a small, varied group of learners and educators try the prototype without
coaching. Observe whether learners can state the path's purpose, operate the
app task, return from detail, understand quiz feedback, and explain why the
next scene follows. Record friction and accessibility issues; do not infer
learning gains from this small usability sample.

### Stage 3: learning comparison

Compare equivalent content in three conditions:

1. Existing linear path and app guide.
2. Scrolly-tell without gated checkpoints.
3. Scrolly-tell with checkpoints.

Use a source-blind pretest, immediate posttest, and delayed test after about
one to two weeks. Include a novel population-change scenario to test transfer,
not just recall of phrasing. Predefine the primary outcome as delayed
distinction of drift from selection in an evidence-based scenario. Track
completion, retries, detail-link use, app runs, time, confidence calibration,
and perceived effort as secondary outcomes. Use blinded scoring for written
transfer responses and size the study based on a power analysis before making
comparative claims.

### Decision gate

Proceed beyond prototype only if the materials pass source and accessibility
review, learners can complete the app-and-return sequence without facilitator
rescue, and the gated version shows a useful improvement in delayed transfer
or retention without materially increasing confusion or abandonment. If the
ungated scrolly-tell performs as well, retain checkpoints as optional practice
rather than mandatory progression.

## Work sequence and deliverables

1. **Inventory and content freeze:** identify reviewed evidence and open gaps
   for the four selected concepts. Deliver a source-to-scene map.
2. **Story and checkpoint design:** write the narrative, two checkpoint items,
   feedback, app task, and misconception coverage. Deliver a storyboard and
   answer-key rationale.
3. **Build the local prototype:** implement the path as a self-contained,
   data-driven surface. Deliver the prototype and a simple local run guide.
4. **Synthetic walkthrough and correction:** run learner profiles, evaluator
   critique, maintainer triage, and rerun. Deliver transcripts, issue log, and
   change notes.
5. **Human review and usability pilot:** obtain content/accessibility review,
   then run the small usability pilot. Deliver a reviewer packet and usability
   summary.
6. **Study decision:** refine the comparison protocol, outcomes, and sample
   size before any learning-effect claim. Deliver a preregistered evaluation
   plan or a decision to stop/refine.

The prototype remains local until a human reviewer approves the content and
the maintainer explicitly chooses whether to publish it.

## Current-state note

The public Allele Tracker application route returned HTTP 200 on 26 October
2026. The site and Didactopus working trees already contain unrelated
uncommitted work. Keep this plan and any later prototype changes scoped; do not
clean or overwrite those existing changes.
