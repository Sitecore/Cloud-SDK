// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertRequestBodyNotContaining: typeof assertRequestBodyNotContainingImplementation;
    }
  }
}

function assertRequestBodyNotContainingImplementation(testID: string, bodyAttributeName: string) {
  return cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        const body = JSON.parse(fileContents[testID].body);

        expect(body[bodyAttributeName]).to.be.undefined;
      }),
    {
      errorMsg: 'Request body not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertRequestBodyNotContaining() {
  const COMMAND_NAME = 'assertRequestBodyNotContaining';

  Cypress.Commands.add(COMMAND_NAME, assertRequestBodyNotContainingImplementation);
}
