#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const args = process.argv.slice(2);

function valueFor(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

const tag = valueFor("--tag");
const outputDir = resolve(valueFor("--output-dir") ?? resolve(root, "release-artifacts"));

if (!tag) {
  console.error("Usage: node scripts/prepare-release.mjs --tag v<package-version> [--output-dir <directory>]");
  process.exit(2);
}

const expectedTag = `v${packageJson.version}`;
if (tag !== expectedTag) {
  console.error(`Release tag ${tag} does not match package.json version ${packageJson.version} (expected ${expectedTag}).`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
const packed = JSON.parse(execFileSync("npm", ["pack", "--json", "--pack-destination", outputDir], {
  cwd: root,
  encoding: "utf8",
}));

if (!Array.isArray(packed) || packed.length !== 1 || !packed[0]?.filename) {
  console.error(`Expected npm pack to produce exactly one artifact, received: ${JSON.stringify(packed)}`);
  process.exit(1);
}

const artifact = resolve(outputDir, packed[0].filename);
const expectedFilename = `${packageJson.name.replace(/^@/, "").replaceAll("/", "-")}-${packageJson.version}.tgz`;
if (basename(artifact) !== expectedFilename) {
  console.error(`Packed artifact ${basename(artifact)} does not match expected identity ${expectedFilename}.`);
  process.exit(1);
}

const outputs = `artifact=${artifact}\nfilename=${expectedFilename}\nversion=${packageJson.version}\n`;
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, outputs);
process.stdout.write(outputs);
