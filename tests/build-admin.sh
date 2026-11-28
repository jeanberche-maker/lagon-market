#!/bin/bash
# Reconstruit le harnais de tests de l'admin (Espace boutique) depuis admin.html.
# Sortie : le chemin du harnais prêt à exécuter (osascript -l JavaScript).
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
APP="/tmp/lagon-admin-app.js"
OUT="/tmp/lagon-admin-harness.js"
awk '/<script>/{f=1;next} /<\/script>/{f=0} f' "$DIR/../admin.html" > "$APP"
cat "$DIR/stub.js" "$APP" "$DIR/suite10.js" "$DIR/admin15.js" "$DIR/admin16.js" "$DIR/admin17.js" > "$OUT"
echo "$OUT"
