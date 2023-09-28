/* eslint-disable */

import type { Config } from '@jest/types';
import { resolve, join } from 'path';

const config: Config.InitialOptions = {
  displayName: 'personalize',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'personalize', 'tsconfig.spec.json') }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageReporters: ['html-spa', ['text', { skipFull: true }]],
  coverageDirectory: '../../coverage/packages/personalize',
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
