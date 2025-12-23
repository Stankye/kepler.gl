// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Custom ESM loader for Node.js 24+ that handles extensionless imports
// This is needed because many packages don't include file extensions in their imports

import {resolve as pathResolve, dirname} from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {existsSync} from 'fs';

const extensions = ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.json'];

export async function resolve(specifier, context, nextResolve) {
  // Let Node handle built-in modules and absolute URLs
  if (specifier.startsWith('node:') || specifier.startsWith('file:')) {
    return nextResolve(specifier, context);
  }

  // Try the default resolution first
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    // Only handle ERR_MODULE_NOT_FOUND
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      throw error;
    }

    // If it's a relative or absolute path without extension, try adding extensions
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      const parentPath = context.parentURL ? fileURLToPath(context.parentURL) : process.cwd();
      const parentDir = dirname(parentPath);
      const basePath = pathResolve(parentDir, specifier);

      // Try with various extensions
      for (const ext of extensions) {
        const fullPath = basePath + ext;
        if (existsSync(fullPath)) {
          return {
            url: pathToFileURL(fullPath).href,
            shortCircuit: true
          };
        }
      }

      // Try as directory with index file
      for (const ext of extensions) {
        const indexPath = pathResolve(basePath, 'index' + ext);
        if (existsSync(indexPath)) {
          return {
            url: pathToFileURL(indexPath).href,
            shortCircuit: true
          };
        }
      }
    }

    // Re-throw if we couldn't resolve
    throw error;
  }
}
