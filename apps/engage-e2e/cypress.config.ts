import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

const mochawesome = '../../node_modules/mochawesome';
const cypressJsonConfig = {
  defaultCommandTimeout: 10000,
  experimentalWebKitSupport: true,
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  videosFolder: '../engage-e2e/cypress/results/videos',
  screenshotsFolder: '../engage-e2e/cypress/results/screenshots/',
  screenshotOnRunFailure: true,
  chromeWebSecurity: true,
  reporter: mochawesome,
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
  retries: {
    runMode: 2,
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
        plugins: [createEsbuildPlugin(config)],
      })
    );

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
  },
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
  },
});
