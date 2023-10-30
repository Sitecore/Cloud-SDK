import { createSettings } from './create-settings';

describe('createSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should store all provided settings', () => {
    const {
      cookieSettings: { cookieDomain, cookieExpiryDays, cookiePath, cookieName },
      siteId,
      contextId,
    } = createSettings({
      contextId: '0123',
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      siteId: '4567',
    });

    expect(cookieDomain).toEqual('domain');
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual('');
    expect(siteId).toEqual('4567');
    expect(contextId).toEqual('0123');
  });

  it('should hold default values for optional settings', () => {
    const {
      cookieSettings: { cookieExpiryDays, cookiePath },
    } = createSettings({
      contextId: '0123',
      cookieDomain: 'domain',
      siteId: '4567',
    });

    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
  });
});
