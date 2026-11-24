#!/bin/bash
# Reconstruit le harnais de tests depuis le fichier live index.html.
# Sortie : le chemin du harnais prêt à exécuter (osascript -l JavaScript).
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
APP="/tmp/lagon-app.js"
HTML="/tmp/lagon-raw-html.js"
OUT="/tmp/lagon-harness.js"
awk '/<script>/{f=1;next} /<\/script>/{f=0} f' "$DIR/../index.html" \
  | sed 's/const \$=s=>document\.querySelector(s);/const qs=s=>document.querySelector(s);/; s/\$(/qs(/g' \
  > "$APP"
# Le HTML brut est exposé au harnais (tests CSS/meta du Lot 8).
python3 - "$DIR/../index.html" > "$HTML" <<'PY'
import json,sys
sys.stdout.write('var RAW_HTML='+json.dumps(open(sys.argv[1],encoding='utf-8').read())+';\n')
PY
cat "$DIR/stub.js" "$HTML" "$APP" "$DIR"/suite*.js > "$OUT"
echo "$OUT"
