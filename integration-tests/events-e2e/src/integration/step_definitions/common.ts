import { After, Before, defineStep } from '@badeball/cypress-cucumber-preprocessor';
import { loadSteps } from '@sitecore-cloudsdk/cypress-utils';

(globalThis as any).statusCode = '';
(globalThis as any).errorMessage = '';
const middlewarePath = '../events-next/src/middleware.ts';

beforeEach(() => {
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/events/${Cypress.env(
      'EVENTS_API_VERSION'
    )}/events*`
  ).as('eventRequest');
  cy.clearCookies();
});

loadSteps(['the_S_ButtonIsClicked', 'anErrorIsThrown_S', 'apiRequest_S', 'clientDebugLog_S', 'serverDebugLog_S_S']);

defineStep('the {string} page is loaded', (page: string) => {
  cy.visit(page);

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
  cy.get('body').should('be.visible');
});

defineStep('the {string} page is loaded with query parameters:', (page: string, params: string) => {
  let searchString = '';
  const parameters = JSON.parse(params);

  const queryParams = '?' + new URLSearchParams(parameters).toString();
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
  cy.get('body').should('be.visible');
});

defineStep(
  'the {string} page is loaded with {string} name and {string} value query parameter',
  (page: string, paramName: string, paramValue: string) => {
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

defineStep('the request with id {string} will contain:', (testID: string, bodyAttribute: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.assertRequestBodyValue(testID, bodyAttribute.trim());
});

After({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, '###1###');
});

Before({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, `###${Date.now()}###`);
});

Before({ tags: '@EnableClientDebug' }, () => {
  localStorage.debug = 'sitecore-cloudsdk:*';
});

defineStep('the event response has status code: {string}', (expectedStatus: string) => {
  expect((globalThis as any).statusCode).to.equal(parseInt(expectedStatus));
});

defineStep('the request with id {string} will contain the {string} header', (testID: string, headerName: string) => {
  cy.assertRequestHeader(testID, headerName);
});

defineStep(
  'the request with id {string} will contain the {string} in the body',
  (testID: string, bodyAttribute: string) => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    cy.assertRequestBody(testID, bodyAttribute);
  }
);

defineStep('the request with id {string} will contain {string} log', (testID: string, log: string) => {
  cy.assertLogs(testID, log);
});

defineStep('the request with id {string} will not contain {string} log', (testID: string, log: string) => {
  cy.assertLogsNotContaining(testID, log);
});

defineStep(
  'the request with id {string} will not contain the {string} in the body',
  (testID: string, bodyAttribute: string) => {
    cy.assertRequestBodyNotContaining(testID, bodyAttribute);
  }
);
