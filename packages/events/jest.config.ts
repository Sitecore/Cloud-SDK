/* eslint-disable */
// Importing @jest/types allows us to have intellisense over InitialOptions of Jest
import type { Config } from 'jest';
import { join, resolve } from 'path';

const config: Config = {
  displayName: 'events',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'events', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../coverage/packages/events',
  coveragePathIgnorePatterns: ['./src/lib/events/index.ts'],
  moduleNameMapper: {
    '@sitecore-cloudsdk/core/browser': join(resolve(), 'packages', 'core', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/server': join(resolve(), 'packages', 'core', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/internal': join(resolve(), 'packages', 'core', 'src', 'internal.js')
  }
};
export default config;
