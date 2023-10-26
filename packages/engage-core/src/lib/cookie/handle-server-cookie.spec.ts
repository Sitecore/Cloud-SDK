import { ISettings } from '../settings/interfaces';
import { handleServerCookie } from './handle-server-cookie';
import * as HandleNextJsMiddlewareCookie from './handle-next-js-middleware-cookie';
import * as HandleHttpCookie from './handle-http-cookie';
import * as utils from '@sitecore-cloudsdk/engage-utils';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('handleServerCookie', () => {
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
  global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

  const isNextJsMiddlewareRequest = jest.spyOn(utils, 'isNextJsMiddlewareRequest');
  const isNextJsMiddlewareResponse = jest.spyOn(utils, 'isNextJsMiddlewareResponse');

  const handleNextJsMiddlewareCookie = jest.spyOn(HandleNextJsMiddlewareCookie, 'handleNextJsMiddlewareCookie');
  const handleHttpCookie = jest.spyOn(HandleHttpCookie, 'handleHttpCookie');
  const getCookieServerSide = jest.spyOn(utils, 'getCookieServerSide');

  const options: ISettings = {
    contextId: '',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      cookieTempValue: 'bid_value'
    },
    siteId: '',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call handleNextJsMiddlewareCookie when request is a isNextJsMiddlewareRequest', async () => {
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

    await handleServerCookie(request, response, options, undefined);

    expect(handleNextJsMiddlewareCookie).toHaveBeenCalledWith(request, response, options, undefined);

    expect(isNextJsMiddlewareRequest).toHaveBeenCalledTimes(1);
    expect(isNextJsMiddlewareResponse).toHaveBeenCalledTimes(1);

    expect(handleHttpCookie).not.toHaveBeenCalled();
  });

  it('should call handleHttpCookie when request is an HTTP Request', async () => {
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

    await handleServerCookie(request, response, options);

    expect(handleHttpCookie).toHaveBeenCalledWith(request, response, options, undefined);
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie', async () => {
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as utils.IMiddlewareNextResponse | utils.IHttpResponse;

    await handleServerCookie(request, response, options);

    expect(isNextJsMiddlewareResponse).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).toHaveReturnedWith(false);
    expect(handleHttpCookie).not.toHaveBeenCalled();
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when request is not isNextJsMiddlewareRequest or isHttpRequest', async () => {
    const request: utils.TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };

    const response = {
      cookies: {},
    } as unknown as utils.IMiddlewareNextResponse;

    await handleServerCookie(request, response, options);

    expect(isNextJsMiddlewareResponse).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).toHaveReturnedWith(false);
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });
});
