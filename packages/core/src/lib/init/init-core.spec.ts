/* eslint-disable @typescript-eslint/naming-convention */
import { getSettings, initCore, setInitStatus, setCoreSettings, INIT_STATUSES } from './init-core';
import { ISettings, ISettingsParamsBrowser } from '../settings/interfaces';
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
  contextId: '123',
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieName: '',
    cookiePath: '/',
  },
  siteId: '456',
};
describe('initCore', () => {
  let mockSettingsInput: ISettingsParamsBrowser;

  beforeEach(() => {
    mockSettingsInput = {
      contextId: '123',
      cookieDomain: 'cDomain',
      siteId: '456',
    };
    setInitStatus(INIT_STATUSES.NOT_STARTED);
    setCoreSettings(null as unknown as ISettings);
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

  it('should return void if trying to re-initialize', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    jest.spyOn(utils, 'cookieExists').mockReturnValueOnce(false);
    const createCookieSpy = jest.spyOn(createCookieInit, 'createCookie');
    mockSettingsInput.enableBrowserCookie = true;

    await initCore(mockSettingsInput);
    expect(createCookieSpy).toHaveBeenCalledTimes(1);

    const result = await initCore(mockSettingsInput);

    expect(result).toBe(void 0);
    expect(createCookieSpy).toHaveBeenCalledTimes(1);
  });
});

describe('getSettings', () => {
  beforeEach(() => {
    setInitStatus(INIT_STATUSES.NOT_STARTED);
    setCoreSettings(null as unknown as ISettings);
  });

  it('should return the core settings if they have been initialized', async () => {
    jest.spyOn(createSetting, 'createSettings').mockReturnValueOnce(mockSettings);
    const settingsInput: ISettingsParamsBrowser = {
      contextId: '123',
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookiePath: '/',

      siteId: '456',
    };

    await initCore(settingsInput);

    const result = getSettings();

    expect(result).toEqual(mockSettings);
  });
  it('should throw an error if the core settings are not initialized', () => {
    expect(() => getSettings()).toThrow(
      `[IE-0004] You must first initialize the "core" module. Run the "init" function.`
    );
  });
});
