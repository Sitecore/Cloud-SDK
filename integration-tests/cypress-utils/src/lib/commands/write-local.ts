// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      writeLocal: typeof writeLocalImplementation;
    }
  }
}

function writeLocalImplementation(fileName: string, content: Cypress.FileContents) {
  return cy.writeFile(`src/fixtures/local/${fileName}`, content);
}

export function writeLocal() {
  const COMMAND_NAME = 'writeLocal';

  Cypress.Commands.add(COMMAND_NAME, writeLocalImplementation);
}
