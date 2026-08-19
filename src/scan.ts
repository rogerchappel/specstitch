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
  const requirements = dedupeTaggedRequirements([
    ...(prd ? extractRequirements(prd, prdPath, 'prd') : []),
    ...(tasks ? extractRequirements(tasks, tasksPath, 'tasks') : [])
  ]);
  const sourcePaths = new Set([path.normalize(prdPath), path.normalize(tasksPath)]);
  const evidenceDocuments = documents.filter((document) => !sourcePaths.has(path.normalize(document.file)));
  const stitched = stitchRequirements(requirements, evidenceDocuments);
  const staleEvidence = findStaleEvidence(requirements, evidenceDocuments);
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

function dedupeTaggedRequirements(requirements: ReturnType<typeof extractRequirements>) {
  const seenDeclarations = new Set<string>();
  return requirements.filter((requirement) => {
    if (requirement.tags.length === 0) return true;
    const key = `${requirement.tags.join('\0')}\0${requirement.text}`;
    if (seenDeclarations.has(key)) return false;
    seenDeclarations.add(key);
    return true;
  });
}

export async function writeReports(root: string, result: ScanResult, options: ScanOptions): Promise<void> {
  const markdownPath = path.join(root, options.outMarkdown ?? 'docs/TRACEABILITY.md');
  const jsonPath = path.join(root, options.outJson ?? 'docs/traceability.json');
  await mkdir(path.dirname(markdownPath), { recursive: true });
  await mkdir(path.dirname(jsonPath), { recursive: true });
  await writeFile(markdownPath, renderMarkdown(result), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}
