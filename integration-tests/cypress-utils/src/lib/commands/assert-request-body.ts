// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertRequestBody: typeof assertRequestBodyImplementation;
    }
  }
}

function assertRequestBodyImplementation(testID: string, bodyAttributeName: string) {
  return cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        const body = JSON.parse(fileContents[testID].body);

        expect(body).to.have.property(bodyAttributeName);
      }),
    {
      errorMsg: 'Request body not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertRequestBody() {
  const COMMAND_NAME = 'assertRequestBody';

  Cypress.Commands.add(COMMAND_NAME, assertRequestBodyImplementation);
}
