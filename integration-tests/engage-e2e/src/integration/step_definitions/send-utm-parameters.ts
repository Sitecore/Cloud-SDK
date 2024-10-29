/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Then } from '@badeball/cypress-cucumber-preprocessor';

// Scenario: Enabled Utm Parameters with no parameters in the URL
Then('a VIEW event is sent with no UTM key-value pairs', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    const keysArr = Object.keys(request.body);
    const hasUTMParams = (key: string) => key.indexOf('utm_') >= 0;
    expect(keysArr.some(hasUTMParams)).to.equal(false);
  });
});

// Scenario: Developer calls an event with includeUTMParameters true
// and the includeUTMParameters should not be present in event
Then('the event does not contain includeUTMParameters as property', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(Object.keys(request.body)).to.not.include('includeUTMParameters');
  });
});
