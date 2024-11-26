// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      assertLogs: typeof assertLogsImplementation;
    }
  }
}

function assertLogsImplementation(testID: string, log: string) {
  return cy.waitUntil(
    () =>
      cy.readLocal('logsData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents).to.have.property(testID);
        expect(fileContents[testID]).to.contain(log);
      }),
    {
      errorMsg: 'Error not found',
      interval: 100,
      timeout: 15000
    }
  );
}

export function assertLogs() {
  const COMMAND_NAME = 'assertLogs';

  Cypress.Commands.add(COMMAND_NAME, assertLogsImplementation);
}
