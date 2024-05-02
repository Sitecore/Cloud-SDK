/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

let statusCode: number;

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('the widget item parameters are:', (params: string) => {
  const parameters = JSON.parse(params);

  if (parameters?.items) {
    cy.get('[data-testid="widgetItemsInput"]').clear();
    cy.get('[data-testid="widgetItemsInput"]').type(params, {
      parseSpecialCharSequences: false
    });
  }
});

defineStep('the widget data request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);
  const length = parameters.items.length;
  cy.wait('@searchRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) statusCode = response.statusCode;

    for (let index = 0; index < length; index++) {
      const { rfkId, entity } = parameters.items[index];
      const { rfk_id: reqRfkId, entity: reqEntity } = request.body.widget.items[index];

      expect(reqRfkId).to.equal(rfkId);
      expect(reqEntity).to.equal(entity);
    }
  });
});

defineStep('Search REST API responds with status code {string}', (expectedStatus: string) => {
  expect(statusCode).to.equal(parseInt(expectedStatus));
});
