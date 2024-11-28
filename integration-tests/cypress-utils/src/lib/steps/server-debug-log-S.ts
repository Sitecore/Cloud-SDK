// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function serverDebugLog_S_S() {
  defineStep(
    'server: debug log is printed out in the console with message including {string} from testID {string}',
    (log: string, testID: string) => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      cy.assertLogs(testID, log);
    }
  );
}
