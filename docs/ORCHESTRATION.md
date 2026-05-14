# ORCHESTRATION

specstitch is designed for agents and maintainers who need quick, deterministic project state.

## Contract

1. Run `specstitch scan` before release, handoff, or larger refactors.
2. Review `docs/TRACEABILITY.md` for orphan requirements and stale tags.
3. Run `specstitch check --min-coverage 0.8 --max-stale 0` in CI or local gates.
4. Prefer explicit `REQ-001` / `TASK-001` tags when a requirement is important.

## Agent loop

- Read PRD/TASKS.
- Make code and test changes.
- Add or update evidence tags where they clarify intent.
- Run scan/check.
- Commit traceability reports only when useful for the repo.

## Safety

The tool only reads local text files and writes reports to configurable local paths. It does not call remote APIs or send project content anywhere.

## Config-aware gates

Repositories can commit `specstitch.config.json` so humans, agents, and CI all share the same PRD/TASKS paths and drift thresholds. Use CLI flags only for one-off stricter checks.
