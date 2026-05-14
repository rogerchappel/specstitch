#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R "$ROOT/tests/fixtures/tagged-repo/." "$TMP/"
node "$ROOT/dist/cli.js" scan --root "$TMP" >/tmp/specstitch-smoke-scan.json
node "$ROOT/dist/cli.js" check --root "$TMP" --min-coverage 1 --max-stale 0 >/tmp/specstitch-smoke-check.json
test -s "$TMP/docs/TRACEABILITY.md"
test -s "$TMP/docs/traceability.json"
grep -q 'REQ-001' "$TMP/docs/TRACEABILITY.md"
echo "smoke ok"
