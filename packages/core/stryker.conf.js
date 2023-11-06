const config = {
  packageManager: 'npm',
  mutate: ['./packages/core/src/**/*.ts', '!./packages/core/src/**/*spec.ts', '!./packages/core/src/lib/consts.ts'],
  thresholds: { high: 80, low: 60, break: 100 },
  // ignoreStatic: true,
  incremental: true,
  testRunner: 'jest',
  htmlReporter: { fileName: 'reports/mutation/core/mutation.html' },
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
