#!/usr/bin/env node
import path from 'node:path';
import { check } from './check.js';
import { scan } from './scan.js';

const VERSION = '0.1.0';

type Parsed = { command: string; options: Record<string, string | boolean> };

async function main(argv: string[]): Promise<number> {
  const parsed = parse(argv);
  if (parsed.options.help || parsed.command === 'help' || !parsed.command) {
    printHelp();
    return 0;
  }
  if (parsed.options.version) {
    console.log(VERSION);
    return 0;
  }

  const root = path.resolve(String(parsed.options.root ?? process.cwd()));
  if (parsed.command === 'scan') {
    const result = await scan({
      root,
      prdPath: stringOption(parsed.options.prd),
      tasksPath: stringOption(parsed.options.tasks),
      outMarkdown: stringOption(parsed.options.markdown),
      outJson: stringOption(parsed.options.json),
      write: parsed.options.write !== false
    });
    printSummary(result.summary);
    return 0;
  }

  if (parsed.command === 'check') {
    const checked = await check({
      root,
      prdPath: stringOption(parsed.options.prd),
      tasksPath: stringOption(parsed.options.tasks),
      outMarkdown: stringOption(parsed.options.markdown),
      outJson: stringOption(parsed.options.json),
      write: parsed.options.write !== false,
      minCoverage: numberOption(parsed.options['min-coverage'], 0.8),
      maxStale: numberOption(parsed.options['max-stale'], 0)
    });
    printSummary(checked.result.summary);
    if (!checked.ok) {
      for (const failure of checked.failures) console.error(`drift: ${failure}`);
      return 1;
    }
    console.log('specstitch check passed');
    return 0;
  }

  console.error(`Unknown command: ${parsed.command}`);
  printHelp();
  return 2;
}

function parse(argv: string[]): Parsed {
  const [command = '', ...rest] = argv;
  const options: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i] ?? '';
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    if (key === 'no-write') {
      options.write = false;
      continue;
    }
    const next = rest[i + 1];
    if (next && !next.startsWith('--')) {
      options[key] = next;
      i += 1;
    } else {
      options[key] = true;
    }
  }
  return { command, options };
}

function printHelp(): void {
  console.log(`specstitch ${VERSION}\n\nUsage:\n  specstitch scan [--root .] [--prd docs/PRD.md] [--tasks docs/TASKS.md]\n  specstitch check [--root .] [--min-coverage 0.8] [--max-stale 0]\n\nOptions:\n  --markdown <path>       Markdown output path (default docs/TRACEABILITY.md)\n  --json <path>           JSON output path (default docs/traceability.json)\n  --no-write              Analyze without writing reports\n  --help                  Show help\n  --version               Show version`);
}

function printSummary(summary: { total: number; covered: number; orphan: number; stale: number; coverage: number }): void {
  console.log(JSON.stringify({ ok: true, summary }, null, 2));
}

function stringOption(value: string | boolean | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function numberOption(value: string | boolean | undefined, fallback: number): number {
  if (typeof value !== 'string') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
