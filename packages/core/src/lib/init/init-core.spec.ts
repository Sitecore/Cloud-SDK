/* eslint-disable @typescript-eslint/naming-convention */
import { getSettings, initCore, setCoreSettings, setCookiePromise } from './init-core';
import { Settings, SettingsParamsBrowser } from '../settings/interfaces';
import * as createCookieInit from '../cookie/create-cookie';
import * as utils from '@sitecore-cloudsdk/utils';
import * as createSetting from '../settings/create-settings';

// Mock the dependencies
jest.mock('../cookie/create-cookie', () => ({
  createCookie: jest.fn(),
}));

jest.mock('@sitecore-cloudsdk/utils', () => ({
  cookieExists: jest.fn(),
}));

const mockSettings = {
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieName: '',
    cookiePath: '/',
  },
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: '',
};
describe('initCore', () => {
  let mockSettingsInput: SettingsParamsBrowser;

  beforeEach(() => {
    mockSettingsInput = {
      cookieDomain: 'cDomain',
      siteName: '456',
      sitecoreEdgeContextId: '123',
    };
    setCoreSettings(null as any);
    setCookiePromise(null as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should run initialize without creating a cookie', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookieInitSpy = jest.spyOn(createCookieInit, 'createCookie');

    mockSettingsInput.enableBrowserCookie = false;

    await initCore(mockSettingsInput);
    const settings = getSettings();

    expect(settings).toEqual(mockSettings);
    expect(createCookieInitSpy).toHaveBeenCalledTimes(0);
  });

  it('should run initialize and create cookie', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookieInitSpy = jest.spyOn(createCookieInit, 'createCookie');

    mockSettingsInput.enableBrowserCookie = true;

    await initCore(mockSettingsInput);
    const settings = getSettings();

    expect(settings).toEqual(mockSettings);
    expect(createCookieInitSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call secondary functions when re-initializing', async () => {
    const createSettingsSpy = jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    const createCookieSpy = jest.spyOn(createCookieInit, 'createCookie').mockResolvedValueOnce();
    mockSettingsInput.enableBrowserCookie = true;

    await initCore(mockSettingsInput);

    expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    expect(createCookieSpy).toHaveBeenCalledTimes(1);

    await initCore(mockSettingsInput);

    expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    expect(createCookieSpy).toHaveBeenCalledTimes(1);
  });
});

describe('getSettings', () => {
  beforeEach(() => {
    setCoreSettings(null as unknown as Settings);
  });

  it('should return the core settings if they have been initialized', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    const settingsInput: SettingsParamsBrowser = {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookiePath: '/',
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    await initCore(settingsInput);

    const result = getSettings();

    expect(result).toEqual(mockSettings);
  });
  it('should throw an error if the core settings are not initialized', () => {
    expect(() => getSettings()).toThrow(
      `[IE-0008] You must first initialize the "core" package. Run the "init" function.`
    );
  });
});
