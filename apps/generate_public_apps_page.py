#!/usr/bin/env python3

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "catalog.json"
OUTPUT = ROOT / "index.html"

CATEGORY_ORDER = [
    ("foundations", "Foundations for evidence and causal reasoning"),
    ("population-genetics", "Population genetics and population change"),
    ("ecology", "Ecology and environmental dynamics"),
    ("artificial-life", "Artificial life and evolutionary computation"),
    ("research-support", "Research support and extension"),
]


def load_catalog() -> dict:
    return json.loads(CATALOG.read_text())


def render_card(app: dict) -> str:
    status_note = ""
    if app.get("visibility") == "planned":
        status_note = '<p><strong>Status:</strong> Planned public surface.</p>'

    category_label = app.get("category", "").replace("-", " ")
    return f"""
        <article class="feature-card platform-card platform-card--{app.get('category', 'unclassified')}">
          <p class="platform-card-category">{category_label}</p>
          <h3>{app['title']}</h3>
          <p>{app['role']}</p>
          <p>{app['description']}</p>
          {status_note}
          <div class="button-row">
            <a class="button-link platform-open-link" href="{app['entrypoint']}">Open</a>
          </div>
        </article>
    """.strip()


def render_category_section(slug: str, title: str, apps: list[dict]) -> str:
    cards = "\n".join(render_card(app) for app in apps)
    return f"""
    <section class="content-card">
      <p class="section-kicker">{title}</p>
      <div class="feature-grid">
{cards}
      </div>
    </section>
    """.rstrip()


def build_page(catalog: dict) -> str:
    apps = [app for app in catalog["apps"] if app.get("published")]
    grouped: dict[str, list[dict]] = {}
    for app in apps:
        grouped.setdefault(app.get("category", "unclassified"), []).append(app)

    sections = []
    for slug, title in CATEGORY_ORDER:
        category_apps = sorted(grouped.get(slug, []), key=lambda item: item["title"].lower())
        if category_apps:
            sections.append(render_category_section(slug, title, category_apps))

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Platforms - evo-edu.org</title>
  <link rel="stylesheet" href="/shared/evo-edu.css">
  <script src="/shared/evo-shell.js" defer></script>
</head>
<body>
  <div class="site-shell">
    <header class="site-topbar">
      <div class="brand-block">
        <span class="brand-mark">Platforms</span>
        <a href="/">evo-edu.org</a>
        <p class="brand-summary">Interactive tools for exploring evolution, ecology, systems, evidence, and model-based reasoning.</p>
      </div>
      <nav class="site-nav">
        <a href="/">Home</a>
        <a href="/evo/about/">About</a>
        <a href="/evo/notebook/">Notebook</a>
        <a href="/evo/roadmap.html">Roadmap</a>
        <a href="/evo/curriculum/">Curriculum</a>
      </nav>
    </header>

    <section class="hero-card">
      <p class="eyebrow">Interactive platforms</p>
      <div class="hero-grid">
        <div>
          <h1>Interactive tools for grounded exploration of evolutionary and ecological ideas.</h1>
          <p class="lede lede-strong">
            These platforms let learners and teachers work directly with change over time, evidence,
            systems, selection, biodiversity, and optimization. The goal is not just to launch an
            app, but to give users an active way to investigate concepts, compare outcomes, and
            build more grounded understanding through exploration.
          </p>
        </div>
        <div class="stat-grid">
          <div class="stat-card">
            <strong>{catalog['published_count']}</strong>
            <span>Interactive platforms currently available for public use.</span>
          </div>
          <div class="stat-card">
            <strong>{catalog['non_public_count']}</strong>
            <span>Additional legacy, planned, internal, or still-being-remediated app directories.</span>
          </div>
          <div class="stat-card">
            <strong>Hands-on experience</strong>
            <span>Use simulations, interactive models, and exploration tools to connect concepts to observable outcomes.</span>
          </div>
          <div class="stat-card">
            <strong>Learning support</strong>
            <span>Published tools are being paired with study guides, curriculum alignment, provenance, and better public framing.</span>
          </div>
        </div>
      </div>
    </section>

{chr(10).join(sections)}

    <footer class="footer-card">
      <div>
        <h3>Platform note</h3>
        <p>These are the currently published interactive tools and support surfaces selected for public evo-edu.org navigation while older and in-progress components continue to be improved behind the scenes.</p>
      </div>
      <small>Generated March 28, 2026</small>
    </footer>
  </div>
</body>
</html>
"""
    return page


def main() -> None:
    if not CATALOG.exists():
        raise SystemExit("catalog.json not found. Run generate_catalog.py first.")
    catalog = load_catalog()
    OUTPUT.write_text(build_page(catalog))


if __name__ == "__main__":
    main()
