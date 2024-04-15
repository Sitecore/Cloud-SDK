import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the {string} page is loaded', (page: string) => {
  cy.visit(page);

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
  cy.get('body').should('be.visible');
});
