import type { IHttpRequest, IHttpResponse } from '@sitecore-cloudsdk/engage-utils';
import { handleHttpCookie } from './handle-http-cookie';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import * as Cdp from '../init/get-browser-id-from-cdp';
import * as utils from '@sitecore-cloudsdk/engage-utils';
import { TARGET_URL } from '../consts';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('httpCookieHandler', () => {
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

  const getCookieServerSideSpy = jest.spyOn(utils, 'getCookieServerSide');
  const createCookieStringSpy = jest.spyOn(utils, 'createCookieString');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle the browser ID cookie in the request and response when the cookie is present', async () => {
    const req: IHttpRequest = {
      headers: {
        cookie: 'bid_key=123456789',
      },
    };
    const res: IHttpResponse = {
      setHeader: jest.fn(),
    };

    const mockCookie = { name: 'test', value: '123456789' };

    getCookieServerSideSpy.mockReturnValue(mockCookie);
    createCookieStringSpy.mockReturnValue('bid_key=123456789');

    await handleHttpCookie(req, res, options);

    expect(getCookieServerSideSpy).toHaveBeenCalledWith(req.headers.cookie, 'bid_key');
    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_key', '123456789', defaultCookieAttributes);
    expect(req.headers.cookie).toBe('bid_key=123456789');
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', 'bid_key=123456789');
  });

  it('should handle the browser ID cookie in the request and response when the cookie is not present', async () => {
    const req: IHttpRequest = {
      headers: {},
    };
    const res: IHttpResponse = {
      setHeader: jest.fn(),
    };

    const mockBrowserId = 'mock_bid_key_from_cdp';
    const getBrowserIdFromCdpSpy = jest.spyOn(Cdp, 'getBrowserIdFromCdp');
    getBrowserIdFromCdpSpy.mockResolvedValue(mockBrowserId);

    createCookieStringSpy.mockReturnValue('bid_key=mock_bid_key_from_cdp');

    await handleHttpCookie(req, res, options);

    expect(getBrowserIdFromCdpSpy).toHaveBeenCalledWith(TARGET_URL, options.clientKey, undefined);
    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_key', 'mock_bid_key_from_cdp', defaultCookieAttributes);
    expect(req.headers.cookie).toBe('bid_key=mock_bid_key_from_cdp');
  });

  it('should set the request header cookie when getCookieServerSide returns undefined but there is a cookie in the request headers', async () => {
    getCookieServerSideSpy.mockReturnValue(undefined);
    const getBrowserIdFromCdpSpy = jest.spyOn(Cdp, 'getBrowserIdFromCdp');
    getBrowserIdFromCdpSpy.mockReturnValueOnce(Promise.resolve('123456789'));
    const req: IHttpRequest = {
      headers: {
        cookie: 'bid_key=123456789',
      },
    };

    const res: IHttpResponse = {
      setHeader: jest.fn(),
    };
    createCookieStringSpy.mockReturnValue('bid_key=mock_bid_key_from_cdp');

    await handleHttpCookie(req, res, options);

    expect(req.headers.cookie).toBe('bid_key=123456789; bid_key=mock_bid_key_from_cdp');
  });

  it('should throw error if getBrowserIdFromCdp returns a falsy value', async () => {
    const req: IHttpRequest = {
      headers: {
        cookie: '',
      },
    };
    const response: IHttpResponse = {
      setHeader: jest.fn(),
    };
    const getBrowserIdFromCdpSpy = jest.spyOn(Cdp, 'getBrowserIdFromCdp');
    getBrowserIdFromCdpSpy.mockReturnValueOnce(Promise.resolve(''));

    expect(async () => await handleHttpCookie(req, response, options)).rejects.toThrow(
      '[IE-0004] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );
  });
});
