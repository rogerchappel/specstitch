import type { Evidence, Requirement, StitchedRequirement } from './types.js';
import { extractTags } from './extract.js';

export type Document = {
  file: string;
  text: string;
};

export function stitchRequirements(requirements: Requirement[], documents: Document[]): StitchedRequirement[] {
  return requirements.map((requirement) => {
    const evidence = findEvidence(requirement, documents);
    const status = evidence.length > 0 ? 'covered' : 'orphan';
    return { ...requirement, status, evidence };
  });
}

export function findStaleEvidence(requirements: Requirement[], documents: Document[]): Evidence[] {
  const knownTags = new Set(requirements.flatMap((requirement) => requirement.tags));
  const stale: Evidence[] = [];
  for (const document of documents) {
    document.text.split(/\r?\n/).forEach((line, index) => {
      for (const tag of extractTags(line)) {
        if (!knownTags.has(tag)) {
          stale.push({ file: document.file, line: index + 1, kind: 'explicit-tag', excerpt: line.trim(), score: 100 });
        }
      }
    });
  }
  return stale;
}

function findEvidence(requirement: Requirement, documents: Document[]): Evidence[] {
  const evidence: Evidence[] = [];
  for (const document of documents) {
    const lines = document.text.split(/\r?\n/);
    lines.forEach((line, index) => {
      const explicit = requirement.tags.some((tag) => line.toUpperCase().includes(tag));
      if (explicit && !isSourceLine(requirement, document.file, index + 1)) {
        evidence.push(toEvidence(document.file, index + 1, 'explicit-tag', line, 100));
        return;
      }
      const score = keywordScore(requirement.keywords, line);
      if (score >= 3) evidence.push(toEvidence(document.file, index + 1, 'keyword', line, score));
      if (document.file === 'package.json' && score >= 2) evidence.push(toEvidence(document.file, index + 1, 'package-script', line, score + 1));
      if (/^\s*#+\s+/.test(line) && score >= 2) evidence.push(toEvidence(document.file, index + 1, 'heading', line, score + 1));
    });
  }
  return evidence
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file) || a.line - b.line)
    .filter((item, index, all) => index === all.findIndex((other) => other.file === item.file && other.line === item.line))
    .slice(0, 8);
}

function keywordScore(keywords: string[], line: string): number {
  const lower = line.toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword)).length;
}

function toEvidence(file: string, line: number, kind: Evidence['kind'], excerpt: string, score: number): Evidence {
  return { file, line, kind, excerpt: excerpt.trim().slice(0, 180), score };
}

function isSourceLine(requirement: Requirement, file: string, line: number): boolean {
  return requirement.file === file && requirement.line === line;
}
