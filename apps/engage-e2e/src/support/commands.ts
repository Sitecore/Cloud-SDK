/* eslint-disable @nx/enforce-module-boundaries */
import eventsPackageJson from '../../../../packages/events/package.json';
import personalizePackageJson from '../../../../packages/personalize/package.json';

export {};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      assertRequest(expectedReq: any, request: any): void;
      assertRequestBody(testID: string, bodyAttributeName: string): void;
      assertRequestBodyNotContaining(testID: string, bodyAttributeName: string): void;
      assertRequestHeader(testID: string, headerName: string, headerValue?: string): void;
      assertLogs(testID: string, log: string): void;
      assertLogsNotContaining(testID: string, log: string): void;
      assertRequestHeaders(request: any, expectedReqHeaders: any): void;
      getLogOutput(): any;
      waitForRequest(alias: string): any;
      waitForResponse(alias: string): any;
      convertToSnakeCase(str: string): string;
      writeLocal(fileName: string, content: any): void;
      readLocal(fileName: string): any;
      visit(url: string, options: string): void;
      requestGuestContext(): any;
      replace(filePath: string, regex: any, text: string): void;
    }
  }

  interface JQuery {
    args: [];
  }
}

// Asserts the provided header data from the stored file in fixtures,
// the data is added by the Next app with the request decorators
Cypress.Commands.add('assertRequestHeader', (testID: string, headerName: string, headerValue?: string) => {
  cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        expect(fileContents[testID].headers).to.have.property(headerName);

        if (headerValue) expect(fileContents[testID].headers[headerName]).to.contain(headerValue);
      }),
    {
      errorMsg: 'Error not found',
      timeout: 15000,
      interval: 100
    }
  );
});

// Asserts the provided attribute value from the stored file in fixtures,
// the data is added by the Next app with the request decorators
Cypress.Commands.add('assertRequestBody', (testID, bodyAttributeName) => {
  cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        const body = JSON.parse(fileContents[testID].body);

        expect(body).to.have.property(bodyAttributeName);
      }),
    {
      errorMsg: 'Request body not found',
      timeout: 15000,
      interval: 100
    }
  );
});

// Asserts the provided attribute is not present in stored file in fixtures,
// the data is added by the Next app with the request decorators
Cypress.Commands.add('assertRequestBodyNotContaining', (testID, bodyAttributeName) => {
  cy.waitUntil(
    () =>
      cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
        const body = JSON.parse(fileContents[testID].body);

        expect(body[bodyAttributeName]).to.be.undefined;
      }),
    {
      errorMsg: 'Request body not found',
      timeout: 15000,
      interval: 100
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
      timeout: 15000,
      interval: 100
    }
  );
});

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
      timeout: 15000,
      interval: 100
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

//Returns the request made for the latest alias during a run
Cypress.Commands.add('waitForRequest', (alias) => {
  cy.wait(alias);
  cy.get(`${alias}.all`).then((aliasList) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastEventRequest: any = aliasList[aliasList.length - 1];
    return cy.wrap(lastEventRequest.request);
  });
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

Cypress.Commands.add('writeLocal', (fileName, content) => {
  cy.writeFile(`src/fixtures/local/${fileName}`, content);
});

Cypress.Commands.add('readLocal', (fileName) => {
  let value: any;
  cy.readFile(`src/fixtures/local/${fileName}`).then((content) => (value = content));
  return value;
});

Cypress.Commands.add('assertRequestHeaders', (request, expectedReqHeaders) => {
  for (const entry of expectedReqHeaders) expect(request.headers[entry.name]).to.contain(entry.value);
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
        method: 'GET',
        url: `${Cypress.env('GUEST_API_URL')}/${Cypress.env('GUEST_API_VERSION')}/guestContexts/?browserRef=${
          c?.value
        }`,
        headers: {
          authorization
        },
        timeout: 15000
      };

      cy.request(options)
        .as('guestContext')
        .then((response) => {
          cy
            .waitUntil(() => expect(response.body.items[0].sessions[0].events[0]).to.exist)
            .then(() => {
              return response.body.items[0].sessions[0].events[0];
            }),
            {
              errorMsg: 'Event not returned from EP',
              timeout: 15000,
              interval: 100
            };
        });
    });
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
