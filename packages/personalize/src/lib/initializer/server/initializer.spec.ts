import * as core from '@sitecore-cloudsdk/engage-core';
import { LIBRARY_VERSION } from '../../consts';
import packageJson from '../../../../package.json';
import { IMiddlewareNextResponse } from '@sitecore-cloudsdk/engage-utils';
import { Personalizer } from '../../personalization/personalizer';
import { initServer } from './initializer';

jest.mock('../../personalization/personalizer');
jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('initializer', () => {
  const id = 'test_id';
  const settingsParams: core.ISettingsParamsServer = {
    clientKey: 'key',
    cookieDomain: 'cDomain',
    targetURL: 'https://domain',
  };
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
    channel: 'WEB',
    currency: 'EUR',
    language: 'EN',
    page: 'races',
    pointOfSale: 'spinair.com',
  };
  const res: IMiddlewareNextResponse = {
    cookies: {
      set() {
        return 'test';
      },
    },
  };

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
  });
  jest.spyOn(core, 'getBrowserIdFromRequest').mockReturnValue(id);
  it('should return an object with available functionality', async () => {
    settingsParams.forceServerCookieMode = true;
    const serverEngage = initServer(settingsParams);

    expect(typeof serverEngage.version).toBe('string');
    expect(serverEngage.version).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(typeof serverEngage).toBe('object');
    expect(typeof serverEngage.handleCookie).toBe('function');
    expect(typeof serverEngage.personalize).toBe('function');

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await serverEngage.handleCookie(req, res);

    expect(handleServerCookieSpy).toHaveBeenCalledTimes(1);

    serverEngage.personalize({ friendlyId: 'personalizeintegrationtest', ...eventData }, req);
    expect(Personalizer).toHaveBeenCalledTimes(1);
  });

  it('should return an object with available functionality but not call handleServerCookieSpy when ', async () => {
    settingsParams.forceServerCookieMode = false;
    const serverEngage = initServer(settingsParams);

    expect(typeof serverEngage.version).toBe('string');
    expect(serverEngage.version).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(typeof serverEngage).toBe('object');
    expect(typeof serverEngage.handleCookie).toBe('function');
    expect(typeof serverEngage.personalize).toBe('function');

    const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

    await serverEngage.handleCookie(req, res);

    expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);

    serverEngage.personalize({ friendlyId: 'personalizeintegrationtest', ...eventData }, req);
    expect(Personalizer).toHaveBeenCalledTimes(1);
  });
});
