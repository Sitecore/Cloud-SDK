/* eslint-disable @typescript-eslint/no-unused-vars */

import { getBrowserId } from './get-browser-id';
import * as init from './init-core';

describe('getBrowserId', () => {
  jest.spyOn(init, 'getSettings').mockReturnValue({
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'cookieName',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
  });

  afterEach(() => {
    document.cookie = 'cookieName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'WrongCookieName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    jest.clearAllMocks();
  });

  it('should return the cookie value when cookie exists on the page ', async () => {
    global.document.cookie = 'cookieName=cookieValue';

    const cookieValue = getBrowserId();
    expect(cookieValue).toEqual('cookieValue');
    expect(init.getSettings).toHaveBeenCalledTimes(1);
  });

  it('should return empty string if there is a cookie but not the correct one', async () => {
    global.document.cookie = 'WrongCookieName=cookieValue';

    const cookieValue = getBrowserId();
    expect(cookieValue).toEqual('');
    expect(init.getSettings).toHaveBeenCalledTimes(1);
  });

  it('should return empty string if no cookie exists on the page', async () => {
    const cookieValue = getBrowserId();
    expect(cookieValue).toBe('');
    expect(init.getSettings).toHaveBeenCalledTimes(1);
  });
});
