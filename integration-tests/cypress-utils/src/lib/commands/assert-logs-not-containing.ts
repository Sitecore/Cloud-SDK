// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertLogsNotContaining: typeof assertLogsNotContainingImplementation;
    }
  }
}

function assertLogsNotContainingImplementation(testID: string, log: string) {
  cy.waitUntil(
    () =>
      cy.readLocal('logsData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents).to.have.property(testID);
        expect(fileContents[testID]).to.not.contain(log);
      }),
    {
      errorMsg: 'Log not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertLogsNotContaining() {
  const COMMAND_NAME = 'assertLogsNotContaining';

  Cypress.Commands.add(COMMAND_NAME, assertLogsNotContainingImplementation);
}
