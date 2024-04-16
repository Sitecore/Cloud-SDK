/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('the getBrowserId function returns an empty string', () => {
  const expected = '';
  cy.get('[data-testid="browserIdLabel"]').should('have.value', expected);
});

// Scenario: user retrieves browser id using the corresponding method from the window and a cookie exists on the browser
Then('the getBrowserId function returns the browser id', () => {
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 100
  });
  cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => {
    const expectedCookieValue = cookie?.value ?? '';
    cy.get('[data-testid="browserIdLabel"]').contains(expectedCookieValue);
  });
});
