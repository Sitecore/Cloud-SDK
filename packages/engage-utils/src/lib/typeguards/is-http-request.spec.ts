import { isHttpRequest } from './is-http-request';
import { TRequest } from '../interfaces';

describe('isHttpRequest', () => {
  it('should return true for a valid HTTP Request', () => {

    const httpRequest = {
      headers: {
        'cookie':'test'
      },
    };

    const result = isHttpRequest(httpRequest);

    expect(result).toBe(true);
  });

  it('should return false for an object without headers', () => {

    const nonHttpRequest = {
      cookies: {
        get: jest.fn(),
      },
    };

    const result = isHttpRequest(nonHttpRequest as unknown as TRequest);

    expect(result).toBe(false);
  });

  it('should return false for an empty object', () => {

    const result = isHttpRequest({} as unknown as TRequest);

    expect(result).toBe(false);
  });
});
