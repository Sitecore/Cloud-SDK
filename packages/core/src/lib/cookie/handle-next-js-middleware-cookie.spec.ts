import * as BrowserIdFromMiddlewareRequest from './get-browser-id-from-middleware-request';
import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import type { MiddlewareNextResponse, MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { COOKIE_NAME_PREFIX } from '../consts';
import type { Settings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';

describe('handleMiddlewareRequest', () => {
  const mockFetchResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'dac13bc5-cdae-4e65-8868-13443409d05e',
    status: 'OK',
    version: '1.2'
  };

  const mockFetch = Promise.resolve({
    json: () => Promise.resolve(mockFetchResponse)
  });

  const options: Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: `${COOKIE_NAME_PREFIX}123`,
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

  const getBrowserIdFromMiddlewareRequestSpy = jest.spyOn(
    BrowserIdFromMiddlewareRequest,
    'getBrowserIdFromMiddlewareRequest'
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

  it('should set the browser ID from getBrowserIdFromMiddlewareRequest when available', async () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce('dac13bc5-cdae-4e65-8868-13443409d05e');
    const cookieName = 'sc_123';

    await handleNextJsMiddlewareCookie(request, response, options);

    expect(getBrowserIdFromMiddlewareRequestSpy).toHaveBeenCalledWith(request, cookieName);
    expect(getBrowserIdFromMiddlewareRequestSpy).toBeCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, 'dac13bc5-cdae-4e65-8868-13443409d05e', defaultCookieAttributes);
  });

  it(`should set the browser ID from settings temp value
     when getBrowserIdFromMiddlewareRequest returns undefined`, async () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce(undefined);
    const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    const cookieName = 'sc_123';

    const mockBrowserId = 'dac13bc5-cdae-4e65-8868-13443409d05e';

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

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, mockBrowserId, defaultCookieAttributes);
  });
});
