// REQ-001 scan PRD and TASKS documents into requirement records.
export function scanInputs() { return ['docs/PRD.md', 'docs/TASKS.md']; }

// REQ-002 emit markdown and JSON traceability reports.
export function writeReports() { return ['docs/TRACEABILITY.md', 'docs/traceability.json']; }
