/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Utils } from '../../support/utils';

const expectedEventData = {
  channel: 'WEB',
  clientKey: Cypress.env('CLIENT_KEY'),
  pointOfSale: 'spinair.com',
  type: '',
};

Then('CDP returns the event with {string} type', (eventType: string, datatable) => {
  expectedEventData.type = eventType;
  const expectedReq = Utils.createExpectedEventReq(eventType, datatable);

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expectedArbitraryData = (({ pos, type, channel, ...o }) => o)(expectedReq);
  cy.requestGuestContext().then((actualEvent: { arbitraryData: any }) => {
    expect(actualEvent.arbitraryData).to.deep.contain(expectedArbitraryData);
    expect(actualEvent).to.deep.contain(expectedEventData);
  });
});

Then('CDP returns the event with parameters:', (params: string) => {
  const parameters = JSON.parse(params);

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expectedArbitraryData = (({ type, ...o }) => o)(parameters);
  expectedEventData.type = parameters.type;
  cy.requestGuestContext().then((actualEvent: { arbitraryData: any }) => {
    expect(actualEvent.arbitraryData).to.deep.contain(expectedArbitraryData);
    expect(actualEvent).to.deep.contain(expectedEventData);
  });
});

Then('CDP returns the {string} as identifier', (email: string) => {
  cy.requestGuestContext().then((actualEvent: { arbitraryData: any }) => {
    expect(actualEvent.arbitraryData.identifiers[0].id).to.deep.equal(email);
    expect(actualEvent.arbitraryData.identifiers[0].provider).to.deep.equal('email');
  });
});

Given('Engage is initialized in server visiting {string} page', (page: string) => {
  cy.visit(page);
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });

  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')));
});
