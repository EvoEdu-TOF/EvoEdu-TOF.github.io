#!/usr/bin/env python3

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent

SCIENTIFIC_VIRTUES = [
    "Distinguish between what the model output shows and what you infer about real ecosystems.",
    "Look for competing explanations before settling on the first plausible pattern.",
    "Revise claims when changing one condition at a time produces results that challenge the original story.",
]

APPS = [
    {
        "slug": "ecobalance",
        "title": "EcoBalance",
        "brand": "Ecology",
        "summary": "Predator-prey and ecological feedback simulations for investigating cycles, stability, and intervention.",
        "launch_target": "/apps/popdyn-predator-prey/pp-app.html",
        "legacy_hub": "/apps/popdyn-predator-prey/",
        "hero_kicker": "Ecological feedback",
        "hero_title": "Explore how predator and prey populations interact through feedback, cycles, and collapse.",
        "hero_body": "EcoBalance gives learners a direct way to compare carrying capacity, predation, and conversion assumptions while watching ecological dynamics unfold over time.",
        "core_question": "How do predator-prey interactions and ecological constraints shape population stability or collapse?",
        "app_summary": "Use the application page to run the interactive simulation, compare parameter changes, and connect results to teaching prompts and alignment notes.",
        "concepts": ["predator-prey cycles", "carrying capacity", "feedback", "stability and collapse", "ecological modeling"],
        "teacher_notes": [
            "Have learners compare one-factor changes rather than moving several sliders at once.",
            "Use the app to distinguish short-term oscillation from long-term instability.",
            "Connect the results to real ecosystems where carrying capacity and predation pressure shift over time.",
        ],
        "learner_tasks": [
            "Run a baseline case and identify whether the populations oscillate, stabilize, or crash.",
            "Change carrying capacity and explain how the prey and predator curves respond.",
            "Reduce predation or predator death rate and compare the new system behavior to the baseline.",
        ],
        "watch_for": "Look for oscillation, delayed response, overshoot, and collapse, and compare short-term cycling with longer-term instability.",
        "use_it_for": "Use the interactive model to compare feedback and constraint, then connect what you observe to teaching prompts, ecological explanation, and curriculum use.",
        "study_sequence": {
            "before": "Define the predator-prey relationship, identify the starting ecological constraints, and predict whether the system should oscillate, stabilize, or collapse.",
            "during": "Run a baseline case, then change carrying capacity, predation, or predator survival one at a time and compare the resulting curves.",
            "after": "Explain which feedbacks best account for the new behavior and what additional run would test whether the system is truly stable or only briefly balanced.",
        },
        "evidence_record": [
            "Which ecological parameter changed and which remained fixed.",
            "How prey and predator curves responded over time.",
            "Where the system shifted from oscillation to stability or collapse.",
        ],
        "evidence_questions": [
            "What in the curves supports your explanation of the system response?",
            "Which feedback or constraint seems most important in this case?",
            "What additional run would test whether your explanation is correct?",
        ],
        "self_study": "Run a baseline case, then change one ecological factor and compare the curves. Write a short explanation of whether the system became more stable, more fragile, or more likely to collapse.",
        "self_extend": "Compare this app with <a href=\"/apps/life-cycle-modeler/\">Life Cycle Modeler</a> or <a href=\"/apps/ecospecies/\">EcoSpecies</a> to connect abstract dynamics to organisms and real ecological systems.",
        "classroom_use": "Use the app to make ecological feedback visible, then ask learners to defend their explanation from the system curves rather than from intuition alone.",
        "independent_use": "Use the guide as a structured ecology notebook: predict the system response, run the model, compare curves, and revise your interpretation when delayed effects or feedback complicate the first story.",
        "sequence_use": {
            "before": "Introduce the ecological relationship and ask what balanced, oscillating, or collapsing dynamics should look like.",
            "during": "Change one ecological condition at a time and justify the system interpretation from the observed curves.",
            "after": "Connect the modeled dynamics to real predator-prey systems, interventions, or resource constraints.",
        },
        "alignment_practice": {
            "produce": [
                "A prediction about how a changed ecological factor will alter the system.",
                "A comparison of prey and predator behavior across at least two runs.",
                "A revised explanation when the observed feedback differs from the original expectation.",
            ],
            "listen": [
                "Attention to feedback, delay, and changing constraint rather than only surface pattern names.",
                "Claims tied to system behavior in the model output.",
                "Readiness to distinguish temporary balance from longer-term instability.",
            ],
        },
        "alignment": [
            "NGSS HS-LS2-1: Use mathematical or computational representations to support explanations of factors that affect carrying capacity.",
            "NGSS HS-LS2-2: Use mathematical representations to support and revise explanations based on ecosystem interactions.",
            "Science and Engineering Practices: using models, analyzing and interpreting data, computational thinking.",
        ],
        "related": [
            ("/apps/life-cycle-modeler/", "Life Cycle Modeler"),
            ("/apps/climate-range-shifter/", "Climate Range Shifter"),
            ("/apps/ecospecies/", "EcoSpecies"),
        ],
        "provenance_short": "Public evo-edu framing over the legacy predator-prey implementation.",
        "provenance_full": "EcoBalance is the evo-edu public route built around the older predator-prey dynamics application. The current remediation adds standardized pages, study guidance, curriculum mapping, and a shared ecology API while the legacy implementation continues to provide the runtime.",
        "lineage": [
            "Public evo-edu route: EcoBalance",
            "Legacy implementation directory: /apps/popdyn-predator-prey/",
            "Current launch target: /apps/popdyn-predator-prey/pp-app.html",
        ],
        "limits": [
            "The current runtime remains the older predator-prey implementation.",
            "The ecology family API is present, but the legacy UI is not yet fully rewired to it.",
        ],
    },
    {
        "slug": "climate-range-shifter",
        "title": "Climate Range Shifter",
        "brand": "Ecology",
        "summary": "Climate-linked range-change investigations for habitat shift, mismatch, and environmental response.",
        "launch_target": "/apps/climate-range-shifter/webapp.html",
        "legacy_hub": "/apps/climate-range-shifter/launch.html",
        "hero_kicker": "Range change",
        "hero_title": "Investigate how changing climate conditions shift habitat suitability and organism ranges.",
        "hero_body": "Climate Range Shifter helps learners reason about moving environmental envelopes, adaptation limits, and the mismatch between where organisms are and where suitable conditions move.",
        "core_question": "What happens when climate conditions move faster than populations or species can track them?",
        "app_summary": "Use the application page to explore climate-driven range movement, then connect the results to the guide and curriculum pages.",
        "concepts": ["range shift", "habitat suitability", "climate velocity", "adaptation limits", "mismatch"],
        "teacher_notes": [
            "Begin with a simple story about a species whose suitable temperature range is moving geographically.",
            "Keep the distinction between environmental change and biological response explicit.",
            "Use the app to frame discussion of habitat fragmentation and uneven climate impacts.",
        ],
        "learner_tasks": [
            "Run a baseline case and compare climate-center movement to range-center movement.",
            "Change adaptation rate and explain how mismatch changes over time.",
            "Reduce habitat breadth and describe how quickly occupancy declines under the same climate velocity.",
        ],
        "watch_for": "Track moving mismatch between climate and occupancy, and compare cases where organisms keep pace with change to cases where suitable conditions outrun them.",
        "use_it_for": "Use the app to compare climate movement, habitat tracking, and adaptation limits, then connect those outcomes to evidence and curriculum use.",
        "study_sequence": {
            "before": "Define the species or population being modeled, the moving climate condition, and what result would count as successful tracking versus growing mismatch.",
            "during": "Run a baseline case, then change adaptation rate, habitat breadth, or climate velocity one at a time and compare the resulting movement.",
            "after": "Explain whether the model shows tracking, lag, or failure to keep pace, and what further run would test your interpretation.",
        },
        "evidence_record": [
            "Which climate or biological parameter changed.",
            "How climate center, range center, or occupancy changed over time.",
            "Where mismatch widened, narrowed, or led to decline.",
        ],
        "evidence_questions": [
            "What evidence shows that the population is tracking or failing to track climate change?",
            "Which biological limit seems most important in the result you observed?",
            "What one further run would help test your explanation?",
        ],
        "self_study": "Run a baseline case, then change adaptation rate or habitat breadth and compare how the range responds. Write a short explanation of where mismatch grows and why.",
        "self_extend": "Pair this app with <a href=\"/apps/ecospecies/\">EcoSpecies</a> to connect modeled range shift with actual species accounts, habitat context, and cited evidence.",
        "classroom_use": "Use the app to make environmental change and biological response visibly different, then require learners to justify where the mismatch appears and why.",
        "independent_use": "Use the guide as a self-study investigation: predict how quickly the range should track climate, run the model, then revise your explanation when climate movement outpaces biological response.",
        "sequence_use": {
            "before": "Introduce the climate trend and ask what successful tracking versus mismatch should look like.",
            "during": "Change one biological or environmental factor at a time and connect the observed movement to adaptation or dispersal limits.",
            "after": "Use the results to discuss environmental change, species persistence, and uneven vulnerability across habitats.",
        },
        "alignment_practice": {
            "produce": [
                "A prediction about how changing climate or biological response should affect range tracking.",
                "A comparison of at least two runs using observed mismatch or occupancy change.",
                "A revised explanation when the model outcome challenges the first expectation.",
            ],
            "listen": [
                "Clear distinction between environmental change and biological response.",
                "Claims tied to observed mismatch, movement, or decline in the model.",
                "Willingness to consider several ecological explanations before concluding.",
            ],
        },
        "alignment": [
            "NGSS HS-LS4-5: Evaluate evidence supporting claims that environmental change influences species populations.",
            "NGSS HS-ESS3-5: Analyze geoscience data and climate-related evidence to forecast impacts and responses.",
            "Science and Engineering Practices: interpreting data, using models, constructing explanations from evidence.",
        ],
        "related": [
            ("/apps/ecobalance/", "EcoBalance"),
            ("/apps/ecospecies/", "EcoSpecies"),
            ("/evo/curriculum/", "Curriculum"),
        ],
        "provenance_short": "Public evo-edu framing over the legacy climate-range-shifter implementation.",
        "provenance_full": "Climate Range Shifter is the evo-edu public route for the older climate-linked range-change simulation. The remediation pass adds clearer public framing, study support, curriculum notes, and a shared ecology API while the established implementation remains the active runtime.",
        "lineage": [
            "Public evo-edu route: Climate Range Shifter",
            "Legacy implementation directory: /apps/climate-range-shifter/",
            "Current launch target: /apps/climate-range-shifter/webapp.html",
        ],
        "limits": [
            "The public route still depends on the older climate-range-shifter runtime.",
            "Deeper API integration and broader test coverage are still pending.",
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


def shell_end(title: str, text: str) -> str:
    return f"""
    <footer class="footer-card">
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <small>Updated March 28, 2026</small>
    </footer>
  </div>
</body>
</html>
"""


def links(app):
    return f"""
          <div class="hero-actions">
            <a class="button-link platform-open-link" href="/apps/{app['slug']}/app/">Open application</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/study-guide.html">Study guide</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/about.html">About</a>
            <a class="button-link-secondary" href="/apps/api/ecology/">API</a>
          </div>
"""


def render_landing(app):
    concepts = "".join(f"<li>{item}</li>" for item in app["concepts"])
    related = "".join(f'<li><a href="{href}">{label}</a></li>' for href, label in app["related"])
    teacher = "".join(f"<li>{item}</li>" for item in app["teacher_notes"][:2])
    learner = "".join(f"<li>{item}</li>" for item in app["learner_tasks"][:2])
    body = f"""
    <section class="hero-card platform-card platform-card--ecology">
      <p class="eyebrow">{app['hero_kicker']}</p>
      <div class="hero-grid">
        <div>
          <h1>{app['hero_title']}</h1>
          <p class="lede lede-strong">{app['hero_body']}</p>
{links(app)}
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
        "This landing page now frames the app as an interactive ecological investigation connected to study support, curriculum use, and provenance notes.",
    )


def render_app_page(app):
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
            <a class="button-link-secondary" href="/apps/api/ecology/">API</a>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>Runtime</strong>
            <span>This standardized wrapper keeps the evo-edu shell around the legacy ecology app while remediation continues.</span>
          </div>
          <div class="stat-card">
            <strong>Next step</strong>
            <span>Connect the legacy app controls to the shared ecology API module instead of relying only on page-local logic.</span>
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
        "Use this page as the standard evo-edu application surface while the underlying ecology engine and API wiring are being modernized.",
    )


def render_study_guide(app):
    teacher = "".join(f"<li>{item}</li>" for item in app["teacher_notes"])
    learner = "".join(f"<li>{item}</li>" for item in app["learner_tasks"])
    virtues = "".join(f"<li>{item}</li>" for item in SCIENTIFIC_VIRTUES)
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Study Guide</p>
      <h1>{app['title']} teacher and learner guide</h1>
      <p class="lede lede-strong">Use this guide to frame the app with a clear ecological question, expected observations, and follow-up reasoning instead of treating the simulation as a standalone experience.</p>
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
          <p>Use the <a href="/evo/scientific-virtues/">Scientific Virtues</a> page to connect ecological modeling with evidence, skepticism, and revision.</p>
        </article>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} Study Guide", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} guide",
        "This guide is the first standardized teacher/learner support page for the app and should expand with pathway-specific versions later.",
    )


def render_alignment(app):
    items = "".join(f"<li>{item}</li>" for item in app["alignment"])
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Curriculum Alignment</p>
      <h1>{app['title']} curriculum alignment</h1>
      <p class="lede lede-strong">This page maps the app to NGSS-relevant concepts and practices while keeping it connected to the broader evo-edu curriculum frame.</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/study-guide.html">Open study guide</a>
        <a class="button-link-secondary" href="/evo/curriculum/">Curriculum hub</a>
      </div>
    </section>

    <section class="content-card">
      <p class="section-kicker">Alignment Notes</p>
      <div class="info-card">
        <ul class="plain-list">{items}</ul>
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
        <p>Use this app to reinforce careful observation, source-aware explanation, and willingness to revise ecological claims when new runs or alternative parameters challenge the first interpretation. Broader guidance appears in the <a href="/evo/scientific-virtues/">Scientific Virtues</a> notes.</p>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} Curriculum Alignment", app["brand"], app["summary"]) + body + shell_end(
        f"{app['title']} alignment",
        "This page is the standardized curriculum-alignment surface for the app and should be refined as pathway and NGSS mapping pages are expanded.",
    )


def render_about(app):
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


def update_metadata(app):
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
        "family": "ecology",
        "docs": "/apps/api/ecology/",
        "module": "/apps/api/ecology/ecology.js",
        "notes": "A shared browser and node-consumable API module now exists for the ecology remediation family.",
    }
    data["tests"] = {
        "status": "prototype",
        "runner": "node --test /mnt/data/www/dev/evo-edu.org/wordpress_data/apps/api/ecology/ecology.test.js",
        "notes": "A node-based contract test suite now exercises the shared ecology family API module.",
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


def main():
    for app in APPS:
        base = ROOT / app["slug"]
        (base / "index.html").write_text(render_landing(app))
        (base / "app/index.html").write_text(render_app_page(app))
        (base / "study-guide.html").write_text(render_study_guide(app))
        (base / "curriculum-alignment.html").write_text(render_alignment(app))
        (base / "about.html").write_text(render_about(app))
        update_metadata(app)


if __name__ == "__main__":
    main()
