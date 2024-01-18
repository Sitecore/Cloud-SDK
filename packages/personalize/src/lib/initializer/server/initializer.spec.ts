/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sort-keys */
import * as core from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import packageJson from '../../../../package.json';
import { initServer } from './initializer';

jest.mock('../../personalization/personalizer');
jest.mock('../../personalization/send-call-flows-request');

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
  const settingsParams: core.SettingsParamsServer = {
    sitecoreEdgeContextId: '456',
    cookieDomain: 'cDomain',
    enableServerCookie: true,
    siteName: '123',
    sitecoreEdgeUrl: '',
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

  const res = {
    cookies: {
      set() {
        return 'test';
      },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const initCoreSpy = jest.spyOn(core, 'initCoreServer');

  jest.spyOn(core, 'getSettingsServer').mockReturnValue({
    sitecoreEdgeContextId: '456',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'bid_key',
      cookiePath: '/',
    },
    siteName: '123',
    sitecoreEdgeUrl: '',
  });

  describe('init', () => {
    it('should initialize the server functionality', async () => {
      initCoreSpy.mockImplementationOnce(() => Promise.resolve());
      await initServer(settingsParams, req, res);
      const settings = core.getSettingsServer();
      expect(settings).toBeDefined();
      expect(settings.sitecoreEdgeContextId).toBe('456');
      expect(core.initCoreServer).toHaveBeenCalledTimes(1);
      expect(core.getSettingsServer).toHaveBeenCalledTimes(1);
      expect(LIBRARY_VERSION).toBe(packageJson.version);
    });
  });
});
