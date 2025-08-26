// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageReportOptions: {
    text: {
      skipEmpty: false,
      skipFull: false
    }
  },
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/jest.config.{js,ts}',
    '!**/jest.preset.{js,ts}',
    '!**/examples/**',
    '!**/src/browser.ts',
    '!**/src/server.ts',
    '!**/src/index.ts',
    '!**/src/internal.ts',
    '!packages/*/src/browser.ts',
    '!packages/*/src/server.ts',
    '!packages/*/src/index.ts',
    '!packages/*/src/internal.ts'
  ]
};
