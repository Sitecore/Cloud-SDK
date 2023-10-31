import { ISettings } from '../settings/interfaces';
import { handleServerCookie } from './handle-server-cookie';
import * as HandleNextJsMiddlewareCookie from './handle-next-js-middleware-cookie';
import * as HandleHttpCookie from './handle-http-cookie';
import * as utils from '@sitecore-cloudsdk/utils';
import * as initCore from '../init/init-core-server';
import * as getProxySettings from '../init/get-proxy-settings';
import { BID_PREFIX } from '../consts';

// Mock the 'initializer' module
jest.mock('../init/init-core-server', () => ({
  getSettingsServer: jest.fn(),
}));

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('handleServerCookie', () => {
  const isNextJsMiddlewareRequest = jest.spyOn(utils, 'isNextJsMiddlewareRequest');
  const isNextJsMiddlewareResponse = jest.spyOn(utils, 'isNextJsMiddlewareResponse');

  const handleNextJsMiddlewareCookie = jest.spyOn(HandleNextJsMiddlewareCookie, 'handleNextJsMiddlewareCookie');
  const handleHttpCookie = jest.spyOn(HandleHttpCookie, 'handleHttpCookie');
  const getCookieServerSide = jest.spyOn(utils, 'getCookieServerSide');

  let options: ISettings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: '',
      cookiePath: '/',
    },
    siteName: '',
    sitecoreEdgeContextId: '',
  };

  beforeEach(() => {
    options = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: '',
        cookiePath: '/',
      },
      siteName: '',
      sitecoreEdgeContextId: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleNextJsMiddlewareCookie when request is a isNextJsMiddlewareRequest', async () => {
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: 'value', clientKey: 'c_key' });
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response: utils.IMiddlewareNextResponse = {
      cookies: {
        set: jest.fn(),
      },
    };

    isNextJsMiddlewareRequest.mockReturnValueOnce(true);
    isNextJsMiddlewareResponse.mockReturnValueOnce(true);
    const getSettingsServerSpy = jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);

    await handleServerCookie(request, response, undefined);

    expect(handleNextJsMiddlewareCookie).toHaveBeenCalledWith(
      request,
      response,
      {
        ...options,
        cookieSettings: { ...options.cookieSettings, cookieName: `${BID_PREFIX}c_key` },
      },
      'value'
    );
    expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
    expect(isNextJsMiddlewareRequest).toHaveBeenCalledTimes(1);
    expect(isNextJsMiddlewareResponse).toHaveBeenCalledTimes(1);

    expect(handleHttpCookie).not.toHaveBeenCalled();
  });

  it('should call handleHttpCookie when request is an HTTP Request', async () => {
    const getSettingsServerSpy = jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: 'value', clientKey: 'c_key' });
    const request: utils.TRequest = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'content-language': 'EN',
        'cookie': 'test=test',
        'referer': 'test',
      },
      url: 'test',
    };

    const response: utils.IHttpResponse = {
      setHeader: jest.fn(),
    };

    getCookieServerSide.mockReturnValueOnce({ name: 'test', value: 'test' });

    isNextJsMiddlewareRequest.mockReturnValueOnce(false);

    const expectedSettings = {
      ...options,
      cookieSettings: { ...options.cookieSettings, cookieName: `${BID_PREFIX}c_key` },
    };

    await handleServerCookie(request, response);

    expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
    expect(handleHttpCookie).toHaveBeenCalledWith(request, response, expectedSettings, 'value');
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).not.toHaveBeenCalled();
  });

  it('should not call if no client key is retrieved', async () => {
    jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: 'value', clientKey: '' });
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as utils.IMiddlewareNextResponse | utils.IHttpResponse;

    await handleServerCookie(request, response);

    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when forceServerCookieMode is false', async () => {
    jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as utils.IMiddlewareNextResponse | utils.IHttpResponse;

    await handleServerCookie(request, response);

    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie', async () => {
    jest.spyOn(initCore, 'getSettingsServer').mockReturnValue(options);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: 'value', clientKey: '' });
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as utils.IMiddlewareNextResponse | utils.IHttpResponse;

    await handleServerCookie(request, response);

    expect(isNextJsMiddlewareResponse).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when request is not isNextJsMiddlewareRequest or isHttpRequest', async () => {
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: 'value', clientKey: 'val' });
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };

    const response = {
      cookies: {},
    } as unknown as utils.IMiddlewareNextResponse;

    await handleServerCookie(request, response);

    expect(isNextJsMiddlewareResponse).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).toHaveReturnedWith(false);
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });
});
