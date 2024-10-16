/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';
import type { CyHttpMessages } from 'cypress/types/net-stubbing';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let searchResponse: CyHttpMessages.IncomingResponse | undefined;

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('the widget data request is sent with filters:', (params: string) => {
  const parameters = JSON.parse(params);
  const typesLength = parameters.items.types.length;

  cy.wait('@searchRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) {
      searchResponse = response;
      statusCode = response.statusCode;
    }

    for (let index = 0; index < typesLength; index++) {
      const paramsTypesArray = parameters.items.types;
      const reqTypesArray = request.body.widget.items[0].search.facet.types;

      expect(reqTypesArray).to.deep.equal(paramsTypesArray);
    }
  });
});
