#!/usr/bin/env bash
# Regenerate the Scrum studio's voice narration.
#   scripts/scrum-narration/generate.sh /path/to/en_GB-cori-high.onnx
# Uses whichever python has piper-tts, soundfile and numpy installed
# (set PYTHON=/path/to/venv/bin/python to choose one).
set -euo pipefail
cd "$(dirname "$0")/../.."
voice="${1:?usage: generate.sh /path/to/voice.onnx}"
tmp="$(mktemp -d)"
npx esbuild scripts/scrum-narration/extract.ts --bundle --platform=node --format=esm --outfile="$tmp/extract.mjs" --log-level=warning
node "$tmp/extract.mjs" > "$tmp/lines.json"
"${PYTHON:-python3}" scripts/scrum-narration/generate.py "$tmp/lines.json" "$voice"
rm -rf "$tmp"
