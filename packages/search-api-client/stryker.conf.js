const config = {
  $schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
  _comment: 'Comments can be put inside `xxx_comment` properties.',
  packageManager: 'npm',
  mutate: ['./packages/search-api-client/src/**/*.ts', '!./packages/search-api-client/src/**/*spec.ts'],
  thresholds: { high: 80, low: 60, break: 100 },
  incremental: false,
  testRunner: 'jest',
  htmlReporter: { fileName: 'reports/mutation/search-api-client/mutation.html' },
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
  jest: {
    config: {
      displayName: 'test',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      preset: './jest.preset.js',
      transform: {
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }]
      }
    }
  },
  logLevel: 'info',
  allowConsoleColors: true
};

module.exports = config;
