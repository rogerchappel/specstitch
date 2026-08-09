import path from 'node:path';
import { readTextIfExists } from './fs.js';

export type SpecstitchConfig = {
  prdPath?: string;
  tasksPath?: string;
  outMarkdown?: string;
  outJson?: string;
  minCoverage?: number;
  maxStale?: number;
};

export async function loadConfig(root: string, configPath = 'specstitch.config.json'): Promise<SpecstitchConfig> {
  const text = await readTextIfExists(path.join(root, configPath));
  if (!text) return {};
  const parsed = JSON.parse(text) as unknown;
  if (!isObject(parsed)) throw new Error('specstitch config must be a JSON object');
  return {
    prdPath: stringValue(parsed.prdPath),
    tasksPath: stringValue(parsed.tasksPath),
    outMarkdown: stringValue(parsed.outMarkdown),
    outJson: stringValue(parsed.outJson),
    minCoverage: thresholdValue(parsed.minCoverage, 'minCoverage', (value) => value <= 1, 'a finite number between 0 and 1'),
    maxStale: thresholdValue(parsed.maxStale, 'maxStale', Number.isSafeInteger, 'a non-negative integer')
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function thresholdValue(value: unknown, name: string, valid: (value: number) => boolean, requirement: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || !valid(value)) {
    throw new Error(`config ${name} must be ${requirement}`);
  }
  return value;
}
