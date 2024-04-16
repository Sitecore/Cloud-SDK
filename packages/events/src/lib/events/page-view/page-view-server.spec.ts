import * as core from '@sitecore-cloudsdk/core';
import { PageViewData, PageViewEvent } from './page-view-event';
import { pageViewServer } from './page-view-server';
import { sendEvent } from '../send-event/sendEvent';

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
  const extensionData = { extKey: 'extValue' };

  let pageViewData: PageViewData;

  const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');

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
    pageViewData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
    };
    jest.clearAllMocks();
  });

  it('should send a PageViewEvent to the server', async () => {
    const mockSettings = {
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
    getSettingsServerSpy.mockReturnValue(mockSettings);

    const response = await pageViewServer(req, { ...pageViewData, extensionData });

    expect(PageViewEvent).toHaveBeenCalledWith({
      id: 'test',
      pageViewData: { ...pageViewData, extensionData },
      searchParams: '',
      sendEvent,
      settings: mockSettings,
    });
    expect(response).toBe('mockedResponse');
  });

  it('should throw error if settings have not been configured properly', async () => {
    getSettingsServerSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await pageViewServer(req, { ...pageViewData, extensionData })).rejects.toThrow(
      `[IE-0005] You must first initialize the "events/server" module. Run the "init" function.`
    );
  });
});
