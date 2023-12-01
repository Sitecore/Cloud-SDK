import { getBrowserIdFromRequest } from './get-browser-id-from-request';
import * as utils from '@sitecore-cloudsdk/utils';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('getBrowserIdFromRequest', () => {
  const cookieName = 'BID_pqsDATA3lw12v5a9rrHPW1c4hET73GxQ';

  const isMiddlewareRequestSpy = jest.spyOn(utils, 'isNextJsMiddlewareRequest');
  const isHttpRequestSpy = jest.spyOn(utils, 'isHttpRequest');
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return the browser id when retrieved from a nextJS v12 middleware request', async () => {
    const expectedResult = 'test_bid';

    const request = {
      cookies: {
        get: () => expectedResult,
        set: () => undefined,
      },
      headers: {
        get: () => 'test',
      },
      url: '',
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return the browser id when retrieved from a nextJS v13 middleware request', async () => {
    const expectedResult = 'test_bid';

    const request = {
      cookies: {
        get: () => ({ name: cookieName, value: expectedResult }),
        set: () => undefined,
      },
      headers: {
        get: () => '',
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return the browser id when retrieved from a nextJS api request', async () => {
    const expectedResult = 'test_bid';

    const request = {
      body: '',
      cookies: {
        [cookieName]: expectedResult,
      },
      headers: {
        cookie: `${cookieName}=${expectedResult}`,
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return the browser id when retrieved from an HTTP request', async () => {
    const expectedResult = 'test_bid';

    const request = {
      headers: {
        cookie: `${cookieName}=${expectedResult}`,
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty string when no bid was retrieved from a nextJS middleware request', async () => {
    const expectedResult = '';

    const request = {
      cookies: {
        get: () => undefined,
        set: () => undefined,
      },
      headers: {
        get: () => '',
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty string when no bid was retrieved from a nextJS api request', async () => {
    const expectedResult = '';

    const request = {
      body: '',
      cookies: {},
      headers: {
        cookie: undefined,
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });
  it('should return an empty string when no cookie header exists', async () => {
    const expectedResult = '';

    const request = {
      headers: {},
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty string when no cookie header exists', async () => {
    const expectedResult = 'test_id';

    const request = {
      headers: {},
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).not.toEqual(expectedResult);
  });
  it('should return an empty string when no bid exists in cookie-header', async () => {
    const expectedResult = '';
    const request = {
      headers: {
        cookie: 'banana=banana',
      },
    };

    const result = getBrowserIdFromRequest(request, cookieName);
    expect(result).toEqual(expectedResult);
  });

  it('should not call any functions if request is not of type isMiddlewareRequest or isHttpRequest', async () => {
    const request = {} as unknown as utils.Request;

    const result = getBrowserIdFromRequest(request, cookieName);

    expect(result).toBe('');
    expect(isMiddlewareRequestSpy).toHaveBeenCalledTimes(1);
    expect(isHttpRequestSpy).toHaveBeenCalledTimes(1);
  });
});
