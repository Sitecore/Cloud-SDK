// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

export function apiRequestError_S_S_S() {
  defineStep(
    'the request to api {string} with testID {string} will respond with the error {string}',
    (path: string, testID: string, errorCode: string) => {
      cy.waitUntil(() =>
        cy
          .request({ failOnStatusCode: false, url: `${Cypress.config('baseUrl')}/api${path}?testID=${testID}` })
          .then((response) => {
            expect(response.body.error).to.contain(errorCode);
          })
      );
    }
  );
}
