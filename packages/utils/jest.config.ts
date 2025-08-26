/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from 'jest';
import { join, resolve } from 'path';

const config: Config = {
  displayName: 'utils',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'utils', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../coverage/packages/utils',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 100,
      statements: 100
    }
  }
};
export default config;
