import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { pageViewServer } from './page-view-server';
import { sendEvent } from '../send-event/sendEvent';

jest.mock('../../init/server/initializer');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn()
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

jest.mock('@sitecore-cloudsdk/core/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('pageViewServer', () => {
  const extensionData = { extKey: 'extValue' };

  let pageViewData: PageViewData;

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined
    },
    headers: {
      get: () => '',
      host: ''
    },
    ip: undefined,
    url: ''
  };

  afterEach(() => {
    pageViewData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races'
    };
    jest.clearAllMocks();
  });

  describe('old init', () => {
    const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
    const getCookieNameFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = null;
    });

    it('should send a PageViewEvent to the server', async () => {
      const mockSettings = {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
          cookiePath: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      };
      getSettingsServerSpy.mockReturnValue(mockSettings);

      const response = await pageViewServer(req, { ...pageViewData, extensionData });

      expect(getCookieNameFromRequestSpy).toHaveBeenCalled();
      expect(PageViewEvent).toHaveBeenCalledWith({
        id: '1234',
        pageViewData: { ...pageViewData, extensionData },
        searchParams: '',
        sendEvent,
        settings: mockSettings
      });
      expect(response).toBe('mockedResponse');
    });

    it('should throw error if settings have not been configured properly', async () => {
      getSettingsServerSpy.mockImplementation(() => {
        throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
      });

      await expect(async () => await pageViewServer(req, { ...pageViewData, extensionData })).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".`
      );
    });
  });

  describe('new init', () => {
    const newSettings = {
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        names: { browserId: 'bid_name', guestId: 'gid_name' },
        path: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    };

    const getCookieValueFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');
    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = {};
    });

    it('should send a PageViewEvent to the server', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

      const response = await pageViewServer(req, { ...pageViewData, extensionData });

      expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
      expect(PageViewEvent).toHaveBeenCalledWith({
        id: '1234',
        pageViewData: { ...pageViewData, extensionData },
        searchParams: '',
        sendEvent,
        settings: newSettings
      });
      expect(response).toBe('mockedResponse');
    });
    it('should throw error new init used but events not initialized', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(
        () =>
          ({
            cookieSettings: { names: { browserId: 'test' } }
          } as any)
      );

      await expect(async () => await pageViewServer(req)).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".`
      );

      expect(PageViewEvent).not.toHaveBeenCalled();
    });
  });
});
