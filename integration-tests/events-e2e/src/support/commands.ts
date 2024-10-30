/* eslint-disable @nx/enforce-module-boundaries */

export {};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      assertRequestBodyValue(testID: string, bodyAttribute: string): void;
      assertLogs(testID: string, log: string): void;
      getLogOutput(): any;
      writeLocal(fileName: string, content: any): void;
      readLocal(fileName: string): any;
      visit(url: string, options: string): void;
      replace(filePath: string, regex: any, text: string): void;
    }
  }

  interface JQuery {
    args: [];
  }
}

// Asserts if the provided attribute exists in the body
// Asserts if the provided attribute value exists in the body,
// the data is added by the Next app with the request decorators
Cypress.Commands.add('assertRequestBodyValue', (testID, bodyAttribute) => {
  cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents[testID].body).to.contain(bodyAttribute);
      }),
    {
      errorMsg: 'Request body not found',
      interval: 100,
      timeout: 15000
    }
  );
});

// Asserts the provided logs data from the stored file in fixtures,
// the data is added by the Next app with the debug decorators
Cypress.Commands.add('assertLogs', (testID: string, log: string) => {
  cy.waitUntil(
    () =>
      cy.readLocal('logsData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents).to.have.property(testID);
        expect(fileContents[testID]).to.contain(log);
      }),
    {
      errorMsg: 'Error not found',
      interval: 100,
      timeout: 15000
    }
  );
});

//Overwrites cy.visit to check if the current baseurl belongs to cdn app in order to add the respective .html extension
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url, options);
  //Overwriting cy.visit behaves faster than the original function so a cy.wait is necessary
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(600);
});

Cypress.Commands.add('writeLocal', (fileName, content) => {
  cy.writeFile(`src/fixtures/local/${fileName}`, content);
});

Cypress.Commands.add('readLocal', (fileName) => {
  let value: any;
  cy.readFile(`src/fixtures/local/${fileName}`).then((content) => (value = content));
  return value;
});

Cypress.Commands.add('replace', (filePath, regexMatch, text) => {
  cy.readFile(filePath).then((data) => {
    const pageData = data;
    cy.writeFile(filePath, pageData.replace(regexMatch, text));
  });
});

Cypress.Commands.add('getLogOutput', () => {
  const logs: string[] = [];

  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.get('@consoleLogOutput')
    .invoke('getCalls')
    .each((call) => {
      call.args.forEach((arg) => {
        logs.push(arg);
      });
    })
    .then(() => logs);
});
