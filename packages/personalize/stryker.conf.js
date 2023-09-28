const config = {
  packageManager: 'npm',
  mutate: ['./packages/personalize/src/**/*.ts', '!./packages/personalize/src/**/*spec.ts'],
  thresholds: { high: 80, low: 60, break: 100 },
  incremental: true,
  testRunner: 'jest',
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
