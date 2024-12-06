import * as core from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import * as initializerModule from '../init/browser/initializer';
import { getGuestId } from './getGuestId';

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

describe('getGuestId', () => {
  describe('old init', () => {
    const getGuestIdSpy = jest.spyOn(core, 'getGuestId');
    const id = 'test_id';
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    const getSettingsWrapperSpy = jest.spyOn(core, 'handleGetSettingsError');

    const awaitInitSpy = jest.spyOn(initializerModule, 'awaitInit');

    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    beforeEach(() => {
      jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
      awaitInitSpy.mockResolvedValueOnce();
      getSettingsSpy.mockReturnValue({
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
          cookiePath: '/'
        },
        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: 'https://localhost'
      });

      getGuestIdSpy.mockResolvedValueOnce('guestID');

      const guestID = await getGuestId();
      expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
      expect(guestID).toBe('guestID');
      expect(getSettingsWrapperSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      awaitInitSpy.mockResolvedValue();
      getSettingsSpy.mockImplementation(() => {
        throw new Error(ErrorMessages.IE_0008);
      });

      await expect(async () => await getGuestId()).rejects.toThrow(ErrorMessages.IE_0014);
    });
  });
  describe('new init', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call getGuestIdFromCore with the correct parameters and resolve with guestId', async () => {
      const id = 'test_id';
      const getGuestIdSpy = jest.spyOn(core, 'getGuestId');
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

      getGuestIdSpy.mockResolvedValueOnce('guestID');

      const guestID = await getGuestId();
      expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
      expect(guestID).toBe('guestID');
      expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
