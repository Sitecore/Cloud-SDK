import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import type { MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
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

    jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockReturnValue(newSettings);
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
      req.headers.get = () => null;
      const getCookieValueFromRequestSpy = jest.spyOn(coreInternalModule, 'getCookieValueFromRequest');

      expect(typeof personalizeServer).toBe('function');

      await personalizeServer(req, personalizeData);

      expect(getCookieValueFromRequestSpy).toHaveBeenCalledTimes(2);
      expect(getCookieValueFromRequestSpy).toHaveBeenNthCalledWith(1, req, newSettings.cookieSettings.name.browserId);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, newSettings, '', {
        timeout: undefined,
        userAgent: null
      });
    });

    it('should include the user agent header and timeout in the opts object', async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
      jest.spyOn(coreInternalModule, 'getCloudSDKSettingsServer').mockImplementationOnce(() => {
        throw new Error(`Test error`);
      });

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(`Test error`);
    });

    it(`should use the request.geo if personalizeData.geo is empty
   and request is a valid MiddlewareRequest`, async () => {
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue({
        exec: jest.fn(),
        settings: {
          cookieSettings: {
            name: { guestId: '1234567' }
          }
        }
      } as any);
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
      jest
        .spyOn(coreInternalModule, 'getEnabledPackageServer')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined);

      await expect(async () => await personalizeServer(req, personalizeData)).rejects.toThrow(ErrorMessages.IE_0017);

      expect(Personalizer).not.toHaveBeenCalled();
    });
  });
});
