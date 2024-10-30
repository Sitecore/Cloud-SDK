// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      readLocal: typeof readLocalImplementation;
    }
  }
}

function readLocalImplementation(fileName: string) {
  return cy.readFile(`src/fixtures/local/${fileName}`);
}

export function readLocal() {
  const COMMAND_NAME = 'readLocal';

  Cypress.Commands.add(COMMAND_NAME, readLocalImplementation);
}
