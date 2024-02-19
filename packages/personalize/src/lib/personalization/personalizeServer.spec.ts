import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalizeServer } from './personalizeServer';

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
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
      host: '',
    },
    ip: undefined,
    url: '',
  };

  const eventData = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com',
  };

  jest.spyOn(core, 'createCookie').mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object with available functionality', async () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest');
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue({
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    });

    expect(typeof personalizeServer).toBe('function');

    personalizeServer(eventData, req);
    expect(getBrowserIdFromRequestSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if settings have not been configured properly', () => {
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => personalizeServer(eventData, req)).rejects.toThrow(
      `[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.`
    );
  });
});
