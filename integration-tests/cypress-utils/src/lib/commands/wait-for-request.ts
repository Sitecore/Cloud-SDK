// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      waitForRequest: typeof waitForRequestImplementation;
    }
  }
}

function waitForRequestImplementation(alias: string) {
  cy.wait(alias);
  return cy.get(`${alias}.all`).then((aliasList) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastEventRequest: any = aliasList[aliasList.length - 1];
    return cy.wrap(lastEventRequest.request);
  });
}

export function waitForRequest() {
  const COMMAND_NAME = 'waitForRequest';

  Cypress.Commands.add(COMMAND_NAME, waitForRequestImplementation);
}
