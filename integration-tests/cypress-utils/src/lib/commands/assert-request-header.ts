// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertRequestHeader: typeof assertRequestHeaderImplementation;
    }
  }
}

function assertRequestHeaderImplementation(testID: string, headerName: string, headerValue?: string) {
  return cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents[testID].headers).to.have.property(headerName);

        if (headerValue) expect(fileContents[testID].headers[headerName]).to.contain(headerValue);
      }),
    {
      errorMsg: 'Error not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertRequestHeader() {
  const COMMAND_NAME = 'assertRequestHeader';

  Cypress.Commands.add(COMMAND_NAME, assertRequestHeaderImplementation);
}
