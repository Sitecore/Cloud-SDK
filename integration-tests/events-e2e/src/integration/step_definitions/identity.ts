import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the identity parameters are: {string}', (params: string) => {
  cy.get('[data-testid="identityDataInput"]').clear();
  cy.get('[data-testid="identityDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('the identity parameters are:', (params: string) => {
  cy.get('[data-testid="identityDataInput"]').clear();
  cy.get('[data-testid="identityDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});
