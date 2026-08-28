import test from 'node:test';
import assert from 'node:assert/strict';
import { findStaleEvidence, stitchRequirements } from '../src/match.js';
import { extractRequirements } from '../src/extract.js';
import type { Requirement } from '../src/types.js';

test('explicit evidence requires complete normalized tags', () => {
  const requirements = extractRequirements(
    '- REQ-123 must match exactly\n- TASK-456 must also match exactly',
    'docs/PRD.md',
    'prd'
  );
  const documents = [{
    file: 'src/index.ts',
    text: '// REQ-1234 is different\n// task-4567 is also different'
  }];

  assert.deepEqual(
    stitchRequirements(requirements, documents).map(({ id, status, evidence }) => ({ id, status, evidence })),
    [
      { id: 'REQ-123', status: 'orphan', evidence: [] },
      { id: 'TASK-456', status: 'orphan', evidence: [] }
    ]
  );
  assert.deepEqual(
    findStaleEvidence(requirements, documents).map(({ excerpt }) => excerpt),
    ['// REQ-1234 is different', '// task-4567 is also different']
  );
});

test('explicit evidence matches complete tags case-insensitively', () => {
  const requirements = extractRequirements('- REQ-123 must match exactly', 'docs/PRD.md', 'prd');
  const documents = [{ file: 'src/index.ts', text: '// req-123 implements the requirement' }];

  const [stitched] = stitchRequirements(requirements, documents);
  assert.equal(stitched?.status, 'covered');
  assert.equal(stitched?.evidence[0]?.kind, 'explicit-tag');
  assert.deepEqual(findStaleEvidence(requirements, documents), []);
});

function requirement(keywords: string[]): Requirement {
  return {
    id: 'REQ-500',
    source: 'prd',
    text: 'The system must report cache state.',
    file: 'docs/PRD.md',
    line: 1,
    tags: ['REQ-500'],
    keywords
  };
}

test('keyword evidence rejects substring collisions', () => {
  const [result] = stitchRequirements(
    [requirement(['system', 'report', 'cache', 'state'])],
    [{ file: 'src/example.ts', text: 'The ecosystem reporter cached each result.' }]
  );

  assert.equal(result?.status, 'orphan');
  assert.deepEqual(result?.evidence, []);
});

test('keyword evidence matches normalized tokens across case and punctuation', () => {
  const [result] = stitchRequirements(
    [requirement(['system', 'report', 'cache', 'state'])],
    [{ file: 'src/example.ts', text: 'SYSTEM-report: cache state.' }]
  );

  assert.equal(result?.status, 'covered');
  assert.deepEqual(result?.evidence.map(({ kind, score }) => ({ kind, score })), [
    { kind: 'keyword', score: 4 }
  ]);
});
