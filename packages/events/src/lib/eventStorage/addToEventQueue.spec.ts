import * as core from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type { EventData } from '../events/custom-event/custom-event';
import * as initializerModule from '../init/browser/initializer';
import { addToEventQueue } from './addToEventQueue';
import * as eventQueue from './eventStorage';

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
    ...originalModule,
    getCookieValueClientSide: jest.fn()
  };
});

const eventData: EventData = {
  channel: 'WEB',
  currency: 'EUR',
  language: 'EN',
  page: 'races',
  type: 'TEST_TYPE'
};

describe('addToEventQueue', () => {
  describe('old init', () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    beforeEach(() => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should add an event to the queue with the correct payload', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      jest.spyOn(core, 'getSettings').mockReturnValueOnce({} as core.Settings);
      jest.spyOn(core, 'getBrowserId').mockReturnValueOnce('id');

      const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

      await addToEventQueue(eventData);

      expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getSettingsSpy = jest.spyOn(core, 'getSettings');

      getSettingsSpy.mockImplementation(() => {
        throw new Error(ErrorMessages.IE_0008);
      });

      await expect(async () => await addToEventQueue(eventData)).rejects.toThrow(ErrorMessages.IE_0014);
    });
  });
  describe('new init', () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should add an event to the queue with the correct payload', async () => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getCookieValueClientSideSpy = jest
        .spyOn(utilsModule, 'getCookieValueClientSide')
        .mockReturnValueOnce('test_id');
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

      const enqueueEventSpy = jest.spyOn(eventQueue.eventQueue, 'enqueueEvent');

      await addToEventQueue(eventData);

      expect(enqueueEventSpy).toHaveBeenCalledTimes(1);
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
