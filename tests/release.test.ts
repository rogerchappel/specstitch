import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "../..");
const script = resolve(root, "scripts/prepare-release.mjs");
const manifest = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const filename = `specstitch-${manifest.version}.tgz`;

test("prepares the one named artifact for the package version", () => {
  const outputDir = mkdtempSync(join(tmpdir(), "specstitch-release-"));
  const output = execFileSync(process.execPath, [script, "--tag", `v${manifest.version}`, "--output-dir", outputDir], {
    encoding: "utf8",
  });

  assert.match(output, new RegExp(`filename=${filename.replaceAll(".", "\\.")}`));
  const packedManifest = JSON.parse(execFileSync("tar", ["-xOf", join(outputDir, filename), "package/package.json"], {
    encoding: "utf8",
  }));
  assert.equal(packedManifest.name, manifest.name);
  assert.equal(packedManifest.version, manifest.version);
});

test("rejects a release tag that differs from package.json", () => {
  const result = spawnSync(process.execPath, [script, "--tag", "v9.9.9", "--output-dir", mkdtempSync(join(tmpdir(), "specstitch-release-"))], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`does not match package\\.json version ${manifest.version.replaceAll(".", "\\.")}`));
});
