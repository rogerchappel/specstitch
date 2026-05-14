# Traceability Quilt

Generated: 2026-05-14T08:44:52.085Z

## Summary

- Requirements: 12
- Covered: 12
- Orphan: 0
- Stale evidence tags: 5
- Coverage: 100%

## Requirements

### ✅ PRD-001

- Source: docs/PRD.md:18
- Text: `specstitch scan` reads `docs/PRD.md`, `docs/TASKS.md`, README, tests, package scripts, and source headings/comments.
- Status: covered
- Evidence:
  - docs/PRD.md:18 (keyword, score 10) — - `specstitch scan` reads `docs/PRD.md`, `docs/TASKS.md`, README, tests, package scripts, and source headings/comments.
  - docs/TASKS.md:4 (keyword, score 8) — - [x] REQ-002 Read docs/PRD.md, docs/TASKS.md, README, tests, package scripts, and source comments/headings.
  - README.md:26 (keyword, score 5) — `scan` reads `docs/PRD.md`, `docs/TASKS.md`, `README.md`, `package.json`, `src`, `test`, and `tests`, then writes:
  - docs/orchestration.json:9 (keyword, score 4) — "inputs": ["docs/PRD.md", "docs/TASKS.md", "README.md", "src", "tests", "package.json"],
  - package.json:4 (package-script, score 4) — "description": "Local-first traceability quilt for PRDs, tasks, docs, tests, and source drift.",
  - docs/PRD.md:6 (keyword, score 3) — `specstitch` builds a traceability quilt between PRDs, task lists, docs, tests, and source files — then highlights drift before it becomes archaeology. 🪡
  - docs/TASKS.md:1 (heading, score 3) — # specstitch TASKS
  - README.md:3 (keyword, score 3) — A tiny local-first CLI that stitches PRDs, task lists, docs, tests, and source comments into a traceability quilt. It is deliberately boring: deterministic text parsing, no LLM cal

### ✅ REQ-001

- Source: docs/PRD.md:19
- Text: Extract requirement/task bullets and match to files using explicit tags (`REQ-001`) and fuzzy local heuristics.
- Status: covered
- Evidence:
  - docs/ORCHESTRATION.md:10 (explicit-tag, score 100) — 4. Prefer explicit `REQ-001` / `TASK-001` tags when a requirement is important.
  - docs/TASKS.md:3 (explicit-tag, score 100) — - [x] REQ-001 Build a Node/TypeScript CLI with `scan` and `check` commands.
  - README.md:55 (explicit-tag, score 100) — - REQ-001 The CLI must scan PRD and TASKS markdown files.
  - README.md:59 (explicit-tag, score 100) — // REQ-001 scan PRD and TASKS documents into requirement records.
  - tests/extract.test.ts:6 (explicit-tag, score 100) — const requirements = extractRequirements('- REQ-001 The CLI must scan docs.\n- nice to have', 'docs/PRD.md', 'prd');
  - tests/extract.test.ts:8 (explicit-tag, score 100) — assert.equal(requirements[0]?.id, 'REQ-001');
  - tests/extract.test.ts:9 (explicit-tag, score 100) — assert.deepEqual(requirements[0]?.tags, ['REQ-001']);
  - tests/fixtures/tagged-repo/docs/PRD.md:3 (explicit-tag, score 100) — - REQ-001 The CLI must scan PRD and TASKS markdown files.

### ✅ PRD-002

- Source: docs/PRD.md:20
- Text: Emit `docs/TRACEABILITY.md` and JSON with covered/orphan/stale items.
- Status: covered
- Evidence:
  - docs/PRD.md:20 (keyword, score 7) — - Emit `docs/TRACEABILITY.md` and JSON with covered/orphan/stale items.
  - docs/ORCHESTRATION.md:8 (keyword, score 3) — 2. Review `docs/TRACEABILITY.md` for orphan requirements and stale tags.
  - docs/TASKS.md:7 (keyword, score 3) — - [x] REQ-005 Emit docs/TRACEABILITY.md and docs/traceability.json from scans.
  - src/cli.ts:85 (keyword, score 3) — console.log(`specstitch ${VERSION}\n\nUsage:\n  specstitch scan [--root .] [--prd docs/PRD.md] [--tasks docs/TASKS.md]\n  specstitch check [--root .] [--min-coverage 0.8] [--max-st
  - src/cli.ts:89 (keyword, score 3) — function printSummary(summary: { total: number; covered: number; orphan: number; stale: number; coverage: number }): void {
  - src/types.ts:1 (keyword, score 3) — export type StitchStatus = 'covered' | 'orphan' | 'stale';
  - tests/fixtures/tagged-repo/docs/PRD.md:4 (keyword, score 3) — - REQ-002 The scanner should emit traceability markdown and JSON reports.
  - tests/fixtures/tagged-repo/src/index.ts:4 (keyword, score 3) — // REQ-002 emit markdown and JSON traceability reports.

### ✅ PRD-003

- Source: docs/PRD.md:21
- Text: `specstitch check` exits non-zero on configurable drift thresholds.
- Status: covered
- Evidence:
  - docs/PRD.md:21 (keyword, score 7) — - `specstitch check` exits non-zero on configurable drift thresholds.
  - docs/ORCHESTRATION.md:26 (keyword, score 4) — Repositories can commit `specstitch.config.json` so humans, agents, and CI all share the same PRD/TASKS paths and drift thresholds. Use CLI flags only for one-off stricter checks.
  - docs/TASKS.md:8 (keyword, score 3) — - [x] REQ-006 Make `check` exit non-zero when coverage or stale evidence thresholds fail.
  - README.md:31 (keyword, score 3) — `check` runs the same scan and exits non-zero when coverage is below the threshold or stale tags exceed the maximum.

### ✅ REQ-001

- Source: docs/TASKS.md:3
- Text: REQ-001 Build a Node/TypeScript CLI with `scan` and `check` commands.
- Status: covered
- Evidence:
  - docs/ORCHESTRATION.md:10 (explicit-tag, score 100) — 4. Prefer explicit `REQ-001` / `TASK-001` tags when a requirement is important.
  - docs/PRD.md:19 (explicit-tag, score 100) — - Extract requirement/task bullets and match to files using explicit tags (`REQ-001`) and fuzzy local heuristics.
  - README.md:55 (explicit-tag, score 100) — - REQ-001 The CLI must scan PRD and TASKS markdown files.
  - README.md:59 (explicit-tag, score 100) — // REQ-001 scan PRD and TASKS documents into requirement records.
  - tests/extract.test.ts:6 (explicit-tag, score 100) — const requirements = extractRequirements('- REQ-001 The CLI must scan docs.\n- nice to have', 'docs/PRD.md', 'prd');
  - tests/extract.test.ts:8 (explicit-tag, score 100) — assert.equal(requirements[0]?.id, 'REQ-001');
  - tests/extract.test.ts:9 (explicit-tag, score 100) — assert.deepEqual(requirements[0]?.tags, ['REQ-001']);
  - tests/fixtures/tagged-repo/docs/PRD.md:3 (explicit-tag, score 100) — - REQ-001 The CLI must scan PRD and TASKS markdown files.

### ✅ REQ-002

- Source: docs/TASKS.md:4
- Text: REQ-002 Read docs/PRD.md, docs/TASKS.md, README, tests, package scripts, and source comments/headings.
- Status: covered
- Evidence:
  - tests/fixtures/tagged-repo/docs/PRD.md:4 (explicit-tag, score 100) — - REQ-002 The scanner should emit traceability markdown and JSON reports.
  - tests/fixtures/tagged-repo/docs/TASKS.md:4 (explicit-tag, score 100) — - [ ] TASK-002 Add report writer for REQ-002.
  - tests/fixtures/tagged-repo/src/index.ts:4 (explicit-tag, score 100) — // REQ-002 emit markdown and JSON traceability reports.
  - tests/fixtures/tagged-repo/tests/index.test.ts:2 (explicit-tag, score 100) — // REQ-002 fixture test references report output.
  - docs/TASKS.md:4 (keyword, score 9) — - [x] REQ-002 Read docs/PRD.md, docs/TASKS.md, README, tests, package scripts, and source comments/headings.
  - docs/PRD.md:18 (keyword, score 8) — - `specstitch scan` reads `docs/PRD.md`, `docs/TASKS.md`, README, tests, package scripts, and source headings/comments.
  - docs/orchestration.json:9 (keyword, score 4) — "inputs": ["docs/PRD.md", "docs/TASKS.md", "README.md", "src", "tests", "package.json"],
  - package.json:4 (package-script, score 4) — "description": "Local-first traceability quilt for PRDs, tasks, docs, tests, and source drift.",

### ✅ REQ-003

- Source: docs/TASKS.md:5
- Text: REQ-003 Extract tagged and untagged requirement/task bullets deterministically.
- Status: covered
- Evidence:
  - docs/TASKS.md:5 (keyword, score 8) — - [x] REQ-003 Extract tagged and untagged requirement/task bullets deterministically.
  - docs/PRD.md:19 (keyword, score 4) — - Extract requirement/task bullets and match to files using explicit tags (`REQ-001`) and fuzzy local heuristics.
  - tests/extract.test.ts:12 (keyword, score 4) — test('assigns stable ids to untagged requirement-like bullets', () => {
  - README.md:62 (keyword, score 3) — Untagged bullets are also matched with simple local keyword heuristics.
  - src/extract.ts:11 (keyword, score 3) — export function extractRequirements(markdown: string, file: string, source: 'prd' | 'tasks'): Requirement[] {
  - src/scan.ts:25 (keyword, score 3) — ...(tasks ? extractRequirements(tasks, tasksPath, 'tasks') : [])
  - tests/extract.test.ts:5 (keyword, score 3) — test('extracts explicit requirement tags from bullets', () => {
  - tests/fixtures/untagged-repo/docs/PRD.md:1 (heading, score 3) — # Untagged Repo PRD

### ✅ REQ-004

- Source: docs/TASKS.md:6
- Text: REQ-004 Match items to files using explicit tags and local keyword heuristics.
- Status: covered
- Evidence:
  - docs/TASKS.md:6 (keyword, score 9) — - [x] REQ-004 Match items to files using explicit tags and local keyword heuristics.
  - docs/PRD.md:19 (keyword, score 6) — - Extract requirement/task bullets and match to files using explicit tags (`REQ-001`) and fuzzy local heuristics.
  - README.md:62 (keyword, score 4) — Untagged bullets are also matched with simple local keyword heuristics.

### ✅ REQ-005

- Source: docs/TASKS.md:7
- Text: REQ-005 Emit docs/TRACEABILITY.md and docs/traceability.json from scans.
- Status: covered
- Evidence:
  - docs/TASKS.md:7 (keyword, score 5) — - [x] REQ-005 Emit docs/TRACEABILITY.md and docs/traceability.json from scans.
  - docs/PRD.md:20 (keyword, score 3) — - Emit `docs/TRACEABILITY.md` and JSON with covered/orphan/stale items.
  - tests/fixtures/tagged-repo/docs/PRD.md:4 (keyword, score 3) — - REQ-002 The scanner should emit traceability markdown and JSON reports.
  - tests/fixtures/tagged-repo/src/index.ts:4 (keyword, score 3) — // REQ-002 emit markdown and JSON traceability reports.

### ✅ REQ-006

- Source: docs/TASKS.md:8
- Text: REQ-006 Make `check` exit non-zero when coverage or stale evidence thresholds fail.
- Status: covered
- Evidence:
  - docs/TASKS.md:8 (keyword, score 11) — - [x] REQ-006 Make `check` exit non-zero when coverage or stale evidence thresholds fail.
  - README.md:31 (keyword, score 6) — `check` runs the same scan and exits non-zero when coverage is below the threshold or stale tags exceed the maximum.
  - docs/PRD.md:21 (keyword, score 4) — - `specstitch check` exits non-zero on configurable drift thresholds.
  - docs/orchestration.json:6 (keyword, score 3) — "check": "specstitch check --root . --min-coverage 0.8 --max-stale 0",
  - docs/ORCHESTRATION.md:9 (keyword, score 3) — 3. Run `specstitch check --min-coverage 0.8 --max-stale 0` in CI or local gates.
  - README.md:23 (keyword, score 3) — specstitch check --root . --min-coverage 0.8 --max-stale 0
  - src/check.ts:17 (keyword, score 3) — failures.push(`stale evidence count ${result.summary.stale} is above maximum ${options.maxStale}`);
  - src/cli.ts:85 (keyword, score 3) — console.log(`specstitch ${VERSION}\n\nUsage:\n  specstitch scan [--root .] [--prd docs/PRD.md] [--tasks docs/TASKS.md]\n  specstitch check [--root .] [--min-coverage 0.8] [--max-st

### ✅ REQ-007

- Source: docs/TASKS.md:9
- Text: REQ-007 Include tagged and untagged fixtures with automated tests and CLI smokes.
- Status: covered
- Evidence:
  - docs/TASKS.md:9 (keyword, score 8) — - [x] REQ-007 Include tagged and untagged fixtures with automated tests and CLI smokes.
  - tests/check.test.ts:12 (keyword, score 4) — const result = await scan({ root: path.resolve('tests/fixtures/untagged-repo'), write: false });
  - docs/PRD.md:22 (keyword, score 3) — - Fixtures for tagged and untagged repos.
  - README.md:16 (keyword, score 3) — node dist/cli.js scan --root tests/fixtures/tagged-repo
  - tests/check.test.ts:7 (keyword, score 3) — const checked = await check({ root: path.resolve('tests/fixtures/tagged-repo'), write: false, minCoverage: 1, maxStale: 0 });
  - tests/fixtures/untagged-repo/docs/PRD.md:1 (heading, score 3) — # Untagged Repo PRD
  - tests/fixtures/untagged-repo/README.md:1 (heading, score 3) — # Untagged Fixture
  - tests/scan.test.ts:6 (keyword, score 3) — const fixtureRoot = path.resolve('tests/fixtures/tagged-repo');

### ✅ REQ-008

- Source: docs/TASKS.md:10
- Text: REQ-008 Document safety, contributing, examples, and local-first behavior.
- Status: covered
- Evidence:
  - docs/TASKS.md:10 (keyword, score 7) — - [x] REQ-008 Document safety, contributing, examples, and local-first behavior.

### ⚠️ STALE-13

- Source: docs/ORCHESTRATION.md:10
- Text: Tag appears in evidence but not in PRD/TASKS: 4. Prefer explicit `REQ-001` / `TASK-001` tags when a requirement is important.
- Status: stale
- Evidence:
  - docs/ORCHESTRATION.md:10 (explicit-tag, score 100) — 4. Prefer explicit `REQ-001` / `TASK-001` tags when a requirement is important.

### ⚠️ STALE-14

- Source: tests/extract.test.ts:18
- Text: Tag appears in evidence but not in PRD/TASKS: assert.deepEqual(extractTags('covers req-123 and TASK-999'), ['REQ-123', 'TASK-999']);
- Status: stale
- Evidence:
  - tests/extract.test.ts:18 (explicit-tag, score 100) — assert.deepEqual(extractTags('covers req-123 and TASK-999'), ['REQ-123', 'TASK-999']);

### ⚠️ STALE-15

- Source: tests/extract.test.ts:18
- Text: Tag appears in evidence but not in PRD/TASKS: assert.deepEqual(extractTags('covers req-123 and TASK-999'), ['REQ-123', 'TASK-999']);
- Status: stale
- Evidence:
  - tests/extract.test.ts:18 (explicit-tag, score 100) — assert.deepEqual(extractTags('covers req-123 and TASK-999'), ['REQ-123', 'TASK-999']);

### ⚠️ STALE-16

- Source: tests/fixtures/tagged-repo/docs/TASKS.md:3
- Text: Tag appears in evidence but not in PRD/TASKS: - [ ] TASK-001 Implement scan command for REQ-001.
- Status: stale
- Evidence:
  - tests/fixtures/tagged-repo/docs/TASKS.md:3 (explicit-tag, score 100) — - [ ] TASK-001 Implement scan command for REQ-001.

### ⚠️ STALE-17

- Source: tests/fixtures/tagged-repo/docs/TASKS.md:4
- Text: Tag appears in evidence but not in PRD/TASKS: - [ ] TASK-002 Add report writer for REQ-002.
- Status: stale
- Evidence:
  - tests/fixtures/tagged-repo/docs/TASKS.md:4 (explicit-tag, score 100) — - [ ] TASK-002 Add report writer for REQ-002.

## Files scanned

- README.md
- docs/ORCHESTRATION.md
- docs/PRD.md
- docs/TASKS.md
- docs/orchestration.json
- package.json
- src/check.ts
- src/cli.ts
- src/config.ts
- src/extract.ts
- src/fs.ts
- src/index.ts
- src/match.ts
- src/report.ts
- src/scan.ts
- src/types.ts
- tests/check.test.ts
- tests/config.test.ts
- tests/extract.test.ts
- tests/fixtures/tagged-repo/README.md
- tests/fixtures/tagged-repo/docs/PRD.md
- tests/fixtures/tagged-repo/docs/TASKS.md
- tests/fixtures/tagged-repo/package.json
- tests/fixtures/tagged-repo/src/index.ts
- tests/fixtures/tagged-repo/tests/index.test.ts
- tests/fixtures/untagged-repo/README.md
- tests/fixtures/untagged-repo/docs/PRD.md
- tests/fixtures/untagged-repo/docs/TASKS.md
- tests/fixtures/untagged-repo/package.json
- tests/fixtures/untagged-repo/src/index.ts
- tests/scan.test.ts

