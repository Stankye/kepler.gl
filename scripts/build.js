// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Cross-platform build script that runs babel on each source folder
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const srcFolders = [
  'actions',
  'components', 
  'reducers',
  'cloud-providers',
  'localization',
  'tasks',
  'ai-assistant'
];

// Remove dist folder
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}

// Run babel for each folder
srcFolders.forEach(folder => {
  const srcPath = path.join('src', folder);
  const outPath = path.join('dist', folder);
  
  console.log(`Building ${srcPath}...`);
  
  try {
    execSync(
      `npx babel ${srcPath} --out-dir ${outPath} --source-maps inline --extensions .ts,.tsx,.js,.jsx --ignore **/*.d.ts`,
      { stdio: 'inherit', shell: true }
    );
  } catch (error) {
    console.error(`Error building ${folder}:`, error.message);
    process.exit(1);
  }
});

console.log('Build completed successfully!');
