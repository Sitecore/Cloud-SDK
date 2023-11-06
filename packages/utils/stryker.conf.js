const config = {
  packageManager: 'npm',
  mutate: [
    './packages/utils/src/**/*.ts',
    '!./packages/utils/src/**/*spec.ts',
    '!./packages/utils/src/lib/fetch-with-timeout.ts',
  ],
  thresholds: { high: 80, low: 60, break: 100 },
  incremental: true,
  testRunner: 'jest',
  htmlReporter: { fileName: 'reports/mutation/utils/mutation.html' },
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
  jest: {
    config: {
      displayName: 'test',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      preset: './jest.preset.js',
      transform: {
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
      },
    },
  },
  logLevel: 'info',
  allowConsoleColors: true,
};

module.exports = config;
