import { initServer, getServerDependencies, setServerDependencies, IServerEventsSettings } from './initializer';
import packageJson from '../../../../package.json';
import { ISettingsParamsServer } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import { IMiddlewareNextResponse } from '@sitecore-cloudsdk/utils';
import { EventApiClient } from '../../cdp/EventApiClient';
import * as core from '@sitecore-cloudsdk/core';

jest.mock('../../cdp/EventApiClient');
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
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const settingsParams: ISettingsParamsServer = {
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

  const res: IMiddlewareNextResponse = {
    cookies: {
      set() {
        return 'test';
      },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
  beforeEach(() => {
    setServerDependencies(null as unknown as IServerEventsSettings);
  });

  describe('getServerDependencies', () => {
    it('should throw error if settings are not initialized', () => {
      let settings;
      expect(() => {
        settings = getServerDependencies();
      }).toThrow(`[IE-0007] You must first initialize the "events" package. Run the "init" function.`);

      expect(settings).toBeUndefined();
    });
  });

  describe('init Server', () => {
    it('should run all necessary functionality during init', async () => {
      const eventsServer = await initServer(settingsParams, req, res);
      const eventServerSettings = getServerDependencies();

      expect(typeof LIBRARY_VERSION).toBe('string');
      expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
      expect(LIBRARY_VERSION).toBe(packageJson.version);
      expect(EventApiClient).toHaveBeenCalledTimes(1);
      expect(eventServerSettings.settings.sitecoreEdgeContextId).toBe('123');
      expect(eventServerSettings.settings.sitecoreEdgeUrl).toBe('https://edge-platform.sitecorecloud.io');
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
