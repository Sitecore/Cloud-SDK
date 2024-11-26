import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('debug log is printed out in the console with message including {string}', (logMessage: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.contain(logMessage);
  });
});
