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
    minCoverage: numberValue(parsed.minCoverage),
    maxStale: numberValue(parsed.maxStale)
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
