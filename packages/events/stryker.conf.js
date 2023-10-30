const config = {
  packageManager: 'npm',
  mutate: [
    './packages/events/src/**/*.ts',
    '!./packages/events/src/**/*spec.ts',
    '!./packages/events/src/lib/events/consts.ts',
    '!./packages/events/src/lib/consts.ts',
  ],
  thresholds: { high: 80, low: 60, break: 100 },
  incremental: false,
  testRunner: 'jest',
  htmlReporter: { fileName: 'reports/mutation/events/mutation.html' },
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
