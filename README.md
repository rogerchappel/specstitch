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
node dist/cli.js scan --root tests/fixtures/tagged-repo
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

## Examples

Tagged evidence works best:

```md
- REQ-001 The CLI must scan PRD and TASKS markdown files.
```

```ts
// REQ-001 scan PRD and TASKS documents into requirement records.
```

Untagged bullets are also matched with simple local keyword heuristics.

## Safety

specstitch is offline by design. It reads local text files and writes local reports only. It does not call external APIs, upload source, or mutate code.

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
