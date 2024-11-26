/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { Before, defineStep, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { loadSteps } from '@sitecore-cloudsdk/cypress-utils';

(globalThis as any).errorMessage = '';

beforeEach(() => {
  (globalThis as any).errorMessage = '';
  cy.on('uncaught:exception', (error) => {
    (globalThis as any).errorMessage = error.message;
    return false;
  });
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
  cy.intercept(
    `https://${Cypress.env('HOSTNAME_STAGING')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/browser/*`
  ).as('initialCallStg');
});

// Load steps from cypress-utils
loadSteps(['the_S_ButtonIsClicked', 'anErrorIsThrown_S', 'apiRequestError_S_S_S', 'apiRequest_S']);

defineStep('the {string} page is loaded', (page: string) => {
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/personalize*`).as(
    'personalizeRequest'
  );
  cy.visit(page);

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
  cy.get('body').should('be.visible');
});

defineStep(
  'the {string} page is loaded with {string} name and {string} value query parameter',
  (page: string, paramName: string, paramValue: string) => {
    cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/personalize*`).as(
      'personalizeRequest'
    );

    cy.on('uncaught:exception', (error) => {
      (globalThis as any).errorMessage = error.message;
      return false;
    });

    const path = `${page}?${paramName}=${paramValue}`;

    cy.visit(path, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn');
      }
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('body')
      .should('be.visible')
      .then(() => cy.writeLocal(`error.txt`, (globalThis as any).errorMessage || ''));
    cy.get('body').should('be.visible');
  }
);

defineStep('the request with id {string} will contain the {string} header', (testID: string, headerName: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);
  cy.assertRequestHeader(testID, headerName);
});

defineStep('the request with id {string} will contain {string} log', (testID: string, log: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);
  cy.assertLogs(testID, log);
});

defineStep('the {string} page is loaded without init function', (page: string) => {
  cy.visit(page);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.location().should((loc) => {
    expect(`${loc.pathname}${loc.search}`).to.eq(page);
  });
});

When('a cookie exists on the page with the respective {string} environment contextId', (environment: string) => {
  const cookieName =
    environment.toLowerCase() == 'production' ? Cypress.env('COOKIE_NAME') : Cypress.env('COOKIE_NAME_STAGING');
  cy.waitUntil(() => cy.getCookie(cookieName), {
    errorMsg: 'Cookie not found',
    interval: 100,
    timeout: 10000
  });
});

Then('the request is sent with staging url', () => {
  cy.wait('@initialCallStg').then(({ request }) => {
    expect(request.url).to.contain(Cypress.env('HOSTNAME_STAGING'));
  });
});

Before({ tags: '@EnableClientDebug' }, () => {
  localStorage.debug = 'sitecore-cloudsdk:*';
});

Then('no error is thrown', () => {
  expect((globalThis as any).errorMessage).to.eq('');
});

defineStep('the {string} page is loaded with query parameters', (page: string, datatable: any) => {
  cy.intercept(
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'API_VERSION'
    )}/browser/*`
  );

  const attributesArray: { key: string; value: string }[] = [];
  const attributes = datatable.hashes()[0];
  let searchString = '';
  let extSearchString = '';

  //In order to test the amount of ext attributes that can be sent to EP
  if (Object.getOwnPropertyDescriptor(attributes, 'extAttributesNumber')) {
    for (let i = 0; i < attributes.extAttributesNumber; i++)
      attributesArray.push({ key: `attr${i}`, value: `value${i}` });

    delete attributes.extAttributesNumber;

    extSearchString = `${
      attributesArray.length ? attributesArray.map((attr) => `&${attr.key}=${attr.value}`).join('') : ''
    }`;
  }

  if (Object.getOwnPropertyDescriptor(attributes, 'nested')) {
    extSearchString = extSearchString + `${attributes.nested ? `&nested=${attributes.nested}` : ''}`;
    delete attributes.nested;
  }

  const queryParams = '?' + new URLSearchParams(attributes).toString() + (extSearchString ? extSearchString : '');
  searchString = page + queryParams;
  cy.visit(searchString, {
    onBeforeLoad(win) {
      cy.stub(win.console, 'warn').as('consoleWarn');
    }
  });

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('body')
    .should('be.visible')
    .then(() => cy.writeLocal(`error.txt`, (globalThis as any).errorMessage));
});

defineStep('the request with id {string} will contain:', (testID: string, bodyAttribute: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(3000);
  cy.assertRequestBodyValue(testID, bodyAttribute.trim());
});

defineStep(
  'the request with id {string} will not contain the {string} in the body',
  (testID: string, bodyAttribute: string) => {
    cy.assertRequestBodyNotContaining(testID, bodyAttribute);
  }
);
