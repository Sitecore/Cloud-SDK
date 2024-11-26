/* eslint-disable @nx/enforce-module-boundaries */
import { loadCommands } from '@sitecore-cloudsdk/cypress-utils';
import corePackageJson from '../../../../packages/core/package.json';
import eventsPackageJson from '../../../../packages/events/package.json';
import personalizePackageJson from '../../../../packages/personalize/package.json';

export {};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      assertRequest(expectedReq: any, request: any): void;
      assertLogsNotContaining(testID: string, log: string): void;
      waitForResponse(alias: string): any;
      convertToSnakeCase(str: string): string;
      visit(url: string, options: string): void;
      requestGuestContext(): any;
      getCorePackageVersion(): any;
    }
  }
  interface JQuery {
    args: [];
  }
}

// Load commands from cypress-utils
loadCommands([
  'getLogOutput',
  'readLocal',
  'writeLocal',
  'assertRequestHeader',
  'assertRequestHeaders',
  'waitForRequest',
  'assertRequestBody',
  'assertRequestBodyNotContaining',
  'assertLogs',
  'replace'
]);

// Asserts the provided logs data not present in stored file in fixtures,
// the data is added by the Next app with the debug decorators
Cypress.Commands.add('assertLogsNotContaining', (testID: string, log: string) => {
  cy.waitUntil(
    () =>
      cy.readLocal('logsData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents).to.have.property(testID);
        expect(fileContents[testID]).to.not.contain(log);
      }),
    {
      errorMsg: 'Log not found',
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

//Returns the response from EP
Cypress.Commands.add('waitForResponse', (alias) => {
  cy.wait(alias);
  cy.get(`${alias}.all`).then((aliasList) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastEventResponse: any = aliasList[aliasList.length - 1];
    return cy.wrap(lastEventResponse.response);
  });
});

Cypress.Commands.add('assertRequest', (request, expectedReq) => {
  Object.keys(expectedReq).forEach((key) => {
    const actualAttr =
      request.body[
        key.replace(/[A-Z]/g, (c) => {
          return '_' + c.toLowerCase();
        })
      ];
    const expectedAttr = expectedReq[key];
    //As we cannot pass null from test level, we pass it as a string
    if (expectedAttr !== 'null') return expect(actualAttr).to.eql(expectedAttr);
    else expect(actualAttr).to.eql(null);
  });

  const expectedPackageVersion = request.url.includes('events')
    ? eventsPackageJson.version
    : personalizePackageJson.version;

  cy.getCookie(Cypress.env('COOKIE_NAME')).then((cookie) => expect(request.body.browser_id).to.eq(cookie?.value));

  expect(request.headers['x-library-version']).to.eq(expectedPackageVersion);

  if (request.url.includes('events'))
    expect(request.headers['x-client-software-id']).to.eq(`${eventsPackageJson.name} ${expectedPackageVersion}`);
});

Cypress.Commands.add('requestGuestContext', () => {
  const authorization = `Basic ${Cypress.env('GUEST_API_TOKEN')}`;
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  cy.getCookie(Cypress.env('COOKIE_NAME'))
    .should('exist')
    .then((c) => {
      const options = {
        headers: {
          authorization
        },
        method: 'GET',
        timeout: 15000,
        url: `${Cypress.env('GUEST_API_URL')}/${Cypress.env('GUEST_API_VERSION')}/guestContexts/?browserRef=${c?.value}`
      };

      cy.request(options)
        .as('guestContext')
        .then((response) => {
          cy.waitUntil(() => expect(response.body.items[0].sessions[0].events[0]).to.exist, {
            errorMsg: 'Event not returned from EP',
            interval: 100,
            timeout: 15000
          }).then(() => {
            return response.body.items[0].sessions[0].events[0];
          });
        });
    });
});

Cypress.Commands.add('getCorePackageVersion', () => {
  return corePackageJson.version;
});
