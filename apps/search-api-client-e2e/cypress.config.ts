import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

const mochawesome = '../../node_modules/mochawesome';
const cypressJsonConfig = {
  defaultCommandTimeout: 10000,
  modifyObstructiveCode: false,
  experimentalWebKitSupport: true,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../search-api-client-e2e/cypress/results/videos',
  screenshotsFolder: '../search-api-client-e2e/cypress/results/screenshots/',
  screenshotOnRunFailure: true,
  chromeWebSecurity: true,
  reporter: mochawesome,
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true
  },
  retries: {
    runMode: 2
  },
  specPattern: '**/*.{feature,features}',
  supportFile: 'src/support/e2e.ts',
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
  }
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig
  }
});
