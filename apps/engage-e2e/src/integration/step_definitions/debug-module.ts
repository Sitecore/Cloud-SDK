import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('debug log is printed out in the console with message including {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.contain(logMessage);
  });
});

defineStep('debug log response status should be {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    logs.filter((item) => {
      if (typeof item === 'object' && item !== null && 'status' in item) {
        expect(item['status']).to.equal(parseInt(logMessage));
      }
      return item;
    });
  });
});

defineStep('debug log is not printed out in the console with message including {string}', (logMessage: string) => {
  cy.getLogOutput().then((logs: string[]) => {
    expect(logs.join('')).to.not.contain(logMessage);
  });
});

defineStep('we display the debug server to UI including: {string}', (logMessage: string) => {
  cy.get("[data-testid='debug']").then(($el) => {
    const text = $el.text();
    expect(text).to.include(logMessage.trim());
  });
});

defineStep(`the debug server won't include: {string}`, (logMessage: string) => {
  cy.get("[data-testid='debug']").then(($el) => {
    const text = $el.text();
    expect(text).to.not.include(logMessage);
  });
});
