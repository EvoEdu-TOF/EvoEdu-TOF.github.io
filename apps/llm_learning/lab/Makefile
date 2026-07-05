# ===== Makefile for Matching Law Synthetic Prototypes =====

# Config
PY ?= python3
VENV := .venv
BIN := $(VENV)/bin
PIP := $(BIN)/pip
PYBIN := $(BIN)/python
REQS := numpy matplotlib pandas scikit-learn

# Generated files
CSV_A := strict_matching_mle.csv
CSV_B := $(wildcard gen_matching_*.csv)
CSV_C := gestalt_stream.csv $(wildcard gestalt_window_W*.csv)
ANALYSIS := analysis.txt

# Default target
.PHONY: all
all: install csvs analyze

# ----- Environment / deps -----
$(VENV)/bin/activate: 
	$(PY) -m venv $(VENV)
	$(PIP) install --upgrade pip

.PHONY: install
install: $(VENV)/bin/activate
	$(PIP) install $(REQS)

# ----- Run parts A/B/C to produce CSVs -----
# Note: The provided scripts already save CSVs. They also show plots interactively.
# If you're running headless/CI, these will still produce CSVs; to save plots,
# add plt.savefig(...) lines in your scripts (see notes at bottom).

.PHONY: partA
partA: install
	ENV=prod MPLBACKEND=Agg $(PYBIN) partA_strict_mle.py

.PHONY: partB
partB: install
	ENV=prod MPLBACKEND=Agg $(PYBIN) partB_generalized_matching.py

.PHONY: partC
partC: install
	ENV=prod MPLBACKEND=Agg $(PYBIN) partC_gestalt_constraint.py

.PHONY: csvs
csvs: partA partB partC
	@echo "CSV files present:"
	@ls -1 strict_matching_mle.csv gen_matching_*.csv gestalt_*.csv 2>/dev/null || true

# ----- Analysis (writes a summary text file) -----
.PHONY: analyze
analyze: install
	ENV=prod $(PYBIN) analyze_matching.py | tee $(ANALYSIS)
	@echo "Wrote $(ANALYSIS)"

# ----- Convenience: clean up artifacts -----
.PHONY: clean-csv
clean-csv:
	rm -f strict_matching_mle.csv gen_matching_*.csv gestalt_stream.csv gestalt_window_W*.csv

.PHONY: clean-venv
clean-venv:
	rm -rf $(VENV)

.PHONY: clean
clean: clean-csv
	rm -f $(ANALYSIS)

# ----- Optional: produce a zip bundle of results -----
.PHONY: bundle
bundle:
	zip -r results_bundle.zip $(ANALYSIS) strict_matching_mle.csv gen_matching_*.csv gestalt_stream.csv gestalt_window_W*.csv 2>/dev/null || true
	@echo "Wrote results_bundle.zip (if CSVs were present)"

