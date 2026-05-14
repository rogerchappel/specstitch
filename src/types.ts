export type StitchStatus = 'covered' | 'orphan' | 'stale';

export type ScanOptions = {
  root: string;
  prdPath?: string;
  tasksPath?: string;
  readmePath?: string;
  outMarkdown?: string;
  outJson?: string;
  write?: boolean;
  minCoverage?: number;
  maxStale?: number;
};

export type Requirement = {
  id: string;
  source: 'prd' | 'tasks';
  text: string;
  file: string;
  line: number;
  tags: string[];
  keywords: string[];
};

export type Evidence = {
  file: string;
  line: number;
  kind: 'explicit-tag' | 'keyword' | 'package-script' | 'heading';
  excerpt: string;
  score: number;
};

export type StitchedRequirement = Requirement & {
  status: StitchStatus;
  evidence: Evidence[];
};

export type ScanSummary = {
  total: number;
  covered: number;
  orphan: number;
  stale: number;
  coverage: number;
};

export type ScanResult = {
  generatedAt: string;
  root: string;
  summary: ScanSummary;
  requirements: StitchedRequirement[];
  filesScanned: string[];
};

export type CheckOptions = ScanOptions & {
  minCoverage: number;
  maxStale: number;
};
