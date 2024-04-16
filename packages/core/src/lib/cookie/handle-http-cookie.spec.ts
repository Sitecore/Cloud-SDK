/* eslint-disable @typescript-eslint/naming-convention */

import * as Utils from '@sitecore-cloudsdk/utils';
import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import { Settings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
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
  const mockFetchResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'browser_id_from_proxy',
    status: 'OK',
    version: '1.2',
  };
  const mockFetch = Promise.resolve({
    json: () => Promise.resolve(mockFetchResponse),
  });
  global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

  let request: Utils.HttpRequest = {
    headers: {
      cookie: 'sc_123=123456789',
    },
  };

  let response: Utils.HttpResponse = {
    setHeader: jest.fn(),
  };
  const options: Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'sc_123',
      cookiePath: '/',
    },
    siteName: '',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
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
    const mockCookie = { name: 'test', value: '123456789' };

    getCookieServerSideSpy.mockReturnValue(mockCookie);
    createCookieStringSpy.mockReturnValue('sc_123=123456789');

    await handleHttpCookie(request, response, options);

    expect(getCookieServerSideSpy).toHaveBeenCalledWith(request.headers.cookie, 'sc_123');
    expect(createCookieStringSpy).toHaveBeenCalledWith('sc_123', '123456789', defaultCookieAttributes);
    expect(request.headers.cookie).toBe('sc_123=123456789');
    expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', 'sc_123=123456789');
  });

  it('should handle the browser ID cookie in the request and response when the cookie is not present', async () => {
    request = {
      headers: {},
    };

    response = {
      setHeader: jest.fn(),
    };

    createCookieStringSpy.mockReturnValue('sc_123=browser_id_from_proxy');

    await handleHttpCookie(request, response, options);

    expect(createCookieStringSpy).toHaveBeenCalledWith('sc_123', 'browser_id_from_proxy', defaultCookieAttributes);
    expect(request.headers.cookie).toBe('sc_123=browser_id_from_proxy');
  });

  it('should set the request header cookie when getCookieServerSide returns undefined but there is a cookie in the request headers', async () => {
    getCookieServerSideSpy.mockReturnValue(undefined);
    const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');
    fetchBrowserIdFromEdgeProxySpy.mockResolvedValueOnce({ browserId: '123456789' });

    request = {
      headers: {
        cookie: 'sc_123=123456789',
      },
    };

    response = {
      setHeader: jest.fn(),
    };
    createCookieStringSpy.mockReturnValue('sc_123=browser_id_from_proxy');

    await handleHttpCookie(request, response, options);

    expect(request.headers.cookie).toBe('sc_123=123456789; sc_123=browser_id_from_proxy');
  });
});
