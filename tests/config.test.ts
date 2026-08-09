import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadConfig } from '../src/config.js';

test('loadConfig returns empty object when absent', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'specstitch-config-'));
  assert.deepEqual(await loadConfig(root), {});
});

test('loadConfig reads supported paths and thresholds', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'specstitch-config-'));
  await writeFile(path.join(root, 'specstitch.config.json'), JSON.stringify({ prdPath: 'product.md', minCoverage: 0.9, maxStale: 2 }));
  assert.deepEqual(await loadConfig(root), { prdPath: 'product.md', tasksPath: undefined, outMarkdown: undefined, outJson: undefined, minCoverage: 0.9, maxStale: 2 });
});

test('loadConfig rejects invalid thresholds', async () => {
  for (const [name, value, diagnostic] of [
    ['minCoverage', -0.1, /between 0 and 1/], ['minCoverage', 1.1, /between 0 and 1/],
    ['minCoverage', '0.8', /between 0 and 1/], ['maxStale', -1, /non-negative integer/],
    ['maxStale', 1.5, /non-negative integer/], ['maxStale', '1', /non-negative integer/]
  ] as const) {
    const root = await mkdtemp(path.join(tmpdir(), 'specstitch-config-'));
    await writeFile(path.join(root, 'specstitch.config.json'), JSON.stringify({ [name]: value }));
    await assert.rejects(loadConfig(root), diagnostic);
  }
});

test('loadConfig accepts threshold boundaries', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'specstitch-config-'));
  await writeFile(path.join(root, 'specstitch.config.json'), JSON.stringify({ minCoverage: 0, maxStale: 0 }));
  assert.deepEqual(await loadConfig(root), { prdPath: undefined, tasksPath: undefined, outMarkdown: undefined, outJson: undefined, minCoverage: 0, maxStale: 0 });
});
