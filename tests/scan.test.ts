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

test('scan ignores stale tags on explicitly ignored evidence lines', async () => {
  const result = await scan({ root: path.resolve('tests/fixtures/ignored-tags-repo'), write: false });
  assert.equal(result.summary.stale, 0);
  assert.equal(result.requirements.some((item) => item.status === 'stale'), false);
  assert.ok(result.requirements.find((item) => item.id === 'REQ-101')?.evidence.some((item) => item.file === 'src/index.ts'));
});
