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
      contextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        cookieTempValue: 'bid_value'
      },
      siteId: '456',
    };

    const mockFetch = Promise.resolve({
      json: () =>
        Promise.resolve({
          ref: 'bid_value',
        } as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
  });
  it('should resolve with a response containing the ref', async () => {
    const expected = { ref: 'bid_value' };
    createCookie(settings.contextId, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
      cookieTempValue: 'bid_value'
    }).then((res) => {
      expect(res).toEqual(expected.ref);
    });
  });

  it('should create a client side cookie with the right name and value', async () => {
    const expected = `${settings.cookieSettings.cookieName}=bid_value`;

    await createCookie(settings.contextId, {
      cookieExpiryDays: settings.cookieSettings.cookieExpiryDays,
      cookieName: settings.cookieSettings.cookieName,
      cookieTempValue: 'bid_value'
    });
    jest.spyOn(document, 'cookie', 'get').mockImplementationOnce(() => 'bid_name=bid_value');
    expect(document.cookie).toContain(expected);
  });
});
