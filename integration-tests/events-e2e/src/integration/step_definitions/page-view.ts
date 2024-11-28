import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the pageView pararamers are: {string}', (params: string) => {
  cy.get('[data-testid="pageViewDataInput"]').clear();
  cy.get('[data-testid="pageViewDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('the pageView pararamers are:', (params: string) => {
  cy.get('[data-testid="pageViewDataInput"]').clear();
  cy.get('[data-testid="pageViewDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('a pageView event is sent with no UTM key-value pairs', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    const keysArr = Object.keys(request.body);
    const hasUTMParams = (key: string) => key.indexOf('utm_') >= 0;
    expect(keysArr.some(hasUTMParams)).to.equal(false);
  });
});

defineStep('the pageView event does not contain includeUTMParameters as property', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(Object.keys(request.body)).to.not.include('includeUTMParameters');
  });
});
