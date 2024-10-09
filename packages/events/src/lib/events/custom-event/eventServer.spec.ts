import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { eventServer } from './eventServer';

jest.mock('../../init/server/initializer');
jest.mock('./custom-event');

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
    ...originalModule
  };
});

jest.mock('@sitecore-cloudsdk/core/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettings: jest.fn(),
    getEnabledPackage: jest.fn()
  };
});

describe('eventServer', () => {
  let eventData: EventData;
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
    jest.clearAllMocks();
  });

  beforeEach(() => {
    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      extensionData: {
        extKey: 'extValue'
      },
      language: 'EN',
      page: 'races',
      type: 'CUSTOM_TYPE'
    };
  });

  describe('old init', () => {
    const getCookieNameFromRequestSpy = jest
      .spyOn(coreInternalModule, 'getCookieValueFromRequest')
      .mockReturnValueOnce('1234');
    const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');

    beforeEach(() => {
      (coreInternalModule as any).builderInstanceServer = null;
    });

    it('should send a custom event to the server', async () => {
      getSettingsServerSpy.mockReturnValue({
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

      await eventServer(req, eventData);

      expect(getCookieNameFromRequestSpy).toHaveBeenCalled();
      expect(CustomEvent).toHaveBeenCalledTimes(1);
      expect(CustomEvent).toHaveBeenCalledWith({
        eventData,
        id: '1234',
        sendEvent,
        settings: {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
            cookiePath: '/'
          },
          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: ''
        }
      });
    });

    it('should throw error if settings have not been configured properly', async () => {
      getSettingsServerSpy.mockImplementation(() => {
        throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
      });

      await expect(async () => await eventServer(req, eventData)).rejects.toThrow(
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
        name: { browserId: 'bid_name' },
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
    it('should send a custom event to the server', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

      await eventServer(req, eventData);

      expect(getCookieValueFromRequestSpy).toHaveBeenCalled();
      expect(CustomEvent).toHaveBeenCalledTimes(1);
      expect(CustomEvent).toHaveBeenCalledWith({
        eventData,
        id: '1234',
        sendEvent,
        settings: newSettings
      });
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      await expect(async () => await eventServer(req, eventData)).rejects.toThrow('Test error');
    });
    it('should throw error new init used but events not initialized', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(
        () =>
          ({
            cookieSettings: { names: { browserId: 'test' } }
          } as any)
      );

      await expect(async () => await eventServer(req, eventData)).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".`
      );

      expect(CustomEvent).not.toHaveBeenCalled();
    });
  });
});
