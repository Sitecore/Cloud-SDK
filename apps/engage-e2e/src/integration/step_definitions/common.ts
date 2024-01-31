/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types="cypress" />
// Above line needed as indicator for Cypress
import { Given, When, Then, defineStep } from '@badeball/cypress-cucumber-preprocessor';
import { Utils } from '../../support/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let statusCode: number;
let errorMessage: string;
beforeEach(() => {
  errorMessage = '';
  cy.on('uncaught:exception', (error) => {
    errorMessage = error.message;
    return false;
  });
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
  // eslint-disable-next-line max-len
  cy.intercept(`https://${Cypress.env('HOSTNAME_STAGING')}/events/${Cypress.env('API_VERSION')}/browser/*`).as(
    'initialCallStg'
  );
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/events/${Cypress.env('API_VERSION')}/events*`).as(
    'eventRequest'
  );
  cy.intercept(`https://${Cypress.env('HOSTNAME')}/events/${Cypress.env('API_VERSION')}/browser/*`).as('initialCall');
  cy.intercept('GET', `${Cypress.config('baseUrl')}/api/pageview-event*`).as('sendTriggerEvent');
  cy.intercept('GET', `${Cypress.config('baseUrl')}/api/identity-event*`).as('sendTriggerEvent');
  cy.intercept('GET', `${Cypress.config('baseUrl')}/api/custom-event*`).as('sendTriggerEvent');
});

// Class Common describes common step definitions

Then('the event is sent with {string} type', (eventType: string, datatable) => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    const expectedReq = Utils.createExpectedEventReq(eventType, datatable);
    cy.assertRequest(request, expectedReq);
    cy.writeLocal('request.json', request);
  });
});

Then('the event is sent successfully from the server', () => {
  cy.waitForResponse('@sendTriggerEvent').then((response: any) => {
    const actualStatus = response.statusCode;
    expect(actualStatus).to.eq(200);
    expect(response.body.client_key).to.eq(Cypress.env('CLIENT_KEY'));
  });
});

Then('api server event request responds with status code {string}', (expectedStatus: string) => {
  cy.waitForResponse('@sendTriggerEvent').then((response: any) => {
    const actualStatus = response.statusCode;
    expect(actualStatus).to.eq(Number(expectedStatus));
  });
});

defineStep('initial call returns {string}', (expectedStatus: string) => {
  cy.waitForResponse('@initialCall').then((response: any) => {
    const actualStatus = response.statusCode;
    expect(actualStatus).to.eq(Number(expectedStatus));
  });
});

defineStep('the {string} page is loaded', (page: string) => {
  // eslint-disable-next-line max-len
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/personalize/${Cypress.env('CALLFLOW_API_VERSION')}/callFlows*`
  ).as('personalizeRequest');
  cy.visit(page);

  cy.wait('@initialCall', { timeout: 30000 });

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq(page);
  });
  cy.get('body').should('be.visible');
});

defineStep('the {string} string is printed in {string} element', (message: string, element: string) => {
  const selector = `[data-testid="${element}"]`;

  cy.get(selector).scrollIntoView().should('be.visible');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.waitUntil(() => cy.get(selector).contains(message), {
    errorMsg: 'Server error not found',
    timeout: 10000,
    interval: 100,
  });
});

defineStep('the {string} page is loaded without init function', (page: string) => {
  cy.visit(page);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  cy.location().should((loc) => {
    expect(`${loc.pathname}${loc.search}`).to.eq(page);
  });
});

defineStep('the {string} page is loaded with query parameters:', (page: string, params: string) => {
  // eslint-disable-next-line max-len
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/personalize/${Cypress.env('CALLFLOW_API_VERSION')}/callFlows*`
  ).as('personalizeRequest');
  // eslint-disable-next-line max-len
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/events/${Cypress.env('API_VERSION')}/events*`).as(
    'eventRequest'
  );

  let searchString = '';
  const parameters = JSON.parse(params);

  const queryParams = '?' + new URLSearchParams(parameters).toString();
  searchString = page + queryParams;
  cy.visit(searchString, {
    onBeforeLoad(win) {
      cy.stub(win.console, 'warn').as('consoleWarn');
    },
  });
  cy.wait('@initialCall');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('body')
    .should('be.visible')
    .then(() => cy.writeLocal(`error.txt`, errorMessage));
  cy.get('body').should('be.visible');
});

//Visit page with the provided query parameters
defineStep('the {string} page is loaded with query parameters', (page: string, datatable: any) => {
  // eslint-disable-next-line max-len
  cy.intercept(
    'POST',
    `https://${Cypress.env('HOSTNAME')}/personalize/${Cypress.env('CALLFLOW_API_VERSION')}/callFlows*`
  ).as('personalizeRequest');
  // eslint-disable-next-line max-len
  cy.intercept('POST', `https://${Cypress.env('HOSTNAME')}/events/${Cypress.env('API_VERSION')}/events*`).as(
    'eventRequest'
  );
  const attributesArray: { key: string; value: string }[] = [];
  const attributes = datatable.hashes()[0];
  let searchString = '';
  let extSearchString = '';

  //In order to test the amount of ext attributes that can be sent to EP
  if (Object.getOwnPropertyDescriptor(attributes, 'extAttributesNumber')) {
    for (let i = 0; i < attributes.extAttributesNumber; i++) {
      attributesArray.push({ key: `attr${i}`, value: `value${i}` });
    }
    delete attributes.extAttributesNumber;

    extSearchString = `${
      attributesArray.length ? attributesArray.map((attr) => `&${attr.key}=${attr.value}`).join('') : ''
    }`;
  }

  if (Object.getOwnPropertyDescriptor(attributes, 'nested')) {
    extSearchString = extSearchString + `${attributes.nested ? `&nested=${attributes.nested}` : ''}`;
    delete attributes.nested;
  }

  const queryParams = '?' + new URLSearchParams(attributes).toString() + (extSearchString ? extSearchString : '');
  searchString = page + queryParams;
  cy.visit(searchString, {
    onBeforeLoad(win) {
      cy.stub(win.console, 'warn').as('consoleWarn');
    },
  });

  cy.wait('@initialCall', { timeout: 30000 });

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get('body')
    .should('be.visible')
    .then(() => cy.writeLocal(`error.txt`, errorMessage));
});

defineStep('no cookie exists on the {string} page', (page: string) => {
  cy.intercept('*', { hostname: Cypress.env('HOSTNAME') }, (req) => {
    req.continue((res) => {
      res.body = {
        ref: '1234',
        status: '200',
        version: Cypress.env('API_VERSION'),
      };
    });
  }).as('bIdRequest');
  cy.clearCookies();
  cy.visit(page);
});

Then('an error is thrown: {string}', (expectedError: string) => {
  //Allowing for the error to be printed on console and retrieved from cypress fixtures
  cy.waitUntil(() => cy.readLocal('error.txt').then((actualError: string) => actualError !== ''), {
    errorMsg: 'Error not found',
    timeout: 15000,
    interval: 100,
  });
  cy.readLocal('error.txt').should('include', expectedError);
});

defineStep('the {string} button is clicked', (event: string) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1200);
  const selector = `[data-testid="${event}"]`;
  cy.on('uncaught:exception', (error) => {
    errorMessage = error.message;
    return false;
  });

  // eslint-disable-next-line cypress/unsafe-to-chain-command
  //We do not want Cypress to click on buttons before Engage is present in window object
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get(selector)
    .should('be.visible')
    .click()
    .then(() => cy.writeLocal(`error.txt`, errorMessage));
});

Given('no cookie is created on the {string} page', (page: string) => {
  cy.intercept(`${Cypress.config('baseUrl')}${page}*`).as('callToServer');
  cy.clearCookies();
});

defineStep('the {string} ext property is undefined', (property: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.readLocal('request.json').then((request: any) => {
    expect(request.body[property]).to.eq(undefined);
    if (request.body.ext) {
      expect(request.body.ext[property]).to.eq(undefined);
    }
  });
});

defineStep('channel, page, language & currency are undefined', () => {
  cy.readLocal('request.json').then((request: any) => {
    expect(request.body.language).to.deep.equal(undefined);
    expect(request.body.currency).to.eq(undefined);
    expect(request.body.page).to.eq(undefined);
    expect(request.body.channel).to.eq(undefined);
  });
});

Then('the event is sent without ext', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.ext).to.eq(undefined);
  });
});

When('page is reloaded', () => {
  cy.reload();
});

defineStep('a {string} warning is displayed on the console', (warning: string) => {
  cy.get('@consoleWarn').should('be.calledWith', warning);
});

defineStep('the queue is null', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.window()
    .its('sessionStorage')
    .then((storage) => {
      expect(storage.getItem('EventQueue')).to.be.null;
    });
});

Then('the {string} event is sent with the following parameters in the ext object', (event: string, datatable: any) => {
  const parameters = datatable.hashes()[0];

  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.type).to.equal(event);

    Object.keys(parameters).forEach(function (key) {
      expect(request.body.ext[key]).to.equal(parameters[key]);
      expect(request.body[key]).to.be.undefined;
    });

    cy.writeLocal('request.json', request);
  });
});

Then('the {string} request is sent with parameters:', (requestType: string, params: string) => {
  const parameters = JSON.parse(params);
  cy.waitForRequest(`@${requestType.toLowerCase()}Request`).then((request: any) => {
    Object.keys(parameters).forEach(function (key) {
      expect(request.body[key]).to.equal(parameters[key]);
    });

    cy.writeLocal('request.json', request);
  });
});

defineStep('the event parameters are:', (params: string) => {
  const parameters = JSON.parse(params);
  if (parameters.type) {
    cy.get('[data-testid="type"]').clear().type(parameters.type);
    delete parameters.type;
  }
  if (parameters.ext) {
    cy.get('[data-testid="ext"]').clear().type(JSON.stringify(parameters.ext), { parseSpecialCharSequences: false });
    delete parameters.ext;
  }
  // eslint-disable-next-line max-len
  if (Object.keys(parameters).length > 0)
    cy.get('[data-testid="topLevelAttributes"]')
      .clear()
      .type(JSON.stringify(parameters), { parseSpecialCharSequences: false });
});

defineStep('the event request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);
  cy.wait('@eventRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response) statusCode = response.statusCode;
    Object.keys(parameters).forEach((value) => {
      expect(request.body[value]).to.deep.equal(parameters[value]);
    });
  });
});

defineStep('{string} ext attributes are added', (numberOfAttributes: string) => {
  cy.get('[data-testid="numberOfExtAttr"]').clear().type(numberOfAttributes);
});

defineStep('ext contains {string} attributes', (numberOfAttributes: string) => {
  cy.wait('@eventRequest').then(({ request }) => {
    expect(Object.keys(request.body['ext']).length).to.equal(Number(numberOfAttributes));
  });
});

Then('EP API responds with {string} status code', (expectedStatus: string) => {
  cy.wait('@eventRequest').then(({ response }) => {
    expect(response?.statusCode).to.equal(+expectedStatus);
  });
});

Then('the request is sent with staging url', () => {
  cy.wait('@initialCallStg').then(({ request }) => {
    expect(request.url).to.contain(Cypress.env('HOSTNAME_STAGING'));
  });
});
