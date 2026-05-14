import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRequirements, extractTags, keywordsFor } from '../src/index.js';

test('extracts explicit requirement tags from bullets', () => {
  const requirements = extractRequirements('- REQ-001 The CLI must scan docs.\n- nice to have', 'docs/PRD.md', 'prd');
  assert.equal(requirements.length, 1);
  assert.equal(requirements[0]?.id, 'REQ-001');
  assert.deepEqual(requirements[0]?.tags, ['REQ-001']);
});

test('assigns stable ids to untagged requirement-like bullets', () => {
  const requirements = extractRequirements('- The checker should report drift clearly.', 'docs/PRD.md', 'prd');
  assert.equal(requirements[0]?.id, 'PRD-001');
});

test('normalizes tags and filters keyword noise', () => {
  assert.deepEqual(extractTags('covers req-123 and TASK-999'), ['REQ-123', 'TASK-999']);
  assert.deepEqual(keywordsFor('The scanner should emit local traceability reports').slice(0, 3), ['scanner', 'emit', 'local']);
});
