import * as fetchBrowserIdFromEdgeProxy from '../../init/fetch-browser-id-from-edge-proxy';
import * as getCookieValueFromMiddlewareRequestModule from '../../cookie/get-cookie-value-from-middleware-request';
import * as getDefaultCookieAttributes from '../../cookie/get-default-cookie-attributes';
import * as getGuestIdModule from '../../init/get-guest-id';
import * as initializerModule from './initializer';
import * as utils from '@sitecore-cloudsdk/utils';
import { COOKIE_NAME_PREFIX, DEFAULT_COOKIE_EXPIRY_DAYS, ErrorMessages, SITECORE_EDGE_URL } from '../../consts';
import type { ServerSettings, Settings } from './interfaces';
import { cloudSDKSettings, enabledPackages, getCloudSDKSettings } from './initializer';
import { CORE_NAMESPACE } from '../../debug/namespaces';
import debug from 'debug';

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
  getCookie: jest.fn(),
  getCookieServerSide: jest.fn(),
  isHttpRequest: jest.fn(),
  isHttpResponse: jest.fn(),
  isNextJsMiddlewareRequest: jest.fn(),
  isNextJsMiddlewareResponse: jest.fn()
}));

describe('initializer server', () => {
  const mockSettingsParamsPublic: ServerSettings = {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookiePath: '/',
    enableServerCookie: true,
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: SITECORE_EDGE_URL
  };

  const mockSettingsParamsInternal: Settings = {
    cookieSettings: {
      domain: 'cDomain',
      enableServerCookie: true,
      expiryDays: 730,
      names: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
      path: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: SITECORE_EDGE_URL
  };
  describe('constructor', () => {
    it('should verify the correct settings passed', () => {
      const request = {} as any;
      const response = {} as any;
      new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);

      expect(cloudSDKSettings).toEqual(mockSettingsParamsInternal);
    });
  });

  describe('create settings', () => {
    it('should apply default values when optional settings are not provided', () => {
      const request = {} as any;
      const response = {} as any;
      const settings = {
        siteName: 'TestSite',
        sitecoreEdgeContextId: '123'
      };

      const instance = new initializerModule.CloudSDKServerInitializer(request, response, settings);
      const result = instance['createSettings'](settings);

      expect(result.cookieSettings.domain).toBeUndefined();
      expect(result.cookieSettings.enableServerCookie).toBe(false);
      expect(result.cookieSettings.expiryDays).toBe(DEFAULT_COOKIE_EXPIRY_DAYS);
      expect(result.cookieSettings.path).toBe('/');
      expect(result.cookieSettings.names.browserId).toBe(`${COOKIE_NAME_PREFIX}123`);
      expect(result.cookieSettings.names.guestId).toBe(`${COOKIE_NAME_PREFIX}123_personalize`);
      expect(result.sitecoreEdgeUrl).toBe(SITECORE_EDGE_URL);
    });
  });

  describe('validate settings', () => {
    const request = {} as any;
    const response = {} as any;
    it('should throw errors when provided mandatory settings with falsy values', () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: '',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0001);

      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: ' ',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0001);

      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.MV_0002);
    });

    it("should throw error when the string provided for siteId doesn't correspond to a valid id", () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: ' ',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: 'test'
        });
      }).toThrow(ErrorMessages.MV_0002);
    });

    it("should throw error when sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url #1", () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: 'test'
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it("should throw error when sitecoreEdgeUrl provided for targetURL doesn't correspond to a valid url #2", () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ' '
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it('should throw error when the sitecoreEdgeUrl provided for targetURL is empty string', () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, {
          cookieDomain: '',
          siteName: '456',
          sitecoreEdgeContextId: '1234',
          sitecoreEdgeUrl: ''
        });
      }).toThrow(ErrorMessages.IV_0001);
    });

    it('should not throw an error if settings are valid', () => {
      expect(() => {
        new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);
      }).not.toThrow();
    });
  });

  describe('initialize', () => {
    const commonPayloadResponse = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
      ref: 'browser_id_from_proxy',
      status: 'OK',
      version: '1.2'
    };
    const mockFetchBrowserIdFromEPResponse = {
      ...commonPayloadResponse,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      customer_ref: 'guest_id_from_proxy'
    };
    const mockGuestIdResponse = {
      ...commonPayloadResponse,
      customer: {
        ref: 'guest_id_from_proxy'
      }
    };
    let request = {} as any;
    let response = {} as any;
    const isNextJsMiddlewareRequestSpy = jest.spyOn(utils, 'isNextJsMiddlewareRequest');
    const isNextJsMiddlewareResponseSpy = jest.spyOn(utils, 'isNextJsMiddlewareResponse');

    const isHttpRequestSpy = jest.spyOn(utils, 'isHttpRequest');
    const isHttpResponseSpy = jest.spyOn(utils, 'isHttpResponse');

    beforeEach(() => {
      request = {
        cookies: { get: jest.fn(), set: jest.fn() },
        headers: {
          get: jest.fn()
        }
      };
      response = {
        cookies: {
          set: jest.fn()
        }
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('handleMiddlewareRequest', () => {
      jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValue({ test: true } as any);
      const getCookieValueFromMiddlewareRequestSpy = jest.spyOn(
        getCookieValueFromMiddlewareRequestModule,
        'getCookieValueFromMiddlewareRequest'
      );

      const request = {
        cookies: { get: jest.fn(), set: jest.fn() },
        headers: {
          get: jest.fn()
        }
      };

      const response = {
        cookies: {
          set: jest.fn()
        }
      };

      const setSpy = jest.spyOn(request.cookies, 'set');

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`should handle the browser ID and guest ID cookies in the request and response 
    when the cookies are present`, async () => {
        mockSettingsParamsPublic.enableServerCookie = true;
        const browserIdCookieName = 'sc_123';
        const guestIdCookieName = 'sc_123_personalize';

        getCookieValueFromMiddlewareRequestSpy
          .mockReturnValueOnce('browser_id_from_proxy')
          .mockReturnValueOnce('guest_id_from_proxy');
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(true);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(true);

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(setSpy).toHaveBeenCalledWith(browserIdCookieName, 'browser_id_from_proxy', { test: true });
        expect(setSpy).toHaveBeenCalledWith(guestIdCookieName, 'guest_id_from_proxy', { test: true });
      });

      it('should set the guest ID when browser ID cookie is available', async () => {
        const mockFetch = Promise.resolve({
          json: () => Promise.resolve(mockGuestIdResponse),
          ok: 'ok'
        });

        global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

        getCookieValueFromMiddlewareRequestSpy.mockReturnValueOnce('browser_id_from_proxy');
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(true);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(true);

        const browserIdCookieName = 'sc_123';
        const guestIdCookieName = 'sc_123_personalize';

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledWith(request, browserIdCookieName);
        expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledWith(request, guestIdCookieName);
        expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenCalledWith(browserIdCookieName, 'browser_id_from_proxy', { test: true });
        expect(setSpy).toHaveBeenCalledWith(guestIdCookieName, 'guest_id_from_proxy', { test: true });
      });

      it(`should set the browser ID and guest ID cookies in the request and response
      when the cookies are not present`, async () => {
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(true);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(true);
        const mockFetch = Promise.resolve({
          json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
        });

        getCookieValueFromMiddlewareRequestSpy.mockReturnValueOnce(undefined);
        const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');
        global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

        const mockBrowserIdCookie = { name: 'sc_123', value: 'browser_id_from_proxy' };
        const mockGuestIdCookie = { name: 'sc_123_personalize', value: 'guest_id_from_proxy' };

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(fetchBrowserIdFromEdgeProxySpy).toHaveBeenCalledWith(
          mockSettingsParamsPublic.sitecoreEdgeUrl,
          mockSettingsParamsPublic.sitecoreEdgeContextId,
          undefined
        );

        expect(setSpy).toHaveBeenCalledTimes(2);
        expect(setSpy).toHaveBeenCalledWith(mockBrowserIdCookie.name, mockBrowserIdCookie.value, { test: true });
        expect(setSpy).toHaveBeenCalledWith(mockGuestIdCookie.name, mockGuestIdCookie.value, { test: true });
      });
    });

    describe('httpCookieHandler', () => {
      let request = {
        headers: {
          cookie: 'sc_123=123456789; sc_123_personalize=987654321'
        }
      };

      let response = {
        setHeader: jest.fn()
      };

      jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValue({ test: true } as any);

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`should handle the browser ID and guest ID cookies in the request and response 
    when the cookies are present`, async () => {
        const mockBrowserIdCookie = { name: 'sc_123', value: '123456789' };
        const mockGuestIdCookie = { name: 'sc_123_personalize', value: '987654321' };
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
        isHttpRequestSpy.mockReturnValueOnce(true);
        isHttpResponseSpy.mockReturnValueOnce(true);

        jest
          .spyOn(utils, 'getCookieServerSide')
          .mockReturnValueOnce(mockBrowserIdCookie)
          .mockReturnValueOnce(mockGuestIdCookie);
        const createCookieStringSpy = jest
          .spyOn(utils, 'createCookieString')
          .mockReturnValueOnce('sc_123=123456789')
          .mockReturnValueOnce('sc_123_personalize=987654321');

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', '123456789', { test: true });
        expect(createCookieStringSpy).toHaveBeenNthCalledWith(2, 'sc_123_personalize', '987654321', { test: true });

        expect(request.headers.cookie).toBe('sc_123=123456789; sc_123_personalize=987654321');
        expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', [
          'sc_123=123456789',
          'sc_123_personalize=987654321'
        ]);
      });

      it(`should set the browser ID and guest ID cookies in the request and response
      when the cookies are not present`, async () => {
        const mockFetch = Promise.resolve({
          json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
        });

        global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
        isHttpRequestSpy.mockReturnValueOnce(true);
        isHttpResponseSpy.mockReturnValueOnce(true);

        request = {
          headers: {} as any
        };

        response = {
          setHeader: jest.fn()
        };

        jest.spyOn(utils, 'getCookieServerSide').mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
        const createCookieStringSpy = jest
          .spyOn(utils, 'createCookieString')
          .mockReturnValueOnce('sc_123=browser_id_from_proxy')
          .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', 'browser_id_from_proxy', { test: true });

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(2, 'sc_123_personalize', 'guest_id_from_proxy', {
          test: true
        });

        expect(request.headers.cookie).toBe('sc_123=browser_id_from_proxy; sc_123_personalize=guest_id_from_proxy');
      });

      it(`should set the guest ID cookie when browser ID cookie is present`, async () => {
        const mockFetch = Promise.resolve({
          json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
        });

        global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
        isHttpRequestSpy.mockReturnValueOnce(true);
        isHttpResponseSpy.mockReturnValueOnce(true);

        request = {
          headers: { cookie: 'sc_123=123456789' }
        };

        response = {
          setHeader: jest.fn()
        };

        jest.spyOn(getGuestIdModule, 'getGuestId').mockResolvedValueOnce('guest_id_from_proxy');
        jest
          .spyOn(utils, 'getCookieServerSide')
          .mockReturnValueOnce({ name: 'sc_123', value: '123456789' })
          .mockReturnValueOnce(undefined);
        const createCookieStringSpy = jest
          .spyOn(utils, 'createCookieString')
          .mockReturnValueOnce('sc_123=123456789')
          .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', '123456789', {
          test: true
        });

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(2, 'sc_123_personalize', 'guest_id_from_proxy', {
          test: true
        });

        expect(request.headers.cookie).toBe('sc_123=123456789; sc_123_personalize=guest_id_from_proxy');
      });

      it(`should set the guest ID cookie when guest ID cookie is not present and header is empty`, async () => {
        const mockFetch = Promise.resolve({
          json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
        });

        global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
        isHttpRequestSpy.mockReturnValueOnce(true);
        isHttpResponseSpy.mockReturnValueOnce(true);

        request = {
          headers: { cookie: '' }
        };

        response = {
          setHeader: jest.fn()
        };

        jest.spyOn(getGuestIdModule, 'getGuestId').mockResolvedValueOnce('guest_id_from_proxy');
        jest
          .spyOn(utils, 'getCookieServerSide')
          .mockReturnValueOnce({ name: 'sc_123', value: '123456789' })
          .mockReturnValueOnce(undefined);
        const createCookieStringSpy = jest
          .spyOn(utils, 'createCookieString')
          .mockReturnValueOnce('sc_123=123456789')
          .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', '123456789', {
          test: true
        });

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(2, 'sc_123_personalize', 'guest_id_from_proxy', {
          test: true
        });

        expect(request.headers.cookie).toBe('sc_123_personalize=guest_id_from_proxy');
      });

      it(`should set the browser ID cookie when guest ID cookie is present`, async () => {
        jest
          .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
          .mockResolvedValueOnce({ browserId: 'browser_id_from_proxy', guestId: 'guest_id_from_proxy' });

        isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
        isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
        isHttpRequestSpy.mockReturnValueOnce(true);
        isHttpResponseSpy.mockReturnValueOnce(true);

        request = {
          headers: { cookie: 'sc_123_personalize=987654321' }
        };

        response = {
          setHeader: jest.fn()
        };

        jest
          .spyOn(utils, 'getCookieServerSide')
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce({ name: 'sc_123_personalize', value: '987654321' });
        const createCookieStringSpy = jest
          .spyOn(utils, 'createCookieString')
          .mockReturnValueOnce('sc_123=browser_id_from_proxy')
          .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

        await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', 'browser_id_from_proxy', {
          test: true
        });

        expect(createCookieStringSpy).toHaveBeenNthCalledWith(2, 'sc_123_personalize', 'guest_id_from_proxy', {
          test: true
        });

        expect(request.headers.cookie).toBe('sc_123_personalize=987654321; sc_123=browser_id_from_proxy');
      });
    });

    it(`should NOT call createCookies method upon initialization when enableServerCookie is false`, () => {
      mockSettingsParamsPublic.enableServerCookie = false;

      const createCookiesSpy = jest.spyOn(
        initializerModule.CloudSDKServerInitializer.prototype as any,
        'createCookies'
      );

      const instance = new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);
      instance.initialize();

      expect(createCookiesSpy).not.toHaveBeenCalled();
    });

    it(`should call createCookies method upon initialization
       when enableServerCookie is true`, () => {
      mockSettingsParamsPublic.enableServerCookie = true;
      const createCookiesSpy = jest
        .spyOn(initializerModule.CloudSDKServerInitializer.prototype as any, 'createCookies')
        .mockImplementationOnce(() => Promise.resolve());

      const instance = new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);
      instance.initialize();

      expect(createCookiesSpy).toHaveBeenCalled();
    });

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:core' as a namespace
        when there are no enabledPackages`, async () => {
      mockSettingsParamsPublic.enableServerCookie = false;
      const debugMock = debug as unknown as jest.Mock;
      enabledPackages.clear();

      const instance = new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);
      await instance.initialize();

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(CORE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('CloudSDK was initialized with no packages');
    });

    it(`should NOT call 'debug' third-party lib with 'sitecore-cloudsdk:core' as a namespace
        when there are enabledPackages`, async () => {
      const debugMock = debug as unknown as jest.Mock;
      mockSettingsParamsPublic.enableServerCookie = false;

      enabledPackages.set('PERSONALIZE', {
        exec: jest.fn(),
        settings: {}
      } as any);

      await new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic).initialize();

      expect(debugMock).not.toHaveBeenCalled();
    });

    it(`should NOT call any cookie handler if req/res objects are not recognized`, async () => {
      mockSettingsParamsPublic.enableServerCookie = true;
      isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
      isNextJsMiddlewareResponseSpy.mockReturnValueOnce(false);
      isHttpRequestSpy.mockReturnValueOnce(false);
      isHttpResponseSpy.mockReturnValueOnce(false);
      const handleHttpCookieSpy = jest.spyOn(
        initializerModule.CloudSDKServerInitializer.prototype as any,
        'handleHttpCookie'
      );

      const handleNextJsMiddlewareCookieSpy = jest.spyOn(
        initializerModule.CloudSDKServerInitializer.prototype as any,
        'handleNextJsMiddlewareCookie'
      );

      const instance = new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);
      await instance.initialize();

      expect(handleHttpCookieSpy).not.toHaveBeenCalled();
      expect(handleNextJsMiddlewareCookieSpy).not.toHaveBeenCalled();
    });

    it('should call exec on each enabled package', async () => {
      mockSettingsParamsPublic.enableServerCookie = false;
      const mockPackage1 = { exec: jest.fn(), initState: null, settings: {} } as any;
      const mockPackage2 = { exec: jest.fn(), initState: null, settings: {} } as any;

      enabledPackages.set('PERSONALIZE', mockPackage1);
      enabledPackages.set('EVENTS', mockPackage2);

      await initializerModule.CloudSDK(request, response, mockSettingsParamsPublic).initialize();

      expect(mockPackage1.exec).toHaveBeenCalled();
      expect(mockPackage2.exec).toHaveBeenCalled();
    });
  });
});

describe('getCloudSDKSettings', () => {
  const request = {} as any;
  const response = {} as any;
  const mockSettingsParamsPublic: ServerSettings = {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookiePath: '/',
    enableServerCookie: true,
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: SITECORE_EDGE_URL
  };

  const mockSettingsParamsInternal: Settings = {
    cookieSettings: {
      domain: 'cDomain',
      enableServerCookie: true,
      expiryDays: 730,
      names: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
      path: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: SITECORE_EDGE_URL
  };
  it('should throw an error if cloudSDKSettings is not defined', () => {
    jest
      .spyOn(initializerModule.CloudSDKServerInitializer.prototype, 'createSettings' as any)
      .mockImplementationOnce(() => undefined);

    new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);

    expect(() => {
      getCloudSDKSettings();
    }).toThrow(
      // eslint-disable-next-line max-len
      '[IE-0013] - You must first initialize the Cloud SDK. Import "CloudSDK" from "@sitecore-cloudsdk/core/server", then run "await CloudSDK().initialize()".'
    );
  });

  it('should return cloudSDKSettings if it is defined', () => {
    new initializerModule.CloudSDKServerInitializer(request, response, mockSettingsParamsPublic);

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
