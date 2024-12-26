/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('the rules widget data request is sent with parameters', (params: string) => {
  const parameters = JSON.parse(params);
  cy.wait('@searchRequest').then(({ request }) => {
    expect(request).to.not.equal(undefined);
    parameters.items.forEach((item: unknown, i: number) => {
      const requestPayload = request.body.widget.items[i];
      expect(item).to.deep.equal(requestPayload);
    });
  });
});
