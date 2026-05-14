import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { extractRequirements } from './extract.js';
import { listCandidateFiles, readTextIfExists } from './fs.js';
import { findStaleEvidence, stitchRequirements, type Document } from './match.js';
import { renderMarkdown, summarize } from './report.js';
import type { ScanOptions, ScanResult } from './types.js';

export async function scan(options: ScanOptions): Promise<ScanResult> {
  const root = path.resolve(options.root);
  const prdPath = options.prdPath ?? 'docs/PRD.md';
  const tasksPath = options.tasksPath ?? 'docs/TASKS.md';
  const files = await listCandidateFiles(root);
  const documents: Document[] = [];

  for (const file of files) {
    const text = await readTextIfExists(path.join(root, file));
    if (text !== undefined) documents.push({ file, text });
  }

  const prd = await readTextIfExists(path.join(root, prdPath));
  const tasks = await readTextIfExists(path.join(root, tasksPath));
  const requirements = [
    ...(prd ? extractRequirements(prd, prdPath, 'prd') : []),
    ...(tasks ? extractRequirements(tasks, tasksPath, 'tasks') : [])
  ];
  const stitched = stitchRequirements(requirements, documents);
  const staleEvidence = findStaleEvidence(requirements, documents);
  for (const stale of staleEvidence) {
    stitched.push({
      id: `STALE-${stitched.length + 1}`,
      source: 'tasks',
      text: `Tag appears in evidence but not in PRD/TASKS: ${stale.excerpt}`,
      file: stale.file,
      line: stale.line,
      tags: [],
      keywords: [],
      status: 'stale',
      evidence: [stale]
    });
  }

  const result: ScanResult = {
    generatedAt: new Date().toISOString(),
    root,
    summary: summarize(stitched.filter((item) => item.status !== 'stale'), staleEvidence),
    requirements: stitched,
    filesScanned: files
  };

  if (options.write !== false) await writeReports(root, result, options);
  return result;
}

export async function writeReports(root: string, result: ScanResult, options: ScanOptions): Promise<void> {
  const markdownPath = path.join(root, options.outMarkdown ?? 'docs/TRACEABILITY.md');
  const jsonPath = path.join(root, options.outJson ?? 'docs/traceability.json');
  await mkdir(path.dirname(markdownPath), { recursive: true });
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await writeFile(markdownPath, renderMarkdown(result), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}
