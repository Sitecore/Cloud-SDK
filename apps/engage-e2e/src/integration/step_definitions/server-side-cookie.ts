/* eslint-disable sort-keys */
/// <reference types='cypress' />
// Above line needed as indicator for Cypress

let errorMessage: string;
import { Then, defineStep, Given } from '@badeball/cypress-cucumber-preprocessor';
beforeEach(() => {
  errorMessage = '';
  cy.clearCookies();
});

defineStep('a server cookie is created on the {string} page', (page) => {
  cy.intercept(`${Cypress.config('baseUrl')}${page}*`).as('callToServer');
  cy.visit(`${page}?enableServerCookie=true`);

  //We waitUntil with a chained assertion since commands might be executed before cookie is set
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.getCookies().then((cookies) => cookies.length === 1), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 500,
  });
  cy.getCookies().then((cookies) => {
    const serverCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
    cy.writeLocal('initialCookie.json', serverCookie);
    expect(serverCookie).to.have.property('name', Cypress.env('COOKIE_NAME'));
  });
});

defineStep('{string} page is loaded again with enableServerCookie parameter', (page: string) => {
  cy.visit(`${page}?enableServerCookie=true&`);
});

Given(
  '{string} page is loaded with enableServerCookie true and an invalid sitecoreEdgeContextId parameter',
  (page: string) => {
    cy.on('uncaught:exception', (error) => {
      errorMessage = error.message;
      return false;
    });

    cy.visit(`${page}?enableServerCookie=true&badSitecoreEdgeContextId=banana`, {
      failOnStatusCode: false,
    }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000).then(() => {
        cy.writeLocal(`error.txt`, errorMessage);
      });
    });
  }
);

Then('the server updates the TTL of the server cookie according to the settings', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('initialCookie.json').then((initialCookie: any) => {
    cy.wait('@callToServer').then((res) => {
      expect(res?.response?.headers).to.have.property('set-cookie');
      expect(res?.response?.headers['set-cookie'][0]).to.include(Cypress.env('COOKIE_NAME'));
    });
    cy.getCookies()
      .should('have.length', 1)
      .then((cookies) => {
        const serverCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
        expect(serverCookie).to.have.property('name', initialCookie.name);
        expect(serverCookie).to.have.property('value', initialCookie.value);
        expect(serverCookie?.expiry).to.not.equal(initialCookie.expiry);
        expect(serverCookie?.secure).to.be.true;
        expect(serverCookie?.sameSite).to.equal('no_restriction');
      });
  });
});

Then('the server cookie contains the browserID returned from the API call', () => {
  cy.wait('@callToServer').then((res) => {
    expect(res?.response?.headers).to.have.property('set-cookie');
    expect(res?.response?.headers['set-cookie'][0]).to.include(Cypress.env('COOKIE_NAME'));
  });
  cy.getCookies()
    .should('have.length', 1)
    .then((cookies) => {
      const serverCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
      expect(serverCookie).to.have.property('value');
    });
});

defineStep(
  'a server cookie is requested to be created at {string} page with {string} domain',
  (page: string, domain: string) => {
    cy.clearAllCookies();
    cy.visit(`${page}?enableServerCookie=true&cookieDomain=${domain}`);
  }
);

defineStep('a server cookie is created with {string} domain', (domain: string) => {
  cy.getCookies()
    .should('have.length', 1)
    .then((cookies) => {
      const serverCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
      expect(serverCookie).to.have.property('name', Cypress.env('COOKIE_NAME'));
      expect(serverCookie).to.have.property('domain', domain);
    });
});

defineStep(
  'the handleCookie function is triggered from {string} page with timeout: {string}',
  (page: string, timeout: string) => {
    cy.on('uncaught:exception', (error) => {
      errorMessage = error.message;
      return false;
    });

    cy.visit(`${page}?timeout=${timeout}`, { failOnStatusCode: false }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000).then(() => {
        cy.writeLocal(`error.txt`, errorMessage);
      });
    });
  }
);
