import { ICdpResponse } from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../cdp/EventApiClient';
import { LIBRARY_VERSION } from '../consts';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('EventApiClient', () => {
  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud', () => {
    const eventData = {
      /* eslint-disable @typescript-eslint/naming-convention */
      browser_id: 'cbb8da7f-ef24-48fe-89f4-f5c5186b607d',
      channel: 'WEB',
      client_key: '',
      currency: 'EUR',
      ext: {
        a: 'test',
      },
      language: 'EN',
      page: 'races',
      pos: '',
      type: 'CUSTOM_TYPE',
    };

    const eventApiClient = new EventApiClient('http://testurl', '123', 'site');
    const expectedUrl = 'http://testurl/events/v1.2/events?sitecoreContextId=123&siteId=site';
    const expectedBody = JSON.stringify(eventData);

    eventApiClient.send(eventData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      body: expectedBody,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {
        'Content-Type': 'application/json',
        'X-Library-Version': LIBRARY_VERSION,
      },
      method: 'POST',
    });
    return eventApiClient.send(eventData).then((data) => {
      expect(data).toEqual({
        status: 'OK',
      });
    });
  });

  it('should return null if an error occurs', async () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const eventData = {
      /* eslint-disable @typescript-eslint/naming-convention */
      browser_id: 'cbb8da7f-ef24-48fe-89f4-f5c5186b607d',
      channel: 'WEB',
      client_key: 'key',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pos: 'spinair.com',
      type: 'CUSTOM_TYPE',
    };

    const response = await new EventApiClient('http://testurl', '123', '').send(eventData);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);
  });
});
