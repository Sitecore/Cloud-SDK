import * as core from '@sitecore-cloudsdk/core';
import { EVENTS_NAMESPACE, LIBRARY_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { EPResponse } from '@sitecore-cloudsdk/core';
import debug from 'debug';
import { sendEvent } from './sendEvent';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

const settingsObj: core.Settings = {
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieName: 'name',
    cookiePath: '/'
  },
  siteName: 'site',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'http://testurl'
};

describe('EventApiClient', () => {
  const debugMock = debug as unknown as jest.Mock;

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as EPResponse)
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    const eventData = {
      /* eslint-disable @typescript-eslint/naming-convention */
      browser_id: 'cbb8da7f-ef24-48fe-89f4-f5c5186b607d',
      channel: 'WEB',
      client_key: '',
      currency: 'EUR',
      ext: {
        a: 'test'
      },
      language: 'EN',
      page: 'races',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z',
      type: 'CUSTOM_TYPE'
    };

    const expectedBody = JSON.stringify(eventData);
    const expectedUrl = 'http://testurl/v1/events/v1.2/events?sitecoreContextId=123&siteId=site';

    await sendEvent(eventData, settingsObj).then((data) => {
      expect(data).toEqual({
        status: 'OK'
      });
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      body: expectedBody,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
        'X-Library-Version': LIBRARY_VERSION
      },
      method: 'POST'
    });

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Events request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/events/v1.2/events?sitecoreContextId=123&siteId=site'
    );
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Events response: %O');
    expect(debugMock.mock.results[2].value.mock.calls[0][0]).toBe('Events payload: %O');
  });

  it('should return null if an error occurs and show debug', async () => {
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
      requested_at: '2024-01-01T00:00:00.000Z',
      type: 'CUSTOM_TYPE'
    };

    const response = await sendEvent(eventData, settingsObj);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Events request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/events/v1.2/events?sitecoreContextId=123&siteId=site'
    );
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Error: events response: %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe('Error');
  });
});
