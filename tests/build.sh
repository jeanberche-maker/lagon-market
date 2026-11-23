#!/bin/bash
# Reconstruit le harnais de tests depuis le fichier live index.html.
# Sortie : le chemin du harnais prêt à exécuter (osascript -l JavaScript).
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
APP="/tmp/lagon-app.js"
OUT="/tmp/lagon-harness.js"
awk '/<script>/{f=1;next} /<\/script>/{f=0} f' "$DIR/../index.html" \
  | sed 's/const \$=s=>document\.querySelector(s);/const qs=s=>document.querySelector(s);/; s/\$(/qs(/g' \
  > "$APP"
cat "$DIR/stub.js" "$APP" "$DIR"/suite*.js > "$OUT"
echo "$OUT"
