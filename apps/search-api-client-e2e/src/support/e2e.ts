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
