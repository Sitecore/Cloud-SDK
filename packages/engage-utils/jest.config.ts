/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from 'jest';
import { resolve, join } from 'path';

const config: Config = {
  displayName: 'engage-utils',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'engage-utils', 'tsconfig.spec.json') }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageReporters: ['json', 'lcov', ['text', { skipFull: true }]],
  coverageDirectory: '../../coverage/packages/engage-utils',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
};
export default config;
