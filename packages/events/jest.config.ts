/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from 'jest';
import { resolve, join } from 'path';

const config: Config = {
  displayName: 'events',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'events', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageReporters: ['html-spa', ['text', { skipFull: true }]],
  coverageDirectory: '../../coverage/packages/events',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10
    }
  },
  coveragePathIgnorePatterns: ['./src/lib/events/index.ts'],
  moduleNameMapper: {
    '@sitecore-cloudsdk/core/browser': join(resolve(), 'packages', 'core', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/server': join(resolve(), 'packages', 'core', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/internal': join(resolve(), 'packages', 'core', 'src', 'internal.js')
  }
};
export default config;
