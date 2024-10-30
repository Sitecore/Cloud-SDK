import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

const mochawesome = '../../node_modules/mochawesome';
const cypressJsonConfig = {
  chromeWebSecurity: true,
  defaultCommandTimeout: 10000,
  experimentalWebKitSupport: true,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,

  reporter: mochawesome,
  reporterOptions: {
    html: false,
    json: true,
    overwrite: false,
    reportDir: 'cypress/results'
  },
  retries: {
    runMode: 2
  },
  screenshotOnRunFailure: true,
  screenshotsFolder: '../personalize-e2e/cypress/results/screenshots/',
  async setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
  ): Promise<Cypress.PluginConfigOptions> {
    // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
    await addCucumberPreprocessorPlugin(on, config);

    on(
      'file:preprocessor',
      createBundler({
        plugins: [createEsbuildPlugin(config)]
      })
    );

    on('before:browser:launch', (browser, launchOptions) => {
      if (browser.family === 'firefox')
        launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true;

      return launchOptions;
    });

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
  },
  specPattern: '**/*.{feature,features}',
  supportFile: 'src/support/e2e.ts',
  video: false,
  videosFolder: '../personalize-e2e/cypress/results/videos'
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig
  }
});
