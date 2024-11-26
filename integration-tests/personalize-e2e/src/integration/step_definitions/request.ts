/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { defineStep, Then } from '@badeball/cypress-cucumber-preprocessor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;
beforeEach(() => {
  statusCode = 0;
  cy.intercept('GET', `http://localhost:4400/api/personalize*`).as('personalizeRequestFromApi');
  // eslint-disable-next-line max-len
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/personalize*`).as(
    'personalizeRequest'
  );
});

defineStep('personalize parameters are:', (params: string) => {
  const parameters = JSON.parse(params);
  if (parameters.friendlyId) cy.get('[data-testid="friendlyId"]').clear().type(parameters.friendlyId);
  if (parameters.email) cy.get('[data-testid="email"]').clear().type(parameters.email);
  if (parameters.identifier) cy.get('[data-testid="identifier"]').clear().type(parameters.identifier);
  if (parameters.pageVariantIds)
    cy.get('[data-testid="pageVariantIds"]')
      .clear()
      .type(JSON.stringify({ pageVariantIds: parameters.pageVariantIds }), { parseSpecialCharSequences: false });
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
      expect(request.body.params).to.deep.equal(params);
    }
    if (parameters.variants) {
      const { variants } = parameters;
      if (variants === 'undefined') expect(request.body.variants).to.undefined;
      else expect(request.body.variants).to.deep.equal(variants);
    }
  });
});

Then('the api server personalize request responds with status code {string}', (expectedStatus: string) => {
  cy.wait('@personalizeRequestFromApi').then(({ response }) => {
    expect(response?.statusCode.toString()).to.equal(expectedStatus);
  });
});

Then('we display {string} User Agent to UI', (userAgent: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);
  cy.get("[data-testid='response']", { timeout: 6000 }).then((el) => {
    expect(el.val()).to.contain(userAgent);
  });
});

Then("we display the callflow's content to UI:", (personalizeContent: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);

  cy.get("[data-testid='response']", { timeout: 6000 }).then((el) => {
    console.log(el.val());
    const parsedTextInput = JSON.stringify(JSON.parse(el.val() as string));
    const parsedExpectedString = JSON.stringify(JSON.parse(personalizeContent));

    expect(parsedTextInput).to.contain(parsedExpectedString);
  });

  // cy.get("[data-testid='response']").should('have.value', personalizeContent.trim(), { timeout: 6000 });
});

Then('we display the request payload UI:', (expectedString: string) => {
  cy.get("[data-testid='requestPayload']", { timeout: 6000 }).then((el) => {
    const parsedTextInput = JSON.stringify(JSON.parse(el.val() as string));
    const parsedExpectedString = JSON.stringify(JSON.parse(expectedString));

    expect(parsedTextInput).to.equal(parsedExpectedString);
  });
});

Then("we display the callflow's request params to UI containing:", (personalizeContent: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);

  cy.get("[data-testid='response']", { timeout: 6000 }).then((el) => {
    const parsedTextInput = JSON.stringify(JSON.parse(el.val() as string));
    const parsedExpectedString = JSON.stringify(JSON.parse(personalizeContent));

    expect(parsedTextInput).to.contain(parsedExpectedString);
  });
});
Then("we display the callflow's request params to UI containing the string:", (personalizeContent: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);

  cy.get("[data-testid='response']", { timeout: 6000 }).then((el) => {
    const textInputContent = el.val();
    const parsedExpectedString = JSON.stringify(JSON.parse(personalizeContent));

    expect(textInputContent).to.contain(parsedExpectedString);
  });
});

defineStep('Personalize API responds with {string} status code', (expectedStatus: string) => {
  cy.wait('@personalizeRequest').then(({ response }) => {
    expect(response?.statusCode).to.equal(+expectedStatus);
  });
});

defineStep('a personalize request is sent with no geolocation data', () => {
  cy.wait('@personalizeRequest').then(({ request }) => {
    expect(request.body.params).to.not.exist;
  });
});

Then('the {string} request contains headers', (targetRequest: string, params: any) => {
  cy.waitForRequest(targetRequest).then((request: any) => {
    const expectedReqHeaders = params.hashes();

    cy.assertRequestHeaders(request, expectedReqHeaders);
  });
});
