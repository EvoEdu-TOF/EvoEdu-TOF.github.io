#!/usr/bin/env bash
# init_project.sh
# Creates directory layout and placeholder files for Study Guide / Preprint / Web site.

set -e

echo "Creating project layout..."

# Directories
mkdir -p docs lab web/site/assets

# Docs: LaTeX sources
touch docs/main.tex
touch docs/study_guide.tex
touch docs/refs.bib

# Lab: code + data placeholders
touch lab/partA_strict_mle.py
touch lab/partB_generalized_matching.py
touch lab/partC_gestalt_constraint.py
touch lab/analyze_matching.py
touch lab/make_metrics_table.py

# Placeholder CSVs and plots
touch lab/strict_matching_mle.csv
touch lab/gen_matching_beta1p0_bias0p0.csv
touch lab/gestalt_stream.csv
touch lab/gestalt_window_W20.csv
touch lab/partA_strict_mle.png
touch lab/partB_generalized_matching.png
touch lab/partC_gestalt_constraint.png

# Web: Docker + Compose
touch web/Dockerfile
touch web/docker-compose.yml

# Web: HTML + assets
cat > web/site/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Behaviorism ↔ LLMs — Study Guide & Preprint</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <header><h1>Placeholder Index</h1></header>
  <main>
    <p>Place generated HTML (study_guide.html, preprint.html) and interactive lab charts here.</p>
  </main>
</body>
</html>
EOF

touch web/site/assets/style.css
touch web/site/assets/script.js

echo "Project layout initialized."
echo "Next steps:"
echo "  - Fill docs/main.tex, docs/study_guide.tex, docs/refs.bib"
echo "  - Add Python code to lab/*.py"
echo "  - Fill Dockerfile and docker-compose.yml under web/"
echo "  - Expand web/site/index.html, style.css, script.js"
