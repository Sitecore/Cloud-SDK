/* eslint-disable @nx/enforce-module-boundaries */
/// <reference types='cypress' />
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Above line needed as indicator for Cypress
import eventsPackageJson from '../../../../../packages/events/package.json';
import personalizePackageJson from '../../../../../packages/personalize/package.json';

// Scenario: user retrieves version of the library from the window object
When('user calls window.{string}.version', (libName: string) => {
  cy.get(`[data-testid="get${libName.toLowerCase()}VersionLibFromWindow"]`).click();
});

Then('the expected {string} version is returned', (libName: string) => {
  const expected = libName.toLowerCase() === 'events' ? eventsPackageJson.version : personalizePackageJson.version;
  cy.waitUntil(() => cy.get('[data-testid="versionLabel"]').contains(expected), {
    errorMsg: `${libName} version not found`,
    interval: 100,
    timeout: 20000
  });
});

// Scenario: user retrieves the version of the library by calling engage.version
When('user calls engage.version from the Events library', () => {
  cy.get('[data-testid="getVersionLibFromEngage"]').click();
});
