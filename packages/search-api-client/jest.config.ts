/* eslint-disable */
import type { Config } from 'jest';
import { resolve, join } from 'path';

const config: Config = {
  displayName: 'search-api-client',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'search-api-client', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageReporters: ['html-spa', ['text', { skipFull: true }]],
  coverageDirectory: '../../coverage/packages/search-api-client',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10
    }
  },
  moduleNameMapper: {
    '@sitecore-cloudsdk/events/browser': join(resolve(), 'packages', 'events', 'src', 'browser.js'),
    '@sitecore-cloudsdk/events/server': join(resolve(), 'packages', 'events', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/browser': join(resolve(), 'packages', 'core', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/server': join(resolve(), 'packages', 'core', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/internal': join(resolve(), 'packages', 'core', 'src', 'internal.js')
  }
};
export default config;
