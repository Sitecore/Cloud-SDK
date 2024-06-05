/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import type { CyHttpMessages } from 'cypress/types/net-stubbing';
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

let statusCode: number;
let searchResponse: CyHttpMessages.IncomingResponse | undefined;

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('Search API responds with:', (params: string) => {
  if (params?.trim()) {
    const parameters = JSON.parse(params);
    const length = parameters.items.length;
    if (searchResponse)
      for (let index = 0; index < length; index++) {
        const { rfkId, entity, search: searchParam } = parameters.items[index];
        const { rfk_id: reqRfkId, entity: reqEntity, limit, offset, content } = searchResponse.body.widgets[index];

        expect(reqRfkId).to.equal(rfkId);
        expect(reqEntity).to.equal(entity);
        if (limit) expect(limit).to.deep.equal(searchParam.limit);
        if (offset) expect(offset).to.deep.equal(searchParam.offset);
        if (content) expect(content.length).to.equal(searchParam.content);
        if (content) expect(content.length).to.equal(searchParam.content);
      }
  }
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

defineStep('the context parameters are:', (params: string) => {
  const parameters = JSON.parse(params);
  if (parameters?.context) {
    cy.get('[data-testid="contextInput"]').clear();
    cy.get('[data-testid="contextInput"]').type(params, {
      parseSpecialCharSequences: false
    });
  }
});

defineStep('the widget data request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);
  const length = parameters.items.length;

  cy.wait('@searchRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) {
      searchResponse = response;
      statusCode = response.statusCode;
    }

    for (let index = 0; index < length; index++) {
      const { rfkId, entity, search: searchParam } = parameters.items[index];
      const { rfk_id: reqRfkId, entity: reqEntity, search } = request.body.widget.items[index];

      expect(reqRfkId).to.equal(rfkId);
      expect(reqEntity).to.equal(entity);
      expect(search).to.deep.equal(searchParam);
    }

    if (parameters?.context?.locale) expect(request.body.context.locale).to.deep.equal(parameters.context.locale);
  });
});

defineStep('Search REST API responds with status code {string}', (expectedStatus: string) => {
  expect(statusCode).to.equal(parseInt(expectedStatus));
});
