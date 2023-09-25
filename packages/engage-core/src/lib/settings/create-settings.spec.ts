import { BID_PREFIX } from '../consts';
import { createSettings } from './create-settings';

describe('createSettings', () => {
  it('should store all provided settings', () => {
    const {
      clientKey,
      cookieSettings: { cookieDomain, cookieExpiryDays, cookiePath, forceServerCookieMode, cookieName },
      includeUTMParameters,
      targetURL,
      pointOfSale,
    } = createSettings({
      clientKey: 'key',
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      forceServerCookieMode: true,
      includeUTMParameters: false,
      pointOfSale: 'spinair.com',
      targetURL: 'https://api',
    });

    expect(targetURL).toEqual('https://api');
    expect(clientKey).toEqual('key');
    expect(cookieDomain).toEqual('domain');
    expect(forceServerCookieMode).toEqual(true);
    expect(includeUTMParameters).toEqual(false);
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual(`${BID_PREFIX}key`);
    expect(pointOfSale).toEqual('spinair.com');
  });

  it('should hold default values for optional settings', () => {
    const {
      cookieSettings: { cookieExpiryDays, cookiePath, forceServerCookieMode },
      includeUTMParameters,
      pointOfSale,
    } = createSettings({
      clientKey: 'key',
      cookieDomain: 'domain',
      pointOfSale: undefined,
      targetURL: 'https://api',
    });

    expect(pointOfSale).toBeUndefined();
    expect(forceServerCookieMode).toEqual(false);
    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
    expect(includeUTMParameters).toEqual(true);
  });
});
