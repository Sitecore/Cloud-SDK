/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the cookie is automatically set with the correct bid value for the user', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 100
  });
});

defineStep('the {string} domain cookie is not created', () => {
  //Cypress checks for cookies faster than cookies need to be created, to avoid false positives, we add cy.wait
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookies().should('have.length', 0);
});
