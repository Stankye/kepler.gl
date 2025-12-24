// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import esbuild from 'esbuild';
import {replace} from 'esbuild-plugin-replace';
import {dotenvRun} from '@dotenv-run/esbuild';

import process from 'node:process';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {join} from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const KeplerPackage = require('../../package.json');

const args = process.argv;

// Normalize path to use forward slashes (for esbuild compatibility on Windows)
const normalizePath = p => p.replace(/\\/g, '/');
const joinPath = (...args) => normalizePath(join(...args));

const BASE_NODE_MODULES_DIR = './node_modules';

const LIB_DIR = '../../';
const NODE_MODULES_DIR = joinPath(LIB_DIR, 'node_modules');
const SRC_DIR = joinPath(LIB_DIR, 'src');

// For debugging deck.gl, load deck.gl from external deck.gl directory
const EXTERNAL_DECK_SRC = joinPath(LIB_DIR, 'deck.gl');

// For debugging loaders.gl, load loaders.gl from external loaders.gl directory
const EXTERNAL_LOADERS_SRC = joinPath(LIB_DIR, 'loaders.gl');

// For debugging hubble.gl, load hubble.gl from external hubble.gl directory
const EXTERNAL_HUBBLE_SRC = joinPath(LIB_DIR, '../../hubble.gl');

const port = 8080;

const getThirdPartyLibraryAliases = useKeplerNodeModules => {
  const nodeModulesDir = useKeplerNodeModules ? NODE_MODULES_DIR : BASE_NODE_MODULES_DIR;

  const localSources = useKeplerNodeModules
    ? {
        // Suppress useless warnings from react-date-picker's dep
        'tiny-warning': `${SRC_DIR}/utils/src/noop.ts`
      }
    : {};

  // react-redux alias only needed when using kepler node_modules (which have v9)
  // local node_modules may have v8 with different structure
  const reactReduxAlias = useKeplerNodeModules
    ? {'react-redux': `${nodeModulesDir}/react-redux/dist/cjs/index.js`}
    : {};

  return {
    ...localSources,
    ...reactReduxAlias,
    react: `${nodeModulesDir}/react`,
    'react-dom': `${nodeModulesDir}/react-dom`,
    'styled-components': `${nodeModulesDir}/styled-components`,
    'react-intl': `${nodeModulesDir}/react-intl`,
    'react-palm': `${nodeModulesDir}/react-palm`,
    // kepler.gl and loaders.gl need to use same apache-arrow
    'apache-arrow': `${nodeModulesDir}/apache-arrow`
  };
};

// Env variables required for demo app
const requiredEnvVariables = [
  'MapboxAccessToken',
  'DropboxClientId',
  'MapboxExportToken',
  'CartoClientId',
  'FoursquareClientId',
  'FoursquareDomain',
  'FoursquareAPIURL',
  'FoursquareUserMapsURL'
];

/**
 * Check for all required env variables to be present
 */
const checkEnvVariables = () => {
  const missingVars = requiredEnvVariables.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('✅ All required environment variables are set.');
  }
};

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');
const config = {
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  loader: {
    '.js': 'jsx',
    '.css': 'css',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file'
  },
  entryPoints: ['src/main.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    NODE_ENV,
    // Define process.env variables for browser environment
    'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || ''),
    'process.env.DropboxClientId': JSON.stringify(process.env.DropboxClientId || ''),
    'process.env.MapboxExportToken': JSON.stringify(process.env.MapboxExportToken || ''),
    'process.env.CartoClientId': JSON.stringify(process.env.CartoClientId || ''),
    'process.env.FoursquareClientId': JSON.stringify(process.env.FoursquareClientId || ''),
    'process.env.FoursquareDomain': JSON.stringify(process.env.FoursquareDomain || ''),
    'process.env.FoursquareAPIURL': JSON.stringify(process.env.FoursquareAPIURL || ''),
    'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL || ''),
    'process.env.NODE_ENV': NODE_ENV
  },
  plugins: [
    dotenvRun({
      verbose: true,
      environment: NODE_ENV,
      root: '../../.env',
      // Only include specific environment variables to avoid Windows system variables with special characters
      prefix: '^(Mapbox|Dropbox|Carto|Foursquare|NODE_)'
    }),
    // automatically injected kepler.gl package version into the bundle
    replace({
      __PACKAGE_VERSION__: KeplerPackage.version,
      include: /constants\/src\/default-settings\.ts/
    })
  ]
};

function addAliases(externals, args) {
  const resolveAlias = getThirdPartyLibraryAliases(true);

  // Combine flags
  const useLocalDeck = args.includes('--env.deck') || args.includes('--env.hubble_src');
  const useRepoDeck = args.includes('--env.deck_src');
  const useLocalAiAssistant = args.includes('--env.ai');

  // resolve ai-assistant from local dir
  if (useLocalAiAssistant) {
    resolveAlias['@openassistant/core'] = joinPath(LIB_DIR, '../openassistant/packages/core/src');
    resolveAlias['@openassistant/ui'] = joinPath(LIB_DIR, '../openassistant/packages/ui/src');
    resolveAlias['@openassistant/echarts'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/components/echarts/src'
    );
    resolveAlias['@openassistant/tables'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/components/tables/src'
    );
    resolveAlias['@openassistant/geoda'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/tools/geoda/src'
    );
    resolveAlias['@openassistant/duckdb'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/tools/duckdb/src'
    );
    resolveAlias['@openassistant/plots'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/tools/plots/src'
    );
    resolveAlias['@openassistant/osm'] = joinPath(
      LIB_DIR,
      '../openassistant/packages/tools/osm/src'
    );
    resolveAlias['@openassistant/utils'] = joinPath(LIB_DIR, '../openassistant/packages/utils/src');
    resolveAlias['@kepler.gl/ai-assistant'] = joinPath(SRC_DIR, 'ai-assistant/src');
  }

  // resolve deck.gl from local dir
  if (useLocalDeck || useRepoDeck) {
    // Load deck.gl from root node_modules
    // if env.deck_src Load deck.gl from deck.gl/modules/main/src folder parallel to kepler.gl
    resolveAlias['deck.gl'] = useLocalDeck
      ? `${NODE_MODULES_DIR}/deck.gl/src`
      : `${EXTERNAL_DECK_SRC}/modules/main/src`;

    // if env.deck Load @deck.gl modules from root node_modules/@deck.gl
    // if env.deck_src Load @deck.gl modules from  deck.gl/modules folder parallel to kepler.gl
    externals['deck.gl'].forEach(mdl => {
      resolveAlias[`@deck.gl/${mdl}`] = useLocalDeck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/src`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src`;
      // types are stored in different directory
      resolveAlias[`@deck.gl/${mdl}/typed`] = useLocalDeck
        ? `${NODE_MODULES_DIR}/@deck.gl/${mdl}/typed`
        : `${EXTERNAL_DECK_SRC}/modules/${mdl}/src/types`;
    });

    ['luma.gl', 'probe.gl', 'loaders.gl'].forEach(name => {
      // if env.deck Load ${name} from root node_modules
      // if env.deck_src Load ${name} from deck.gl/node_modules folder parallel to kepler.gl
      resolveAlias[name] = useLocalDeck
        ? `${NODE_MODULES_DIR}/${name}/src`
        : name === 'probe.gl'
        ? `${EXTERNAL_DECK_SRC}/node_modules/${name}/src`
        : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/core/src`;

      // if env.deck Load @${name} modules from root node_modules/@${name}
      // if env.deck_src Load @${name} modules from deck.gl/node_modules/@${name} folder parallel to kepler.gl`
      externals[name].forEach(mdl => {
        resolveAlias[`@${name}/${mdl}`] = useLocalDeck
          ? `${NODE_MODULES_DIR}/@${name}/${mdl}/src`
          : `${EXTERNAL_DECK_SRC}/node_modules/@${name}/${mdl}/src`;
      });
    });
  }

  if (args.includes('--env.loaders_src')) {
    externals['loaders.gl'].forEach(mdl => {
      resolveAlias[`@loaders.gl/${mdl}`] = `${EXTERNAL_LOADERS_SRC}/modules/${mdl}/src`;
    });
  }

  if (args.includes('--env.hubble_src')) {
    externals['hubble.gl'].forEach(mdl => {
      resolveAlias[`@hubble.gl/${mdl}`] = `${EXTERNAL_HUBBLE_SRC}/modules/${mdl}/src`;
    });
  }

  return resolveAlias;
}

function openURL(url) {
  // Could potentially be replaced by https://www.npmjs.com/package/open, it was throwing an error when tried last
  const cmd = {
    darwin: ['open'],
    linux: ['xdg-open'],
    win32: ['cmd', '/c', 'start']
  };
  const command = cmd[process.platform];
  if (command) {
    spawn(command[0], [...command.slice(1), url]);
  }
}

(async () => {
  // local dev

  const modules = ['@deck.gl', '@loaders.gl', '@luma.gl', '@probe.gl', '@hubble.gl'];
  const loadAllDirs = modules.map(
    dir =>
      new Promise(success => {
        fs.readdir(joinPath(NODE_MODULES_DIR, dir), (err, items) => {
          if (err) {
            const colorRed = '\x1b[31m';
            const colorReset = '\x1b[0m';
            console.log(
              `${colorRed}%s${colorReset}`,
              `Cannot find ${dir} in node_modules, make sure it is installed. ${err}`
            );

            success(null);
          }
          success(items);
        });
      })
  );

  const externals = await Promise.all(loadAllDirs).then(results => ({
    'deck.gl': results[0],
    'loaders.gl': results[1],
    'luma.gl': results[2],
    'probe.gl': results[3],
    'hubble.gl': results[4]
  }));

  const localAliases = addAliases(externals, args);

  if (args.includes('--build')) {
    await esbuild
      .build({
        ...config,
        minify: true,
        sourcemap: false,
        // Add alias resolution for build
        alias: {
          ...getThirdPartyLibraryAliases(true)
        },
        // Add these production optimizations
        define: {
          ...config.define,
          'process.env.NODE_ENV': '"production"'
        },
        drop: ['console', 'debugger'],
        treeShaking: true,
        metafile: true,
        // Optionally generate a bundle analysis
        plugins: [
          ...config.plugins,
          {
            name: 'bundle-analyzer',
            setup(build) {
              build.onEnd(result => {
                if (result.metafile) {
                  // Write bundle analysis to disk
                  fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
                }
              });
            }
          }
        ]
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      })
      .then(() => {
        checkEnvVariables();
      });
  }

  if (args.includes('--start')) {
    await esbuild
      .context({
        ...config,
        minify: false,
        sourcemap: true,
        // add alias to resolve libraries so there is only one copy of them
        ...(process.env.NODE_ENV === 'local'
          ? {alias: localAliases}
          : {alias: getThirdPartyLibraryAliases(false)}),
        banner: {
          js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`
        }
      })
      .then(async ctx => {
        checkEnvVariables();

        await ctx.watch();
        await ctx.serve({
          servedir: 'dist',
          port,
          fallback: 'dist/index.html',
          onRequest: ({remoteAddress, method, path, status, timeInMS}) => {
            console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
          }
        });
        console.info(
          `kepler.gl demo app running at ${`http://localhost:${port}`}, press Ctrl+C to stop`
        );
        openURL(`http://localhost:${port}`);
      })
      .catch(e => {
        console.error(e);
        process.exit(1);
      });
  }
})();
