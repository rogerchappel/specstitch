# Changelog

## Unreleased

- Match keyword evidence on complete normalized tokens instead of substrings in
  unrelated longer words.
- Match requirement evidence by complete normalized tags so prefix-related tags
  cannot produce contradictory covered and stale results.
- Keep release checks on the named package smoke script and run the same pack verification in CI.

## 0.1.0

- Initial local-first scan/check MVP.
