/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;
beforeEach(() => {
  statusCode = 0;
  cy.intercept('GET', `http://localhost:4200/api/personalize*`).as('personalizeRequestFromApi');
  // eslint-disable-next-line max-len
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/personalize/${Cypress.env(
      'CALLFLOW_API_VERSION'
    )}/callFlows*`
  ).as('personalizeRequest');
});

defineStep('personalize parameters are:', (params: string) => {
  const parameters = JSON.parse(params);
  if (parameters.friendlyId) cy.get('[data-testid="friendlyId"]').clear().type(parameters.friendlyId);
  if (parameters.email) cy.get('[data-testid="email"]').clear().type(parameters.email);
  if (parameters.identifier) cy.get('[data-testid="identifier"]').clear().type(parameters.identifier);
  if (parameters.params)
    cy.get('[data-testid="params"]')
      .clear()
      .type(JSON.stringify(parameters.params), { parseSpecialCharSequences: false });
  if (parameters.timeout) cy.get('[data-testid="timeout"]').clear().type(parameters.timeout);
});

defineStep('a personalize request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);
  cy.wait('@personalizeRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) statusCode = response.statusCode;
    if (parameters.friendlyId) expect(request.body.friendlyId).to.equal(parameters.friendlyId);
    if (parameters.email) cy.get('[data-testid="email"]').clear().type(parameters.email);
    if (parameters.identifier) {
      expect(request.body.identifiers.id).to.equal(parameters.identifier);
      expect(request.body.identifiers.provider).to.equal('email');
    }
    if (parameters.params) {
      const params = parameters.params;
      Object.keys(params).forEach((value) => {
        expect(request.body.params[value]).to.equal(params[value]);
      });
    }
  });
});

Then('the api server personalize request responds with status code {string}', (expectedStatus: string) => {
  cy.wait('@personalizeRequestFromApi').then(({ response }) => {
    expect(response?.statusCode.toString()).to.equal(expectedStatus);
  });
});

Then("we display the callflow's content to UI:", (personalizeContent: string) => {
  cy.get("[data-testid='response']").should('have.value', personalizeContent.trim(), { timeout: 6000 });
});

defineStep('Personalize API responds with {string} status code', (expectedStatus: string) => {
  cy.wait('@personalizeRequest').then(({ response }) => {
    expect(response?.statusCode).to.equal(+expectedStatus);
  });
});
