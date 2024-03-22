import * as core from '@sitecore-cloudsdk/core';
import { Personalizer } from './personalizer';
import { personalizeServer } from './personalizeServer';
import { MiddlewareRequest } from '@sitecore-cloudsdk/utils';

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
  jest.spyOn(core, 'createCookie').mock;

  const originalReq = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined,
    },
    headers: {
      get: () => '',
    },
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
  const settings = {
    cookieSettings: { cookieDomain: 'cDomain', cookieExpiryDays: 730, cookieName: 'bid_name', cookiePath: '/' },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  };

  let req: MiddlewareRequest;

  beforeEach(() => {
    req = { ...originalReq };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object with available functionality', async () => {
    req.headers.get = () => null;
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest');
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    expect(typeof personalizeServer).toBe('function');

    personalizeServer(eventData, req);
    expect(getBrowserIdFromRequestSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(eventData, settings, '', {
      timeout: undefined,
      userAgent: null,
    });
  });

  it('should include the user agent header and timeout in the opts object', async () => {
    const httpReq = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user-agent': 'test_ua',
      },
    };

    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    jest.spyOn(core, 'getSettingsServer').mockReturnValue(settings);

    personalizeServer(eventData, httpReq);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(eventData, settings, '', { userAgent: 'test_ua' });
  });

  it('should include the user agent header if in middleware request', async () => {
    const getMock = jest.fn().mockReturnValue('test_ua');
    req.headers.get = getMock;
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    jest.spyOn(core, 'getSettingsServer').mockReturnValue(settings);

    personalizeServer(eventData, req, 100);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(eventData, settings, '', {
      timeout: 100,
      userAgent: 'test_ua',
    });
    expect(getMock).toHaveBeenCalledWith('user-agent');
  });

  it('should throw error if settings have not been configured properly', () => {
    jest.spyOn(core, 'getSettingsServer').mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => personalizeServer(eventData, req)).rejects.toThrow(
      `[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.`
    );
  });
});
