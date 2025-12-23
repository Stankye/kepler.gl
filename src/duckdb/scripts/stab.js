// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Cross-platform script to create stub dist files for duckdb module
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
const componentsDir = path.join(distDir, 'components');
const tableDir = path.join(distDir, 'table');

// Create directories
[distDir, componentsDir, tableDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create stub files
fs.writeFileSync(path.join(distDir, 'index.js'), "export * from '../src';\n");
fs.writeFileSync(path.join(componentsDir, 'index.js'), "export * from '../../src/components';\n");
fs.writeFileSync(path.join(tableDir, 'index.js'), "export * from '../../src/table';\n");
