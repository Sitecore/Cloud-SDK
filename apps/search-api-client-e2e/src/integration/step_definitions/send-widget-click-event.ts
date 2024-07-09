import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});

  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'EVENTS_API_VERSION'
    )}/events*`
  ).as('eventRequest');
});

defineStep('the event request parameters are:', (params: string) => {
  cy.get('[data-testid="eventInputData"]').clear();
  cy.get('[data-testid="eventInputData"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('the event request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);

  cy.wait('@eventRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) statusCode = response.statusCode;
    Object.keys(parameters).forEach((value) => {
      expect(request.body[value]).to.deep.equal(parameters[value]);
    });
  });
});
