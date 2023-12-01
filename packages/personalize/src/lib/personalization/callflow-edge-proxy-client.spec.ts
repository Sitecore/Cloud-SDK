import { CallFlowEdgeProxyClient, EPCallFlowsBody } from './callflow-edge-proxy-client';
import { LIBRARY_VERSION } from '../consts';
import { Settings, SITECORE_EDGE_URL } from '@sitecore-cloudsdk/core';

describe('Test Base CallFlow Base Class', () => {
  let data: EPCallFlowsBody;
  let settingsMock: Settings;

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as unknown),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    data = {
      channel: 'WEB',
      clientKey: '',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: '',
    };

    settingsMock = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: SITECORE_EDGE_URL,
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
      pointOfSale: '',
    };
    new CallFlowEdgeProxyClient(settingsMock).sendCallFlowsRequest(expectedBody).then(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${SITECORE_EDGE_URL}/personalize/v2/callFlows?sitecoreContextId=${settingsMock.sitecoreEdgeContextId}&siteId=${settingsMock.siteName}`,
        {
          body: JSON.stringify(expectedBody),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { 'Content-Type': 'application/json', 'X-Library-Version': LIBRARY_VERSION },
          method: 'POST',
        }
      );
    });
  });

  it('test sendCallFlow functionality', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve('banana') });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const sendCallFlowSpy = jest.spyOn(CallFlowEdgeProxyClient.prototype, 'sendCallFlowsRequest');

    data.email = 'test';
    data.identifiers = {
      id: '1',
      provider: 'email',
    };
    data.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await new CallFlowEdgeProxyClient(settingsMock).sendCallFlowsRequest(data);

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

    const response = await new CallFlowEdgeProxyClient(settingsMock).sendCallFlowsRequest(data);
    expect(response).toEqual(null);
  });
});
