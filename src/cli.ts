#!/usr/bin/env node
import path from 'node:path';
import { check } from './check.js';
import { loadConfig } from './config.js';
import { scan } from './scan.js';

const VERSION = '0.1.0';

type Parsed = { command: string; options: Record<string, string | boolean> };

async function main(argv: string[]): Promise<number> {
  let parsed: Parsed;
  try {
    parsed = parse(argv);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    printHelp();
    return 2;
  }
  if (parsed.options.version) {
    console.log(VERSION);
    return 0;
  }
  if (parsed.options.help || parsed.command === 'help' || !parsed.command) {
    printHelp();
    return 0;
  }

  const root = path.resolve(String(parsed.options.root ?? process.cwd()));
  const config = await loadConfig(root, stringOption(parsed.options.config));
  let thresholds: { minCoverage: number; maxStale: number };
  try {
    thresholds = {
      minCoverage: thresholdOption(parsed.options['min-coverage'], config.minCoverage ?? 0.8, '--min-coverage', (value) => value <= 1, 'a finite number between 0 and 1'),
      maxStale: thresholdOption(parsed.options['max-stale'], config.maxStale ?? 0, '--max-stale', Number.isSafeInteger, 'a non-negative integer')
    };
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    printHelp();
    return 2;
  }
  if (parsed.command === 'scan') {
    const result = await scan({
      root,
      prdPath: stringOption(parsed.options.prd) ?? config.prdPath,
      tasksPath: stringOption(parsed.options.tasks) ?? config.tasksPath,
      outMarkdown: stringOption(parsed.options.markdown) ?? config.outMarkdown,
      outJson: stringOption(parsed.options.json) ?? config.outJson,
      write: parsed.options.write !== false
    });
    printSummary(result.summary);
    return 0;
  }

  if (parsed.command === 'check') {
    const checked = await check({
      root,
      prdPath: stringOption(parsed.options.prd) ?? config.prdPath,
      tasksPath: stringOption(parsed.options.tasks) ?? config.tasksPath,
      outMarkdown: stringOption(parsed.options.markdown) ?? config.outMarkdown,
      outJson: stringOption(parsed.options.json) ?? config.outJson,
      write: parsed.options.write !== false,
      minCoverage: thresholds.minCoverage,
      maxStale: thresholds.maxStale
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
  let [command = '', ...rest] = argv;
  if (command === '--help' || command === '--version') {
    rest = argv;
    command = '';
  }
  const options: Record<string, string | boolean> = {};
  const valueOptions = new Set(['root', 'config', 'prd', 'tasks', 'markdown', 'json', 'min-coverage', 'max-stale']);
  const booleanOptions = new Set(['help', 'version', 'no-write']);
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i] ?? '';
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (key === 'no-write') {
      options.write = false;
      continue;
    }
    if (booleanOptions.has(key)) {
      options[key] = true;
      continue;
    }
    if (!valueOptions.has(key)) throw new Error(`Unknown option: ${arg}`);
    const next = rest[i + 1];
    if (!next || next.startsWith('--')) throw new Error(`${arg} requires a value`);
    options[key] = next;
    i += 1;
  }
  return { command, options };
}

function printHelp(): void {
  console.log(`specstitch ${VERSION}\n\nUsage:\n  specstitch --help\n  specstitch --version\n  specstitch scan [options]\n  specstitch check [options]\n\nCommand options:\n  --root <path>           Repository root (default current directory)\n  --prd <path>            PRD path\n  --tasks <path>          Tasks path\n  --markdown <path>       Markdown output path (default docs/TRACEABILITY.md)\n  --json <path>           JSON output path (default docs/traceability.json)\n  --config <path>         Config file path (default specstitch.config.json)\n  --no-write              Analyze without writing reports\n  --min-coverage <number> Minimum coverage for check (default 0.8)\n  --max-stale <number>    Maximum stale requirements for check (default 0)\n  --help                  Show help\n  --version               Show version`);
}

function printSummary(summary: { total: number; covered: number; orphan: number; stale: number; coverage: number }): void {
  console.log(JSON.stringify({ ok: true, summary }, null, 2));
}

function stringOption(value: string | boolean | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function thresholdOption(value: string | boolean | undefined, fallback: number, name: string, valid: (value: number) => boolean, requirement: string): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new Error(`${name} requires a value (${requirement})`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || !valid(parsed)) throw new Error(`${name} must be ${requirement}; received ${JSON.stringify(value)}`);
  return parsed;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
