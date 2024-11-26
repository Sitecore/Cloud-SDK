import { defineStep, Given, Then } from '@badeball/cypress-cucumber-preprocessor';

defineStep('server browser id cookie is created on the {string} page', (page) => {
  cy.intercept(`${Cypress.config('baseUrl')}${page}*`).as('callToServer');
  cy.visit(`${page}?enableServerCookie=true`);

  //We waitUntil with a chained assertion since commands might be executed before cookie is set
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    interval: 500,
    timeout: 10000
  });

  cy.getCookies().then((cookies) => {
    const serverBrowserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));

    const serverCookies = {
      browserId: serverBrowserIdCookie
    };
    cy.writeLocal('initialCookies.json', serverCookies as unknown as string);
  });
});

defineStep('server guest id cookie is created on the {string} page', () => {
  //We waitUntil with a chained assertion since commands might be executed before cookie is set
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')), {
    errorMsg: 'Cookie not found',
    interval: 500,
    timeout: 10000
  });

  cy.getCookies().then((cookies) => {
    const serverGuetIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME_PERSONALIZE'));

    const serverCookies = {
      guestId: serverGuetIdCookie
    };
    cy.writeLocal('initialCookies.json', serverCookies as unknown as string);
  });
});

defineStep(
  'request to api {string} with testID {string} will respond with the error {string}',
  (path: string, testID: string, errorCode: string) => {
    cy.waitUntil(() =>
      cy
        .request({ failOnStatusCode: false, url: `${Cypress.config('baseUrl')}/api${path}?testID=${testID}` })
        .then((response) => {
          expect(response.body.error).to.contain(errorCode);
        })
    );
  }
);

Given('no cookie is created on the {string} page', (page: string) => {
  cy.intercept(`${Cypress.config('baseUrl')}${page}*`).as('callToServer');
  cy.clearCookies();
});

Then('the server updates the TTL of the browser id cookie according to the settings', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('initialCookies.json').then((initialCookies: any) => {
    cy.wait('@callToServer');
    cy.getCookies()
      .should('have.length', 1)
      .then((cookies) => {
        const browserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));
        expect(browserIdCookie).to.have.property('name', initialCookies.browserId.name);
        expect(browserIdCookie).to.have.property('value', initialCookies.browserId.value);
        expect(browserIdCookie?.expiry).to.not.equal(initialCookies.browserId.expiry);
        expect(browserIdCookie?.secure).to.be.true;
        expect(browserIdCookie?.sameSite).to.equal('no_restriction');
      });
  });
});

Then('the server updates the TTL of the guest id cookie according to the settings', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('initialCookies.json').then((initialCookies: any) => {
    cy.getCookies()
      .should('have.length', 2)
      .then((cookies) => {
        const guestIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME_PERSONALIZE'));

        expect(guestIdCookie).to.have.property('name', initialCookies.guestId.name);
        expect(guestIdCookie).to.have.property('value', initialCookies.guestId.value);
        expect(guestIdCookie?.expiry).to.not.equal(initialCookies.guestId.expiry);
        expect(guestIdCookie?.secure).to.be.true;
        expect(guestIdCookie?.sameSite).to.equal('no_restriction');
      });
  });
});

Then('the server cookies contain the browserID cookie returned from the API call', () => {
  cy.wait('@callToServer').then((res) => {
    expect(res?.response?.headers).to.have.property('set-cookie');
    expect(res?.response?.headers['set-cookie'][0]).to.include(Cypress.env('COOKIE_NAME'));
  });

  cy.getCookies()
    .should('have.length', 1)
    .then((cookies) => {
      const browserIdCookie = cookies.find((cookie) => cookie.name === Cypress.env('COOKIE_NAME'));

      expect(browserIdCookie).to.have.property('value');
    });
});
