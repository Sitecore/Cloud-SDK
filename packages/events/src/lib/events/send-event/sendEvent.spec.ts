import * as core from '@sitecore-cloudsdk/core/internal';
import * as utils from '@sitecore-cloudsdk/utils';
import { EVENTS_NAMESPACE, PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import debug from 'debug';
import { sendEvent } from './sendEvent';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

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
    cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
    cookiePath: '/'
  },
  siteName: 'site',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'http://testurl'
};

describe('EventApiClient', () => {
  const debugMock = debug as unknown as jest.Mock;
  const normalizeHeadersSpy = jest.spyOn(utils, 'normalizeHeaders');

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
  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse)
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(core, 'processDebugResponse').mockReturnValue({
      headers: {},
      redirected: undefined,
      status: undefined,
      statusText: undefined,
      url: undefined
    });
    let currentTime = 1609459200000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const returnTime = currentTime;
      currentTime += 1000;
      return returnTime;
    });

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
        'X-Library-Version': PACKAGE_VERSION
      },
      method: 'POST'
    });

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Events request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/events/v1.2/events?sitecoreContextId=123&siteId=site'
    );

    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Events response in %dms : %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
    expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
      body: { status: 'OK' },
      headers: {},
      redirected: undefined,
      status: undefined,
      statusText: undefined,
      url: undefined
    });
  });

  it('Sends event with the correct values to Sitecore Cloud and show debug', async () => {
    jest.spyOn(core, 'processDebugResponse').mockReturnValue({});
    let currentTime = 1609459200000;
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const returnTime = currentTime;
      currentTime += 1000;
      return returnTime;
    });

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
        'X-Library-Version': PACKAGE_VERSION
      },
      method: 'POST'
    });

    expect(normalizeHeadersSpy).toHaveBeenCalledTimes(0);
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
    expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
      body: { status: 'OK' }
    });
  });

  it('should return null if an error occurs and show debug', async () => {
    const mockFetch = Promise.reject('Error');

    global.fetch = jest.fn().mockImplementation(() => mockFetch);

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
