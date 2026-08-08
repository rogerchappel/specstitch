#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/package" "$TMP/consumer/fixture"
(cd "$ROOT" && npm pack --pack-destination "$TMP/package" >/dev/null)
TARBALL=("$TMP/package"/*.tgz)
test "${#TARBALL[@]}" -eq 1

if tar -tzf "${TARBALL[0]}" | grep -Eq '^package/dist/tests(/|$)'; then
  echo "packed artifact unexpectedly contains compiled tests" >&2
  exit 1
fi

cp -R "$ROOT/tests/fixtures/tagged-repo/." "$TMP/consumer/fixture/"
(
  cd "$TMP/consumer"
  npm init --yes >/dev/null
  npm install --ignore-scripts "${TARBALL[0]}" >/dev/null
  set +e
  ./node_modules/.bin/specstitch scan --root fixture >scan.json
  SCAN_STATUS=$?
  set -e
  test "$SCAN_STATUS" -le 1
)

test -s "$TMP/consumer/fixture/docs/TRACEABILITY.md"
test -s "$TMP/consumer/fixture/docs/traceability.json"
grep -q 'REQ-001' "$TMP/consumer/fixture/docs/TRACEABILITY.md"
grep -q '"summary"' "$TMP/consumer/scan.json"
echo "package smoke ok"
