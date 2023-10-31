import { createSettings } from './create-settings';

describe('createSettings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should store all provided settings', () => {
    const {
      cookieSettings: { cookieDomain, cookieExpiryDays, cookiePath, cookieName },
      siteName,
      sitecoreEdgeContextId,
    } = createSettings({
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      siteName: '4567',
      sitecoreEdgeContextId: '0123',
    });

    expect(cookieDomain).toEqual('domain');
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual('');
    expect(siteName).toEqual('4567');
    expect(sitecoreEdgeContextId).toEqual('0123');
  });

  it('should hold default values for optional settings', () => {
    const {
      cookieSettings: { cookieExpiryDays, cookiePath },
    } = createSettings({
      cookieDomain: 'domain',
      siteName: '4567',
      sitecoreEdgeContextId: '0123',
    });

    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
  });
});
