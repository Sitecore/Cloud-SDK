import * as createCookies from '../cookie/create-cookies';
import * as createSetting from '../settings/create-settings';
import * as utils from '@sitecore-cloudsdk/utils';
import type { BrowserSettings, Settings } from '../settings/interfaces';
import { getSettings, initCore, setCookiePromise, setCoreSettings } from './init-core';
import { CORE_NAMESPACE } from '../debug/namespaces';
import { ErrorMessages } from '../consts';
import debug from 'debug';

// Mock the dependencies
jest.mock('../cookie/create-cookies', () => ({
  createCookies: jest.fn()
}));

jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn()
}));

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn(() => jest.fn(() => jest.fn())))
  };
});

const mockSettings = {
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieNames: { browserId: '', guestId: '' },
    cookiePath: '/'
  },
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: ''
};
describe('initCore', () => {
  let mockSettingsInput: BrowserSettings;

  beforeEach(() => {
    mockSettingsInput = {
      cookieDomain: 'cDomain',
      siteName: '456',
      sitecoreEdgeContextId: '123'
    };
    setCoreSettings(null as any);
    setCookiePromise(null as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should run initialize without creating a cookie', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookiesSpy = jest.spyOn(createCookies, 'createCookies');

    mockSettingsInput.enableBrowserCookie = false;

    await initCore(mockSettingsInput);
    const settings = getSettings();

    expect(settings).toEqual(mockSettings);
    expect(createCookiesSpy).toHaveBeenCalledTimes(0);
  });

  it('should run initialize and create cookie', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookiesSpy = jest.spyOn(createCookies, 'createCookies');

    mockSettingsInput.enableBrowserCookie = true;

    await initCore(mockSettingsInput);
    const settings = getSettings();

    expect(settings).toEqual(mockSettings);
    expect(createCookiesSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call secondary functions when re-initializing', async () => {
    const createSettingsSpy = jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    const createCookiesSpy = jest.spyOn(createCookies, 'createCookies').mockResolvedValueOnce();
    mockSettingsInput.enableBrowserCookie = true;

    await initCore(mockSettingsInput);

    expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    expect(createCookiesSpy).toHaveBeenCalledTimes(1);

    await initCore(mockSettingsInput);

    expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    expect(createCookiesSpy).toHaveBeenCalledTimes(1);
  });

  it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:test' as a namespace`, async () => {
    const debugMock = debug as unknown as jest.Mock;

    await initCore(mockSettingsInput);

    expect(debugMock).toHaveBeenCalledTimes(1);
    expect(debugMock).toHaveBeenCalledWith(CORE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('coreClient library initialized');
  });
});

describe('getSettings', () => {
  beforeEach(() => {
    setCoreSettings(null as unknown as Settings);
  });

  it('should return the core settings if they have been initialized', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    const settingsInput: BrowserSettings = {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookiePath: '/',
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: ''
    };

    await initCore(settingsInput);

    const result = getSettings();

    expect(result).toEqual(mockSettings);
  });
  it('should throw an error if the core settings are not initialized', () => {
    expect(() => getSettings()).toThrow(ErrorMessages.IE_0008);
  });
});
