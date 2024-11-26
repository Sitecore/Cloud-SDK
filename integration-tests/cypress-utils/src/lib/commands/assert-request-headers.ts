// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertRequestHeaders: typeof assertRequestHeadersImplementation;
    }
  }
}

function assertRequestHeadersImplementation(request: any, expectedReqHeaders: any) {
  for (const entry of expectedReqHeaders) expect(request.headers[entry.name]).to.contain(entry.value);
}

export function assertRequestHeaders() {
  const COMMAND_NAME = 'assertRequestHeaders';

  Cypress.Commands.add(COMMAND_NAME, assertRequestHeadersImplementation);
}
