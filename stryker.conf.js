const config = {
  packageManager: 'npm',
  mutate: ['./packages/hello/src/lib/hello.ts'],
  thresholds: { high: 80, low: 60, break: null },
  testRunner: 'jest',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
  jest: {
    config: {
      displayName: 'test',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      preset: './jest.preset.js',
      transform: {
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
        '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
      },
    },
  },
  logLevel: 'info',
  mutator: 'typescript',
  allowConsoleColors: true,
};

module.exports = config;
