import { CallFlowCDPClient, ICdpCallFlowsBody } from './callflow-cdp-client';
import { LIBRARY_VERSION } from '../consts';
import { ISettings } from '@sitecore-cloudsdk/engage-core';

describe('Test Base CallFlow Base Class', () => {
  let data: ICdpCallFlowsBody;
  let settingsMock: ISettings;

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as unknown),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    data = {
      channel: 'WEB',
      clientKey: 'key',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: 'spinair.com',
    };

    settingsMock = {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch with the appropriate data', async () => {
    const mockFetch = Promise.resolve('test');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const expectedBody = {
      channel: 'WEB',
      clientKey: 'key',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: 'spinair.com',
    };
    new CallFlowCDPClient(settingsMock).sendCallFlowsRequest(expectedBody).then(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://domain/v2/callFlows', {
        body: JSON.stringify(expectedBody),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Content-Type': 'application/json', 'X-Library-Version': LIBRARY_VERSION },
        method: 'POST',
      });
    });
  });

  it('test sendCallFlow functionality', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve('banana') });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const sendCallFlowSpy = jest.spyOn(CallFlowCDPClient.prototype, 'sendCallFlowsRequest');

    data.email = 'test';
    data.identifiers = {
      id: '1',
      provider: 'email',
    };
    data.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await new CallFlowCDPClient(settingsMock).sendCallFlowsRequest(data);

    expect(response).toEqual('banana');
    expect(sendCallFlowSpy).toHaveBeenCalledTimes(1);
    expect(sendCallFlowSpy).toHaveBeenCalledWith(data);
  });

  it('should return null if an error occurs', async () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    data.email = 'test';
    data.identifiers = {
      id: '1',
      provider: 'email',
    };
    data.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await new CallFlowCDPClient(settingsMock).sendCallFlowsRequest(data);
    expect(response).toEqual(null);
  });
});
