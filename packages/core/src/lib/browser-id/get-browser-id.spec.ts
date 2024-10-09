import * as initCoreModule from '../init/init-core';
import * as coreBrowserModule from '../initializer/browser/initializer';
import { getBrowserId } from './get-browser-id';

jest.mock('../initializer/browser/initializer', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __esModule: true,
  getCloudSDKSettings: jest.fn(),
  initCoreState: false
}));

jest.mock('../init/init-core', () => ({
  getSettings: jest.fn()
}));

describe('getBrowserId', () => {
  const getSettingsSpy = jest.spyOn(initCoreModule, 'getSettings').mockReturnValue({
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
      cookiePath: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  });

  const getCloudSDKSettingsSpy = jest.spyOn(coreBrowserModule, 'getCloudSDKSettings').mockReturnValue({
    cookieSettings: {
      domain: 'cDomain',
      expiryDays: 730,
      name: { browserId: 'bid_name' },
      path: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the cookie value when cookie exists on the page', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce(`bid_name=bid_value`);

    const browserId = getBrowserId();
    expect(browserId).toEqual('bid_value');
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getCloudSDKSettingsSpy).not.toHaveBeenCalled();
  });

  it('should return empty string if there is a cookie but not the correct one', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce('WrongCookieName=cookieValue');

    const browserId = getBrowserId();
    expect(browserId).toEqual('');
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getCloudSDKSettingsSpy).not.toHaveBeenCalled();
  });

  it('should return empty string if no cookie exists on the page', async () => {
    const browserId = getBrowserId();
    expect(browserId).toBe('');
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getCloudSDKSettingsSpy).not.toHaveBeenCalled();
  });

  it('should return the cookie value when cookie exists on the page with new init', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce(`bid_name=bid_value`);

    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toEqual('bid_value');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).not.toHaveBeenCalled();
  });

  it('should return empty string if there is a cookie but not the correct one with new init', async () => {
    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce('WrongCookieName=cookieValue');

    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toEqual('');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).not.toHaveBeenCalled();
  });
  it('should return empty string if no cookie exists on the page with new init', async () => {
    const mockCoreBrowserModule = coreBrowserModule as { initCoreState: Promise<void> };
    mockCoreBrowserModule.initCoreState = Promise.resolve();

    const browserId = getBrowserId();
    expect(browserId).toBe('');
    expect(getCloudSDKSettingsSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).not.toHaveBeenCalled();
  });
});
