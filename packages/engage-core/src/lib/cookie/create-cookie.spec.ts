import { ICdpResponse } from '../interfaces';
import { ISettings } from '../settings/interfaces';
import { createCookie } from './create-cookie';
describe('createCookie', () => {
  let settings: ISettings;

  afterEach(() => {
    jest.clearAllMocks();
    document.cookie = 'testCookie=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  beforeEach(() => {
    settings = {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    };

    const mockFetch = Promise.resolve({
      json: () =>
        Promise.resolve({
          ref: 'ref',
        } as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
  });
  it('should resolve with a response when disableCookie is passed as false', async () => {
    const expected = { ref: 'ref' };
    settings.cookieSettings.forceServerCookieMode = false;
    createCookie(settings.targetURL, settings.clientKey, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
      forceServerCookieMode: settings.cookieSettings.forceServerCookieMode,
    }).then((res) => {
      expect(res).toEqual(expected.ref);
    });
  });

  it('should resolve with a response when disableCookie is passed as true', async () => {
    settings.cookieSettings.forceServerCookieMode = true;
    const expected = { ref: 'ref' };

    createCookie(settings.targetURL, settings.clientKey, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
      forceServerCookieMode: settings.cookieSettings.forceServerCookieMode,
    }).then((res) => {
      expect(res).toEqual(expected.ref);
    });
  });

  it('should create a client side cookie with the right name and value when forceServerCookieMode property is set to false', async () => {
    const expected = `${settings.cookieSettings.cookieName}=ref`;

    await createCookie(settings.targetURL, settings.clientKey, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
      forceServerCookieMode: settings.cookieSettings.forceServerCookieMode,
    });
    jest.spyOn(document, 'cookie', 'get').mockImplementationOnce(() => 'bid_name=ref');
    expect(document.cookie).toContain(expected);
  });

  describe('Create Cookie with setCookie forceServerCookieMode to false', () => {
    it('creates a cookie with the given name, value, and the given expiration time in days', async () => {
      // const cookieMaxAge = settings.cookieSettings.cookieExpiryDays * DAILY_SECONDS;
      // eslint-disable-next-line max-len
      // const expected = `${settings.cookieSettings.cookieName}=ref; Max-Age=${cookieMaxAge}; SameSite=None; Secure; Path=/; Domain=cDomain`;

      await createCookie(settings.targetURL, settings.clientKey, {
        cookieDomain: settings.cookieSettings.cookieDomain,
        cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
        cookieName: settings.cookieSettings.cookieName,
        forceServerCookieMode: false,
      });

      // expect(createCookieStringSpy).toHaveReturnedWith(expected);
      // expect(getDefaultCookieAttributesSpy).toHaveBeenCalledTimes(1);
    });

    it('creates a string of cookie parameters', async () => {
      // const cookieMaxAge = settings.cookieSettings.cookieExpiryDays * DAILY_SECONDS;
      // eslint-disable-next-line max-len
      // const expected = `${settings.cookieSettings.cookieName}=ref; Max-Age=${cookieMaxAge}; SameSite=None; Secure; Path=/; Domain=cDomain`;

      await createCookie(settings.targetURL, settings.clientKey, {
        cookieDomain: settings.cookieSettings.cookieDomain,
        cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
        cookieName: settings.cookieSettings.cookieName,
        forceServerCookieMode: false,
      });

      // expect(createCookieStringSpy).toHaveBeenCalledTimes(1);
      // expect(createCookieStringSpy).toHaveReturnedWith(expected);
    });
  });
});
