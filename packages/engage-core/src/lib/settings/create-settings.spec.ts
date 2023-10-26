import { BID_PREFIX } from '../consts';
import { ICdpResponse } from '../interfaces';
import { createSettings } from './create-settings';
import * as getProxySettings from '../init/get-proxy-settings';

describe('createSettings',() => {
  const mockResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'dac13bc5-cdae-4e65-8868-13443409d05e',
    status: 'OK',
    version: '1.2',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should store all provided settings', async() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

    const {
      cookieSettings: { cookieDomain, cookieExpiryDays, cookiePath, cookieName },
      siteId,
      contextId,
    } = await createSettings({
      contextId: '0123',
      cookieDomain: 'domain',
      cookieExpiryDays: 40,
      cookiePath: '/path',
      siteId: '4567',
    });

    expect(cookieDomain).toEqual('domain');
    expect(cookieExpiryDays).toEqual(40);
    expect(cookiePath).toEqual('/path');
    expect(cookieName).toEqual(`${BID_PREFIX}pqsDATA3lw12v5a9rrHPW1c4hET73GxQ`);
    expect(siteId).toEqual('4567');
    expect(contextId).toEqual('0123');
  });

  it('should hold default values for optional settings', async() => {
      jest.spyOn(getProxySettings, 'getProxySettings').mockResolvedValue({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        browserId: 'xxx',
        clientKey: 'yyy'
      });

    const {
      cookieSettings: { cookieExpiryDays, cookiePath }
    } = await createSettings({
      contextId: '0123',
      cookieDomain: 'domain',
      siteId: '4567',
    });

    expect(cookieExpiryDays).toEqual(730);
    expect(cookiePath).toEqual('/');
  });
});
