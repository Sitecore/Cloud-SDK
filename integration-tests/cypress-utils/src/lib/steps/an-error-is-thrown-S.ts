// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/* eslint-disable cypress/unsafe-to-chain-command */
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function anErrorIsThrown_S() {
  defineStep('an error is thrown: {string}', (expectedError: string) => {
    cy.waitUntil(() => (globalThis as any).errorMessage !== '', {
      errorMsg: 'Error not found',
      interval: 200,
      timeout: 10000
    });
    expect((globalThis as any).errorMessage).to.include(expectedError);
  });
}
