// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-wait-until';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const addContext = require('../../../../node_modules/mochawesome/addContext');
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    // eslint-disable-next-line max-len
    const screenshot =
      `../screenshots/${Cypress.spec.name}/${runnable.parent?.title} -- ${test.title} (failed) (attempt 3).png`.replace(
        '#',
        '%23'
      );
    addContext({ test }, screenshot);
  }
});

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'debug').as('consoleLogOutput');
});
