import * as fetchBrowserIdFromEdgeProxy from '../init/fetch-browser-id-from-edge-proxy';
import * as getDefaultCookieAttributes from './get-default-cookie-attributes';
import * as utils from '@sitecore-cloudsdk/utils';
import { COOKIE_NAME_PREFIX, SITECORE_EDGE_URL } from '../consts';
import { Settings } from '../settings/interfaces';
import { createCookie } from './create-cookie';

jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn(),
  createCookieString: jest.fn()
}));

describe('createCookie', () => {
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
        cookieName: `${COOKIE_NAME_PREFIX}123`,
        cookiePath: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: SITECORE_EDGE_URL
    };
  });

  it('should create a cookie and update the settings', async () => {
    const expectedCookieName = `${COOKIE_NAME_PREFIX}123`;
    const expectedCookie = `${expectedCookieName}=bid_value`;
    const cookieExistSpy = jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookieStringSpy = jest.spyOn(utils, 'createCookieString').mockReturnValueOnce(expectedCookie);
    jest
      .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
      .mockResolvedValueOnce({ browserId: 'value' });
    const getDefaultCookieAttributesSpy = jest
      .spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes')
      .mockReturnValueOnce(mockCookieAttributes);

    await createCookie(settings);

    expect(settings.cookieSettings.cookieName).toBe(expectedCookieName);
    expect(cookieExistSpy).toHaveBeenCalledTimes(1);
    expect(getDefaultCookieAttributesSpy).toHaveBeenCalledTimes(1);
    expect(createCookieStringSpy).toHaveBeenCalledTimes(1);
  });

  it('should not not create a cookie if cookieName exists', async () => {
    const cookieExistSpy = jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(true);
    const fetchBrowserIdFromEdgeProxySpy = jest
      .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
      .mockResolvedValueOnce({ browserId: 'value' });

    await createCookie(settings);

    expect(cookieExistSpy).toHaveBeenCalledTimes(1);
    expect(fetchBrowserIdFromEdgeProxySpy).not.toHaveBeenCalled();
    expect(utils.createCookieString).not.toHaveBeenCalled();
  });

  it('should add the cooke to document.cookie', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    jest
      .spyOn(fetchBrowserIdFromEdgeProxy, 'fetchBrowserIdFromEdgeProxy')
      .mockResolvedValueOnce({ browserId: 'value' });
    jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValueOnce(mockCookieAttributes);

    const expected = `${settings.cookieSettings.cookieName}=value`;

    await createCookie(settings);
    jest.spyOn(document, 'cookie', 'get').mockImplementationOnce(() => 'sc_123=value');
    expect(document.cookie).toContain(expected);
  });
});
