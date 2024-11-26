// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertRequestBodyValue: typeof assertRequestBodyValueImplementation;
    }
  }
}

function assertRequestBodyValueImplementation(testID: string, bodyAttribute: string) {
  return cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents[testID].body).to.contain(bodyAttribute);
      }),
    {
      errorMsg: 'Request body not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertRequestBodyValue() {
  const COMMAND_NAME = 'assertRequestBodyValue';

  Cypress.Commands.add(COMMAND_NAME, assertRequestBodyValueImplementation);
}
