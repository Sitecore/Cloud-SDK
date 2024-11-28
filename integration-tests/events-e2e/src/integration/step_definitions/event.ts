import { defineStep } from '@badeball/cypress-cucumber-preprocessor';

defineStep('the event parameters are: {string}', (params: string) => {
  cy.get('[data-testid="eventDataInput"]').clear();
  cy.get('[data-testid="eventDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('the event parameters are:', (params: string) => {
  cy.get('[data-testid="eventDataInput"]').clear();
  cy.get('[data-testid="eventDataInput"]').type(params, {
    parseSpecialCharSequences: false
  });
});

defineStep('the event is sent without ext', () => {
  cy.waitForRequest('@eventRequest').then((request: any) => {
    expect(request.body.ext).to.eq(undefined);
  });
});

defineStep('the event request is sent with parameters: {string}', (params: string) => {
  const parameters = JSON.parse(params);

  cy.wait('@eventRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response?.statusCode) (globalThis as any).statusCode = response.statusCode;
    Object.keys(parameters).forEach((value) => {
      expect(request.body[value]).to.deep.equal(parameters[value]);
    });
  });
});

defineStep('the event request is sent with parameters:', (params: string) => {
  const parameters = JSON.parse(params);

  cy.wait('@eventRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response?.statusCode) (globalThis as any).statusCode = response.statusCode;
    Object.keys(parameters).forEach((value) => {
      expect(request.body[value]).to.deep.equal(parameters[value]);
    });
  });
});

defineStep('the event request is sent with headers: {string}', (headersStr: string) => {
  const headers = JSON.parse(headersStr);

  cy.wait('@eventRequest').then(({ request, response }) => {
    expect(request).to.not.equal(undefined);

    if (response?.statusCode) (globalThis as any).statusCode = response.statusCode;
    Object.keys(headers).forEach((value) => {
      expect(request.headers[value]).to.deep.equal(headers[value]);
    });
  });
});

defineStep('the request with id {string} will contain ut_api_version in the metadata', (testID: string) => {
  cy.readLocal('fetchData.json').then((fileContents: Record<string, any>) => {
    const data = JSON.parse(fileContents[testID].body)?.sc_search?.metadata?.ut_api_version;

    expect(data).to.contain('1.0');
  });
});
