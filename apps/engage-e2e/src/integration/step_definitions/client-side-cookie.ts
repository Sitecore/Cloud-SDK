/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { Given, Then, When, defineStep } from '@badeball/cypress-cucumber-preprocessor';

declare global {
  /* eslint-disable @typescript-eslint/naming-convention */
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    engage: any;
    Engage: any;
  }
}
/* eslint-enable @typescript-eslint/naming-convention */

let errorMessage: string;

Then('the cookie is automatically set with the correct bid and gid value for the user', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  });
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  });
});

Given('a client cookie exists on the {string} page', (page: string) => {
  cy.intercept('*', { hostname: Cypress.env('HOSTNAME') }, (req) => {
    req.continue((res) => {
      res.body = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        customer_ref: '5678',
        ref: '1234',
        status: '200',
        version: Cypress.env('API_VERSION')
      };
    });
  }).as('bIdRequest');
  cy.visit(page);
});

Then('only one cookie is set', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(700);
  cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => cookie?.value == '1234');
  cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')).then((cookie) => cookie?.value == '5678');
  cy.getCookies().should('have.length', 2);
});

defineStep('a client cookie is created at {string} page with {string} domain', (page: string, domain: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.clearCookies();
  cy.waitUntil(() => cy.getCookies().then((cookies) => cookies.length === 0), {
    errorMsg: 'Failed to clear cookies',
    interval: 100,
    timeout: 10000
  });
  cy.visit(page, {
    qs: {
      cookieDomain: domain
    }
  });
});

defineStep('{string} cookie is created with the {string} domain', (result: string, domain: string) => {
  //cy.getCookie cannot be timed out but in order to avoid flaky tests, we use waitUntil the cookie to be created
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => cookie?.domain === domain), {
    errorMsg: 'Cookie not found',
    interval: 500,
    timeout: 10000
  });
});

defineStep('the {string} domain cookie is not created', () => {
  //Cypress checks for cookies faster than cookies need to be created, to avoid false positives, we add cy.wait
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookies().should('have.length', 0);
});

When('no TTL setting has been specified', () => {
  const engage = {
    cookieTTL: undefined
  };
  expect(engage.cookieTTL).to.equal(undefined);
});

Then('the cookie is set with the default expiry', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(
    () =>
      cy.getCookie(Cypress.env('COOKIE_NAME')).then((c) => {
        expect(c?.expiry).to.not.equal('Session');
      }),
    {
      errorMsg: 'Cookie not found',
      interval: 500,
      timeout: 10000
    }
  );
});

Given(
  '{string} page is loaded with enableBrowserCookie true and an invalid sitecoreEdgeContextId parameter',
  (page: string) => {
    cy.on('uncaught:exception', (error) => {
      errorMessage = error.message;
      return false;
    });

    cy.visit(`${page}?enableBrowserCookie=true&badSitecoreEdgeContextIdBrowser=test`, {
      failOnStatusCode: false
    }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000).then(() => {
        cy.writeLocal(`error.txt`, errorMessage);
      });
    });
  }
);
