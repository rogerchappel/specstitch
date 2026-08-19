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

test('requirement declarations in PRD and TASKS do not evidence one another', async () => {
  const result = await scan({ root: path.resolve('tests/fixtures/cross-source-only'), write: false });

  assert.deepEqual(result.summary, {
    total: 1,
    covered: 0,
    orphan: 1,
    stale: 0,
    coverage: 0
  });
  assert.equal(result.requirements[0]?.id, 'REQ-900');
  assert.deepEqual(result.requirements[0]?.evidence, []);
});

test('a repeated requirement tag remains covered by implementation evidence', async () => {
  const result = await scan({ root: path.resolve('tests/fixtures/cross-source-backed'), write: false });

  assert.deepEqual(result.summary, {
    total: 2,
    covered: 2,
    orphan: 0,
    stale: 0,
    coverage: 1
  });
  assert.deepEqual(result.requirements[0]?.evidence.map(({ file, line }) => ({ file, line })), [
    { file: 'src/widgets.ts', line: 1 }
  ]);
});

test('partially overlapping tag declarations retain every distinct requirement', async () => {
  const result = await scan({ root: path.resolve('tests/fixtures/overlapping-tags'), write: false });

  assert.deepEqual(result.summary, {
    total: 3,
    covered: 3,
    orphan: 0,
    stale: 0,
    coverage: 1
  });
  assert.deepEqual(result.requirements.map(({ id, text, tags }) => ({ id, text, tags })), [
    {
      id: 'REQ-100',
      text: 'REQ-100 REQ-200 must preserve the first behavior',
      tags: ['REQ-100', 'REQ-200']
    },
    {
      id: 'REQ-200',
      text: 'REQ-200 REQ-300 must preserve the second behavior',
      tags: ['REQ-200', 'REQ-300']
    },
    {
      id: 'REQ-300',
      text: 'REQ-300 must preserve the third behavior',
      tags: ['REQ-300']
    }
  ]);
  assert.equal(result.requirements.some((item) => item.status === 'stale'), false);
});
