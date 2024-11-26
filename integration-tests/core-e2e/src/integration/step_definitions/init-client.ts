import { defineStep, Then } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the core settings are injected to the window object', (table: string) => {
  const data = JSON.parse(table);
  let corePackageVersion: string;
  cy.getCorePackageVersion().then((version: string) => (corePackageVersion = version));

  cy.window().then((win: any) => {
    expect(win).to.have.property('scCloudSDK');
    expect(win.scCloudSDK).to.have.property('core');
    expect(win.scCloudSDK.core).to.have.property('settings');
    expect(win.scCloudSDK.core).to.have.property('version');
    expect(win.scCloudSDK.core.settings).to.have.property('sitecoreEdgeContextId');
    expect(win.scCloudSDK.core.settings).to.have.property('sitecoreEdgeUrl');
    expect(win.scCloudSDK.core.version).to.equal(corePackageVersion);
    expect(win.scCloudSDK.core.settings.sitecoreEdgeContextId).to.equal(
      data.scCloudSDK.core.settings.sitecoreEdgeContextId
    );
    expect(win.scCloudSDK.core.settings.sitecoreEdgeUrl).to.equal(data.scCloudSDK.core.settings.sitecoreEdgeUrl);
  });
});

Then('the getBrowserId function returns the browser id', () => {
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  }).then(() => {
    cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => {
      const expectedCookieValue = cookie?.value ?? '';
      cy.get('[data-testid="browserIdLabel"]').contains(expectedCookieValue);
    });
  });
});

defineStep('the domain is: {string}', (domain: string) => {
  if (domain) {
    cy.get('[data-testid="initDomainInput"]').clear();
    cy.get('[data-testid="initDomainInput"]').type(domain, {
      parseSpecialCharSequences: false
    });
  }
});
