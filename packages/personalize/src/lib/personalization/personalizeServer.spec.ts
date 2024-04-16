import * as core from '@sitecore-cloudsdk/core';
import { PersonalizeData, Personalizer } from './personalizer';
import { MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import { personalizeServer } from './personalizeServer';

jest.mock('./personalizer');

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('personalizeServer', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  jest.spyOn(core, 'createCookie').mock;
  const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');

  const originalReq = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined
    },
    headers: {
      get: () => ''
    },
    url: ''
  };
  const personalizeData: PersonalizeData = {
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    language: 'EN'
  };
  const settings = {
    cookieSettings: { cookieDomain: 'cDomain', cookieExpiryDays: 730, cookieName: 'bid_name', cookiePath: '/' },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: ''
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
    const getBrowserIdFromRequestSpy = jest.spyOn(core, 'getBrowserIdFromRequest');
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    expect(typeof personalizeServer).toBe('function');

    personalizeServer(req, personalizeData);
    expect(getBrowserIdFromRequestSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
      timeout: undefined,
      userAgent: null
    });
  });

  it('should include the user agent header and timeout in the opts object', async () => {
    const httpReq = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user-agent': 'test_ua'
      }
    };

    jest.spyOn(core, 'getSettingsServer').mockReturnValue(settings);

    personalizeServer(httpReq, personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
      userAgent: 'test_ua'
    });
  });

  it('should include the user agent header if in middleware request', async () => {
    const getMock = jest.fn().mockReturnValue('test_ua');
    req.headers.get = getMock;
    jest.spyOn(core, 'getSettingsServer').mockReturnValue(settings);

    personalizeServer(req, personalizeData, { timeout: 100 });

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
      timeout: 100,
      userAgent: 'test_ua'
    });
    expect(getMock).toHaveBeenCalledWith('user-agent');
  });

  it('should throw error if settings have not been configured properly', () => {
    jest.spyOn(core, 'getSettingsServer').mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    expect(async () => personalizeServer(req, personalizeData)).rejects.toThrow(
      `[IE-0007] You must first initialize the "personalize/server" module. Run the "init" function.`
    );
  });

  it('should use the request.geo if personalizeData.geo is empty and request is a valid MiddlewareRequest', async () => {
    req.geo = {
      city: 'Tarnów',
      country: 'PL',
      region: '12'
    };
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    personalizeServer(req, personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      {
        ...personalizeData,
        geo: {
          city: 'Tarnów',
          country: 'PL',
          region: '12'
        }
      },
      settings,
      '',
      { timeout: undefined, userAgent: 'test_ua' }
    );
  });

  it('should omit the request.geo if personalizeData.geo has values', async () => {
    req.geo = {
      city: 'Tarnów',
      country: 'PL',
      region: '12'
    };
    personalizeData.geo = {
      city: 'Athens',
      country: 'GR',
      region: 'I'
    };
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    personalizeServer(req, personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
      {
        ...personalizeData,
        geo: {
          city: 'Athens',
          country: 'GR',
          region: 'I'
        }
      },
      settings,
      '',
      { timeout: undefined, userAgent: 'test_ua' }
    );
  });

  it('should omit the request.geo if request.geo is empty', async () => {
    personalizeData.geo = undefined;
    req.geo = {};
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    personalizeServer(req, personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
      timeout: undefined,
      userAgent: 'test_ua'
    });
  });

  it("should omit the request.geo if request.geo doesn't exist in the MiddlewareRequest", async () => {
    personalizeData.geo = undefined;
    req.geo = undefined;
    const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
    getSettingsServerSpy.mockReturnValue(settings);

    personalizeServer(req, personalizeData);

    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
    expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(personalizeData, settings, '', {
      timeout: undefined,
      userAgent: 'test_ua'
    });
  });
});
