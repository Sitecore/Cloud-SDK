import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import type { MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import type { PersonalizeData } from './personalizer';
import { Personalizer } from './personalizer';
import { personalizeServer } from './personalizeServer';

jest.mock('./personalizer');

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

jest.mock('@sitecore-cloudsdk/core/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('personalizeServer', () => {
  describe('old init', () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    jest.spyOn(coreInternalModule, 'createCookies').mock;
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    const originalReq = {
      cookies: {
        get() {
          return 'test';
        },
        set: () => undefined
      },
      headers: {
        get: () => ''
      },
      url: ''
    };
    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
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

    let req: MiddlewareRequest;

    beforeEach(() => {
      req = { ...originalReq };
      (coreInternalModule as any).builderInstanceServer = null;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an object with available functionality', async () => {
      req.headers.get = () => null;
      const getCookieValueFromRequestSpy = jest.spyOn(coreInternalModule, 'getCookieValueFromRequest');
      const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
      getSettingsServerSpy.mockReturnValue(settings);

      expect(typeof personalizeServer).toBe('function');

      await personalizeServer(req, personalizeData);
      expect(getCookieValueFromRequestSpy).toHaveBeenCalledTimes(2);
      expect(getCookieValueFromRequestSpy).toHaveBeenLastCalledWith(req, settings.cookieSettings.cookieNames.guestId);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        timeout: undefined,
        userAgent: null
      });
    });

    it('should include the user agent header and timeout in the opts object', async () => {
      const httpReq = {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'user-agent': 'test_ua'
        }
      };

      jest.spyOn(coreInternalModule, 'getSettingsServer').mockReturnValue(settings);

      await personalizeServer(httpReq, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        userAgent: 'test_ua'
      });
    });

    it('should include the user agent header if in middleware request', async () => {
      const getMock = jest.fn().mockReturnValue('test_ua');
      req.headers.get = getMock;
      jest.spyOn(coreInternalModule, 'getSettingsServer').mockReturnValue(settings);

      await personalizeServer(req, personalizeData, { timeout: 100 });

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        timeout: 100,
        userAgent: 'test_ua'
      });
      expect(getMock).toHaveBeenCalledWith('user-agent');
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getSettingsServer').mockImplementation(() => {
        throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
      });

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0017] - You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/personalize/server". Then, run "await CloudSDK().addPersonalize().initialize()".`
      );
    });

    it(`should use the request.geo if personalizeData.geo is empty
   and request is a valid MiddlewareRequest`, async () => {
      req.geo = {
        city: 'Tarnów',
        country: 'PL',
        region: '12'
      };
      const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
      getSettingsServerSpy.mockReturnValueOnce(settings);

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          ...personalizeData,
          geo: {
            city: 'Tarnów',
            country: 'PL',
            region: '12'
          }
        },
        settings,
        '',
        { timeout: undefined, userAgent: 'test_ua' }
      );
    });

    it('should omit the request.geo if personalizeData.geo has values', async () => {
      req.geo = {
        city: 'Tarnów',
        country: 'PL',
        region: '12'
      };
      personalizeData.geo = {
        city: 'Athens',
        country: 'GR',
        region: 'I'
      };
      const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
      getSettingsServerSpy.mockReturnValueOnce(settings);

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          ...personalizeData,
          geo: {
            city: 'Athens',
            country: 'GR',
            region: 'I'
          }
        },
        settings,
        '',
        { timeout: undefined, userAgent: 'test_ua' }
      );
    });

    it('should omit the request.geo if request.geo is empty', async () => {
      personalizeData.geo = undefined;
      req.geo = {};
      const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
      getSettingsServerSpy.mockReturnValueOnce(settings);

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        timeout: undefined,
        userAgent: 'test_ua'
      });
    });

    it("should omit the request.geo if request.geo doesn't exist in the MiddlewareRequest", async () => {
      personalizeData.geo = undefined;
      req.geo = undefined;
      const getSettingsServerSpy = jest.spyOn(coreInternalModule, 'getSettingsServer');
      getSettingsServerSpy.mockReturnValueOnce(settings);

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
        timeout: undefined,
        userAgent: 'test_ua'
      });
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

    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    jest.spyOn(coreInternalModule, 'createCookies').mock;
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    const originalReq = {
      cookies: {
        get() {
          return 'test';
        },
        set: () => undefined
      },
      headers: {
        get: () => ''
      },
      url: ''
    };
    const personalizeData: PersonalizeData = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    };

    let req: MiddlewareRequest;

    beforeEach(() => {
      req = { ...originalReq };
      (coreInternalModule as any).builderInstanceServer = {};
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an object with available functionality', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      req.headers.get = () => null;
      const getCookieValueFromRequestSpy = jest.spyOn(coreInternalModule, 'getCookieValueFromRequest');

      expect(typeof personalizeServer).toBe('function');

      await personalizeServer(req, personalizeData);

      expect(getCookieValueFromRequestSpy).toHaveBeenCalledTimes(2);
      expect(getCookieValueFromRequestSpy).toHaveBeenNthCalledWith(1, req, newSettings.cookieSettings.names.browserId);
      expect(getCookieValueFromRequestSpy).toHaveBeenLastCalledWith(req, newSettings.cookieSettings.names.guestId);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        timeout: undefined,
        userAgent: null
      });
    });

    it('should include the user agent header and timeout in the opts object', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      const httpReq = {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'user-agent': 'test_ua'
        }
      };

      await personalizeServer(httpReq, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        userAgent: 'test_ua'
      });
    });

    it('should include the user agent header if in middleware request', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      const getMock = jest.fn().mockReturnValue('test_ua');
      req.headers.get = getMock;

      await personalizeServer(req, personalizeData, { timeout: 100 });

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        timeout: 100,
        userAgent: 'test_ua'
      });
      expect(getMock).toHaveBeenCalledWith('user-agent');
    });

    it('should throw error if settings have not been configured properly', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
        throw new Error(`Test error`);
      });

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(`Test error`);
    });

    it(`should use the request.geo if personalizeData.geo is empty
   and request is a valid MiddlewareRequest`, async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      req.geo = {
        city: 'Tarnów',
        country: 'PL',
        region: '12'
      };

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          ...personalizeData,
          geo: {
            city: 'Tarnów',
            country: 'PL',
            region: '12'
          }
        },
        newSettings,
        '',
        { timeout: undefined, userAgent: 'test_ua' }
      );
    });

    it('should omit the request.geo if personalizeData.geo has values', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      req.geo = {
        city: 'Tarnów',
        country: 'PL',
        region: '12'
      };
      personalizeData.geo = {
        city: 'Athens',
        country: 'GR',
        region: 'I'
      };

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          ...personalizeData,
          geo: {
            city: 'Athens',
            country: 'GR',
            region: 'I'
          }
        },
        newSettings,
        '',
        { timeout: undefined, userAgent: 'test_ua' }
      );
    });

    it('should omit the request.geo if request.geo is empty', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      personalizeData.geo = undefined;
      req.geo = {};

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        timeout: undefined,
        userAgent: 'test_ua'
      });
    });

    it("should omit the request.geo if request.geo doesn't exist in the MiddlewareRequest", async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);
      personalizeData.geo = undefined;
      req.geo = undefined;

      await personalizeServer(req, personalizeData);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        timeout: undefined,
        userAgent: 'test_ua'
      });
    });

    it('should throw error new init used but personalize not initialized', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce(undefined);

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0017] - You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/personalize/server". Then, run "await CloudSDK().addPersonalize().initialize()".`
      );

      expect(Personalizer).not.toHaveBeenCalled();
    });
  });
});
