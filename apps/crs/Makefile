# Makefile for tangling Org files and building the web app
ORG_FILE=climate-range-shifter.org
OUTPUT_DIR=dist

all: tangle

# Tangle all files from the Org-mode document
tangle:
	mkdir -p $(OUTPUT_DIR)
	emacs --batch $(ORG_FILE) \
	  --eval="(require 'ob-tangle)" \
	  --eval="(org-babel-tangle)"

clean:
	rm -rf $(OUTPUT_DIR)

# Simple target to copy tangling results into dist folder
install:
	mkdir -p $(OUTPUT_DIR)
	cp launch.html webapp.html instructions.html alignment.html style.css app.js $(OUTPUT_DIR)/

# Makefile for tangling Org files and building the web app
ORG_FILE=climate-range-shifter.org
OUTPUT_DIR=dist

all: tangle

# Tangle all files from the Org-mode document
tangle:
	mkdir -p $(OUTPUT_DIR)
	emacs --batch $(ORG_FILE) \
	  --eval="(require 'ob-tangle)" \
	  --eval="(org-babel-tangle)"

clean:
	rm -rf $(OUTPUT_DIR)

# Simple target to copy tangling results into dist folder
install:
	mkdir -p $(OUTPUT_DIR)
	cp launch.html webapp.html instructions.html alignment.html style.css app.js $(OUTPUT_DIR)/

# Makefile for tangling Org files and building the web app
ORG_FILE=climate-range-shifter.org
OUTPUT_DIR=dist

all: tangle

# Tangle all files from the Org-mode document
tangle:
	mkdir -p $(OUTPUT_DIR)
	emacs --batch $(ORG_FILE) \
	  --eval="(require 'ob-tangle)" \
	  --eval="(org-babel-tangle)"

clean:
	rm -rf $(OUTPUT_DIR)

# Simple target to copy tangling results into dist folder
install:
	mkdir -p $(OUTPUT_DIR)
	cp launch.html webapp.html instructions.html alignment.html style.css app.js $(OUTPUT_DIR)/
