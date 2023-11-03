import * as BrowserIdFromMiddlewareRequest from './get-browser-id-from-middleware-request';
import { IMiddlewareNextResponse, IMiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { handleNextJsMiddlewareCookie } from './handle-next-js-middleware-cookie';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { ISettings } from '../settings/interfaces';

describe('handleMiddlewareRequest', () => {
  const options: ISettings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_key',
      cookiePath: '/',
    },
    siteName: '',
    sitecoreEdgeContextId: 'context_id',
    sitecoreEdgeUrl: '',
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

  it('should set the browser ID from getBrowserIdFromMiddlewareRequest when available', () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce('dac13bc5-cdae-4e65-8868-13443409d05e');
    const cookieName = 'bid_key';

    handleNextJsMiddlewareCookie(req, response, options, '');

    expect(getBrowserIdFromMiddlewareRequestSpy).toHaveBeenCalledWith(req, cookieName);
    expect(getBrowserIdFromMiddlewareRequestSpy).toBeCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, 'dac13bc5-cdae-4e65-8868-13443409d05e', defaultCookieAttributes);
  });

  it('should set the browser ID from settings temp value when getBrowserIdFromMiddlewareRequest returns undefined', () => {
    getBrowserIdFromMiddlewareRequestSpy.mockReturnValueOnce(undefined);
    const cookieName = 'bid_key';

    const mockBrowserId = 'dac13bc5-cdae-4e65-8868-13443409d05e';

    const req: IMiddlewareRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const setSpy = jest.spyOn(req.cookies, 'set');

    handleNextJsMiddlewareCookie(req, response, options, mockBrowserId);

    expect(setSpy).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(cookieName, mockBrowserId, defaultCookieAttributes);
  });
});
