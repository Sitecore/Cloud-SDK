import { Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';

let errorMessage: string;

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
  cy.waitUntil(
    () =>
      cy.readLocal('error.txt').then((actualError: string) => {
        expect(actualError).to.include(expectedError);
      }),
    {
      errorMsg: 'Error not found',
      interval: 100,
      timeout: 15000
    }
  );
});

defineStep('the request with id {string} will contain:', (testID: string, bodyAttribute: string) => {
  cy.assertRequestBodyValue(testID, bodyAttribute.trim());
});

defineStep(
  'the {string} page is loaded with {string} name and {string} value query parameter',
  (page: string, paramName: string, paramValue: string) => {
    // eslint-disable-next-line max-len
    cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/${Cypress.env('EDGE_PROXY_VERSION')}/search*`).as(
      'searchRequest'
    );

    const path = `${page}?${paramName}=${paramValue}`;

    cy.visit(path, {
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
