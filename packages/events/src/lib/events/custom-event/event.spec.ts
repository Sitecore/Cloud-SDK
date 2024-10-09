import * as core from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import * as initializerModule from '../../init/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';
import type { EventData } from './custom-event';
import { event } from './event';

jest.mock('../../initializer/browser/initializer');
jest.mock('./custom-event');
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
    ...originalModule,
    getCookieValueClientSide: jest.fn()
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

describe('event', () => {
  describe('old init', () => {
    let eventData: EventData;
    const id = 'test_id';
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

    const getSettingsSpy = jest.spyOn(core, 'getSettings');

    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);
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

    it('should send a custom event to the server', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
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

      await event(eventData);

      expect(CustomEvent).toHaveBeenCalledWith({
        eventData,
        id,
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

      expect(CustomEvent).toHaveBeenCalledTimes(1);
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      getSettingsSpy.mockImplementation(() => {
        throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
      });

      await expect(async () => await event(eventData)).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0014] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/events/browser". Then, run "CloudSDK().addEvents().initialize()".`
      );
    });
  });
  describe('new init', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send a custom event to the server', async () => {
      const id = 'test_id';
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        extensionData: {
          extKey: 'extValue'
        },
        language: 'EN',
        page: 'races',
        type: 'CUSTOM_TYPE'
      };
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getCookieValueClientSideSpy = jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValueOnce(id);
      const getSettingsSpy = jest.spyOn(core, 'getCloudSDKSettingsBrowser').mockReturnValue({
        cookieSettings: {
          domain: 'cDomain',
          expiryDays: 730,
          name: { browserId: 'bid_name' },
          path: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: ''
      });

      await event(eventData);

      expect(CustomEvent).toHaveBeenCalledWith({
        eventData,
        id,
        sendEvent,
        settings: {
          cookieSettings: {
            domain: 'cDomain',
            expiryDays: 730,
            name: { browserId: 'bid_name' },
            path: '/'
          },
          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: ''
        }
      });

      expect(CustomEvent).toHaveBeenCalledTimes(1);
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
