import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../initializer/client/initializer';
import * as utils from '@sitecore-cloudsdk/utils';
import { Personalizer } from './personalizer';
import { personalize } from './personalize';

jest.mock('./personalizer');

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('personalize', () => {
  const browserId = 'browser_id_value';
  const guestRef = 'guest_ref_value';
  const personalizeData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com'
  };

  const settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/'
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
  };

  let windowSpy: jest.SpyInstance;

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  jest.spyOn(core, 'getBrowserId').mockReturnValue(browserId);
  jest.spyOn(utils, 'getCookieValueClientSide').mockReturnValue(guestRef);

  jest.spyOn(core, 'createCookie').mock;

  beforeEach(() => {
    jest.clearAllMocks();
    windowSpy = jest.spyOn(globalThis, 'window', 'get');
  });

  it('should return an object with available functionality', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(Personalizer).toHaveBeenCalledTimes(1);
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
    expect(utils.getCookieValueClientSide).toHaveBeenCalledWith('guestRef');
    expect(utils.getCookieValueClientSide).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await personalize(personalizeData)).rejects.toThrow(
      `[IE-0006] You must first initialize the "personalize/browser" module. Run the "init" function.`
    );
  });

  it('should call getInteractiveExperience with timeout in opts object', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(personalizeData, { timeout: 100 });

    const expectedOpts = { timeout: 100 };
    const expectedData = personalizeData;
    const expectedSettings = settings;

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      expectedData,
      expectedSettings,
      window.location.search,
      expectedOpts
    );
  });

  it('should call getInteractiveExperience without opts object', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(personalizeData);

    const expectedOpts = { timeout: undefined };
    const expectedData = personalizeData;
    const expectedSettings = settings;

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      expectedData,
      expectedSettings,
      window.location.search,
      expectedOpts
    );
  });

  it('should call getInteractiveExperience without search params', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    windowSpy.mockImplementation(() => ({
      location: {
        search: '?utm_campaign=campaign&utm_medium=email'
      }
    }));

    await personalize(personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      personalizeData,
      settings,
      '?utm_campaign=campaign&utm_medium=email',
      { timeout: undefined }
    );
  });
});
