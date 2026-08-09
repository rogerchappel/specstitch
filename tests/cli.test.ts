import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const cliPath = path.resolve('dist/src/cli.js');
const fixturePath = path.resolve('tests/fixtures/tagged-repo');

function runCli(...args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8'
  });
}

test('top-level --help prints usage without errors', () => {
  const result = runCli('--help');

  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /^specstitch 0\.1\.0\n/);
  assert.match(result.stdout, /specstitch --help/);
  assert.match(result.stdout, /specstitch --version/);
});

test('top-level --version prints only the version', () => {
  const result = runCli('--version');

  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, '0.1.0\n');
});

test('unknown command reports an error and exits 2', () => {
  const result = runCli('unknown');

  assert.equal(result.status, 2);
  assert.equal(result.stderr, 'Unknown command: unknown\n');
  assert.match(result.stdout, /Usage:/);
});

test('scan command still accepts options and succeeds', () => {
  const result = runCli('scan', '--root', fixturePath, '--no-write');

  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /"ok": true/);
});

test('check rejects invalid threshold flags with usage errors', () => {
  for (const [flag, value, diagnostic] of [
    ['--min-coverage', '-0.1', /between 0 and 1/], ['--min-coverage', '1.1', /between 0 and 1/],
    ['--min-coverage', 'nope', /between 0 and 1/], ['--max-stale', '-1', /non-negative integer/],
    ['--max-stale', '1.5', /non-negative integer/], ['--max-stale', 'nope', /non-negative integer/]
  ] as const) {
    const result = runCli('check', '--root', fixturePath, '--no-write', flag, value);
    assert.equal(result.status, 2, `${flag} ${value}`);
    assert.match(result.stderr, diagnostic);
    assert.match(result.stdout, /Usage:/);
  }
});

test('check rejects missing threshold flag values', () => {
  for (const flag of ['--min-coverage', '--max-stale']) {
    const result = runCli('check', '--root', fixturePath, '--no-write', flag);
    assert.equal(result.status, 2, flag);
    assert.match(result.stderr, /requires a value/);
  }
});

test('check accepts boundary threshold values', () => {
  for (const [flag, value] of [['--min-coverage', '0'], ['--min-coverage', '1'], ['--max-stale', '0']] as const) {
    const result = runCli('check', '--root', fixturePath, '--no-write', flag, value);
    assert.equal(result.status, 0, `${flag} ${value}: ${result.stderr}`);
  }
});
