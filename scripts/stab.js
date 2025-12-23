// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Cross-platform script to create a stub dist/index.js file
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
const indexFile = path.join(distDir, 'index.js');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, {recursive: true});
}

if (!fs.existsSync(indexFile)) {
  fs.writeFileSync(indexFile, '// stub\n');
}
