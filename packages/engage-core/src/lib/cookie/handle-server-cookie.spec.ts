import { ISettings } from '../settings/interfaces';
import { handleServerCookie } from './handle-server-cookie';
import * as HandleNextJsMiddlewareCookie from './handle-next-js-middleware-cookie';
import * as HandleHttpCookie from './handle-http-cookie';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IHttpResponse, IMiddlewareNextResponse, TRequest } from '../../../../engage-utils/src/lib/interfaces';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as IsNextJsMiddlewareRequest from '../../../../engage-utils/src/lib/typeguards/is-next-js-middleware-request';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as IsNextJsMiddlewareResponse from '../../../../engage-utils/src/lib/typeguards/is-next-js-middleware-response';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as CookieServerSide from '../../../../engage-utils/src/lib/cookies/get-cookie-server-side';
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

  const isNextJsMiddlewareRequest = jest.spyOn(IsNextJsMiddlewareRequest, 'isNextJsMiddlewareRequest');
  const isNextJsMiddlewareResponse = jest.spyOn(IsNextJsMiddlewareResponse, 'isNextJsMiddlewareResponse');

  const handleNextJsMiddlewareCookie = jest.spyOn(HandleNextJsMiddlewareCookie, 'handleNextJsMiddlewareCookie');
  const handleHttpCookie = jest.spyOn(HandleHttpCookie, 'handleHttpCookie');
  const getCookieServerSide = jest.spyOn(CookieServerSide, 'getCookieServerSide');

  const options: ISettings = {
    clientKey: 'key',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      forceServerCookieMode: true,
    },
    includeUTMParameters: true,
    targetURL: 'https://domain',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call handleNextJsMiddlewareCookie when request is a isNextJsMiddlewareRequest', async () => {
    const request: TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response: IMiddlewareNextResponse = {
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
    const request: TRequest = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'content-language': 'EN',
        'cookie': 'test=test',
        'referer': 'test',
      },
      url: 'test',
    };

    const response: IHttpResponse = {
      setHeader: jest.fn(),
    };

    getCookieServerSide.mockReturnValueOnce({ name: 'test', value: 'test' });

    isNextJsMiddlewareRequest.mockReturnValueOnce(false);

    await handleServerCookie(request, response, options);

    expect(handleHttpCookie).toHaveBeenCalledWith(request, response, options, undefined);
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when forceServerCookieMode is false', async () => {
    const request: TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as IMiddlewareNextResponse | IHttpResponse;
    options.cookieSettings.forceServerCookieMode = false;

    await handleServerCookie(request, response, options);

    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie', async () => {
    const request: TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };
    const response = {} as unknown as IMiddlewareNextResponse | IHttpResponse;

    await handleServerCookie(request, response, options);

    expect(isNextJsMiddlewareResponse).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).toHaveReturnedWith(false);
    expect(handleHttpCookie).not.toHaveBeenCalled();
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
  });

  it('should not call handleNextJsMiddlewareCookie or handleHttpCookie when request is not isNextJsMiddlewareRequest or isHttpRequest', async () => {
    const request: TRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn(),
      },
    };

    const response = {
      cookies: {},
    } as unknown as IMiddlewareNextResponse;

    await handleServerCookie(request, response, options);

    expect(isNextJsMiddlewareResponse).toHaveBeenCalled();
    expect(isNextJsMiddlewareResponse).toHaveReturnedWith(false);
    expect(handleNextJsMiddlewareCookie).not.toHaveBeenCalled();
    expect(handleHttpCookie).not.toHaveBeenCalled();
  });
});
