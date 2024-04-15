/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

defineStep('the request with id {string} will contain ut_api_version in the metadata', (testID: string) => {
  cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
    const data = JSON.parse(fileContents[testID].body)?.sc_search?.metadata?.ut_api_version;

    expect(data).to.contain('1.0');
  });
});
