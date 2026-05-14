import { scan } from './scan.js';
import type { CheckOptions, ScanResult } from './types.js';

export type CheckResult = {
  ok: boolean;
  result: ScanResult;
  failures: string[];
};

export async function check(options: CheckOptions): Promise<CheckResult> {
  const result = await scan(options);
  const failures: string[] = [];
  if (result.summary.coverage < options.minCoverage) {
    failures.push(`coverage ${percent(result.summary.coverage)} is below minimum ${percent(options.minCoverage)}`);
  }
  if (result.summary.stale > options.maxStale) {
    failures.push(`stale evidence count ${result.summary.stale} is above maximum ${options.maxStale}`);
  }
  if (result.summary.orphan > 0 && options.minCoverage >= 1) {
    failures.push(`${result.summary.orphan} requirement(s) have no evidence`);
  }
  return { ok: failures.length === 0, result, failures };
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
