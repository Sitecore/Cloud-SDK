import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as utilsModule from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import * as initializerModule from '../init/client/initializer';
import { personalize } from './personalize';
import { Personalizer } from './personalizer';

jest.mock('./personalizer');

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn()
  };
});

jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
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
describe('personalize', () => {
  describe('old init', () => {
    const browserId = 'browser_id_value';
    const guestId = 'guest_id_value';
    const personalizeData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com'
    };

    const settings = {
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

    let windowSpy: jest.SpyInstance;

    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    jest.spyOn(coreInternalModule, 'getBrowserId').mockReturnValue(browserId);
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue(guestId);

    jest.spyOn(coreInternalModule, 'createCookies').mock;

    beforeEach(() => {
      jest.clearAllMocks();
      windowSpy = jest.spyOn(globalThis, 'window', 'get');
    });

    it('should return an object with available functionality', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getSettings');
      getSettingsSpy.mockReturnValue(settings);

      await personalize(personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(Personalizer).toHaveBeenCalledTimes(1);
      expect(coreInternalModule.getBrowserId).toHaveBeenCalledTimes(1);
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(settings.cookieSettings.cookieNames.guestId);
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledTimes(1);
    });

    it('should throw error if settings have not been configured properly', async () => {
      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getSettings');
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      getSettingsSpy.mockImplementation(() => {
        throw new Error(ErrorMessages.IE_0006);
      });

      await expect(async () => await personalize(personalizeData)).rejects.toThrow(ErrorMessages.IE_0016);
    });

    it('should call getInteractiveExperience with timeout in opts object', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getSettings');
      getSettingsSpy.mockReturnValue(settings);

      await personalize(personalizeData, { timeout: 100 });

      const expectedOpts = { timeout: 100 };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without opts object', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getSettings');
      getSettingsSpy.mockReturnValue(settings);

      await personalize(personalizeData);

      const expectedOpts = { timeout: undefined };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without search params', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getSettings');
      getSettingsSpy.mockReturnValue(settings);

      windowSpy.mockImplementation(() => ({
        location: {
          search: '?utm_campaign=campaign&utm_medium=email'
        }
      }));

      await personalize(personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        settings,
        '?utm_campaign=campaign&utm_medium=email',
        { timeout: undefined }
      );
    });
  });

  describe('new init', () => {
    const browserId = 'browser_id_value';
    const guestId = 'guest_id_value';
    const personalizeData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com'
    };

    const settings = {
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

    const personalizeSettings = {
      initState: true,
      settings: {
        cookieSettings: { name: { guestId: '123456' } },
        enablePersonalizeCookie: false
      }
    };

    let windowSpy: jest.SpyInstance;

    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    jest.spyOn(coreInternalModule, 'getBrowserId').mockReturnValue(browserId);
    jest.spyOn(utilsModule, 'getCookieValueClientSide').mockReturnValue(guestId);

    jest.spyOn(coreInternalModule, 'createCookies').mock;

    beforeEach(() => {
      jest.clearAllMocks();
      windowSpy = jest.spyOn(globalThis, 'window', 'get');
    });
    it('should return an object with available functionality', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue(personalizeSettings as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue(settings);

      expect(typeof personalize).toBe('function');

      getSettingsSpy.mockReturnValue(settings);

      await personalize(personalizeData);

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(Personalizer).toHaveBeenCalledTimes(1);
      expect(utilsModule.getCookieValueClientSide).toHaveBeenCalledWith(
        personalizeSettings.settings.cookieSettings.name.guestId
      );
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser');

      getSettingsSpy.mockImplementation(() => {
        throw new Error(`Test error`);
      });

      await expect(async () => await personalize(personalizeData)).rejects.toThrow(`Test error`);
    });

    it('should call getInteractiveExperience with timeout in opts object', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue(personalizeSettings as any);
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue(settings);

      await personalize(personalizeData, { timeout: 100 });

      const expectedOpts = { timeout: 100 };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without opts object', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      expect(typeof personalize).toBe('function');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue(settings);

      await personalize(personalizeData);

      const expectedOpts = { timeout: undefined };
      const expectedData = personalizeData;
      const expectedSettings = settings;

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        expectedData,
        expectedSettings,
        window.location.search,
        expectedOpts
      );
    });

    it('should call getInteractiveExperience without search params', async () => {
      jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
      const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

      const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue(settings);

      windowSpy.mockImplementation(() => ({
        location: {
          search: '?utm_campaign=campaign&utm_medium=email'
        }
      }));

      await personalize(personalizeData);

      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        personalizeData,
        settings,
        '?utm_campaign=campaign&utm_medium=email',
        { timeout: undefined }
      );
    });
  });
});
