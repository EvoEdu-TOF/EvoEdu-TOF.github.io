#!/usr/bin/env python3

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent

SCIENTIFIC_VIRTUES = [
    "Ask what evidence in the run supports the explanation, rather than jumping from pattern to conclusion.",
    "Separate observation from inference by naming what the model shows and what you think it means.",
    "Revise the explanation when a parameter change or repeated run produces conflicting results.",
]


APPS = [
    {
        "slug": "allele-tracker",
        "title": "Allele Tracker",
        "brand": "Population Genetics",
        "summary": "Population genetics simulations and support materials for allele frequency change, drift, selection, mutation, and migration.",
        "current": "",
        "launch_target": "/apps/popg/jspopg.html",
        "legacy_hub": "/apps/popg/",
        "hero_kicker": "Population change",
        "hero_title": "Investigate allele frequency change under drift, selection, mutation, and migration.",
        "hero_body": "Allele Tracker gives learners a way to compare adaptive and non-adaptive forces across repeated runs, parameter changes, and multiple populations.",
        "core_question": "How do evolutionary forces change allele frequencies, and when do different forces dominate the outcome?",
        "app_summary": "Launch the interactive simulation, compare scenarios, and connect the results to study-guide prompts and curriculum-alignment notes.",
        "concepts": [
            "genetic drift",
            "selection",
            "mutation",
            "migration",
            "allele loss and fixation",
        ],
        "teacher_notes": [
            "Use paired runs to compare drift-only scenarios with scenarios that add weak or strong selection.",
            "Keep population size visible in the discussion so learners do not confuse drift with deterministic change.",
            "Have learners justify which parameter changes altered the outcome most and why.",
        ],
        "learner_tasks": [
            "Run a baseline drift-only case and record when fixation or loss occurs.",
            "Add migration and compare divergence across multiple populations.",
            "Add weak selection and explain whether the pattern is still dominated by drift or not.",
        ],
        "watch_for": "Compare repeated runs, watch for fixation and loss, and notice when the same setup still produces different outcomes because chance is doing real work.",
        "use_it_for": "Open the app, compare force-specific runs, and use the guide and curriculum pages to connect the patterns to explanation and evidence.",
        "study_sequence": {
            "before": "Define the population, decide which evolutionary force will be changed first, and state what result would count as evidence for drift rather than selection or migration.",
            "during": "Run a baseline case, change one force at a time, and compare repeated trials before deciding which mechanism best explains the pattern.",
            "after": "Ask whether the outcome supports drift, selection, migration, or some combination, and what additional run would challenge the first explanation.",
        },
        "evidence_record": [
            "Which parameters changed and which remained fixed.",
            "When fixation, loss, or stable polymorphism appeared across repeated runs.",
            "Where the same parameter set produced different outcomes and what that suggests about chance.",
        ],
        "evidence_questions": [
            "What evidence supports your explanation of the frequency change?",
            "What competing explanation did you consider and reject?",
            "What new run would make your claim stronger or weaker?",
        ],
        "self_study": "Run one drift-only case, one case with selection added, and one repeat of each. Then write a short comparison explaining which force best accounts for the difference you observed.",
        "self_extend": "Compare this app with <a href=\"/apps/gene-flow-mapper/\">Gene Flow Mapper</a> to connect within-population change to movement between populations.",
        "classroom_use": "Use the app to contrast adaptive and non-adaptive change, then ask learners to defend their explanation with direct run evidence rather than vocabulary alone.",
        "independent_use": "Treat the guide like a lab notebook: make a prediction, run the simulation, compare repeated outcomes, and revise your explanation when the data do not match your first story.",
        "sequence_use": {
            "before": "Define the population, the mechanism under discussion, and the expected direction of change if that mechanism is acting strongly.",
            "during": "Track one changed force at a time and compare repeated runs instead of relying on a single outcome.",
            "after": "Use a short explanation or discussion to separate what the model showed from what you infer about the evolutionary mechanism.",
        },
        "alignment_practice": {
            "produce": [
                "A prediction about how allele frequencies should change under a named mechanism.",
                "A comparison of multiple runs using concrete frequency outcomes.",
                "A revised explanation when repeated trials do not match the first prediction.",
            ],
            "listen": [
                "Clear separation of drift, selection, mutation, and migration as possible explanations.",
                "Claims tied to specific model outcomes rather than unsupported intuition.",
                "Recognition that stochastic outcomes can still be evidence rather than noise to ignore.",
            ],
        },
        "alignment": [
            "NGSS HS-LS3-2: Make and defend claims about how genetic variation supports trait variation.",
            "NGSS HS-LS4-2: Construct explanations based on evidence that evolution results from factors including inheritance and selection.",
            "Science and Engineering Practices: analyzing data, using models, constructing explanations.",
        ],
        "related": [
            ("/apps/gene-flow-mapper/", "Gene Flow Mapper"),
            ("/apps/life-cycle-modeler/", "Life Cycle Modeler"),
            ("/evo/notebook/", "Notebook"),
        ],
        "provenance_short": "Public evo-edu framing over the legacy PopG implementation.",
        "provenance_full": "Allele Tracker is the evo-edu public route built around the older PopG simulation. The remediation work adds standardized landing, study, curriculum, and API surfaces while the legacy implementation still supplies the interactive runtime.",
        "lineage": [
            "Public evo-edu route: Allele Tracker",
            "Legacy implementation directory: /apps/popg/",
            "Current launch target: /apps/popg/jspopg.html",
        ],
        "limits": [
            "The current runtime is still the legacy PopG implementation.",
            "The shared API layer is in prototype status and deeper UI/API integration remains to be done.",
        ],
    },
    {
        "slug": "gene-flow-mapper",
        "title": "Gene Flow Mapper",
        "brand": "Population Genetics",
        "summary": "Landscape genetics and spatial population-change materials for movement, barriers, and population structure.",
        "current": "",
        "launch_target": "/apps/landgen/landgenapp104.html",
        "legacy_hub": "/apps/landgen/",
        "hero_kicker": "Movement and structure",
        "hero_title": "Explore how movement, barriers, and landscape structure shape gene flow.",
        "hero_body": "Gene Flow Mapper helps learners connect spatial structure to allele movement, divergence, and the consequences of dispersal limits or landscape barriers.",
        "core_question": "How do movement and barriers alter the genetic structure of populations across space?",
        "app_summary": "Use the application page to run the spatial simulation, then use the study guide and alignment page to frame observations and instructional use.",
        "concepts": [
            "gene flow",
            "barriers",
            "fragmentation",
            "population structure",
            "dispersal distance",
        ],
        "teacher_notes": [
            "Ask learners to predict outcomes before placing barriers and then compare their expectations to the resulting maps.",
            "Use the tool to distinguish isolation by distance from abrupt separation caused by barriers.",
            "Pair the app with discussions of conservation genetics and habitat fragmentation.",
        ],
        "learner_tasks": [
            "Run a no-barrier case and describe the resulting pattern across the landscape.",
            "Add one or more barriers and explain how the map changes over time.",
            "Change dispersal distance and compare the effect to changing barrier placement.",
        ],
        "watch_for": "Track how structure emerges across space, and compare gradual separation from distance with abrupt separation caused by barriers.",
        "use_it_for": "Use the spatial simulation to connect maps, movement, and fragmentation, then carry that evidence into the guide and curriculum pages.",
        "study_sequence": {
            "before": "Define the landscape, the movement conditions, and what pattern would count as evidence for isolation by distance versus barrier-driven separation.",
            "during": "Run a no-barrier case first, then add barriers or change dispersal distance one at a time and compare the resulting maps.",
            "after": "Explain whether the observed structure is better accounted for by distance, fragmentation, or both, and propose a further run to test that claim.",
        },
        "evidence_record": [
            "Which barriers or distance settings were changed.",
            "How the spatial pattern shifted across the landscape over time.",
            "Where divergence appeared gradually and where it appeared abruptly.",
        ],
        "evidence_questions": [
            "What in the map supports your interpretation of gene flow or separation?",
            "How would you distinguish barrier effects from ordinary distance effects?",
            "What additional landscape change would test your explanation?",
        ],
        "self_study": "Run a no-barrier case, then add one barrier and then a second. Compare the resulting maps and explain what each barrier changed.",
        "self_extend": "Pair this app with <a href=\"/apps/ecospecies/\">EcoSpecies</a> or conservation examples to connect spatial models to real habitats and fragmentation questions.",
        "classroom_use": "Use the app to make movement and fragmentation visible, then ask learners to justify their ecological or evolutionary interpretation from the map rather than from prior assumptions.",
        "independent_use": "Use the guide as a map-reading investigation: predict what a barrier will do, run the model, record the changed pattern, and revise your explanation if the result is more gradual or more abrupt than expected.",
        "sequence_use": {
            "before": "Introduce the landscape and ask what movement without barriers should look like.",
            "during": "Add barriers or change dispersal distance one step at a time and have learners defend their interpretation from the resulting pattern.",
            "after": "Compare the simulated pattern to fragmentation, dispersal, or corridor questions from real-world systems.",
        },
        "alignment_practice": {
            "produce": [
                "A prediction about how movement or barriers should affect spatial pattern.",
                "A comparison of maps from at least two conditions.",
                "A revised explanation after testing more than one landscape setup.",
            ],
            "listen": [
                "Attention to spatial pattern rather than only numeric outcomes.",
                "Claims that distinguish barrier effects from distance effects.",
                "Willingness to compare multiple plausible explanations for the same map.",
            ],
        },
        "alignment": [
            "NGSS HS-LS4-1: Communicate scientific information that common ancestry and biological evolution are supported by multiple lines of evidence.",
            "NGSS HS-LS2-6: Evaluate claims and design reasoning around factors that affect ecosystem dynamics and populations.",
            "Science and Engineering Practices: developing and using models, analyzing and interpreting data.",
        ],
        "related": [
            ("/apps/allele-tracker/", "Allele Tracker"),
            ("/apps/life-cycle-modeler/", "Life Cycle Modeler"),
            ("/apps/ecospecies/", "EcoSpecies"),
        ],
        "provenance_short": "Public evo-edu framing over the legacy landgen implementation.",
        "provenance_full": "Gene Flow Mapper is the evo-edu public route for the older landgen spatial-population simulation. The current remediation adds public framing, guide pages, curriculum notes, and a family API while the legacy implementation remains the active runtime.",
        "lineage": [
            "Public evo-edu route: Gene Flow Mapper",
            "Legacy implementation directory: /apps/landgen/",
            "Current launch target: /apps/landgen/landgenapp104.html",
        ],
        "limits": [
            "The interactive runtime is still the older landgen implementation.",
            "The shared family API is present, but the legacy interface has not yet been fully rewired to it.",
        ],
    },
    {
        "slug": "life-cycle-modeler",
        "title": "Life Cycle Modeler",
        "brand": "Population Ecology",
        "summary": "Stage- and age-structured population modeling resources for growth, decline, survivorship, and fecundity.",
        "current": "",
        "launch_target": "/apps/popdyn/popdyn_ia.html",
        "legacy_hub": "/apps/popdyn/",
        "hero_kicker": "Population trajectories",
        "hero_title": "Model how survival and reproduction shape population growth, decline, and stability.",
        "hero_body": "Life Cycle Modeler gives learners a direct way to explore matrix-based population dynamics and connect demographic assumptions to long-term outcomes.",
        "core_question": "How do differences in survival and reproduction across life stages change the future of a population?",
        "app_summary": "Use the application page to run matrix-based scenarios and compare different life-history structures, then connect those observations to the guide and curriculum notes.",
        "concepts": [
            "life history",
            "matrix population models",
            "survivorship",
            "fecundity",
            "population growth and decline",
        ],
        "teacher_notes": [
            "Use species with familiar life histories so students can connect the matrix terms to real organisms.",
            "Have learners compare which stage changes matter most to growth rate and persistence.",
            "Connect the app to conservation or management scenarios rather than presenting it as abstract math alone.",
        ],
        "learner_tasks": [
            "Run a baseline case and determine whether the population grows, stabilizes, or declines.",
            "Change survival in one stage and explain how the projection changes.",
            "Compare two different life histories and argue which is more vulnerable to specific disturbances.",
        ],
        "watch_for": "Notice which life stages matter most, and compare cases where a small change in survival or fecundity produces a large long-term effect.",
        "use_it_for": "Use the matrix model to compare life-history strategies, then connect those differences to teaching, conservation, and demographic reasoning.",
        "study_sequence": {
            "before": "Define the life stages in the model and predict which stage should matter most to population growth or decline.",
            "during": "Run a baseline case, then change one stage-specific survival or fecundity value at a time and compare the resulting trajectories.",
            "after": "Explain which stage has the strongest effect, what evidence supports that claim, and how the result connects to management or conservation questions.",
        },
        "evidence_record": [
            "Which stage-specific parameter changed.",
            "How the projected population trajectory responded over time.",
            "Which stage change had the largest effect on growth, decline, or stability.",
        ],
        "evidence_questions": [
            "What evidence shows that one life stage matters more than another?",
            "How do the projections support your interpretation of vulnerability or persistence?",
            "What one additional scenario would test your explanation?",
        ],
        "self_study": "Compare two life histories or two stage-specific interventions and write a short argument about which population is more vulnerable and why.",
        "self_extend": "Pair this app with <a href=\"/apps/ecobalance/\">EcoBalance</a> to connect population trajectories to broader ecological constraints and interactions.",
        "classroom_use": "Use the app to move from abstract matrix terms to decisions about persistence, vulnerability, and management, then ask learners to justify which stage matters most.",
        "independent_use": "Work through the guide as a demographic case study: predict which stage should matter, run the model, then revise your explanation if another stage turns out to dominate the outcome.",
        "sequence_use": {
            "before": "Introduce the life history and ask which stage should matter most to growth rate or persistence.",
            "during": "Change one stage-specific variable at a time and compare projections rather than treating the matrix as abstract math only.",
            "after": "Connect the results to conservation, management, or disturbance scenarios affecting real populations.",
        },
        "alignment_practice": {
            "produce": [
                "A prediction about which life stage will most affect growth or decline.",
                "A comparison of projections from at least two stage-specific changes.",
                "A revised explanation when the model highlights a different vulnerable stage than expected.",
            ],
            "listen": [
                "Reasoning that connects stage structure to long-term outcome.",
                "Claims justified with projection behavior rather than intuition alone.",
                "Attention to how management or disturbance questions change the interpretation.",
            ],
        },
        "alignment": [
            "NGSS HS-LS2-1: Use mathematical or computational representations to support explanations of carrying capacity and ecosystem factors.",
            "NGSS HS-LS2-6: Evaluate claims and reasoning about complex interactions in ecosystems.",
            "Science and Engineering Practices: using mathematics and computational thinking, analyzing and interpreting data.",
        ],
        "related": [
            ("/apps/ecobalance/", "EcoBalance"),
            ("/apps/allele-tracker/", "Allele Tracker"),
            ("/evo/curriculum/", "Curriculum"),
        ],
        "provenance_short": "Public evo-edu framing over the legacy popdyn implementation.",
        "provenance_full": "Life Cycle Modeler is the evo-edu public route for the older popdyn matrix-population tool. The remediation pass adds public documentation, study guidance, curriculum mapping, and a shared API contract while the original implementation still provides the working simulation.",
        "lineage": [
            "Public evo-edu route: Life Cycle Modeler",
            "Legacy implementation directory: /apps/popdyn/",
            "Current launch target: /apps/popdyn/popdyn_ia.html",
        ],
        "limits": [
            "The runtime remains the legacy popdyn implementation.",
            "Additional work is still needed to expose more of the engine behavior through the shared API and stronger tests.",
        ],
    },
]


def shell_start(title: str, brand: str, summary: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} - evo-edu.org</title>
  <link rel="stylesheet" href="/shared/evo-edu.css">
  <script src="/shared/evo-shell.js" defer></script>
</head>
<body>
  <div class="site-shell">
    <header class="site-topbar">
      <div class="brand-block">
        <span class="brand-mark">{brand}</span>
        <a href="/">evo-edu.org</a>
        <p class="brand-summary">{summary}</p>
      </div>
      <nav class="site-nav" data-evo-nav></nav>
    </header>
"""


def shell_end(footer_title: str, footer_text: str) -> str:
    return f"""
    <footer class="footer-card">
      <div>
        <h3>{footer_title}</h3>
        <p>{footer_text}</p>
      </div>
      <small>Updated March 28, 2026</small>
    </footer>
  </div>
</body>
</html>
"""


def render_links(app: dict) -> str:
    return f"""
          <div class="hero-actions">
            <a class="button-link platform-open-link" href="/apps/{app['slug']}/app/">Open application</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/study-guide.html">Study guide</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/about.html">About</a>
            <a class="button-link-secondary" href="/apps/api/population-genetics/">API</a>
          </div>
"""


def render_landing(app: dict) -> str:
    related = "".join(
        f'<li><a href="{href}">{label}</a></li>' for href, label in app["related"]
    )
    concepts = "".join(f"<li>{item}</li>" for item in app["concepts"])
    teacher = "".join(f"<li>{item}</li>" for item in app["teacher_notes"][:2])
    learner = "".join(f"<li>{item}</li>" for item in app["learner_tasks"][:2])
    body = f"""
    <section class="hero-card platform-card platform-card--population-genetics">
      <p class="eyebrow">{app['hero_kicker']}</p>
      <div class="hero-grid">
        <div>
          <h1>{app['hero_title']}</h1>
          <p class="lede lede-strong">{app['hero_body']}</p>
{render_links(app)}
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>Core question</strong>
            <span>{app['core_question']}</span>
          </div>
          <div class="stat-card">
            <strong>What you can explore</strong>
            <span>{app['app_summary']}</span>
          </div>
          <div class="stat-card">
            <strong>What to watch for</strong>
            <span>{app['watch_for']}</span>
          </div>
          <div class="stat-card">
            <strong>Ways to use it</strong>
            <span>{app['use_it_for']}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Use This Tool</p>
      <h2 class="section-heading">{app['title']} in the learning pathway</h2>
      <div class="info-grid">
        <article class="info-card">
          <h3>Interactive investigation</h3>
          <p>{app['app_summary']}</p>
        </article>
        <article class="info-card">
          <h3>Concepts to keep in view</h3>
          <ul class="plain-list">{concepts}</ul>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Teaching and Inquiry</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>Good first moves</h3>
          <ul class="plain-list">{learner}</ul>
        </article>
        <article class="path-card">
          <h3>Discussion moves</h3>
          <ul class="plain-list">{teacher}</ul>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Context and Related Resources</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>Open next</h3>
          <ul class="plain-list">
            <li><a href="/apps/{app['slug']}/app/">Application page</a></li>
            <li><a href="/apps/{app['slug']}/study-guide.html">Teacher and learner study guide</a></li>
            <li><a href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a></li>
            <li><a href="/apps/{app['slug']}/about.html">About and provenance</a></li>
          </ul>
        </article>
        <article class="path-card">
          <h3>Related tools and resources</h3>
          <ul class="plain-list">{related}</ul>
        </article>
      </div>
      <div class="family-note">
        <p>{app['provenance_short']} <a href="/apps/{app['slug']}/about.html">Read the fuller about and provenance notes.</a></p>
      </div>
    </section>
"""
    return shell_start(app["title"], app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} on evo-edu.org",
        "This landing page now frames the app as an interactive investigation connected to study support, curriculum use, and provenance notes.",
    )


def render_app_page(app: dict) -> str:
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Application</p>
      <div class="hero-grid">
        <div>
          <h1>{app['title']}</h1>
          <p class="lede lede-strong">{app['app_summary']}</p>
          <div class="hero-actions">
            <a class="button-link" href="{app['launch_target']}" target="_blank" rel="noopener">Open in a full window</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/">Return to landing page</a>
            <a class="button-link-secondary" href="{app['legacy_hub']}">Legacy hub</a>
            <a class="button-link-secondary" href="/apps/api/population-genetics/">API</a>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>Runtime</strong>
            <span>This standardized wrapper keeps the evo-edu shell around the legacy app while remediation continues.</span>
          </div>
          <div class="stat-card">
            <strong>Next step</strong>
            <span>Extract the simulation engine and expose it through a tested API instead of relying only on the legacy UI.</span>
          </div>
        </div>
      </div>
    </section>

    <section class="content-card app-frame-card">
      <div class="app-frame-header">
        <p class="section-kicker">Interactive Surface</p>
        <h2 class="section-heading">{app['title']} application</h2>
      </div>
      <iframe class="app-frame" src="{app['launch_target']}" title="{app['title']} application"></iframe>
    </section>
"""
    return shell_start(f"{app['title']} Application", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} application",
        "Use this page as the standard evo-edu application surface while the underlying engine and API are being modernized.",
    )


def render_study_guide(app: dict) -> str:
    teacher = "".join(f"<li>{item}</li>" for item in app["teacher_notes"])
    learner = "".join(f"<li>{item}</li>" for item in app["learner_tasks"])
    virtues = "".join(f"<li>{item}</li>" for item in SCIENTIFIC_VIRTUES)
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Study Guide</p>
      <h1>{app['title']} teacher and learner guide</h1>
      <p class="lede lede-strong">Use this guide to frame the app with a clear question, expected observations, and follow-up discussion rather than treating the simulation as a standalone activity.</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/app/">Open application</a>
        <a class="button-link-secondary" href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Teaching Focus</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>Teacher notes</h3>
          <ul class="plain-list">{teacher}</ul>
        </article>
        <article class="path-card">
          <h3>Learner tasks</h3>
          <ul class="plain-list">{learner}</ul>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Suggested Sequence</p>
      <div class="mission-grid">
        <article class="mission-card">
          <h3>Before the run</h3>
          <p>{app['study_sequence']['before']}</p>
        </article>
        <article class="mission-card">
          <h3>During the run</h3>
          <p>{app['study_sequence']['during']}</p>
        </article>
        <article class="mission-card">
          <h3>After the run</h3>
          <p>{app['study_sequence']['after']}</p>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Core Question</p>
      <div class="callout-card">
        <p>{app['core_question']}</p>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Evidence Prompts</p>
      <div class="info-grid">
        <article class="info-card">
          <h3>What to record</h3>
          <ul class="plain-list">{''.join(f'<li>{item}</li>' for item in app['evidence_record'])}</ul>
        </article>
        <article class="info-card">
          <h3>Questions to answer</h3>
          <ul class="plain-list">{''.join(f'<li>{item}</li>' for item in app['evidence_questions'])}</ul>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Self-Study Path</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>Try this on your own</h3>
          <p>{app['self_study']}</p>
        </article>
        <article class="path-card">
          <h3>Extend the investigation</h3>
          <p>{app['self_extend']}</p>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Scientific Virtues</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>Habits to practice</h3>
          <ul class="plain-list">{virtues}</ul>
        </article>
        <article class="path-card">
          <h3>Continue the thread</h3>
          <p>Use the <a href="/evo/scientific-virtues/">Scientific Virtues</a> page to connect this investigation to broader habits of evidence, skepticism, and revision.</p>
        </article>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} Study Guide", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} guide",
        "This guide is the first standardized teacher/learner support page for the app and should expand as pathway pages are built.",
    )


def render_alignment(app: dict) -> str:
    alignment = "".join(f"<li>{item}</li>" for item in app["alignment"])
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Curriculum Alignment</p>
      <h1>{app['title']} curriculum alignment</h1>
      <p class="lede lede-strong">This page maps the app to NGSS-relevant concepts and practices while keeping the app connected to the larger evo-edu curriculum frame.</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/study-guide.html">Open study guide</a>
        <a class="button-link-secondary" href="/evo/curriculum/">Curriculum hub</a>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Alignment Notes</p>
      <div class="info-card">
        <ul class="plain-list">{alignment}</ul>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Classroom and Independent Use</p>
      <div class="path-grid">
        <article class="path-card">
          <h3>K-12 or workshop use</h3>
          <p>{app['classroom_use']}</p>
        </article>
        <article class="path-card">
          <h3>Self-directed use</h3>
          <p>{app['independent_use']}</p>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Use in Sequence</p>
      <div class="mission-grid">
        <article class="mission-card">
          <h3>Before the app</h3>
          <p>{app['sequence_use']['before']}</p>
        </article>
        <article class="mission-card">
          <h3>During the app</h3>
          <p>{app['sequence_use']['during']}</p>
        </article>
        <article class="mission-card">
          <h3>After the app</h3>
          <p>{app['sequence_use']['after']}</p>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Evidence of Alignment in Practice</p>
      <div class="info-grid">
        <article class="info-card">
          <h3>What learners should produce</h3>
          <ul class="plain-list">{''.join(f'<li>{item}</li>' for item in app['alignment_practice']['produce'])}</ul>
        </article>
        <article class="info-card">
          <h3>What to listen for</h3>
          <ul class="plain-list">{''.join(f'<li>{item}</li>' for item in app['alignment_practice']['listen'])}</ul>
        </article>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Scientific Virtues in Use</p>
      <div class="info-card">
        <p>Use this app to reinforce careful observation, evidence-based explanation, and willingness to revise claims after repeated runs or conflicting results. That guidance is expanded in the <a href="/evo/scientific-virtues/">Scientific Virtues</a> notes.</p>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} Curriculum Alignment", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} alignment",
        "This page is the first standardized curriculum-alignment surface for the app and should be refined as pathway and NGSS mapping pages are expanded.",
    )


def render_about(app: dict) -> str:
    lineage = "".join(f"<li>{item}</li>" for item in app["lineage"])
    limits = "".join(f"<li>{item}</li>" for item in app["limits"])
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">About</p>
      <h1>{app['title']} about and provenance</h1>
      <p class="lede lede-strong">{app['provenance_full']}</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/app/">Open application</a>
        <a class="button-link-secondary" href="/apps/{app['slug']}/">Return to landing page</a>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Lineage</p>
      <div class="info-card">
        <ul class="plain-list">{lineage}</ul>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Current Limits</p>
      <div class="info-card">
        <ul class="plain-list">{limits}</ul>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} About", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} provenance",
        "This page records the origin, current implementation path, and known limits for the public evo-edu route.",
    )


def write(path: Path, content: str) -> None:
    path.write_text(content)


def update_metadata(app: dict) -> None:
    path = ROOT / app["slug"] / "app.json"
    data = json.loads(path.read_text())
    data["pages"] = {
        "landing": f"/apps/{app['slug']}/",
        "application": f"/apps/{app['slug']}/app/",
        "study_guide": f"/apps/{app['slug']}/study-guide.html",
        "curriculum_alignment": f"/apps/{app['slug']}/curriculum-alignment.html",
        "about": f"/apps/{app['slug']}/about.html",
    }
    data["implementation"] = {
        "legacy_hub": app["legacy_hub"],
        "launch_target": app["launch_target"],
    }
    data["provenance"] = {
        "summary": app["provenance_short"],
        "details": app["provenance_full"],
        "lineage": app["lineage"],
        "limits": app["limits"],
    }
    data["api"] = {
        "status": "prototype",
        "family": "population-genetics",
        "docs": "/apps/api/population-genetics/",
        "module": "/apps/api/population-genetics/population-genetics.js",
        "notes": "A shared browser and node-consumable API module now exists for the first population-genetics remediation family.",
    }
    data["tests"] = {
        "status": "prototype",
        "runner": "node --test /mnt/data/www/dev/evo-edu.org/wordpress_data/apps/api/population-genetics/population-genetics.test.js",
        "notes": "A node-based contract test suite now exercises the shared family API module.",
    }
    data["status"] = {
        "landing": "standardized",
        "application": "standardized-wrapper",
        "study_guide": "present",
        "curriculum_alignment": "present",
        "api": "prototype",
        "tests": "prototype",
    }
    path.write_text(json.dumps(data, indent=2) + "\n")


def main() -> None:
    for app in APPS:
        base = ROOT / app["slug"]
        write(base / "index.html", render_landing(app))
        write(base / "app/index.html", render_app_page(app))
        write(base / "study-guide.html", render_study_guide(app))
        write(base / "curriculum-alignment.html", render_alignment(app))
        write(base / "about.html", render_about(app))
        update_metadata(app)


if __name__ == "__main__":
    main()
