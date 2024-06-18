import * as CookieValueFromMiddlewareRequest from './get-cookie-value-from-middleware-request';
import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import type { MiddlewareNextResponse, MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { COOKIE_NAME_PREFIX } from '../consts';
import type { Settings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';

describe('handleMiddlewareRequest', () => {
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

  const options: Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieNames: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
      cookiePath: '/'
    },
    siteName: '',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  };

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const getCookieValueFromMiddlewareRequestSpy = jest.spyOn(
    CookieValueFromMiddlewareRequest,
    'getCookieValueFromMiddlewareRequest'
  );

  const request: MiddlewareRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn()
    }
  };

  const response: MiddlewareNextResponse = {
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
    const browserIdCookieName = 'sc_123';
    const guestIdCookieName = 'sc_123_personalize';

    getCookieValueFromMiddlewareRequestSpy
      .mockReturnValueOnce('browser_id_from_proxy')
      .mockReturnValueOnce('guest_id_from_proxy');

    await handleNextJsMiddlewareCookie(request, response, options);

    expect(setSpy).toHaveBeenCalledWith(browserIdCookieName, 'browser_id_from_proxy', defaultCookieAttributes);
    expect(setSpy).toHaveBeenCalledWith(guestIdCookieName, 'guest_id_from_proxy', defaultCookieAttributes);
  });

  it('should set the guest ID when browser ID cookie is available', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockGuestIdResponse),
      ok: 'ok'
    });

    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    getCookieValueFromMiddlewareRequestSpy.mockReturnValueOnce('browser_id_from_proxy');

    const browserIdCookieName = 'sc_123';
    const guestIdCookieName = 'sc_123_personalize';

    await handleNextJsMiddlewareCookie(request, response, options);

    expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledWith(request, browserIdCookieName);
    expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledWith(request, guestIdCookieName);
    expect(getCookieValueFromMiddlewareRequestSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalledWith(browserIdCookieName, 'browser_id_from_proxy', defaultCookieAttributes);
    expect(setSpy).toHaveBeenCalledWith(guestIdCookieName, 'guest_id_from_proxy', defaultCookieAttributes);
  });

  it(`should set the browser ID and guest ID cookies in the request and response 
    when the cookies are not present`, async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
    });

    getCookieValueFromMiddlewareRequestSpy.mockReturnValueOnce(undefined);
    const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    const mockBrowserIdCookie = { name: 'sc_123', value: 'browser_id_from_proxy' };
    const mockGuestIdCookie = { name: 'sc_123_personalize', value: 'guest_id_from_proxy' };

    const request: MiddlewareRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn()
      }
    };
    const setSpy = jest.spyOn(request.cookies, 'set');

    await handleNextJsMiddlewareCookie(request, response, options);

    expect(fetchBrowserIdFromEdgeProxySpy).toHaveBeenCalledWith(
      options.sitecoreEdgeUrl,
      options.sitecoreEdgeContextId,
      undefined
    );

    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalledWith(mockBrowserIdCookie.name, mockBrowserIdCookie.value, defaultCookieAttributes);
    expect(setSpy).toHaveBeenCalledWith(mockGuestIdCookie.name, mockGuestIdCookie.value, defaultCookieAttributes);
  });
});
