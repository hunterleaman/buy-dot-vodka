#!/usr/bin/env bash

# Run the script: ./scripts/export-master-data-architecture.sh

# Path to the master markdown file in the repo
MASTER_MD="./docs/data-architecture/master.md"

# Output PDF name + destination
OUTPUT_PDF="$HOME/Desktop/Master Data Architecture Document.pdf"

# Ensure pandoc exists
if ! command -v pandoc >/dev/null 2>&1; then
  echo "Error: pandoc is not installed. Install via Homebrew: brew install pandoc"
  exit 1
fi

# Ensure a PDF engine exists (xelatex preferred)
if ! command -v xelatex >/dev/null 2>&1; then
  if ! command -v pdflatex >/dev/null 2>&1; then
    echo "Error: No LaTeX engine found (xelatex or pdflatex). Install MacTeX or BasicTeX."
    exit 1
  fi
  PDF_ENGINE="pdflatex"
else
  PDF_ENGINE="xelatex"
fi

echo "Exporting Master Data Architecture Document..."
pandoc "$MASTER_MD" \
  -o "$OUTPUT_PDF" \
  --from markdown \
  --pdf-engine="$PDF_ENGINE" \
  --toc \
  --syntax-highlighting tango \
  --metadata title="Master Data Architecture Document"

if [ $? -eq 0 ]; then
  echo "Success: PDF saved to $OUTPUT_PDF"
else
  echo "Error: PDF export failed."
fi
