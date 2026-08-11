import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const packageSpec = `${packageJson.name}@${packageJson.version}`;

const registry = spawnSync('npm', ['view', packageSpec, 'version', '--json'], {
  encoding: 'utf8',
});

if (registry.error) {
  throw registry.error;
}

const registryOutput = `${registry.stdout}\n${registry.stderr}`;
const unpublished = registry.status !== 0 && /\bE404\b|not found/i.test(registryOutput);

if (registry.status !== 0 && !unpublished) {
  process.stderr.write(registryOutput);
  throw new Error(`Could not determine npm publication status for ${packageSpec}`);
}

if (unpublished) {
  const shellBlocks = [...readme.matchAll(/```(?:bash|sh|shell)\s*\n([\s\S]*?)```/gi)]
    .map((match) => match[1]);
  const claimsRegistryInstall = shellBlocks.some((block) =>
    new RegExp(`(?:^|\\n)\\s*npm\\s+(?:install|i)\\s+(?:--global|-g)\\s+${packageJson.name}(?:\\s|$)`).test(block),
  );

  if (claimsRegistryInstall) {
    throw new Error(`README claims a registry installation for unpublished ${packageSpec}`);
  }

  for (const required of [
    'has not been published to the npm registry yet',
    `git clone https://github.com/rogerchappel/${packageJson.name}.git`,
    'npm install',
    'npm run build',
  ]) {
    if (!readme.includes(required)) {
      throw new Error(`README is missing pre-publication installation guidance: ${required}`);
    }
  }
}

console.log(`installation docs match npm status for ${packageSpec}: ${unpublished ? 'unpublished' : 'published'}`);
