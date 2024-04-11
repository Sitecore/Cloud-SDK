/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
import { Then } from '@badeball/cypress-cucumber-preprocessor';

before(() => {
  cy.writeLocal('logsData.json', {});
  cy.writeLocal('fetchData.json', {});
});

Then('all requests from previous calls have progressive requested_at values and are in correct format', () => {
  cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
    const first = JSON.parse(fileContents['sendCustomEventFromMiddlewareWithRequestedAt'].body).requested_at;
    const second = JSON.parse(fileContents['sendCustomEventFromBrowserWithRequestedAt'].body).requested_at;

    const firstDate = new Date(first).getTime();
    const secondDate = new Date(second).getTime();

    const now = Date.now();

    expect(now - firstDate).to.greaterThan(0);
    expect(now - firstDate).to.lessThan(20000);
    expect(now - secondDate).to.greaterThan(0);
    expect(now - secondDate).to.lessThan(20000);
    expect(secondDate - firstDate).to.greaterThan(0);
    expect(secondDate - firstDate).to.lessThan(20000);

    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    expect(dateFormatRegex.test(first)).to.true;
    expect(dateFormatRegex.test(second)).to.true;
  });
});
