// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function clientDebugLog_S() {
  defineStep(
    'client: debug log is printed out in the console with message including {string}',
    (logMessage: string) => {
      cy.getLogOutput().then((logs: string[]) => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);
        expect(logs.join('')).to.contain(logMessage);
      });
    }
  );
}
