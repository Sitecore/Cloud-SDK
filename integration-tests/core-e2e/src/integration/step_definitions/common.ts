import { After, Before, defineStep, When } from '@badeball/cypress-cucumber-preprocessor';
import { loadSteps } from '@sitecore-cloudsdk/cypress-utils';

(globalThis as any).errorMessage = '';

const middlewarePath = '../core-next/middleware.ts';

loadSteps(['the_S_ButtonIsClicked', 'anErrorIsThrown_S']);

Before({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, `###${Date.now()}###`);
});

After({ tags: '@RestartServer-Middleware' }, () => {
  cy.replace(middlewarePath, /###\d+###/, '###1###');
});

//beforeEach hook as a workaround to not bypass CORS errors on preflight OPTIONS requests to callFlows and events
beforeEach(() => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  (globalThis as any).errorMessage = '';
  cy.writeLocal('error.txt', '');
  cy.clearCookies();
});

defineStep('the {string} page is loaded', (page: string) => {
  // eslint-disable-next-line max-len
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/search*`).as(
    'searchRequest'
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
    // eslint-disable-next-line max-len
    cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/search*`).as(
      'searchRequest'
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

defineStep(
  'the {string} page is reloaded with {string} name and {string} value query parameter',
  (page: string, paramName: string, paramValue: string) => {
    const path = `${page}?${paramName}=${paramValue}`;
    cy.intercept(`${Cypress.config('baseUrl')}${path}*`).as('callToServer');
    cy.visit(path, {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn');
      }
    });
  }
);

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

defineStep('the {string} domain cookie is created', () => {
  //Cypress checks for cookies faster than cookies need to be created, to avoid false positives, we add cy.wait
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookies().should('have.length', 1);
});

When('page is reloaded', () => {
  cy.reload();
});
