import { SITECORE_EDGE_URL, COOKIE_NAME_PREFIX } from '../consts';
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
      sitecoreEdgeUrl,
    } = createSettings({
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      siteName: '4567',
      sitecoreEdgeContextId: '0123',
      sitecoreEdgeUrl: undefined as unknown as string,
    });
    expect(cookieDomain).toEqual('domain');
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual(`${COOKIE_NAME_PREFIX}${sitecoreEdgeContextId}`);
    expect(siteName).toEqual('4567');
    expect(sitecoreEdgeContextId).toEqual('0123');
    expect(sitecoreEdgeUrl).toEqual(SITECORE_EDGE_URL);
  });
  it('should hold default values for optional settings', () => {
    const {
      cookieSettings: { cookieExpiryDays, cookiePath },
      sitecoreEdgeUrl,
    } = createSettings({
      cookieDomain: 'domain',
      siteName: '4567',
      sitecoreEdgeContextId: '0123',
      sitecoreEdgeUrl: 'https://localhost',
    });

    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
    expect(sitecoreEdgeUrl).toEqual('https://localhost');
  });
});
