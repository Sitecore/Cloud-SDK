import * as core from '@sitecore-cloudsdk/core/internal';
import * as initializerModule from '../../init/browser/initializer';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { pageView } from './page-view';
import { sendEvent } from '../send-event/sendEvent';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettings: jest.fn()
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
jest.mock('./page-view-event', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PageViewEvent: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(() => Promise.resolve('mockedResponse'))
      };
    })
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

describe('pageView', () => {
  describe('old init', () => {
    const id = 'test_id';
    const extensionData = { extKey: 'extValue' };

    let pageViewData: PageViewData;

    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

    beforeEach(() => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);
    });

    afterEach(() => {
      pageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races'
      };
      jest.clearAllMocks();
    });

    it('should send a PageViewEvent with data', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getSettingsSpy = jest.spyOn(core, 'getSettings');
      getSettingsSpy.mockReturnValue({
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
          cookiePath: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      });

      const response = await pageView({ ...pageViewData, extensionData });

      expect(PageViewEvent).toHaveBeenCalledWith({
        id,
        pageViewData: { ...pageViewData, extensionData },
        searchParams: window.location.search,
        sendEvent,
        settings: expect.objectContaining({})
      });
      expect(response).toBe('mockedResponse');
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);
    });

    it('should send a PageViewEvent without data', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/namespace
      initializerModule.initPromise = Promise.resolve();
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getSettingsSpy = jest.spyOn(core, 'getSettings');
      getSettingsSpy.mockReturnValue({
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
          cookiePath: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      });

      const response = await pageView();

      expect(PageViewEvent).toHaveBeenCalledWith({
        id,
        searchParams: window.location.search,
        sendEvent,
        settings: expect.objectContaining({})
      });
      expect(response).toBe('mockedResponse');
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line import/namespace
      initializerModule.initPromise = Promise.resolve();
      const getSettingsSpy = jest.spyOn(core, 'getSettings');
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      getSettingsSpy.mockImplementation(() => {
        throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
      });

      await expect(async () => await pageView({ ...pageViewData, extensionData })).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0014] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/events/browser". Then, run "CloudSDK().addEvents().initialize()".`
      );
    });
  });
  describe('new init', () => {
    it('should send a PageViewEvent with data', async () => {
      const id = 'test_id';
      const extensionData = { extKey: 'extValue' };
      const pageViewData: PageViewData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races'
      };
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getCookieValueClientSideSpy = jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValueOnce(id);
      const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser').mockReturnValue({
        cookieSettings: {
          domain: 'cDomain',
          expiryDays: 730,
          names: { browserId: 'bid_name', guestId: 'gid_name' },
          path: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      });

      const response = await pageView({ ...pageViewData, extensionData });

      expect(PageViewEvent).toHaveBeenCalledWith({
        id,
        pageViewData: { ...pageViewData, extensionData },
        searchParams: window.location.search,
        sendEvent,
        settings: expect.objectContaining({})
      });
      expect(response).toBe('mockedResponse');
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
