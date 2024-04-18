import * as core from '@sitecore-cloudsdk/core';
import { EVENTS_NAMESPACE, LIBRARY_VERSION } from '../../consts';
import type { MiddlewareNextResponse } from '@sitecore-cloudsdk/utils';
import type { ServerSettings } from '@sitecore-cloudsdk/core';
import debug from 'debug';
import { initServer } from './initializer';
import packageJson from '../../../../package.json';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

describe('initializer', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  const getSettingsServerSpy = jest.spyOn(core, 'getSettingsServer');
  const settingsParams: ServerSettings = {
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: undefined
  };
  const req = {
    cookies: {
      get() {
        return 'test';
      },
      set: () => undefined
    },
    headers: {
      get: () => '',
      host: ''
    },
    ip: undefined,
    url: ''
  };
  const res: MiddlewareNextResponse = {
    cookies: {
      set() {
        return 'test';
      }
    }
  };

  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const initCoreSpy = jest.spyOn(core, 'initCoreServer');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init Server', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should run all necessary functionality during init', async () => {
      const eventsServer = await initServer(req, res, settingsParams);
      const eventServerSettings = core.getSettingsServer();

      expect(typeof LIBRARY_VERSION).toBe('string');
      expect(getSettingsServerSpy).toHaveBeenCalledTimes(1);
      expect(LIBRARY_VERSION).toBe(packageJson.version);
      expect(eventServerSettings.sitecoreEdgeContextId).toBe('123');
      expect(eventServerSettings.sitecoreEdgeUrl).toBe('https://edge-platform.sitecorecloud.io');
      expect(typeof eventsServer).toBe('undefined');
    });

    it('should not call handleCookie if enableServerCookie is false', async () => {
      await initServer(req, res, { ...settingsParams, enableServerCookie: false });

      const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

      expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
    });
    it('should not call handleCookie if enableServerCookie is undefined', async () => {
      await initServer(req, res, settingsParams);

      const handleServerCookieSpy = jest.spyOn(core, 'handleServerCookie');

      expect(handleServerCookieSpy).toHaveBeenCalledTimes(0);
    });

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:events' as a namespace`, async () => {
      const debugMock = debug as unknown as jest.Mock;

      initCoreSpy.mockImplementationOnce(() => Promise.resolve());
      await initServer(req, res, settingsParams);

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('eventsServer library initialized');
    });

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:events' as a namespace and log the error`, async () => {
      const debugMock = debug as unknown as jest.Mock;

      initCoreSpy.mockImplementationOnce(() => Promise.reject('Error'));

      await expect(async () => {
        await initServer(req, res, settingsParams);
      }).rejects.toThrow(`Error`);

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe(
        `Error on initializing eventsServer library with error: %o`
      );
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(`Error`);
    });
  });
});
