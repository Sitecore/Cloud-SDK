import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalize } from './personalize';
import * as initializerModule from '../initializer/client/initializer';

jest.mock('./personalizer');

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('personalize', () => {
  const id = 'test_id';
  const eventData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com',
  };

  const settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_name',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };

  const { window } = global;
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
  jest.spyOn(core, 'createCookie').mock;

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  it('should return an object with available functionality', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(eventData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(Personalizer).toHaveBeenCalledTimes(1);
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => await personalize(eventData)).rejects.toThrow(
      `[IE-0006] You must first initialize the "personalize/browser" module. Run the "init" function.`
    );
  });

  it('should call getInteractiveExperience with timeout in opts object', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(eventData, 100);

    const expectedOpts = { timeout: 100 };
    const expectedData = eventData;
    const expectedSettings = settings;

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(expectedData, expectedSettings, expectedOpts);
  });

  it('should call getInteractiveExperience without opts object', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

    expect(typeof personalize).toBe('function');

    const getSettingsSpy = jest.spyOn(core, 'getSettings');
    getSettingsSpy.mockReturnValue(settings);

    await personalize(eventData);

    const expectedOpts = { timeout: undefined };
    const expectedData = eventData;
    const expectedSettings = settings;

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(expectedData, expectedSettings, expectedOpts);
  });
});
