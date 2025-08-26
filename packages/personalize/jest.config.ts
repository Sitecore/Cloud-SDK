/* eslint-disable */
import type { Config } from '@jest/types';
import { join, resolve } from 'path';

const config: Config.InitialOptions = {
  displayName: 'personalize',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: join(resolve(), 'packages', 'personalize', 'tsconfig.spec.json') }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'jsdom',
  coverageDirectory: '../../coverage/packages/personalize',
  testPathIgnorePatterns: ['web-personalization.spec.ts'],
  moduleNameMapper: {
    '@sitecore-cloudsdk/events/browser': join(resolve(), 'packages', 'events', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/browser': join(resolve(), 'packages', 'core', 'src', 'browser.js'),
    '@sitecore-cloudsdk/core/server': join(resolve(), 'packages', 'core', 'src', 'server.js'),
    '@sitecore-cloudsdk/core/internal': join(resolve(), 'packages', 'core', 'src', 'internal.js')
  }
};
export default config;
