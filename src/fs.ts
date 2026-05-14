import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_INCLUDE = [
  'README.md',
  'package.json',
  'docs',
  'src',
  'test',
  'tests',
  '__tests__'
];

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'coverage', '.next', '.turbo']);
const SKIP_FILES = new Set(['docs/TRACEABILITY.md', 'docs/traceability.json']);
const TEXT_EXTENSIONS = new Set(['.md', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.cjs', '.yml', '.yaml']);

export async function readTextIfExists(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

export async function listCandidateFiles(root: string): Promise<string[]> {
  const found: string[] = [];
  for (const entry of DEFAULT_INCLUDE) {
    const absolute = path.join(root, entry);
    try {
      const info = await stat(absolute);
      if (info.isDirectory()) await walk(absolute, root, found);
      if (info.isFile() && isTextFile(absolute)) found.push(path.relative(root, absolute));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }
  return [...new Set(found)].filter((file) => !SKIP_FILES.has(file)).sort();
}

async function walk(directory: string, root: string, found: string[]): Promise<void> {
  for (const dirent of await readdir(directory, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      if (!SKIP_DIRS.has(dirent.name)) await walk(path.join(directory, dirent.name), root, found);
      continue;
    }
    const absolute = path.join(directory, dirent.name);
    if (dirent.isFile() && isTextFile(absolute)) found.push(path.relative(root, absolute));
  }
}

function isTextFile(filePath: string): boolean {
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}
