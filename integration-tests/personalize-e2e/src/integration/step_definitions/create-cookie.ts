/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />
// Above line needed as indicator for Cypress
import { defineStep, Then } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the {string} domain cookie is not created', () => {
  //Cypress checks for cookies faster than cookies need to be created, to avoid false positives, we add cy.wait
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookies().should('have.length', 0);
});

Then('the personalization cookie should not exist', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')).should('not.exist');
});

Then('the cookie is automatically set with the correct guestId value for the user', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME_PERSONALIZE')), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
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
