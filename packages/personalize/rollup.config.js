// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
/* eslint-disable sort-keys */
const ts = require('rollup-plugin-ts');
const json = require('@rollup/plugin-json');
const dynamicImportVars = require('@rollup/plugin-dynamic-import-vars');
module.exports = (config) => {
  return {
    ...config,
    preserveEntrySignatures: 'strict',
    input: 'packages/personalize/src/index.ts',
    output: [
      {
        dir: 'dist/packages/personalize/cjs',
        esModule: true,
        format: 'cjs',
        generatedCode: {
          preset: 'es2015',
          reservedNamesAsProps: false,
        },
        preserveModules: true,
        entryFileNames: '[name].cjs',
      },
      {
        dir: 'dist/packages/personalize/esm',
        esModule: true,
        format: 'es',
        generatedCode: {
          preset: 'es2015',
          reservedNamesAsProps: false,
        },
        interop: 'esModule',
        entryFileNames: '[name].mjs',
        preserveModules: true,
      },
    ],
    plugins: [
      json(),
      ts({
        tsconfig: 'packages/personalize/tsconfig.lib.json',
      }),
      dynamicImportVars(),
    ],
  };
};
