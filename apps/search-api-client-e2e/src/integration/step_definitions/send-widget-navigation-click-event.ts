import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;

beforeEach(() => {
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'EVENTS_API_VERSION'
    )}/events*`
  ).as('eventRequest');
});

defineStep('the event request parameters for WidgetNavigationClickEvent are:', (params: string) => {
  cy.get('[data-testid="sendWidgetNavigationClickEventInputData"]').clear();
  cy.get('[data-testid="sendWidgetNavigationClickEventInputData"]').type(params, {
    parseSpecialCharSequences: false
  });
});
