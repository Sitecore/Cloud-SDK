/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISettings } from '../settings/interfaces';
import { getBrowserId } from './get-browser-id';

describe('getBrowserId', () => {
  let settings: ISettings = {
    clientKey: 'key',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'cookieName',
      cookiePath: '/',
      forceServerCookieMode: false,
    },
    includeUTMParameters: true,
    targetURL: 'https://domain',
  };

  beforeEach(() => {
    settings = {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'cookieName',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    };
  });

  afterEach(() => {
    document.cookie = 'cookieName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'WrongCookieName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    jest.clearAllMocks();
  });

  it('should return the cookie value when cookie exists on the page ', async () => {
    global.document.cookie = 'cookieName=cookieValue';

    const cookieValue = getBrowserId(settings.cookieSettings.cookieName);
    expect(cookieValue).toEqual('cookieValue');
  });

  it('should return empty string if there is a cookie but not the correct one', async () => {
    global.document.cookie = 'WrongCookieName=cookieValue';

    const cookieValue = getBrowserId(settings.cookieSettings.cookieName);
    expect(cookieValue).toEqual('');
  });

  it('should return empty string if no cookie exists on the page', async () => {
    const cookieValue = getBrowserId(settings.cookieSettings.cookieName);
    expect(cookieValue).toBe('');
  });
});
