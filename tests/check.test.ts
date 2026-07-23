import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { check, scan } from '../src/index.js';

test('check passes when fixture coverage meets threshold', async () => {
  const checked = await check({ root: path.resolve('tests/fixtures/tagged-repo'), write: false, minCoverage: 1, maxStale: 0 });
  assert.equal(checked.ok, true);
});

test('check fails full coverage when a tag is repeated only in requirement sources', async () => {
  const checked = await check({
    root: path.resolve('tests/fixtures/cross-source-only'),
    write: false,
    minCoverage: 1,
    maxStale: 0
  });

  assert.equal(checked.ok, false);
  assert.deepEqual(checked.failures, [
    'coverage 0% is below minimum 100%',
    '1 requirement(s) have no evidence'
  ]);
});

test('check passes full coverage when a repeated tag has implementation evidence', async () => {
  const checked = await check({
    root: path.resolve('tests/fixtures/cross-source-backed'),
    write: false,
    minCoverage: 1,
    maxStale: 0
  });

  assert.equal(checked.ok, true);
  assert.deepEqual(checked.failures, []);
});

test('untagged fixture keeps deterministic auto ids', async () => {
  const result = await scan({ root: path.resolve('tests/fixtures/untagged-repo'), write: false });
  assert.ok(result.requirements.some((item) => item.id === 'PRD-001'));
  assert.ok(result.summary.total >= 2);
});
