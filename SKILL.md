# specstitch Agent Skill

Use this skill when an agent needs to prove that project requirements, task lists, docs, tests, and implementation files still line up.

## When To Use

- Before opening a release-candidate PR for a repo with `docs/PRD.md` and `docs/TASKS.md`.
- After changing requirements, acceptance criteria, tests, or CLI behavior.
- During repo audits where a human needs compact requirement-to-evidence output.
- When docs mention tags such as `REQ-001` and source or tests should carry matching evidence.

## Required Inputs

- A local repository checkout.
- `docs/PRD.md` and `docs/TASKS.md` when available.
- Optional `specstitch.config.json` for custom paths and thresholds.

## Tools

- Filesystem read access to the target repo.
- Filesystem write access only when the agent is allowed to update `docs/TRACEABILITY.md` and `docs/traceability.json`.
- Shell access for `specstitch scan` or `specstitch check`.

## Side-Effect Boundaries

- Default commands read local text files and write traceability reports.
- Do not edit source, tests, PRDs, or task files as part of this skill unless the user asks for remediation.
- Do not call network services or send repo contents outside the local machine.

## Approval Requirements

- Ask before overwriting checked-in traceability reports if the workspace has unrelated user changes.
- Ask before changing coverage thresholds or suppressing stale requirements.
- Treat `specstitch-ignore` on a tagged line as an intentional local suppression; do not add it broadly without reviewer context.
- Ask before running broad formatting, dependency, or release commands.

## Workflow

1. Inspect the current branch and confirm the workspace state.
2. Run a dry analysis when the user only wants findings:

   ```bash
   specstitch scan --root . --no-write
   ```

3. Regenerate reports when updates are approved:

   ```bash
   specstitch scan --root .
   ```

4. Enforce release thresholds:

   ```bash
   specstitch check --root . --min-coverage 0.8 --max-stale 0
   ```

5. Summarize covered, orphan, and stale items in the final response or PR body.

## Examples

Tagged requirement:

```md
- REQ-001 The CLI must scan PRD and TASKS markdown files.
```

Tagged evidence:

```ts
// REQ-001 scan PRD and TASKS documents into requirement records.
```

Release check:

```bash
npm run build
node dist/src/cli.js check --root tests/fixtures/tagged-repo --min-coverage 1 --max-stale 0
```

## Validation

Run these checks after changing this repo or the skill instructions:

```bash
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
```
