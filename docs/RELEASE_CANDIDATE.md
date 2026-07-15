# Release Candidate Notes

## Scope

This release candidate packages `specstitch` as both a local-first CLI and a reusable agent skill for requirement traceability audits.

## Included

- Agent skill instructions in `SKILL.md`.
- Deterministic `scan` and `check` workflows for PRD/TASKS drift.
- Same-line `specstitch-ignore` markers for generated or quoted tags that should not create stale evidence.
- Fixture-backed tests and smoke scripts.
- Package smoke coverage for published-file review.

## Verification

Run before requesting review:

```bash
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
```

## Classification

`ship` once the release-candidate PR is green and the package tarball contains `SKILL.md`, docs, README, license, and compiled CLI output.
