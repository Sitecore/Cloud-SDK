import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

beforeEach(() => {
  (globalThis as any).errorMessage = '';
});

defineStep('the scCloudSDK.events object is injected to the window object', () => {
  let eventsPackageVersion: string;
  cy.getEventsPackageVersion().then((version: string) => (eventsPackageVersion = version));

  cy.window().then((window: any) => {
    expect(window).to.have.property('scCloudSDK');
    expect(window.scCloudSDK).to.have.property('events');
    expect(window.scCloudSDK.events).to.have.property('version');
    expect(window.scCloudSDK.events.version).to.equal(eventsPackageVersion);
  });
});

defineStep('the scCloudSDK.events does not exist in the window object', () => {
  cy.window().then((window: any) => {
    expect(window).to.have.property('scCloudSDK');
    expect(window.scCloudSDK).not.to.have.property('events');
  });
});

defineStep('the cookie is automatically set with the correct bid value for the user', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  });
});

defineStep('the {string} domain cookie is not created', () => {
  //Cypress checks for cookies faster than cookies need to be created, to avoid false positives, we add cy.wait
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookies().should('have.length', 0);
});
