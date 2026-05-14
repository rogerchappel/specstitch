# Contributing

Thanks for helping make specstitch more useful. Keep the project local-first, deterministic, and easy for future maintainers or agents to audit.

## Development

```bash
npm install
npm test
npm run check
npm run smoke
```

## Expectations

- Add fixture-backed tests for parser or matching changes.
- Avoid network-dependent behavior in core scan/check flows.
- Prefer explicit traceability tags in examples.
- Keep reports stable enough for diffs.
