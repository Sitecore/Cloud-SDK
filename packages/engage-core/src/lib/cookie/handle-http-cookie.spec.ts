/* eslint-disable @typescript-eslint/naming-convention */
import type { IHttpRequest, IHttpResponse } from '@sitecore-cloudsdk/engage-utils';
import { handleHttpCookie } from './handle-http-cookie';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import * as GetProxySettings from '../init/get-proxy-settings';
import * as Utils from '@sitecore-cloudsdk/engage-utils';
import { ISettings } from '../settings/interfaces';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('httpCookieHandler', () => {
  const options: ISettings = {
    contextId: 'context_id',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
      cookieTempValue: 'bid_value'
    },
    siteId: '',
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

    expect(getCookieServerSideSpy).toHaveBeenCalledWith(req.headers.cookie, 'bid_name');
    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_name', '123456789', defaultCookieAttributes);
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


    const getProxySettings = jest.spyOn(GetProxySettings, 'getProxySettings');
    getProxySettings.mockResolvedValue({ browserId: 'bid_value', clientKey: 'bid_name'});

    createCookieStringSpy.mockReturnValue('bid_name=mock_bid_name_from_edge_proxy');

    await handleHttpCookie(req, res, options);

    expect(getProxySettings).toHaveBeenCalledWith(options.contextId, undefined);
    expect(createCookieStringSpy).toHaveBeenCalledWith('bid_name', 'bid_value', defaultCookieAttributes);
    expect(req.headers.cookie).toBe('bid_name=mock_bid_name_from_edge_proxy');
  });

  it('should set the request header cookie when getCookieServerSide returns undefined but there is a cookie in the request headers', async () => {
    getCookieServerSideSpy.mockReturnValue(undefined);
    const getProxySettings = jest.spyOn(GetProxySettings, 'getProxySettings');
    getProxySettings.mockReturnValueOnce(Promise.resolve({ browserId: '123456789', clientKey:'key' }));
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

  it('should throw error if getProxySettings returns a falsy value', async () => {
    const req: IHttpRequest = {
      headers: {
        cookie: '',
      },
    };
    const response: IHttpResponse = {
      setHeader: jest.fn(),
    };
    const getProxySettings = jest.spyOn(GetProxySettings, 'getProxySettings');
    getProxySettings.mockReturnValueOnce(Promise.resolve({ browserId: '', clientKey: ''}));

    expect(async () => await handleHttpCookie(req, response, options)).rejects.toThrow(
      '[IE-0004] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );
  });
});
