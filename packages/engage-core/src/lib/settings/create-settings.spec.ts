import { BID_PREFIX } from '../consts';
import { createSettings } from './create-settings';

describe('createSettings', () => {
  it('should store all provided settings', () => {
    const {
      clientKey,
      cookieSettings: { cookieDomain, cookieExpiryDays, cookiePath, cookieName },
      pointOfSale,
      siteId,
      contextId,
    } = createSettings({
      clientKey: 'key',
      contextId: '0123',
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      pointOfSale: 'spinair.com',
      siteId: '4567',
    });

    expect(clientKey).toEqual('key');
    expect(cookieDomain).toEqual('domain');
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual(`${BID_PREFIX}key`);
    expect(pointOfSale).toEqual('spinair.com');
    expect(siteId).toEqual('4567');
    expect(contextId).toEqual('0123');
  });

  it('should hold default values for optional settings', () => {
    const {
      cookieSettings: { cookieExpiryDays, cookiePath },
      pointOfSale,
    } = createSettings({
      clientKey: 'key',
      contextId: '0123',
      cookieDomain: 'domain',
      pointOfSale: undefined,
      siteId: '4567',
    });

    expect(pointOfSale).toBeUndefined();
    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
  });
});
