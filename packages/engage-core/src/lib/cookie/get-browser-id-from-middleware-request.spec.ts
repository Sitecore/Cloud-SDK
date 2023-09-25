// Import the function to be tested

import { getBrowserIdFromMiddlewareRequest } from './get-browser-id-from-middleware-request';

// Mock the dependencies
const mockCookieName = 'bid_key';
const mockRequest = {
  cookies: { get: jest.fn(), set: jest.fn() },
  headers: {
    get: jest.fn(),
  },
};

describe('getBrowserIdFromMiddlewareRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  it('should return browser ID when found in Next.js v12 cookie format', () => {
    const expectedBrowserId = 'your-browser-id';
    mockRequest.cookies.get.mockReturnValue(expectedBrowserId);

    const result = getBrowserIdFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBe(expectedBrowserId);
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });

  it('should return browser ID when found in Next.js v13 cookie format', () => {
    const expectedBrowserId = 'your-browser-id';
    const cookieObject = { value: expectedBrowserId };
    mockRequest.cookies.get.mockReturnValue(cookieObject);

    const result = getBrowserIdFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBe(expectedBrowserId);
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });

  it('should return undefined when browser ID is not found', () => {
    mockRequest.cookies.get.mockReturnValue(undefined);

    const result = getBrowserIdFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBeUndefined();
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });
});
