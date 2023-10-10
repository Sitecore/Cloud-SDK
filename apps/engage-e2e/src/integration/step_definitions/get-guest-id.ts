/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('the engage.getGuestId called', () => {
  cy.get('[data-testid="getGuestId"]').click();
});

Then('customer.ref GUID is returned', () => {
  cy.get("[data-testid='getGuestIdResponse']").should('not.contain.text', 'Invalid', { timeout: 6000 });
});
