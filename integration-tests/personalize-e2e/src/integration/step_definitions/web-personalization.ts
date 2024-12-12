/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the web personalization page is loaded', () => {
  cy.visit('/web-personalization');

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/web-personalization');
  });
  cy.get('body').should('be.visible');
});

defineStep('the provided settings are injected to the window object', (table: string) => {
  const data = JSON.parse(table);

  cy.window().then((win: any) => {
    expect(win).to.have.property('scCloudSDK');
    expect(win.scCloudSDK).to.have.property('personalize');
    expect(win.scCloudSDK.personalize).to.have.property('settings');
    expect(win.scCloudSDK.personalize.settings.async).to.equal(data.scCloudSDK.personalize.settings.async);
    expect(win.scCloudSDK.personalize.settings.defer).to.equal(data.scCloudSDK.personalize.settings.defer);
    expect(win.scCloudSDK.core.settings.siteName).to.equal(data.scCloudSDK.core.settings.siteName);
    expect(win.scCloudSDK.core.settings.sitecoreEdgeContextId).to.equal(
      data.scCloudSDK.core.settings.sitecoreEdgeContextId
    );
    expect(win.scCloudSDK.core.settings.sitecoreEdgeUrl).to.equal(data.scCloudSDK.core.settings.sitecoreEdgeUrl);
  });
});

defineStep('web personalization settings are not injected to the window object', () => {
  cy.window().then((win: any) => {
    expect(win).to.have.property('scCloudSDK');
    expect(win.scCloudSDK).to.have.property('personalize');
    expect(win.scCloudSDK.personalize).to.have.property('personalize');
    expect(win.scCloudSDK.personalize).not.to.have.property('settings');
  });
});

defineStep('webExperiences are loaded to DOM', () => {
  const cdnUrl = 'https://d35vb5cccm4xzp.cloudfront.net';
  cy.document().get(`head script[src*="${cdnUrl}"]`).should('exist');
});

defineStep('webExperiences are not loaded to DOM', () => {
  const cdnUrl = 'https://d35vb5cccm4xzp.cloudfront.net';
  cy.document().get(`head script[src*="${cdnUrl}"]`).should('not.exist');
});
