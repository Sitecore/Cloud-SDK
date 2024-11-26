import { loadCommands } from '@sitecore-cloudsdk/cypress-utils';

/* eslint-disable @nx/enforce-module-boundaries */
export {};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visit(url: string, options: string): void;
    }
  }

  interface JQuery {
    args: [];
  }
}

loadCommands(['getLogOutput', 'readLocal', 'writeLocal', 'assertRequestBodyValue', 'assertLogs', 'replace']);

//Overwrites cy.visit to check if the current baseurl belongs to cdn app in order to add the respective .html extension
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url, options);
  //Overwriting cy.visit behaves faster than the original function so a cy.wait is necessary
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(600);
});
