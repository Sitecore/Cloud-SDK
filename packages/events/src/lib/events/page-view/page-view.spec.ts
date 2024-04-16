import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../../initializer/browser/initializer';
import { PageViewData, PageViewEvent } from './page-view-event';
import { pageView } from './page-view';
import { sendEvent } from '../send-event/sendEvent';

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

describe('pageView', () => {
  const id = 'test_id';
  const extensionData = { extKey: 'extValue' };

  let pageViewData: PageViewData;

  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

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
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue({
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

    const response = await pageView({ ...pageViewData, extensionData });

    expect(PageViewEvent).toHaveBeenCalledWith({
      id,
      pageViewData: { ...pageViewData, extensionData },
      searchParams: window.location.search,
      sendEvent,
      settings: expect.objectContaining({}),
    });
    expect(response).toBe('mockedResponse');
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', async () => {
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await pageView({ ...pageViewData, extensionData })).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});
