import { TARGET_URL } from '../consts';
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
      contextId: '',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteId: '',
    };

    const mockFetch = Promise.resolve({
      json: () =>
        Promise.resolve({
          ref: 'ref',
        } as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
  });
  it('should resolve with a response containing the ref', async () => {
    const expected = { ref: 'ref' };
    createCookie(TARGET_URL, settings.clientKey, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
    }).then((res) => {
      expect(res).toEqual(expected.ref);
    });
  });

  it('should create a client side cookie with the right name and value', async () => {
    const expected = `${settings.cookieSettings.cookieName}=ref`;

    await createCookie(TARGET_URL, settings.clientKey, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
    });
    jest.spyOn(document, 'cookie', 'get').mockImplementationOnce(() => 'bid_name=ref');
    expect(document.cookie).toContain(expected);
  });
});
