/// <reference types='cypress' />
// Above line needed as indicator for Cypress

import { When, Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';

beforeEach(() => {
  // eslint-disable-next-line max-len
  cy.intercept(
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/browser/*`
  ).as('initialCall');
});

defineStep('the pageView function is called', (datatable: any) => {
  if (datatable) {
    const parameters = datatable.hashes()[0];
    Object.keys(parameters).forEach(function (key) {
      cy.get(`[data-testid="${key}ParamInput"]`).should('be.visible').type(`${parameters[key]}`);
    });
  }
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('[data-testid="sendEvent"]').click();
});

// Scenario: Developer uses pageView to send a VIEW event with referrer
When('the {string} page is loaded with a different document.referrer hostname', (page: string) => {
  // eslint-disable-next-line max-len
  cy.intercept(
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/events*`
  ).as('eventRequest');
  cy.visit(page, {
    onBeforeLoad: (contentWindow: Cypress.AUTWindow) => {
      Object.defineProperty(contentWindow.document, 'referrer', {
        get() {
          return 'https://referrer.com/test?q=test';
        },
      });
      expect(contentWindow.document.referrer).to.equal('https://referrer.com/test?q=test');
    },
  });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
});

Then('the event is sent with the referrer', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.referrer).to.eq('https://referrer.com/test?q=test');
  });
});

// Scenario: Developer uses pageView to send a VIEW event without referrer
When('the {string} page is loaded with the same document.referrer hostname', (page: string) => {
  // eslint-disable-next-line max-len
  cy.intercept(
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/events*`
  ).as('eventRequest');
  cy.visit(page, {
    onBeforeLoad: (contentWindow: Cypress.AUTWindow) => {
      Object.defineProperty(contentWindow.document, 'referrer', {
        get() {
          return `${Cypress.config('baseUrl')}/test?q=test`;
        },
      });
      expect(contentWindow.document.referrer).to.equal(`${Cypress.config('baseUrl')}/test?q=test`);
    },
  });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
});

Then('the event is sent without the referrer', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.referrer).to.equal(undefined);
  });
});

Then('the event is sent with the values inferred from window.location.pathname', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.page).to.equal('about');
  });
});

defineStep('the {string} attribute {string} exist in the document', (attribute: string, value: string) => {
  cy.get('html')
    .then(($elem) => {
      $elem[0].setAttribute(attribute, value);
    })
    .should('have.attr', attribute);
});

defineStep("the {string} attribute doesn't exist in the document", (attribute: string) => {
  cy.get('html')
    .then(($elem) => {
      $elem[0].removeAttribute(attribute);
    })
    .should('not.have.attr', attribute);
});

When('the cookies are removed from the browser', () => {
  cy.waitUntil(() => cy.getCookie(Cypress.env('COOKIE_NAME')), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 100,
  });
  cy.getCookie(Cypress.env('COOKIE_NAME'))
    .should('exist')
    .then((c) => {
      cy.wrap(c?.value).as('browser_id');
    });
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.clearCookies();
  cy.getCookie(Cypress.env('COOKIE_NAME')).should('not.exist');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});

Then('the event is sent with empty browserId', () => {
  cy.get('[data-testid="sendEvent"]').click();
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.browser_id).to.equal('');
  });
});

When('a cookie exists on the page with the respective {string} environment contextId', (environment: string) => {
  const cookieName =
    environment.toLowerCase() == 'production' ? Cypress.env('COOKIE_NAME') : Cypress.env('COOKIE_NAME_STAGING');
  cy.waitUntil(() => cy.getCookie(cookieName), {
    errorMsg: 'Cookie not found',
    timeout: 10000,
    interval: 100,
  });
});

Then('the bid value set in the cookie for the user is returned', () => {
  // eslint-disable-next-line max-len
  cy.intercept(
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/events*`
  ).as('eventRequest');
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.browser_id).not.be.empty;
  });
});
