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
