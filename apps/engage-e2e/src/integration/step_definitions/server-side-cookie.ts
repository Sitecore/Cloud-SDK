/* eslint-disable sort-keys */
/// <reference types='cypress' />
// Above line needed as indicator for Cypress

let errorMessage: string;
import { After, Before, Given, Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';
const middlewarePath = '../engage-next/middleware.ts';
const serverSidePropsPath = '../engage-next/pages/server-side-props-server-cookie.tsx';

//beforeEach hook as a workaround to not bypass CORS errors on preflight OPTIONS requests to callFlows and events
beforeEach(() => {
  errorMessage = '';
  cy.clearCookies();
});

Before({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, `###${Date.now()}###`);
});

Before({ tags: '@RestartServer-Server-Side-Props' }, () => {
  cy.replace(serverSidePropsPath, /###\d+###/, `###${Date.now()}###`);
});

defineStep('server cookies are created on the {string} page', (page) => {
  cy.intercept(`${Cypress.config('baseUrl')}${page}*`).as('callToServer');
  cy.visit(`${page}?enableServerCookie=true`);

  //We waitUntil with a chained assertion since commands might be executed before cookie is set
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 500
  });

  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 500
  });

  cy.getCookies().then((cookies) => {
    const serverBrowserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
    const serverGuestIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME_PERSONALIZE'));

    const serverCookies = {
      browserId: serverBrowserIdCookie,
      guestId: serverGuestIdCookie
    };
    cy.writeLocal('initialCookies.json', serverCookies);
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

    cy.visit(`${page}?enableServerCookie=true&badSitecoreEdgeContextId=test`, {
      failOnStatusCode: false
    }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000).then(() => {
        cy.writeLocal(`error.txt`, errorMessage);
      });
    });
  }
);

Then('the server updates the TTL of the server cookies according to the settings', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('initialCookies.json').then((initialCookies: any) => {
    cy.wait('@callToServer').then((res) => {
      expect(res?.response?.headers).to.have.property('set-cookie');
      expect(res?.response?.headers['set-cookie'][0]).to.include(Cypress.env('COOKIE_NAME'));
      expect(res?.response?.headers['set-cookie'][1]).to.include(Cypress.env('COOKIE_NAME_PERSONALIZE'));
    });
    cy.getCookies()
      .should('have.length', 2)
      .then((cookies) => {
        const browserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
        const guestIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME_PERSONALIZE'));

        expect(browserIdCookie).to.have.property('name', initialCookies.browserId.name);
        expect(browserIdCookie).to.have.property('value', initialCookies.browserId.value);
        expect(browserIdCookie?.expiry).to.not.equal(initialCookies.browserId.expiry);
        expect(browserIdCookie?.secure).to.be.true;
        expect(browserIdCookie?.sameSite).to.equal('no_restriction');

        expect(guestIdCookie).to.have.property('name', initialCookies.guestId.name);
        expect(guestIdCookie).to.have.property('value', initialCookies.guestId.value);
        expect(guestIdCookie?.expiry).to.not.equal(initialCookies.guestId.expiry);
        expect(guestIdCookie?.secure).to.be.true;
        expect(guestIdCookie?.sameSite).to.equal('no_restriction');
      });
  });
});

Then('the server cookies contain the browserID and guestID cookies returned from the API call', () => {
  cy.wait('@callToServer').then((res) => {
    expect(res?.response?.headers).to.have.property('set-cookie');
    expect(res?.response?.headers['set-cookie'][0]).to.include(Cypress.env('COOKIE_NAME'));
    expect(res?.response?.headers['set-cookie'][1]).to.include(Cypress.env('COOKIE_NAME_PERSONALIZE'));
  });

  cy.getCookies()
    .should('have.length', 2)
    .then((cookies) => {
      const browserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
      const guestIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME_PERSONALIZE'));

      expect(browserIdCookie).to.have.property('value');
      expect(guestIdCookie).to.have.property('value');
    });
});

defineStep(
  'server cookies are requested to be created at {string} page with {string} domain',
  (page: string, domain: string) => {
    cy.visit(`${page}?enableServerCookie=true&cookieDomain=${domain}`);
  }
);

defineStep('server cookies are created with {string} domain', (domain: string) => {
  cy.waitUntil(
    () =>
      cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => {
        expect(cookie?.domain).to.eq(domain);
      }),
    {
      errorMsg: 'Cookie not found',
      timeout: 10000,
      interval: 100
    }
  );

  cy.waitUntil(
    () =>
      cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')).then((cookie) => {
        expect(cookie?.domain).to.eq(domain);
      }),
    {
      errorMsg: 'Cookie not found',
      timeout: 10000,
      interval: 100
    }
  );
});

defineStep(
  'the initServer function is triggered from {string} page with timeout: {string}',
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

After({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, '###1###');
});

After({ tags: '@RestartServer-Server-Side-Props' }, () => {
  cy.replace(serverSidePropsPath, /###\d+###/, '###1###');
});
