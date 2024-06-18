import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import * as getDefaultCookieAttributes from './get-default-cookie-attributes';
import * as getGuestId from '../init/get-guest-id';
import * as utils from '@sitecore-cloudsdk/utils';
import { COOKIE_NAME_PREFIX, SITECORE_EDGE_URL } from '../consts';
import type { Settings } from '../settings/interfaces';
import { createCookies } from './create-cookies';

//
jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn(),
  createCookieString: jest.fn(),
  getCookie: jest.fn()
}));

describe('createCookies', () => {
  let settings: Settings;
  const mockCookieAttributes = {
    domain: 'localhost',
    maxAge: 720,
    path: '/',
    sameSite: 'None',
    secure: true
  };

  afterEach(() => {
    jest.clearAllMocks();
    document.cookie = 'testCookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  beforeEach(() => {
    jest.clearAllMocks();

    settings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieNames: { browserId: `${COOKIE_NAME_PREFIX}123`, guestId: `${COOKIE_NAME_PREFIX}123_personalize` },
        cookiePath: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: SITECORE_EDGE_URL
    };
  });

  it('should create the cookies and add the cookies to document.cookie', async () => {
    const expectedBrowserIdCookieName = `${COOKIE_NAME_PREFIX}123`;
    const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
    const expectedBrowserIdValue = 'bid_value';
    const expectedGuestIdValue = 'gid_value';

    const getBrowserIdCookieSpy = jest.spyOn(utils, 'getCookie').mockReturnValueOnce(undefined);
    const createCookieStringSpy = jest
      .spyOn(utils, 'createCookieString')
      .mockReturnValueOnce(`${expectedBrowserIdCookieName}=${expectedBrowserIdValue}`)
      .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

    jest
      .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
      .mockResolvedValueOnce({ browserId: 'bid_value', guestId: 'gid_value' });

    const getDefaultCookieAttributesSpy = jest
      .spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes')
      .mockReturnValueOnce(mockCookieAttributes);

    await createCookies(settings);

    expect(settings.cookieSettings.cookieNames.browserId).toBe(expectedBrowserIdCookieName);
    expect(getBrowserIdCookieSpy).toHaveBeenCalledTimes(1);
    expect(getDefaultCookieAttributesSpy).toHaveBeenCalledTimes(1);
    expect(createCookieStringSpy).toHaveBeenCalledTimes(2);
    expect(document.cookie).toBe(
      `${expectedBrowserIdCookieName}=${expectedBrowserIdValue}; ${expectedGuestIdCookieName}=${expectedGuestIdValue}`
    );
  });

  it(`should not not create a browserId cookie if cookieName exists 
  and should create a guestId cookie instead if does not exist`, async () => {
    const expectedGuestIdCookieName = `${COOKIE_NAME_PREFIX}123_personalize`;
    const expectedGuestIdValue = 'gid_value';

    const getCookieSpy = jest
      .spyOn(utils, 'getCookie')
      .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123`, value: 'bid_value' });

    const getGuestIdSpy = jest.spyOn(getGuestId, 'getGuestId').mockResolvedValueOnce('value2');

    const fetchBrowserIdFromEdgeProxySpy = jest
      .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
      .mockResolvedValueOnce({ browserId: 'value', guestId: 'value2' });

    const createCookieStringSpy = jest
      .spyOn(utils, 'createCookieString')
      .mockReturnValueOnce(`${expectedGuestIdCookieName}=${expectedGuestIdValue}`);

    await createCookies(settings);

    expect(getCookieSpy).toHaveBeenCalledTimes(2);
    expect(getGuestIdSpy).toHaveBeenCalledTimes(1);
    expect(createCookieStringSpy).toHaveBeenCalledTimes(1);
    expect(fetchBrowserIdFromEdgeProxySpy).not.toHaveBeenCalled();
    expect(utils.createCookieString).toHaveBeenCalledTimes(1);
  });

  it(`should neither create a browserId nor a guestId cookie if both exists`, async () => {
    const createCookieStringSpy = jest.spyOn(utils, 'createCookieString');
    const getGuestIdSpy = jest.spyOn(getGuestId, 'getGuestId');

    const getCookieSpy = jest
      .spyOn(utils, 'getCookie')
      .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123`, value: 'bid_value' })
      .mockReturnValueOnce({ name: `${COOKIE_NAME_PREFIX}123_personalize`, value: 'gid_value' });

    const fetchBrowserIdFromEdgeProxySpy = jest.spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy');

    await createCookies(settings);

    expect(getCookieSpy).toHaveBeenCalledTimes(2);
    expect(getGuestIdSpy).not.toHaveBeenCalled();
    expect(createCookieStringSpy).not.toHaveBeenCalled();
    expect(fetchBrowserIdFromEdgeProxySpy).not.toHaveBeenCalled();
    expect(utils.createCookieString).not.toHaveBeenCalled();
  });
});
