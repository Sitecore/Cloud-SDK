// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
/* eslint-disable sort-keys */
const ts = require('rollup-plugin-ts');
const json = require('@rollup/plugin-json');

module.exports = (config) => {
  return {
    ...config,
    preserveEntrySignatures: 'strict',
    input: 'packages/events/src/index.ts',
    output: [
      {
        dir: 'dist/packages/events/cjs',
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
        dir: 'dist/packages/events/esm',
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
        tsconfig: 'packages/events/tsconfig.lib.json',
      }),
    ],
  };
};
