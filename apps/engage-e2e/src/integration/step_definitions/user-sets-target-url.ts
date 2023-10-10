/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let urlParam: string;
let errorMessage: string;
beforeEach(() => {
  errorMessage = '';
});

// Scenario: user initializes library with a valid targetURL using http protocol
Given('that the user uses a valid targetUrl that includes {string} protocol', (protocol) => {
  urlParam = `${protocol}://${Cypress.env('HOSTNAME')}`;
  const url = new URL(urlParam);
  expect(url.origin).to.equal(urlParam);
});

When('the user visits the application with the url param', () => {
  cy.on('uncaught:exception', (error) => {
    errorMessage = error.message;
    return false;
  });
  cy.visit(`/?targetURL=${urlParam}`, { failOnStatusCode: false });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('body')
    .should('be.visible')
    .then(() => cy.writeLocal(`error.txt`, errorMessage));
});

Then('no error is thrown', () => {
  expect(errorMessage).to.eq('');
});

// Scenario: user initializes library with an invalid targetURL setting

Given('that the user uses an invalid targetUrl setting', () => {
  urlParam = Cypress.env('HOSTNAME');
});
