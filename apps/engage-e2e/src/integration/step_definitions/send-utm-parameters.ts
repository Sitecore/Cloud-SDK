/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Then } from '@badeball/cypress-cucumber-preprocessor';

// Scenario: Disabled Utm Parameters
Then('a VIEW event is sent but no extra UTM parameters are sent with the event', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.utm_medium).to.equal(undefined);
    expect(request.body.utm_source).to.equal(undefined);
    expect(request.body.utm_campaign).to.equal(undefined);
    expect(request.body.utm_content).to.equal(undefined);
  });
});

// Scenario: Enabled Utm Parameters with no parameters in the URL
Then('a VIEW event is sent with no UTM key-value pairs', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    const keysArr = Object.keys(request);
    const hasUTMParams = (key: string) => key.indexOf('utm_') >= 0;
    expect(keysArr.some(hasUTMParams)).to.equal(false);
  });
});
