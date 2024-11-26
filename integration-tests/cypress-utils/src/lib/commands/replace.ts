// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      replace: typeof replaceImplementation;
    }
  }
}

function replaceImplementation(filePath: string, regexMatch: any, text: string) {
  return cy.readFile(filePath).then((data) => {
    const pageData = data;
    cy.writeFile(filePath, pageData.replace(regexMatch, text));
  });
}

export function replace() {
  const COMMAND_NAME = 'replace';

  Cypress.Commands.add(COMMAND_NAME, replaceImplementation);
}
