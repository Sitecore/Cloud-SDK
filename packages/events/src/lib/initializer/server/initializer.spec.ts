import { initServer } from './initializer';
import packageJson from '../../../../package.json';
import { SettingsParamsServer } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import { MiddlewareNextResponse } from '@sitecore-cloudsdk/utils';
import * as core from '@sitecore-cloudsdk/core';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('initializer', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
  const settingsParams: SettingsParamsServer = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: undefined,
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
  const res: MiddlewareNextResponse = {
    cookies: {
      set() {
        return 'test';
      },
    },
  };

  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init Server', () => {
    it('should run all necessary functionality during init', async () => {
      const eventsServer = await initServer(settingsParams, req, res);
      const eventServerSettings = core.getSettingsServer();

      expect(typeof LIBRARY_VERSION).toBe('string');
      expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
      expect(LIBRARY_VERSION).toBe(packageJson.version);
      expect(eventServerSettings.sitecoreEdgeContextId).toBe('123');
      expect(eventServerSettings.sitecoreEdgeUrl).toBe('https://edge-platform.sitecorecloud.io');
      expect(typeof eventsServer).toBe('undefined');
    });

    it('should not call handleCookie if enableServerCookie is false', async () => {
      await initServer({ ...settingsParams, enableServerCookie: false }, req, res);

      const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

      expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
    });
    it('should not call handleCookie if enableServerCookie is undefined', async () => {
      await initServer(settingsParams, req, res);

      const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

      expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
    });
  });
});
