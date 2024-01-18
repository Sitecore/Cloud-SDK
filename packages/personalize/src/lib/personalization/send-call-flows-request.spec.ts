import { EPResponse } from '@sitecore-cloudsdk/core';
import { sendCallFlowsRequest, EPCallFlowsBody } from './send-call-flows-request';
import * as core from '@sitecore-cloudsdk/core';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const settingsObj: core.Settings = {
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieName: 'name',
    cookiePath: '/',
  },
  siteName: 'site',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'http://testurl',
};


describe('CallFlow sendCallFlowsRequest', () => {
  let personalizeData: EPCallFlowsBody;

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    personalizeData = {
      channel: 'WEB',
      clientKey: '',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends personalize with the correct values', async () => {
    personalizeData = {
      channel: 'WEB',
      clientKey: 'key',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: '',
    };

    sendCallFlowsRequest(personalizeData, settingsObj);

    return sendCallFlowsRequest(personalizeData, settingsObj).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });
  });

  it('should return null if an error occurs', async () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj);
    expect(response).toEqual(null);
  });
});
