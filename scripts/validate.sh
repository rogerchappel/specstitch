#!/usr/bin/env bash
set -euo pipefail
npm run docs:install-check
npm test
npm run check
npm run build
npm run smoke
