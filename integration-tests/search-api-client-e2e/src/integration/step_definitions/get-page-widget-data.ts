/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';
import type { CyHttpMessages } from 'cypress/types/net-stubbing';

let statusCode: number;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let searchResponse: CyHttpMessages.IncomingResponse | undefined;

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('the page widget data request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);

  cy.wait('@searchRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) {
      searchResponse = response;
      statusCode = response.statusCode;
    }
    expect(parameters.context.page.uri).to.equal(request.body.context.page.uri);
  });
});

defineStep('Search REST API for page widget data responds with status code {string}', (expectedStatus: string) => {
  expect(statusCode).to.equal(parseInt(expectedStatus));
});

defineStep('the pathname parameter is {string}', (pathname: string) => {
  if (pathname) {
    cy.get('[data-testid="pathnameInput"]').clear();
    cy.get('[data-testid="pathnameInput"]').type(pathname, {
      parseSpecialCharSequences: false
    });
  }
});

defineStep('the context parameter is {string}', (context: string) => {
  if (context) {
    cy.get('[data-testid="contextInput"]').clear();
    cy.get('[data-testid="contextInput"]').type(context, {
      parseSpecialCharSequences: false
    });
  }
});
