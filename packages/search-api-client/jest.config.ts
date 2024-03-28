/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from '@jest/types';
import { resolve, join } from 'path';

const config: Config.InitialOptions = {
  displayName: 'search-api-client',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'search-api-client', 'tsconfig.spec.json') }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'node',
  coverageDirectory: '../../coverage/packages/core',
  coverageReporters: ['html-spa', ['text', { skipFull: true }]],
};

export default config;
