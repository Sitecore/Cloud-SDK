// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
declare global {
  namespace Cypress {
    interface Chainable {
      getLogOutput: typeof getLogOutputImplementation;
    }
  }
}

function getLogOutputImplementation() {
  const logs: string[] = [];

  // eslint-disable-next-line cypress/unsafe-to-chain-command
  return cy
    .get('@consoleLogOutput')
    .invoke('getCalls')
    .each((element) => {
      (element as any).args.forEach((arg: any) => {
        logs.push(arg);
      });
    })
    .then(() => logs);
}

export function getLogOutput() {
  const COMMAND_NAME = 'getLogOutput';

  Cypress.Commands.add(COMMAND_NAME, getLogOutputImplementation);
}
