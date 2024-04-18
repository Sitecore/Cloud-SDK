import * as HandleHttpCookie from './handle-http-cookie';
import * as HandleNextJsMiddlewareCookie from './handle-next-js-middleware-cookie';
import * as initCore from '../init/init-core-server';
import * as utils from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { handleServerCookie } from './handle-server-cookie';

// Mock the 'initializer' module
jest.mock('../init/init-core-server', () => ({
  getSettingsServer: jest.fn()
}));

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('handleServerCookie', () => {
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
  global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

  const options: Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: '',
      cookiePath: '/'
    },
    siteName: '',
    sitecoreEdgeContextId: '',
    sitecoreEdgeUrl: ''
  };

  const isNextJsMiddlewareRequestSpy = jest.spyOn(utils, 'isNextJsMiddlewareRequest');
  const isNextJsMiddlewareResponseSpy = jest.spyOn(utils, 'isNextJsMiddlewareResponse');

  const isHttpRequestSpy = jest.spyOn(utils, 'isHttpRequest');
  const isHttpResponseSpy = jest.spyOn(utils, 'isHttpResponse');

  const handleNextJsMiddlewareCookieSpy = jest.spyOn(HandleNextJsMiddlewareCookie, 'handleNextJsMiddlewareCookie');
  const handleHttpCookieSpy = jest.spyOn(HandleHttpCookie, 'handleHttpCookie');

  const getSettingsServerSpy = jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);
  const getCookieServerSide = jest.spyOn(utils, 'getCookieServerSide');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleNextJsMiddlewareCookie when request is a isNextJsMiddlewareRequest', async () => {
    const request: utils.Request = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn()
      }
    };
    const response: utils.MiddlewareNextResponse = {
      cookies: {
        set: jest.fn()
      }
    };

    isNextJsMiddlewareRequestSpy.mockReturnValueOnce(true);
    isNextJsMiddlewareResponseSpy.mockReturnValueOnce(true);

    await handleServerCookie(request, response, undefined);

    expect(handleNextJsMiddlewareCookieSpy).toHaveBeenCalledWith(request, response, options, undefined);
    expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
    expect(isNextJsMiddlewareRequestSpy).toHaveBeenCalledTimes(1);
    expect(isNextJsMiddlewareResponseSpy).toHaveBeenCalledTimes(1);

    expect(handleHttpCookieSpy).not.toHaveBeenCalled();
  });

  it('should call handleHttpCookie when request is an HTTP Request', async () => {
    const request: utils.Request = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'content-language': 'EN',
        'cookie': 'test=test',
        'referer': 'test'
      },
      url: 'test'
    };

    const response: utils.HttpResponse = {
      setHeader: jest.fn()
    };

    getCookieServerSide.mockReturnValueOnce({ name: 'test', value: 'test' });

    isNextJsMiddlewareRequestSpy.mockReturnValueOnce(false);
    isHttpRequestSpy.mockReturnValueOnce(true);
    isHttpResponseSpy.mockReturnValueOnce(true);

    await handleServerCookie(request, response, undefined);

    expect(handleHttpCookieSpy).toHaveBeenCalledWith(request, response, options, undefined);
    expect(handleNextJsMiddlewareCookieSpy).not.toHaveBeenCalled();
    expect(isNextJsMiddlewareResponseSpy).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when request is not isNextJsMiddlewareRequest or isHttpRequest', async () => {
    const request: utils.Request = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn()
      }
    };
    const response = {} as unknown as utils.MiddlewareNextResponse | utils.HttpResponse;

    await handleServerCookie(request, response, undefined);

    expect(isNextJsMiddlewareResponseSpy).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponseSpy).toHaveReturnedWith(false);
    expect(handleHttpCookieSpy).not.toHaveBeenCalled();
    expect(handleNextJsMiddlewareCookieSpy).not.toHaveBeenCalled();
  });
});
