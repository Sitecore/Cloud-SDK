/* eslint-disable @typescript-eslint/naming-convention */

import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import * as Utils from '@sitecore-cloudsdk/utils';
import { ISettings } from '../settings/interfaces';
import { handleHttpCookie } from './handle-http-cookie';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('httpCookieHandler', () => {
  let req: Utils.IHttpRequest = {
    headers: {
      cookie: 'bid_key=123456789',
    },
  };

  let res: Utils.IHttpResponse = {
    setHeader: jest.fn(),
  };
  const options: ISettings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
    },
    siteName: '',
    sitecoreEdgeContextId: 'context_id',
  };

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const getCookieServerSideSpy = jest.spyOn(Utils, 'getCookieServerSide');
  const createCookieStringSpy = jest.spyOn(Utils, 'createCookieString');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle the browser ID cookie in the request and response when the cookie is present', () => {
    const mockCookie = { name: 'test', value: '123456789' };

    getCookieServerSideSpy.mockReturnValue(mockCookie);
    createCookieStringSpy.mockReturnValue('bid_key=123456789');

    handleHttpCookie(req, res, options, 'bid_value');

    expect(getCookieServerSideSpy).toHaveBeenCalledWith(req.headers.cookie, 'bid_name');
    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_name', '123456789', defaultCookieAttributes);
    expect(req.headers.cookie).toBe('bid_key=123456789');
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', 'bid_key=123456789');
  });

  it('should handle the browser ID cookie in the request and response when the cookie is not present', () => {
    req = {
      headers: {},
    };

    res = {
      setHeader: jest.fn(),
    };

    createCookieStringSpy.mockReturnValue('bid_name=mock_bid_name_from_edge_proxy');

    handleHttpCookie(req, res, options, 'bid_value');

    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_name', 'bid_value', defaultCookieAttributes);
    expect(req.headers.cookie).toBe('bid_name=mock_bid_name_from_edge_proxy');
  });

  it('should throw error if there is no cookie', () => {
    req = {
      headers: {
        cookie: '',
      },
    };
    res = {
      setHeader: jest.fn(),
    };

    expect(() => handleHttpCookie(req, res, options, '')).toThrow(
      '[IE-0003] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );
  });

  it('should set the request header cookie when getCookieServerSide returns undefined but there is a cookie in the request headers', async () => {
    getCookieServerSideSpy.mockReturnValue(undefined);

    req = {
      headers: {
        cookie: '',
      },
    };

    res = {
      setHeader: jest.fn(),
    };
    createCookieStringSpy.mockReturnValue('bid_key=mock_bid_key_from_cdp');

    handleHttpCookie(req, res, options, 'bid_value');

    expect(req.headers.cookie).toBe('bid_key=mock_bid_key_from_cdp');
  });

  it('should set the request header cookie when there is a tempCookieValue returns undefined but there is a cookie in the request headers', () => {
    req = {
      headers: {
        cookie: 'bid_key=123456789',
      },
    };

    res = {
      setHeader: jest.fn(),
    };

    createCookieStringSpy.mockReturnValue('bid_key=bid_value');

    handleHttpCookie(req, res, options, 'bid_value');

    expect(req.headers.cookie).toBe('bid_key=123456789; bid_key=bid_value');
  });
});
