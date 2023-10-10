/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { defineStep, When } from '@badeball/cypress-cucumber-preprocessor';

When('the user fills the identity form', (datatable: any) => {
  const requestAttr = datatable.hashes()[0];
  Object.keys(requestAttr).forEach(function (key) {
    if (key == 'country' || key == 'gender') {
      cy.get(`[data-testid=${key}]`).select(requestAttr[key]);
    } else {
      if (requestAttr[key] !== '') {
        cy.get(`[data-testid=${key}]`).type(requestAttr[key]);
      }
    }
  });
});

// Scenario Outline: User fills form with invalid date data and triggers identity event
When('the user inputs an invalid date format in {string} of identity form', (field: string) => {
  cy.get(`[data-testid="${field}"]`).type('2022-01-01');
});

When('the user inputs an invalid email to identity form', () => {
  cy.get('[data-testid="identity-form"]').invoke('attr', 'novalidate', 'true');
  cy.get('[data-testid="email"]').type('@invalid_mail.com');
});

defineStep('the {string} email is sent as the identifier', (email: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('request.json').then((request: any) => {
    expect(request.body.identifiers[0].provider).to.eq('email');
    expect(request.body.identifiers[0].id).to.eq(email);
  });
});
