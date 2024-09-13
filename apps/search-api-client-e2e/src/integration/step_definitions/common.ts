import { After, Before, Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';

let errorMessage: string;
const middlewarePath = '../search-api-client-next/middleware.ts';

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

defineStep('the {string} button is clicked', (button: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1200);
  const selector = `[data-testid="${button}"]`;
  cy.on('uncaught:exception', (error) => {
    errorMessage = error.message;
    return false;
  });

  /* eslint-disable cypress/unsafe-to-chain-command,cypress/no-unnecessary-waiting */
  cy.wait(1000);
  cy.get(selector)
    .should('be.visible')
    .click()
    .then(() => cy.writeLocal(`error.txt`, errorMessage || ' '));
  /* eslint-enable cypress/unsafe-to-chain-command,cypress/no-unnecessary-waiting */
});

Then('an error is thrown: {string}', (expectedError: string) => {
  //Allowing for the error to be printed on console and retrieved from cypress fixtures
  cy.waitUntil(() => cy.readLocal('error.txt').then((actualError: string) => actualError !== ''), {
    errorMsg: 'Error not found',
    interval: 100,
    timeout: 15000
  });
  cy.readLocal('error.txt').should('include', expectedError);
});

defineStep('the request with id {string} will contain:', (testID: string, bodyAttribute: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.assertRequestBodyValue(testID, bodyAttribute.trim());
});

defineStep(
  'the {string} page is loaded with {string} name and {string} value query parameter',
  (page: string, paramName: string, paramValue: string) => {
    // eslint-disable-next-line max-len
    cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/search*`).as(
      'searchRequest'
    );

    cy.on('uncaught:exception', (error) => {
      errorMessage = error.message;
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
      .then(() => cy.writeLocal(`error.txt`, errorMessage || ''));
    cy.get('body').should('be.visible');
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

defineStep('client: debug log is printed out in the console with message including {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.contain(logMessage);
  });
});

defineStep(
  'server: debug log is printed out in the console with message including {string} from testID {string}',
  (log: string, testID: string) => {
    cy.assertLogs(testID, log);
  }
);

//beforeEach hook as a workaround to not bypass CORS errors on preflight OPTIONS requests to callFlows and events
beforeEach(() => {
  errorMessage = '';
  cy.clearCookies();
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
