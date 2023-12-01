import { pageViewServer } from './page-view-server';
import { getServerDependencies } from '../../initializer/server/initializer';
import { PageViewEventInput, PageViewEvent } from './page-view-event';
import * as init from '../../initializer/server/initializer';
import * as core from '@sitecore-cloudsdk/core';
import { EventApiClient } from '../../ep/EventApiClient';

jest.mock('../../initializer/server/initializer');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('./page-view-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PageViewEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse')),
      };
    }),
  };
});

describe('pageViewServer', () => {
  let eventData: PageViewEventInput;
  const eventApiClient = new EventApiClient('http://test.com', '123', '456');
  const settings: core.Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };

  jest.spyOn(init, 'getServerDependencies').mockReturnValueOnce({
    eventApiClient: eventApiClient,
    settings: settings,
  });

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };

  afterEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };
    jest.clearAllMocks();
  });

  it('should send a PageViewEvent to the server', async () => {
    const extensionData = { extKey: 'extValue' };
    const response = await pageViewServer(eventData, req, extensionData);

    expect(getServerDependencies).toHaveBeenCalled();
    expect(PageViewEvent).toHaveBeenCalledWith({
      eventApiClient: eventApiClient,
      eventData,
      extensionData,
      id: 'test',
      searchParams: '',
      settings: {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/',
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: '',
      },
    });
    expect(response).toBe('mockedResponse');
  });
});
