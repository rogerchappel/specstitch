import type { Evidence, ScanResult, ScanSummary, StitchedRequirement } from './types.js';

export function summarize(requirements: StitchedRequirement[], staleEvidence: Evidence[]): ScanSummary {
  const covered = requirements.filter((requirement) => requirement.status === 'covered').length;
  const orphan = requirements.filter((requirement) => requirement.status === 'orphan').length;
  return {
    total: requirements.length,
    covered,
    orphan,
    stale: staleEvidence.length,
    coverage: requirements.length === 0 ? 1 : Number((covered / requirements.length).toFixed(4))
  };
}

export function renderMarkdown(result: ScanResult): string {
  const lines = [
    '# Traceability Quilt',
    '',
    `Generated: ${result.generatedAt}`,
    '',
    '## Summary',
    '',
    `- Requirements: ${result.summary.total}`,
    `- Covered: ${result.summary.covered}`,
    `- Orphan: ${result.summary.orphan}`,
    `- Stale evidence tags: ${result.summary.stale}`,
    `- Coverage: ${Math.round(result.summary.coverage * 100)}%`,
    '',
    '## Requirements',
    ''
  ];

  for (const requirement of result.requirements) {
    lines.push(`### ${statusIcon(requirement.status)} ${requirement.id}`);
    lines.push('');
    lines.push(`- Source: ${requirement.file}:${requirement.line}`);
    lines.push(`- Text: ${requirement.text}`);
    lines.push(`- Status: ${requirement.status}`);
    if (requirement.evidence.length === 0) {
      lines.push('- Evidence: _none found_');
    } else {
      lines.push('- Evidence:');
      for (const item of requirement.evidence) {
        lines.push(`  - ${item.file}:${item.line} (${item.kind}, score ${item.score}) — ${item.excerpt}`);
      }
    }
    lines.push('');
  }

  lines.push('## Files scanned', '');
  for (const file of result.filesScanned) lines.push(`- ${file}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function statusIcon(status: string): string {
  if (status === 'covered') return '✅';
  if (status === 'stale') return '⚠️';
  return '🧵';
}
