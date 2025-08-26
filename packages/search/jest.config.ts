/* eslint-disable */
import type { Config } from 'jest';
import { join, resolve } from 'path';

const config: Config = {
  displayName: 'search',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'search', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../coverage/packages/search',
  moduleNameMapper: {
    '@sitecore-cloudsdk/events/browser': join(resolve(), 'packages', 'events', 'src', 'browser.js'),
    '@sitecore-cloudsdk/events/server': join(resolve(), 'packages', 'events', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/browser': join(resolve(), 'packages', 'core', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/server': join(resolve(), 'packages', 'core', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/internal': join(resolve(), 'packages', 'core', 'src', 'internal.js')
  }
};
export default config;
