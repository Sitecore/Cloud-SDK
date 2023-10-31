import { ISettings } from '../settings/interfaces';
import { createCookie } from './create-cookie';
import * as getProxySettings from '../init/get-proxy-settings';
import * as utils from '@sitecore-cloudsdk/utils';
import * as getDefaultCookieAttributes from './get-default-cookie-attributes';
import { BID_PREFIX } from '../consts';

jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn(),
  createCookieString: jest.fn(),
}));

describe('createCookie', () => {
  let settings: ISettings;
  const mockCookieAttributes = {
    domain: 'localhost',
    maxAge: 720,
    path: '/',
    sameSite: 'None',
    secure: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
    document.cookie = 'testCookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    settings = {
      contextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: '',
        cookiePath: '/',
      },
      siteId: '456',
    };
  });
  it('should create a cookie and update the settings', async () => {
    const expectedCookieName = `${BID_PREFIX}c_key`;
    const expectedCookie = `${expectedCookieName}=bid_value`;
    const cookieExistSpy = jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    jest.spyOn(utils, 'createCookieString').mockReturnValueOnce(expectedCookie);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValueOnce({ browserId: 'value', clientKey: 'c_key' });
    jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValueOnce(mockCookieAttributes);

    await createCookie(settings);

    expect(settings.cookieSettings.cookieName).toBe(expectedCookieName);
    expect(cookieExistSpy).toHaveBeenCalledTimes(1);
  });

  it('should not run if browser id comes as an empty string', async () => {
    const cookieExistSpy = jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({ browserId: '', clientKey: 'c_key' });

    await createCookie(settings);

    expect(cookieExistSpy).toHaveBeenCalledTimes(1);
    expect(utils.createCookieString).toHaveBeenCalledTimes(0);
  });

  it('should add the cooke to document.cookie', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValueOnce({ browserId: 'value', clientKey: 'c_key' });
    jest.spyOn(getDefaultCookieAttributes, 'getDefaultCookieAttributes').mockReturnValueOnce(mockCookieAttributes);

    const expected = `${settings.cookieSettings.cookieName}=value`;

    await createCookie(settings);
    jest.spyOn(document, 'cookie', 'get').mockImplementationOnce(() => 'bid_c_key=value');
    expect(document.cookie).toContain(expected);
  });
});
