import { isNextJsMiddlewareRequest } from './is-next-js-middleware-request';
import { TRequest } from '../interfaces';

describe('isNextJsMiddlewareRequest', () => {
  it('should return true for a valid Next.js Middleware Request', () => {
    const validMiddlewareRequest = {
      cookies: {
        get: jest.fn(),
        set: jest.fn(),
      },
    };

    const result = isNextJsMiddlewareRequest(validMiddlewareRequest as unknown as TRequest);

    expect(result).toBe(true);
  });

  it('should return false for an object without cookies', () => {
    const objectWithoutCookies = {
      query: {},
    };

    const result = isNextJsMiddlewareRequest(objectWithoutCookies as unknown as TRequest);

    expect(result).toBe(false);
  });

  it('should return false for an empty object', () => {
    const result = isNextJsMiddlewareRequest({} as unknown as TRequest);

    expect(result).toBe(false);
  });
});
