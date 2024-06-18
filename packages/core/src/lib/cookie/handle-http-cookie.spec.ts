import * as Utils from '@sitecore-cloudsdk/utils';
// import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import * as getDefaultCookieAttributesModule from './get-default-cookie-attributes';
import type { Settings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { handleHttpCookie } from './handle-http-cookie';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('httpCookieHandler', () => {
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

  let request: Utils.HttpRequest = {
    headers: {
      cookie: 'sc_123=123456789; sc_123_personalize=987654321'
    }
  };

  let response: Utils.HttpResponse = {
    setHeader: jest.fn()
  };

  const options: Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieNames: { browserId: 'sc_123', guestId: 'sc_123_personalize' },
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

  const getCookieServerSideSpy = jest.spyOn(Utils, 'getCookieServerSide');
  const createCookieStringSpy = jest.spyOn(Utils, 'createCookieString');
  const getDefaultCookieAttributesSpy = jest.spyOn(getDefaultCookieAttributesModule, 'getDefaultCookieAttributes');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should handle the browser ID and guest ID cookies in the request and response 
    when the cookies are present`, async () => {
    const mockBrowserIdCookie = { name: 'sc_123', value: '123456789' };
    const mockGuestIdCookie = { name: 'sc_123_personalize', value: '987654321' };

    getCookieServerSideSpy.mockReturnValueOnce(mockBrowserIdCookie).mockReturnValueOnce(mockGuestIdCookie);
    createCookieStringSpy.mockReturnValueOnce('sc_123=123456789').mockReturnValueOnce('sc_123_personalize=987654321');

    await handleHttpCookie(request, response, options);

    expect(createCookieStringSpy).toHaveBeenNthCalledWith(1, 'sc_123', '123456789', defaultCookieAttributes);
    expect(createCookieStringSpy).toHaveBeenNthCalledWith(
      2,
      'sc_123_personalize',
      '987654321',
      defaultCookieAttributes
    );

    expect(request.headers.cookie).toBe('sc_123=123456789; sc_123_personalize=987654321');
    expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', ['sc_123=123456789', 'sc_123_personalize=987654321']);
  });

  it(`should set the browser ID and guest ID cookies in the request and response 
    when the cookies are not present`, async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse)
    });

    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    request = {
      headers: {}
    };

    response = {
      setHeader: jest.fn()
    };

    createCookieStringSpy
      .mockReturnValueOnce('sc_123=browser_id_from_proxy')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    await handleHttpCookie(request, response, options);

    expect(createCookieStringSpy).toHaveBeenNthCalledWith(
      1,
      'sc_123',
      'browser_id_from_proxy',
      defaultCookieAttributes
    );

    expect(createCookieStringSpy).toHaveBeenNthCalledWith(
      2,
      'sc_123_personalize',
      'guest_id_from_proxy',
      defaultCookieAttributes
    );

    expect(request.headers.cookie).toBe('sc_123=browser_id_from_proxy; sc_123_personalize=guest_id_from_proxy');
  });

  it(`should set the guest ID cookie when browser ID cookie is present`, async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockGuestIdResponse),
      ok: 'ok'
    });

    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    request = {
      headers: { cookie: 'sc_123=browser_id_from_proxy' }
    };

    const mockBrowserIdCookie = { name: 'sc_123', value: 'browser_id_from_proxy' };

    createCookieStringSpy
      .mockReturnValueOnce('sc_123=browser_id_from_proxy')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    getCookieServerSideSpy.mockReturnValueOnce(mockBrowserIdCookie).mockReturnValueOnce(undefined);
    getDefaultCookieAttributesSpy.mockReturnValue({
      domain: '',
      maxAge: 421,
      path: '/',
      sameSite: 'None',
      secure: true
    });

    await handleHttpCookie(request, response, options);

    expect(request.headers.cookie).toBe('sc_123=browser_id_from_proxy; sc_123_personalize=guest_id_from_proxy');
  });

  it(`should set the browser ID cookie when guest ID cookie is present`, async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockFetchBrowserIdFromEPResponse),
      ok: 'ok'
    });

    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    request = {
      headers: { cookie: 'sc_123_personalize=guest_id_from_proxy' }
    };

    const mockGuestIdCookie = { name: 'sc_123_personalize', value: 'guest_id_from_proxy' };

    createCookieStringSpy
      .mockReturnValueOnce('sc_123=browser_id_from_proxy')
      .mockReturnValueOnce('sc_123_personalize=guest_id_from_proxy');

    getCookieServerSideSpy.mockReturnValueOnce(undefined).mockReturnValueOnce(mockGuestIdCookie);
    getDefaultCookieAttributesSpy.mockReturnValue({
      domain: '',
      maxAge: 421,
      path: '/',
      sameSite: 'None',
      secure: true
    });

    await handleHttpCookie(request, response, options);

    expect(request.headers.cookie).toBe('sc_123_personalize=guest_id_from_proxy; sc_123=browser_id_from_proxy');
  });
});
