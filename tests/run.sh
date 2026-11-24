#!/bin/bash
# Exécute la suite du prototype dans JavaScriptCore (osascript, macOS).
# Exit 1 si un seul test FAIL. Les suites réimpriment leur historique :
# les FAIL sont dédupliqués et le résumé retenu est celui de la dernière suite.
set -e
HARNESS=$(bash "$(dirname "$0")/build.sh")
OUT=$(osascript -l JavaScript "$HARNESS" 2>&1) || { echo "ERREUR d'exécution du harnais"; exit 1; }
echo "$OUT"

FAILS=$(echo "$OUT" | grep '^FAIL ' | sort -u | wc -l | tr -d ' ')
if [ "$FAILS" -gt 0 ]; then
  echo "✗ $FAILS échec(s) de test (dédupliqués ci-dessus)"
  exit 1
fi
UNIQ_PASS=$(echo "$OUT" | grep '^PASS ' | sort -u | wc -l | tr -d ' ')
echo "✓ TOTAL : ${UNIQ_PASS} tests uniques PASS · 0 FAIL"
