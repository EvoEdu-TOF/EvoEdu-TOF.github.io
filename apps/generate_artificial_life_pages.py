#!/usr/bin/env python3

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

SCIENTIFIC_VIRTUES = [
    "State clearly what the model demonstrates and what it does not claim about real biological systems.",
    "Use repeated runs and comparisons as evidence instead of relying on a single striking outcome.",
    "Treat model limitations as part of the explanation, not as an afterthought.",
]

APPS = [
    {
        "slug": "shape-evolver",
        "title": "Shape Evolver",
        "brand": "Artificial Life",
        "summary": "Biomorph-style exploration of variation, selection, and evolving form.",
        "launch_target": "/apps/biomorphs/jsbiomorph.html",
        "legacy_hub": "/apps/biomorphs/",
        "hero_kicker": "Variation and form",
        "hero_title": "Explore how small inherited changes produce visible differences in evolving forms.",
        "hero_body": "Shape Evolver gives learners a way to compare mutation, selection, and constraint through iterative changes in generated forms.",
        "core_question": "How can small heritable changes accumulate into visibly different forms under repeated selection?",
        "concepts": ["variation", "selection", "inheritance", "constraint", "generated form"],
        "teacher_notes": ["Have learners compare one generation of change to several rounds of selective choice.", "Keep the distinction clear between the model and real developmental biology.", "Use screenshots or saved states to support before-and-after discussion."],
        "learner_tasks": ["Choose one lineage and describe which visible traits changed first.", "Compare two different branches from the same starting form.", "Explain how constraints and available variation shape what can evolve."],
        "alignment": ["NGSS HS-LS4-2: Explain how evolution results from inherited variation and selection.", "Science and Engineering Practices: using models, constructing explanations from evidence."],
        "related": [("/apps/cumulative-selection-explorer/", "Cumulative Selection Explorer"), ("/apps/digital-evolution-lab/", "Digital Evolution Lab"), ("/evo/notebook/", "Notebook")],
        "provenance_short": "Public evo-edu framing over the legacy biomorphs implementation.",
        "provenance_full": "Shape Evolver is the current evo-edu public route for the older Biomorphs implementation. The public-facing pages clarify purpose, study use, and curriculum fit while the legacy app continues to supply the interactive runtime.",
        "lineage": [
            "Public evo-edu route: Shape Evolver",
            "Legacy implementation directory: /apps/biomorphs/",
            "Current launch target: /apps/biomorphs/jsbiomorph.html",
        ],
        "limits": [
            "The current runtime is still the older biomorphs implementation.",
            "Public documentation and shell have been modernized faster than the underlying engine.",
        ],
    },
    {
        "slug": "cumulative-selection-explorer",
        "title": "Cumulative Selection Explorer",
        "brand": "Artificial Life",
        "summary": "Weasel-style selection demonstration for variation, selection, and cumulative change.",
        "launch_target": "/apps/weasel/weaselui.html",
        "legacy_hub": "/apps/weasel/",
        "hero_kicker": "Cumulative change",
        "hero_title": "Inspect how cumulative selection differs from purely random search.",
        "hero_body": "This app helps learners compare targeted selection with random change and discuss what the demonstration can and cannot show about evolution.",
        "core_question": "What difference does cumulative selection make compared with undirected random change?",
        "concepts": ["selection", "random variation", "cumulative change", "search space", "model limits"],
        "teacher_notes": ["Make the limitations of the demonstration explicit.", "Use the tool to frame questions about cumulative versus one-step change.", "Connect it to model critique, not just model celebration."],
        "learner_tasks": ["Run the simulation and track score improvement over generations.", "Compare a higher and lower mutation rate.", "Explain why the model is a demonstration, not a full account of biological evolution."],
        "alignment": ["NGSS HS-LS4-2: Explain how evolutionary processes depend on inherited variation and differential success.", "Science and Engineering Practices: analyzing and interpreting data, evaluating models."],
        "related": [("/apps/shape-evolver/", "Shape Evolver"), ("/apps/grid-world-survival/", "Grid-World Survival"), ("/evo/curriculum/", "Curriculum")],
        "provenance_short": "Public evo-edu framing over the legacy Weasel demonstration.",
        "provenance_full": "Cumulative Selection Explorer is the evo-edu public route for the older Weasel-style cumulative-selection demonstration. The current remediation adds clearer framing, study support, and curriculum context while preserving the existing implementation.",
        "lineage": [
            "Public evo-edu route: Cumulative Selection Explorer",
            "Legacy implementation directory: /apps/weasel/",
            "Current launch target: /apps/weasel/weaselui.html",
        ],
        "limits": [
            "The runtime remains a legacy demonstration surface.",
            "The tool is useful for model critique, but it does not by itself represent the full complexity of biological evolution.",
        ],
    },
    {
        "slug": "grid-world-survival",
        "title": "Grid-World Survival",
        "brand": "Artificial Life",
        "summary": "Grid-world selection demo for survival, fitness, and environmental change.",
        "launch_target": "/apps/gw/",
        "legacy_hub": "/apps/gw/",
        "hero_kicker": "Environment and survival",
        "hero_title": "Explore how environment and mutation interact in a grid-world survival model.",
        "hero_body": "Grid-World Survival frames selection as a dynamic process where different genomes perform differently as the environment changes.",
        "core_question": "How do different genomes fare when survival depends on the structure of the environment?",
        "concepts": ["fitness", "environment", "mutation", "selection", "survival"],
        "teacher_notes": ["Use the app to discuss fitness as context-dependent rather than fixed.", "Treat this as a conceptual model rather than a literal ecology simulator.", "Pair it with written comparison to another artificial-life tool."],
        "learner_tasks": ["Run a baseline case and note how average fitness changes.", "Increase mutation rate and compare the resulting best genomes.", "Describe how environment shapes which genomes persist."],
        "alignment": ["NGSS HS-LS4-4: Explain how natural selection leads to adaptation.", "Science and Engineering Practices: computational thinking, analyzing model output."],
        "related": [("/apps/cumulative-selection-explorer/", "Cumulative Selection Explorer"), ("/apps/ecobalance/", "EcoBalance"), ("/apps/api/artificial-life/", "Artificial Life API")],
        "provenance_short": "Legacy grid-world route currently withheld from the public catalog.",
        "provenance_full": "Grid-World Survival is still backed by the older gw implementation and is currently excluded from public evo-edu navigation because the underlying app is not yet at the same documentation and implementation standard as the other remediated tools.",
        "lineage": [
            "Public evo-edu route: Grid-World Survival",
            "Legacy implementation directory: /apps/gw/",
            "Current launch target: /apps/gw/",
        ],
        "limits": [
            "Not currently published in the live evo-edu app catalog.",
            "Requires deeper implementation remediation before it should return to public navigation.",
        ],
    },
    {
        "slug": "route-optimizer",
        "title": "Route Optimizer",
        "brand": "Artificial Life",
        "summary": "Traveling-salesperson optimization tool for evolutionary search and comparison.",
        "launch_target": "/apps/tsp/jstsp.html",
        "legacy_hub": "/apps/tsp/",
        "hero_kicker": "Optimization and search",
        "hero_title": "Use an evolutionary-style search tool to compare routes, generations, and improvement.",
        "hero_body": "Route Optimizer supports discussions of search, heuristics, improvement, and the strengths and limitations of evolutionary optimization strategies.",
        "core_question": "How do iterative search and improvement strategies help find better routes without checking every possibility?",
        "concepts": ["optimization", "search", "fitness", "heuristics", "generational improvement"],
        "teacher_notes": ["Position the tool as evolutionary computation rather than direct biology content.", "Use it to connect variation, selection, and optimization language.", "Focus on why heuristic search matters when the space is too large to brute-force."],
        "learner_tasks": ["Generate a route set and compare early versus later generations.", "Change population or selection settings and note the effect on best distance.", "Explain why a good search strategy matters in a large solution space."],
        "alignment": ["Science and Engineering Practices: using computational thinking and models.", "Crosscutting Concepts: systems, optimization, and stability/change."],
        "related": [("/apps/network-builder/", "Network Builder"), ("/apps/shape-evolver/", "Shape Evolver"), ("/apps/api/artificial-life/", "Artificial Life API")],
        "provenance_short": "Modern JavaScript adaptation of an older GA-based TSP solver lineage, wrapped in evo-edu public documentation.",
        "provenance_full": "Route Optimizer is built on a JavaScript and HTML implementation of a genetic-algorithm Traveling Salesperson solver. The implementation notes in the underlying tool cite Hiroaki Sengoku's GA-based TSP work as an important algorithmic influence, and the current version was produced as a modern browser replacement for earlier Java applet-era examples that were no longer usable. The evo-edu route adds public documentation, study guidance, and curriculum context around that implementation.",
        "lineage": [
            "Public evo-edu route: Route Optimizer",
            "Legacy implementation directory: /apps/tsp/",
            "Current launch target: /apps/tsp/jstsp.html",
            "Algorithmic lineage noted in the implementation: Hiroaki Sengoku's GA-based TSP solver work",
        ],
        "limits": [
            "The underlying implementation is strong, but its public documentation was sparse before this remediation pass.",
            "Known issue noted in the implementation: manual city-definition click accuracy still needs improvement.",
        ],
    },
    {
        "slug": "network-builder",
        "title": "Network Builder",
        "brand": "Artificial Life",
        "summary": "Steiner-style network design app for systems and optimization exploration.",
        "launch_target": "/apps/steiner/jssteiner.html",
        "legacy_hub": "/apps/steiner/",
        "hero_kicker": "Systems and networks",
        "hero_title": "Investigate how search and optimization can build shorter or more efficient networks.",
        "hero_body": "Network Builder supports systems thinking and optimization by giving learners a way to compare candidate network layouts and their total costs.",
        "core_question": "How can iterative search produce more efficient networks from the same set of points?",
        "concepts": ["networks", "optimization", "efficiency", "cost", "search"],
        "teacher_notes": ["Use this as a systems/optimization companion to the TSP tool.", "Connect total path length to efficiency and tradeoffs.", "Keep expectations clear: this is an optimization model, not a direct biology simulator."],
        "learner_tasks": ["Build a network from the same points using different search settings.", "Compare total length between candidate solutions.", "Explain how optimization criteria shape the resulting network."],
        "alignment": ["Science and Engineering Practices: developing models and using computational thinking.", "Crosscutting Concepts: systems and system models."],
        "related": [("/apps/route-optimizer/", "Route Optimizer"), ("/apps/grid-world-survival/", "Grid-World Survival"), ("/apps/api/artificial-life/", "Artificial Life API")],
        "provenance_short": "Public evo-edu framing over the legacy Steiner-style network optimization implementation.",
        "provenance_full": "Network Builder is the evo-edu public route for the older Steiner-style network optimization tool. The remediation work adds public framing, study guidance, and curriculum context while the legacy implementation still provides the runtime.",
        "lineage": [
            "Public evo-edu route: Network Builder",
            "Legacy implementation directory: /apps/steiner/",
            "Current launch target: /apps/steiner/jssteiner.html",
        ],
        "limits": [
            "The current runtime remains the legacy optimization implementation.",
            "Public documentation and shell have been modernized ahead of deeper engine/API work.",
        ],
    },
]

def shell_start(title, brand, summary):
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

def shell_end(title, text):
    return f"""
    <footer class="footer-card">
      <div><h3>{title}</h3><p>{text}</p></div>
      <small>Updated March 28, 2026</small>
    </footer>
  </div>
</body>
</html>
"""

def action_links(app):
    return f"""
          <div class="hero-actions">
            <a class="button-link" href="/apps/{app['slug']}/app/">Open application</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/study-guide.html">Study guide</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/about.html">About</a>
            <a class="button-link-secondary" href="/apps/api/artificial-life/">API</a>
          </div>
"""

def render_landing(app):
    concepts = "".join(f"<li>{item}</li>" for item in app["concepts"])
    related = "".join(f'<li><a href="{href}">{label}</a></li>' for href, label in app["related"])
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">{app['hero_kicker']}</p>
      <div class="hero-grid">
        <div>
          <h1>{app['hero_title']}</h1>
          <p class="lede lede-strong">{app['hero_body']}</p>
{action_links(app)}
        </div>
        <div class="stat-grid">
          <div class="stat-card"><strong>Core question</strong><span>{app['core_question']}</span></div>
          <div class="stat-card"><strong>App page</strong><span>Standardized evo-edu wrapper over the current implementation.</span></div>
          <div class="stat-card"><strong>Guide status</strong><span>Teacher and learner guide created in this remediation pass.</span></div>
          <div class="stat-card"><strong>API status</strong><span>Artificial-life family API prototype now available.</span></div>
        </div>
      </div>
    </section>
    <section class="content-card">
      <p class="section-kicker">Why Use This Tool</p>
      <div class="info-grid">
        <article class="info-card"><h3>What learners do</h3><p>{app['hero_body']}</p></article>
        <article class="info-card"><h3>Concepts to foreground</h3><ul class="plain-list">{concepts}</ul></article>
      </div>
    </section>
    <section class="content-card">
      <p class="section-kicker">Provenance</p>
      <div class="info-card">
        <p>{app['provenance_short']} <a href="/apps/{app['slug']}/about.html">Read the fuller about and provenance notes.</a></p>
      </div>
    </section>
    <section class="content-card">
      <p class="section-kicker">Related Resources</p>
      <div class="path-grid">
        <article class="path-card"><h3>Connected pages</h3><ul class="plain-list"><li><a href="/apps/{app['slug']}/app/">Application page</a></li><li><a href="/apps/{app['slug']}/study-guide.html">Teacher and learner study guide</a></li><li><a href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a></li><li><a href="/apps/{app['slug']}/about.html">About and provenance</a></li></ul></article>
        <article class="path-card"><h3>Related tools and resources</h3><ul class="plain-list">{related}</ul></article>
      </div>
    </section>
"""
    return shell_start(app["title"], app["brand"], app["summary"]) + body + shell_end(f"{app['title']} status", "This standardized landing page is part of the artificial-life remediation family and now anchors the app, guide, curriculum, and API surfaces.")

def render_app(app):
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Application</p>
      <div class="hero-grid">
        <div>
          <h1>{app['title']}</h1>
          <p class="lede lede-strong">{app['hero_body']}</p>
          <div class="hero-actions">
            <a class="button-link" href="{app['launch_target']}" target="_blank" rel="noopener">Open in a full window</a>
            <a class="button-link-secondary" href="/apps/{app['slug']}/">Return to landing page</a>
            <a class="button-link-secondary" href="{app['legacy_hub']}">Legacy hub</a>
            <a class="button-link-secondary" href="/apps/api/artificial-life/">API</a>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-card"><strong>Runtime</strong><span>This standardized wrapper keeps the evo-edu shell around the existing tool while remediation continues.</span></div>
          <div class="stat-card"><strong>Next step</strong><span>Connect the legacy app behavior to the shared artificial-life API module where practical.</span></div>
        </div>
      </div>
    </section>
    <section class="content-card app-frame-card">
      <div class="app-frame-header"><p class="section-kicker">Interactive Surface</p><h2 class="section-heading">{app['title']} application</h2></div>
      <iframe class="app-frame" src="{app['launch_target']}" title="{app['title']} application"></iframe>
    </section>
"""
    return shell_start(f"{app['title']} Application", app["brand"], app["summary"]) + body + shell_end(f"{app['title']} application", "Use this page as the standard evo-edu application surface while the underlying engine and API wiring are being modernized.")

def render_guide(app):
    teacher = "".join(f"<li>{x}</li>" for x in app["teacher_notes"])
    learner = "".join(f"<li>{x}</li>" for x in app["learner_tasks"])
    virtues = "".join(f"<li>{x}</li>" for x in SCIENTIFIC_VIRTUES)
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Study Guide</p>
      <h1>{app['title']} teacher and learner guide</h1>
      <p class="lede lede-strong">Use this guide to frame the tool with a clear question, expected observations, and model-limits discussion rather than treating it as a standalone demo.</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/app/">Open application</a>
        <a class="button-link-secondary" href="/apps/{app['slug']}/curriculum-alignment.html">Curriculum alignment</a>
      </div>
    </section>
    <section class="content-card">
      <p class="section-kicker">Teaching Focus</p>
      <div class="path-grid">
        <article class="path-card"><h3>Teacher notes</h3><ul class="plain-list">{teacher}</ul></article>
        <article class="path-card"><h3>Learner tasks</h3><ul class="plain-list">{learner}</ul></article>
      </div>
    </section>
    <section class="content-card"><p class="section-kicker">Core Question</p><div class="callout-card"><p>{app['core_question']}</p></div></section>
    <section class="content-card">
      <p class="section-kicker">Scientific Virtues</p>
      <div class="path-grid">
        <article class="path-card"><h3>Habits to practice</h3><ul class="plain-list">{virtues}</ul></article>
        <article class="path-card"><h3>Continue the thread</h3><p>Use the <a href="/evo/scientific-virtues/">Scientific Virtues</a> page to connect model use with evidence, skepticism, and revision.</p></article>
      </div>
    </section>
"""
    return shell_start(f"{app['title']} Study Guide", app["brand"], app["summary"]) + body + shell_end(f"{app['title']} guide", "This guide is the first standardized teacher/learner support page for the app and should expand with pathway-specific versions later.")

def render_alignment(app):
    items = "".join(f"<li>{x}</li>" for x in app["alignment"])
    body = f"""
    <section class="hero-card">
      <p class="eyebrow">Curriculum Alignment</p>
      <h1>{app['title']} curriculum alignment</h1>
      <p class="lede lede-strong">This page maps the app to relevant concepts and practices while keeping it connected to the broader evo-edu curriculum frame.</p>
      <div class="hero-actions">
        <a class="button-link" href="/apps/{app['slug']}/study-guide.html">Open study guide</a>
        <a class="button-link-secondary" href="/evo/curriculum/">Curriculum hub</a>
      </div>
    </section>
    <section class="content-card"><p class="section-kicker">Alignment Notes</p><div class="info-card"><ul class="plain-list">{items}</ul></div></section>
    <section class="content-card"><p class="section-kicker">Scientific Virtues in Use</p><div class="info-card"><p>Use this app to reinforce model critique, evidence-based explanation, and willingness to revise a claim when repeated runs or explicit limitations point another way. Broader guidance appears in the <a href="/evo/scientific-virtues/">Scientific Virtues</a> notes.</p></div></section>
"""
    return shell_start(f"{app['title']} Curriculum Alignment", app["brand"], app["summary"]) + body + shell_end(f"{app['title']} alignment", "This page is the standardized curriculum-alignment surface for the app and should be refined as pathway and NGSS mapping pages are expanded.")

def render_about(app):
    lineage = "".join(f"<li>{x}</li>" for x in app["lineage"])
    limits = "".join(f"<li>{x}</li>" for x in app["limits"])
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
      <div class="info-card"><ul class="plain-list">{lineage}</ul></div>
    </section>
    <section class="content-card">
      <p class="section-kicker">Current Limits</p>
      <div class="info-card"><ul class="plain-list">{limits}</ul></div>
    </section>
    """
    return shell_start(f"{app['title']} About", app["brand"], app["summary"]) + body + shell_end(f"{app['title']} provenance", "This page records the origin, current implementation path, and known limits for the public evo-edu route.")

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
    data["implementation"] = {"legacy_hub": app["legacy_hub"], "launch_target": app["launch_target"]}
    data["provenance"] = {
        "summary": app["provenance_short"],
        "details": app["provenance_full"],
        "lineage": app["lineage"],
        "limits": app["limits"],
    }
    data["api"] = {"status": "prototype", "family": "artificial-life", "docs": "/apps/api/artificial-life/", "module": "/apps/api/artificial-life/artificial-life.js", "notes": "A shared browser and node-consumable API module now exists for the artificial-life remediation family."}
    data["tests"] = {"status": "prototype", "runner": "node --test /mnt/data/www/dev/evo-edu.org/wordpress_data/apps/api/artificial-life/artificial-life.test.js", "notes": "A node-based contract test suite now exercises the shared artificial-life family API module."}
    data["status"] = {"landing": "standardized", "application": "standardized-wrapper", "study_guide": "present", "curriculum_alignment": "present", "api": "prototype", "tests": "prototype"}
    path.write_text(json.dumps(data, indent=2) + "\n")

def main():
    for app in APPS:
        base = ROOT / app["slug"]
        (base / "index.html").write_text(render_landing(app))
        (base / "app/index.html").write_text(render_app(app))
        (base / "study-guide.html").write_text(render_guide(app))
        (base / "curriculum-alignment.html").write_text(render_alignment(app))
        (base / "about.html").write_text(render_about(app))
        update_metadata(app)

if __name__ == "__main__":
    main()
