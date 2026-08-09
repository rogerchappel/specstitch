# specstitch

A tiny local-first CLI that stitches PRDs, task lists, docs, tests, and source comments into a traceability quilt. It is deliberately boring: deterministic text parsing, no LLM calls, no telemetry, no archaeology séance. 🪡

## Install

```bash
npm install -g specstitch
```

Or run from a checkout:

```bash
npm install
npm run build
node dist/src/cli.js scan --root tests/fixtures/tagged-repo
```

## Usage

```bash
specstitch scan --root .
specstitch check --root . --min-coverage 0.8 --max-stale 0
```

`scan` reads `docs/PRD.md`, `docs/TASKS.md`, `README.md`, `package.json`, `src`, `test`, and `tests`, then writes:

- `docs/TRACEABILITY.md`
- `docs/traceability.json`

`check` runs the same scan and exits non-zero when coverage is below the threshold or stale tags exceed the maximum.

When a generated line or quoted example intentionally contains a requirement tag that should not count as evidence, add `specstitch-ignore` on that same line:

```ts
export const generatedNote = 'REQ-999'; // specstitch-ignore generated example
```

## Configuration

Create `specstitch.config.json` to set default paths and thresholds:

```json
{
  "prdPath": "docs/PRD.md",
  "tasksPath": "docs/TASKS.md",
  "outMarkdown": "docs/TRACEABILITY.md",
  "outJson": "docs/traceability.json",
  "minCoverage": 0.8,
  "maxStale": 0
}
```

CLI flags override config values.

`minCoverage` and `--min-coverage` accept finite numbers from `0` through `1`,
inclusive. `maxStale` and `--max-stale` accept non-negative integers. Invalid or
missing CLI values produce a usage error instead of falling back to defaults.

## Examples

Tagged evidence works best:

```md
- REQ-001 The CLI must scan PRD and TASKS markdown files.
```

```ts
// REQ-001 scan PRD and TASKS documents into requirement records.
```

The configured PRD and TASKS files declare requirements; they do not count as
evidence for one another. When the same explicit tag appears in both, it is
reported once. Evidence must come from another scanned location such as
README documentation, `package.json`, source, or tests.

Untagged bullets are also matched with simple local keyword heuristics.

## Safety

specstitch is offline by design. It reads local text files and writes local reports only. It does not call external APIs, upload source, or mutate code.

## Agent Skill

See [SKILL.md](SKILL.md) for when an agent should use `specstitch`, which report writes require approval, and how to validate traceability evidence before a release-candidate PR.

## Contributing

Please keep changes deterministic and fixture-backed. Add or update tests under `tests/fixtures` when matching behavior changes.

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## License

MIT

## Development

Run the same checks locally before opening a PR:

- `npm run check` - tsc --noEmit
- `npm run build` - tsc
- `npm test` - npm run build && node --test dist/**/*.test.js
- `npm run smoke` - npm run build && bash scripts/smoke.sh
- `npm run release:check` - npm test && npm run check && npm run build && npm run smoke && npm run package:smoke

## Release readiness

Release automation is review-gated. Pull requests that touch release metadata run
the ReleaseBox dry-run workflow, which checks `releasebox.config.json`, runs
`npm run release:check`, validates the versioned npm artifact without publishing,
and previews release notes. A `v<version>` tag must exactly match `package.json`.
The tag workflow publishes that one tarball to npm with provenance before creating
the GitHub release and attaching the same artifact. Homebrew
updates remain disabled until they are explicitly enabled.
