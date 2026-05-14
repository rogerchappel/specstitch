import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { scan } from '../src/index.js';

const fixtureRoot = path.resolve('tests/fixtures/tagged-repo');

test('scan stitches tagged fixture requirements to source evidence', async () => {
  const result = await scan({ root: fixtureRoot, write: false });
  assert.equal(result.summary.orphan, 0);
  assert.ok(result.summary.coverage >= 1);
  assert.ok(result.filesScanned.includes('src/index.ts'));
});

test('scan includes generated requirement evidence details', async () => {
  const result = await scan({ root: fixtureRoot, write: false });
  const req = result.requirements.find((item) => item.id === 'REQ-001');
  assert.ok(req);
  assert.ok(req.evidence.some((item) => item.file === 'src/index.ts'));
});
