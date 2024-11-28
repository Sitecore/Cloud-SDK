import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep(
  'the form parameters are: {string},{string},{string}',
  (formId: string, interactionType: string, componentInstanceId: string) => {
    cy.get('[data-testid="formIdInput"]').clear();
    cy.get('[data-testid="interactionTypeInput"]').clear();
    cy.get('[data-testid="componentInstanceIdInput"]').clear();
    cy.get('[data-testid="formIdInput"]').type(formId, {
      parseSpecialCharSequences: false
    });
    cy.get('[data-testid="interactionTypeInput"]').type(interactionType, {
      parseSpecialCharSequences: false
    });
    cy.get('[data-testid="componentInstanceIdInput"]').type(componentInstanceId, {
      parseSpecialCharSequences: false
    });
  }
);
