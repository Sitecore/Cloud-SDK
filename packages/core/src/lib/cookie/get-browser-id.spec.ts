import * as init from '../init/init-core';
import { COOKIE_NAME_PREFIX } from '../consts';
import { getBrowserId } from './get-browser-id';

describe('getBrowserId', () => {
  jest.spyOn(init, 'getSettings').mockReturnValue({
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieNames: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
      cookiePath: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cookie value when cookie exists on the page ', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce(`${COOKIE_NAME_PREFIX}123=bid_value`);

    const cookieValue = getBrowserId();
    expect(cookieValue).toEqual('bid_value');
    expect(init.getSettings).toHaveBeenCalledTimes(1);
  });

  it('should return empty string if there is a cookie but not the correct one', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce('WrongCookieName=cookieValue');

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
