import * as fetchBrowserIdFromEdgeProxy from '../../init/fetch-browser-id-from-edge-proxy';
import * as getDefaultCookieAttributes from '../../cookie/get-default-cookie-attributes';
import * as getGuestIdModule from '../../init/get-guest-id';
import * as initializerModule from './initializer';
import * as utils from '@sitecore-cloudsdk/utils';
import type { BrowserSettings, Settings } from './interfaces';
import { COOKIE_NAME_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS, ErrorMessages, SITECORE_EDGE_URL } from '../../consts';
import { cloudSDKSettings, enabledPackages, getCloudSDKSettings } from './initializer';
import { CORE_NAMESPACE } from '../../debug/namespaces';
import debug from 'debug';

let windowSpy: jest.SpyInstance;

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn(),
  createCookieString: jest.fn(),
  getCookie: jest.fn()
}));

const mockSettingsParamsPublic: BrowserSettings = {
  cookieDomain: 'cDomain',
  cookieExpiryDays: 730,
  cookiePath: '/',
  enableBrowserCookie: true,
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: SITECORE_EDGE_URL
};

const mockSettingsParamsInternal: Settings = {
  cookieSettings: {
    domain: 'cDomain',
    enableBrowserCookie: true,
    expiryDays: 730,
    names: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
    path: '/'
  },
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: SITECORE_EDGE_URL
};

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');

  enabledPackages.clear();

  jest.clearAllMocks();
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe('initializer browser', () => {
  describe('constructor', () => {
    it('should throw an error if window does not exist', async () => {
      windowSpy.mockImplementation(() => undefined);

      expect(() => new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic)).toThrow(
        ErrorMessages.IE_0001
      );
    });

    it('should verify the correct settings passed', () => {
      new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);

      expect(cloudSDKSettings).toEqual(mockSettingsParamsInternal);
    });
  });

  describe('getCloudSDKSettings', () => {
    it('should throw an error if cloudSDKSettings is not defined', () => {
      jest
        .spyOn(initializerModule.CloudSDKBrowserInitializer.prototype, 'createSettings' as any)
        .mockImplementationOnce(() => undefined);

      new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);

      expect(() => {
        getCloudSDKSettings();
      }).toThrow(
        // eslint-disable-next-line max-len
        '[IE-0012] - You must first initialize the Cloud SDK. Import "CloudSDK" from "@sitecore-cloudsdk/core/browser", then run "CloudSDK().initialize()".'
      );
    });

    it('should return cloudSDKSettings if it is defined', () => {
      new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);

      const result = initializerModule.getCloudSDKSettings();
      expect(result).toEqual(mockSettingsParamsInternal);
    });
  });

  describe('getEnabledPackage', () => {
    it('should return undefined if the package is not enabled', () => {
      const result = initializerModule.getEnabledPackage('nonExistentPackage');
      expect(result).toBeUndefined();
    });

    it('should return the enabled package if it exists', () => {
      const mockPackage = { exec: jest.fn(), initState: null, settings: {} } as any;
      enabledPackages.set('testPackage', mockPackage);

      const result = initializerModule.getEnabledPackage('testPackage');
      expect(result).toBe(mockPackage);
    });
  });
  describe('create settings', () => {
    it('should apply default values when optional settings are not provided', () => {
      const settings = {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '123'
      };

      const instance = new initializerModule.CloudSDKBrowserInitializer(settings);
      const result = instance['createSettings'](settings);

      expect(result.cookieSettings.domain).toBeUndefined();
      expect(result.cookieSettings.enableBrowserCookie).toBe(false);
      expect(result.cookieSettings.expiryDays).toBe(DEFAULT_COOKIE_EXPIRY_DAYS);
      expect(result.cookieSettings.path).toBe('/');
      expect(result.cookieSettings.names.browserId).toBe(`${COOKIE_NAME_PREFIX}123`);
      expect(result.cookieSettings.names.guestId).toBe(`${COOKIE_NAME_PREFIX}123_personalize`);
      expect(result.sitecoreEdgeUrl).toBe(SITECORE_EDGE_URL);
    });
  });

  describe('validate settings', () => {
    it('should throw errors when provided mandatory settings with falsy values', () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: '',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0001);

      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: ' ',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0001);

      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0002);
    });

    it("should throw error when the string provided for siteId doesn't correspond to a valid id", () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: ' ',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: 'test'
        });
      }).toThrow(ErrorMessages.MV_0002);
    });

    it("should throw error when sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url #1", () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: 'test'
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it("should throw error when sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url #2", () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ' '
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it('should throw error when the sitecoreEdgeUrl provided for targetURL is empty string', () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer({
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it('should not throw an error if settings are valid', () => {
      expect(() => {
        new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      }).not.toThrow();
    });
  });

  describe('initialize', () => {
    const mockCookieAttributes = {
      domain: 'localhost',
      maxAge: 720,
      path: '/',
      sameSite: 'None',
      secure: true
    };

    it(`should NOT call createCookies method upon initialization when enableBrowserCookie is false`, () => {
      mockSettingsParamsPublic.enableBrowserCookie = false;

      const createCookiesSpy = jest.spyOn(
        initializerModule.CloudSDKBrowserInitializer.prototype as any,
        'createCookies'
      );

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      instance.initialize();

      expect(createCookiesSpy).not.toHaveBeenCalled();
    });

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:core' as a namespace 
      when there are no enabledPackages`, async () => {
      mockSettingsParamsPublic.enableBrowserCookie = true;

      const debugMock = debug as unknown as jest.Mock;
      const expectedBrowserIdCookieName = `${COOKIE_NAME_PREFIX}123`;
      const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
      const expectedBrowserIdValue = 'bid_value';
      const expectedGuestIdValue = 'gid_value';

      jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValueOnce(mockCookieAttributes);

      jest.spyOn(utils, 'getCookie').mockReturnValueOnce(undefined);
      jest
        .spyOn(utils, 'createCookieString')
        .mockReturnValueOnce(`${expectedBrowserIdCookieName}=${expectedBrowserIdValue}`)
        .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

      jest
        .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
        .mockResolvedValueOnce({ browserId: 'bid_value', guestId: 'gid_value' });

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      instance.initialize();

      expect(instance['createCookies']).toHaveBeenCalled();
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(CORE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('CloudSDK was initialized with no packages');
    });

    it(`should NOT call 'debug' third-party lib with 'sitecore-cloudsdk:core' as a namespace 
      when there are enabledPackages`, async () => {
      const debugMock = debug as unknown as jest.Mock;
      const expectedBrowserIdCookieName = `${COOKIE_NAME_PREFIX}123`;
      const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
      const expectedBrowserIdValue = 'bid_value';
      const expectedGuestIdValue = 'gid_value';

      const getDefaultCookieAttributesSpy = jest
        .spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes')
        .mockReturnValueOnce(mockCookieAttributes);

      jest.spyOn(utils, 'getCookie').mockReturnValueOnce(undefined);
      jest
        .spyOn(utils, 'createCookieString')
        .mockReturnValueOnce(`${expectedBrowserIdCookieName}=${expectedBrowserIdValue}`)
        .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

      jest
        .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
        .mockResolvedValueOnce({ browserId: 'bid_value', guestId: 'gid_value' });

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);

      enabledPackages.set('PERSONALIZE', {
        exec: jest.fn(),
        initState: null,
        settings: {}
      } as any);

      instance.initialize();

      expect(instance['createCookies']).toHaveBeenCalled();
      expect(debugMock).not.toHaveBeenCalled();
      expect(getDefaultCookieAttributesSpy).toHaveBeenCalledTimes(1);
    });

    it('should create the cookies and add the cookies to document.cookie', async () => {
      const expectedBrowserIdCookieName = `${COOKIE_NAME_PREFIX}123`;
      const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
      const expectedBrowserIdValue = 'bid_value';
      const expectedGuestIdValue = 'gid_value';

      const getDefaultCookieAttributesSpy = jest
        .spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes')
        .mockReturnValueOnce(mockCookieAttributes);

      const getBrowserIdCookieSpy = jest.spyOn(utils, 'getCookie').mockReturnValueOnce(undefined);
      const createCookieStringSpy = jest
        .spyOn(utils, 'createCookieString')
        .mockReturnValueOnce(`${expectedBrowserIdCookieName}=${expectedBrowserIdValue}`)
        .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

      jest
        .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
        .mockResolvedValueOnce({ browserId: 'bid_value', guestId: 'gid_value' });

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      instance.initialize();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(instance['createCookies']).toHaveBeenCalled();
      expect(getBrowserIdCookieSpy).toHaveBeenCalledTimes(1);
      expect(getDefaultCookieAttributesSpy).toHaveBeenCalledTimes(1);
      expect(createCookieStringSpy).toHaveBeenCalledTimes(2);
      expect(document.cookie).toBe(
        // eslint-disable-next-line max-len
        `${expectedBrowserIdCookieName}=${expectedBrowserIdValue}; ${expectedGuestIdCookieName}=${expectedGuestIdValue}`
      );
    });

    it(`should not create a browserId cookie if cookieName exists 
      and should create a guestId cookie instead if does not exist`, async () => {
      const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
      const expectedGuestIdValue = 'gid_value';

      const getCookieSpy = jest
        .spyOn(utils, 'getCookie')
        .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123`, value: 'bid_value' });

      const getGuestIdSpy = jest.spyOn(getGuestIdModule, 'getGuestId').mockResolvedValueOnce('value2');

      const fetchBrowserIdFromEdgeProxySpy = jest
        .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
        .mockResolvedValueOnce({ browserId: 'value', guestId: 'value2' });

      const createCookieStringSpy = jest
        .spyOn(utils, 'createCookieString')
        .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      instance.initialize();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(instance['createCookies']).toHaveBeenCalled();
      expect(getCookieSpy).toHaveBeenCalledTimes(2);
      expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
      expect(createCookieStringSpy).toHaveBeenCalledTimes(1);
      expect(fetchBrowserIdFromEdgeProxySpy).not.toHaveBeenCalled();
    });

    it(`should neither create a browserId nor a guestId cookie if both exists`, async () => {
      const createCookieStringSpy = jest.spyOn(utils, 'createCookieString');
      const getGuestIdSpy = jest.spyOn(getGuestIdModule, 'getGuestId').mockResolvedValueOnce('value2');

      const getCookieSpy = jest
        .spyOn(utils, 'getCookie')
        .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123`, value: 'bid_value' })
        .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123_personalize`, value: 'gid_value' });

      const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');

      const instance = new initializerModule.CloudSDKBrowserInitializer(mockSettingsParamsPublic);
      instance.initialize();

      expect(getCookieSpy).toHaveBeenCalledTimes(2);
      expect(getGuestIdSpy).not.toHaveBeenCalled();
      expect(createCookieStringSpy).not.toHaveBeenCalled();
      expect(fetchBrowserIdFromEdgeProxySpy).not.toHaveBeenCalled();
    });

    it('should call exec on each enabled package', async () => {
      const mockPackage1 = { exec: jest.fn(), initState: null, settings: {} } as any;
      const mockPackage2 = { exec: jest.fn(), initState: null, settings: {} } as any;

      enabledPackages.set('PERSONALIZE', mockPackage1);
      enabledPackages.set('EVENTS', mockPackage2);

      initializerModule.CloudSDK(mockSettingsParamsPublic).initialize();

      expect(mockPackage1.exec).toHaveBeenCalled();
      expect(mockPackage2.exec).toHaveBeenCalled();
    });
  });
});
