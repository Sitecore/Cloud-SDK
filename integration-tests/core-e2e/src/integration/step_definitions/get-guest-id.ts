import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('the getGuestId function returns the guest id', () => {
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  }).then(() => {
    cy.getCookie(Cypress.env('COOKIE_NAME')).then(() => {
      cy.get("[data-testid='getGuestIdResponse']").should('not.contain.text', 'Invalid', { timeout: 6000 });
    });
  });
});
