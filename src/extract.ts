import path from 'node:path';
import type { Requirement } from './types.js';

const TAG_PATTERN = /\b(?:REQ|TASK)-\d{3,}\b/gi;
const BULLET_PATTERN = /^\s*(?:[-*+]\s+|\d+[.)]\s+|#+\s+)(.+?)\s*$/;
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'then', 'than', 'must', 'should',
  'will', 'shall', 'can', 'able', 'read', 'scan', 'file', 'files', 'docs', 'code'
]);

export function extractRequirements(markdown: string, file: string, source: 'prd' | 'tasks'): Requirement[] {
  const lines = markdown.split(/\r?\n/);
  const requirements: Requirement[] = [];
  let auto = 1;

  lines.forEach((line, index) => {
    const match = line.match(BULLET_PATTERN);
    if (!match) return;
    const text = cleanText(match[1] ?? '');
    if (!isRequirementLike(text)) return;
    const tags = extractTags(text);
    const id = tags[0] ?? `${source.toUpperCase()}-${String(auto++).padStart(3, '0')}`;
    requirements.push({
      id,
      source,
      text,
      file: path.normalize(file),
      line: index + 1,
      tags,
      keywords: keywordsFor(text)
    });
  });

  return dedupeRequirements(requirements);
}

export function extractTags(text: string): string[] {
  return [...new Set((text.match(TAG_PATTERN) ?? []).map((tag) => tag.toUpperCase()))];
}

export function keywordsFor(text: string): string[] {
  return [...new Set(text
    .toLowerCase()
    .replace(/[`*_#[\]().,;:!?/\\]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word)))]
    .slice(0, 12);
}

function cleanText(text: string): string {
  return text.replace(/^\[[ xX-]\]\s*/, '').trim();
}

function isRequirementLike(text: string): boolean {
  if (extractTags(text).length > 0) return true;
  if (text.length < 12) return false;
  return /\b(must|should|shall|reads?|writes?|emits?|checks?|supports?|extracts?|matches?|exits?|generates?|reports?)\b/i.test(text);
}

function dedupeRequirements(requirements: Requirement[]): Requirement[] {
  const seen = new Set<string>();
  return requirements.filter((requirement) => {
    const key = `${requirement.source}:${requirement.id}:${requirement.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
