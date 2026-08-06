#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/dist" "$TMP/tests/fixtures/tagged-repo"
cp -R "$ROOT/dist/src" "$TMP/dist/"
cp -R "$ROOT/tests/fixtures/tagged-repo/." "$TMP/tests/fixtures/tagged-repo/"
grep -Fqx 'node dist/src/cli.js scan --root tests/fixtures/tagged-repo' "$ROOT/README.md"
(cd "$TMP" && node dist/src/cli.js scan --root tests/fixtures/tagged-repo) >/tmp/specstitch-smoke-scan.json
(cd "$TMP" && node dist/src/cli.js check --root tests/fixtures/tagged-repo --min-coverage 1 --max-stale 0) >/tmp/specstitch-smoke-check.json
test -s "$TMP/tests/fixtures/tagged-repo/docs/TRACEABILITY.md"
test -s "$TMP/tests/fixtures/tagged-repo/docs/traceability.json"
grep -q 'REQ-001' "$TMP/tests/fixtures/tagged-repo/docs/TRACEABILITY.md"
echo "smoke ok"
