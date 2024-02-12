import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('debug log is printed out in the console with message including {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.contain(logMessage);
  });
});

Then('debug log is not printed out in the console with message including {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.not.contain(logMessage);
  });
});
