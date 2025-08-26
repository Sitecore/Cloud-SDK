/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from '@jest/types';
import { join, resolve } from 'path';

const config: Config.InitialOptions = {
  displayName: 'core',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'core', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../coverage/packages/core',
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};

export default config;
