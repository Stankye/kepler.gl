// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { resolve } from 'path';
var keplerPackages = [
    'actions',
    'ai-assistant',
    'cloud-providers',
    'common-utils',
    'components',
    'constants',
    'deckgl-arrow-layers',
    'deckgl-layers',
    'duckdb',
    'effects',
    'layers',
    'localization',
    'processors',
    'reducers',
    'schemas',
    'styles',
    'table',
    'tasks',
    'types',
    'utils'
];
var keplerAliases = {};
keplerPackages.forEach(function (pkg) {
    keplerAliases["@kepler.gl/".concat(pkg)] = resolve(__dirname, "../../src/".concat(pkg, "/src"));
});
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [wasm(), react()],
    server: {
        port: 8082,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        },
        target: 'esnext',
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.MapboxAccessToken': JSON.stringify(process.env.MapboxAccessToken || ''),
        'process.env.DropboxClientId': JSON.stringify(process.env.DropboxClientId || ''),
        'process.env.MapboxExportToken': JSON.stringify(process.env.MapboxExportToken || ''),
        'process.env.CartoClientId': JSON.stringify(process.env.CartoClientId || ''),
        'process.env.FoursquareClientId': JSON.stringify(process.env.FoursquareClientId || ''),
        'process.env.FoursquareDomain': JSON.stringify(process.env.FoursquareDomain || ''),
        'process.env.FoursquareAPIURL': JSON.stringify(process.env.FoursquareAPIURL || ''),
        'process.env.FoursquareUserMapsURL': JSON.stringify(process.env.FoursquareUserMapsURL || ''),
        'process.env.OpenAIToken': JSON.stringify(process.env.OpenAIToken || ''),
        'process.env.NODE_DEBUG': JSON.stringify(false)
    },
    resolve: {
        dedupe: ['styled-components'],
        alias: __assign(__assign({ '@': resolve(__dirname, './src') }, keplerAliases), { react: resolve(__dirname, '../../node_modules/react'), 'react-dom': resolve(__dirname, '../../node_modules/react-dom'), 'react-redux': resolve(__dirname, '../../node_modules/react-redux'), redux: resolve(__dirname, '../../node_modules/redux'), 'styled-components': resolve(__dirname, '../../node_modules/styled-components') })
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext'
        }
    }
});
