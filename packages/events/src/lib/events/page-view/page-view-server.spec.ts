import { pageViewServer } from './page-view-server';
import { PageViewEventInput, PageViewEvent } from './page-view-event';
import { sendEvent } from '../send-event/sendEvent';
import * as core from '@sitecore-cloudsdk/core';

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

const extensionData = { extKey: 'extValue' };

const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');

describe('pageViewServer', () => {
  let eventData: PageViewEventInput;

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
    getSettingsServerSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    const response = await pageViewServer(eventData, req, extensionData);

    expect(PageViewEvent).toHaveBeenCalledWith({
      eventData,
      extensionData,
      id: 'test',
      searchParams: '',
      sendEvent,
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

  it('should throw error if settings have not been configured properly', () => {
    getSettingsServerSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await pageViewServer(eventData, req, extensionData)).rejects.toThrow(
      `[IE-0005] You must first initialize the "events/server" module. Run the "init" function.`
    );
  });
});
