/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';

Then('the window.Engage object has the provided settings', (datatable: any) => {
  const attributes = datatable.hashes()[0];

  //Waits until page loaded and window is found
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.window().its('Engage').its('settings').should('exist'), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 100,
  });
  cy.window().its('Engage').its('settings').its('web_flow_target').should('eq', attributes['webFlowTarget']);
  cy.window().its('Engage').its('settings').its('pointOfSale').should('eq', attributes['pointOfSale']);
  cy.window()
    .its('Engage')
    .its('settings')
    .its('target')
    .should('eq', `https://${Cypress.env('HOSTNAME')}`);
  cy.window().its('Engage').its('settings').its('client_key').should('eq', Cypress.env('CLIENT_KEY'));
});

Then('the window.Engage object exists with the getBrowserId property but not the settings object', () => {
  cy.window().its('Engage').should('exist');
  cy.window().its('Engage').its('getBrowserId').should('exist');
  cy.window().its('Engage').its('settings').should('not.exist');
});

Then("the window.Engage object doesn't contain the settings object", () => {
  cy.window().its('Engage').its('settings').should('not.exist');
});

Then('the window.Engage object should include the following settings', (datatable: any) => {
  const formData = datatable.hashes()[0];

  cy.window().its('Engage').should('exist');

  if (formData.webPersonalizationSettings.trim().length > 0 && formData.webPersonalizationSettings.trim() !== 'false') {
    const webFlowTarget = formData.webFlowTarget || Cypress.env('WEB_FLOW_TARGET');
    cy.window().its('Engage').its('settings').should('exist');
    cy.window().its('Engage').its('settings').its('web_flow_config').should('exist');
    cy.window()
      .its('Engage')
      .its('settings')
      .its('web_flow_config')
      .its('async')
      .should('eq', formData.async === 'true');
    cy.window()
      .its('Engage')
      .its('settings')
      .its('web_flow_config')
      .its('defer')
      .should('eq', formData.defer === 'true');
    cy.window().its('Engage').its('settings').its('web_flow_target').should('eq', webFlowTarget);
  } else {
    cy.window().its('Engage').its('settings').should('not.exist');
  }
});

// Scenario: webExperiences SDK is integrated with Engage and popup is triggered
// Scenario: webExperiences is integrated with Engage but is disabled
defineStep('webExperiences {string} loaded to DOM', (loadedState: string) => {
  const isLoaded = loadedState.includes('not') ? 'not.' : '';
  const webFlowTarget = 'https://d35vb5cccm4xzp.cloudfront.net';
  cy.document().get(`head script[src*="${webFlowTarget}"]`).should(`${isLoaded}exist`);
});

defineStep('popup content {string} triggered', (triggeredState: string) => {
  const isTriggered = triggeredState.includes('not') ? 'not.to.' : '';
  cy.document().get('#bx-modal_overlay').should(`${isTriggered}exist`);
});

// Scenario: async setting on script is set to asyncScriptLoading
Then('the script tags have their async attributes set to the asyncScriptLoading setting value', () => {
  cy.document().get('head script[src*="web-version.min.js"]').should('not.have.attr', 'async');
});

// Scenario: async setting on script is not set to asyncScriptLoading and defaults to 'true'
Then('the script tags have their async attributes set to the default value of true', () => {
  cy.document().get('head script:last').should('have.attr', 'async');
});

// Scenario: Init is called with a baseURLOverride value passed in webPersonalization settings
Then('the script tags src attributes include the following strings', (datatable: any) => {
  const formData = datatable.hashes()[0];
  let expectWebFlowTarget;
  if (formData.webFlowTarget === 'default') {
    expectWebFlowTarget = Cypress.env('WEB_FLOW_TARGET');
  } else {
    expectWebFlowTarget = formData.webFlowTarget;
  }
  cy.document()
    .get('head script[src*="web-version.min.js"]')
    .should('have.attr', 'src')
    .should('include', expectWebFlowTarget);
});

defineStep('{string} template appeared', (templateTitle: string) => {
  cy.document().get(`[data-testid=${templateTitle}]`).should('exist');
});
