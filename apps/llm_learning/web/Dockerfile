# --- Build HTML from LaTeX with Pandoc ---
FROM pandoc/core:latest AS builder
WORKDIR /work

# Copy sources
COPY docs/ ./docs/
COPY web/site/ ./site/

# Build HTML pages (MathJax enabled)
RUN mkdir -p /out
RUN pandoc docs/study_guide.tex  \
    --from=latex --to=html5 --standalone --mathjax \
    -c assets/style.css \
    --metadata=title:"Study Guide" \
    -o /out/study_guide.html \
    --bibliography=docs/refs.bib

RUN pandoc docs/main.tex \
    --from=latex --to=html5 --standalone --mathjax \
    -c assets/style.css \
    --metadata=title:"Preprint" \
    -o /out/preprint.html \
    --bibliography=docs/refs.bib

# Copy static site skeleton (index + assets)
RUN cp -r site/* /out/

# --- Runtime: nginx serves the static files ---
FROM nginx:alpine
COPY --from=builder /out/ /usr/share/nginx/html/
# Optional: serve lab CSVs/plots if you copy them in the image
# COPY lab/ /usr/share/nginx/html/data/
