/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the init core page is loaded', () => {
  cy.visit('/init-core');

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/init-core');
  });
  cy.get('body').should('be.visible');
});

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
    expect(win.scCloudSDK.core.settings).to.have.property('siteName');
    expect(win.scCloudSDK.core.version).to.equal(corePackageVersion);
    expect(win.scCloudSDK.core.settings.sitecoreEdgeContextId).to.equal(
      data.scCloudSDK.core.settings.sitecoreEdgeContextId
    );
    expect(win.scCloudSDK.core.settings.sitecoreEdgeUrl).to.equal(data.scCloudSDK.core.settings.sitecoreEdgeUrl);
    expect(win.scCloudSDK.core.settings.siteName).to.equal(data.scCloudSDK.core.settings.siteName);
  });
});
