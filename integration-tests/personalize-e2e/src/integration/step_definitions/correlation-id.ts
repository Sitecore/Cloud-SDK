/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { Then } from '@badeball/cypress-cucumber-preprocessor';

before(() => {
  cy.writeLocal('logsData.json', {} as any);
  cy.writeLocal('fetchData.json', {} as any);
});

Then('all requests from previous calls have unique correlation ids', () => {
  cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
    const values: string[] = [];
    values.push(fileContents['sendPersonalizeFromMiddlewareWithCorrelationID'].headers['x-sc-correlation-id']);
    values.push(fileContents['sendPersonalizeFromBrowserWithCorrelationID'].headers['x-sc-correlation-id']);

    const valuesSet = new Set(values);

    expect(valuesSet.size).to.eq(values.length);
  });
});
