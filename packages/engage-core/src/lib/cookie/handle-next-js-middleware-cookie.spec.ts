import * as Cdp from '../init/get-browser-id-from-cdp';
import * as BrowserIdFromMiddlewareRequest from './get-browser-id-from-middleware-request';
import { IMiddlewareNextResponse, IMiddlewareRequest } from '@sitecore-cloudsdk/engage-utils';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { TARGET_URL } from '../consts';

describe('handleMiddlewareRequest', () => {
  const mockFetchResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'dac13bc5-cdae-4e65-8868-13443409d05e',
    status: 'OK',
    version: '1.2',
  };
  const mockFetch = Promise.resolve({
    json: () => Promise.resolve(mockFetchResponse),
  });
  const options = {
    clientKey: 'key',
    contextId: '',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
    },
    siteId: '',
  };

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const getBrowserIdFromMiddlewareRequestSpy = jest.spyOn(
    BrowserIdFromMiddlewareRequest,
    'getBrowserIdFromMiddlewareRequest'
  );

  const req: IMiddlewareRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn(),
    },
  };

  const response: IMiddlewareNextResponse = {
    cookies: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      set: jest.fn(),
    },
  };

  const setSpy = jest.spyOn(req.cookies, 'set');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the browser ID from getBrowserIdFromMiddlewareRequest when available', async () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce('dac13bc5-cdae-4e65-8868-13443409d05e');
    const cookieName = 'bid_key';

    await handleNextJsMiddlewareCookie(req, response, options);

    expect(getBrowserIdFromMiddlewareRequestSpy).toHaveBeenCalledWith(req, cookieName);
    expect(getBrowserIdFromMiddlewareRequestSpy).toBeCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, 'dac13bc5-cdae-4e65-8868-13443409d05e', defaultCookieAttributes);
  });

  it('should set the browser ID from getBrowserIdFromCdp when getBrowserIdFromMiddlewareRequest returns undefined', async () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce(undefined);
    const getBrowserIdFromCdpSpy = jest.spyOn(Cdp, 'getBrowserIdFromCdp');
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    const cookieName = 'bid_key';

    const mockBrowserId = 'dac13bc5-cdae-4e65-8868-13443409d05e';

    const req: IMiddlewareRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const setSpy = jest.spyOn(req.cookies, 'set');

    await handleNextJsMiddlewareCookie(req, response, options);
    expect(getBrowserIdFromCdpSpy).toHaveBeenCalledWith(TARGET_URL, options.clientKey, undefined);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, mockBrowserId, defaultCookieAttributes);
  });

  it('should throw error if getBrowserIdFromCdp returns a falsy value', async () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce('');

    const req: IMiddlewareRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };

    expect(async () => await handleNextJsMiddlewareCookie(req, response, options)).rejects.toThrow(
      '[IE-0004] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );
  });
});
