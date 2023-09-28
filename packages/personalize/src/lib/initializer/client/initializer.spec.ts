import { init } from './initializer';
import * as core from '@sitecore-cloudsdk/engage-core';
import * as utils from '@sitecore-cloudsdk/engage-utils';
import { LIBRARY_VERSION } from '../../consts';
import packageJson from '../../../../package.json';
import { Personalizer } from '../../personalization/personalizer';

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

const settingsParams: core.ISettingsParamsBrowser = {
  clientKey: 'key',
  cookieDomain: 'cDomain',
  targetURL: 'https://domain',
};

describe('initializer', () => {
  const { window } = global;
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  const id = 'test_id';
  jest.spyOn(core, 'createCookie').mock;
  const settingsObj = {
    clientKey: 'key',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      forceServerCookieMode: false,
    },
    includeUTMParameters: true,
    targetURL: 'https://domain',
  };
  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  it('should try to create a cookie if it does not exist', () => {
    jest.spyOn(core, 'createCookie').mock;
    jest.spyOn(utils, 'cookieExists').mockReturnValue(false);
    jest.spyOn(core, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });

    init(settingsParams);

    expect(core.createCookie).toHaveBeenCalledTimes(1);
  });

  it('should not try to create a cookie if it already exists', () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
    jest.spyOn(core, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });

    init(settingsParams);

    expect(core.createCookie).toHaveBeenCalledTimes(0);
  });
  it('should return an object with available functionality', async () => {
    const eventData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pointOfSale: 'spinair.com',
    };

    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
    jest.spyOn(core, 'createSettings').mockReturnValue(settingsObj);

    const engage = await init(settingsParams);

    expect(typeof engage.version).toBe('string');
    expect(engage.version).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(typeof engage.personalize).toBe('function');

    engage.personalize({ friendlyId: 'personalizeintegrationtest', ...eventData });
    expect(Personalizer).toHaveBeenCalledTimes(1);
  });

  describe('window object', () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
    jest.spyOn(core, 'createSettings').mockReturnValue({
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    });
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    it('should invoke get browser id method when calling the getBrowserId method', async () => {
      await init(settingsParams);

      if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
      expect(core.getBrowserId).toHaveBeenCalledTimes(2);
    });
    it('adds method to get ID to window Engage property when engage is on window', async () => {
      await init(settingsParams);
      expect(global.window.Engage).toBeDefined();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      global.window.Engage = { test: 'test' } as any;
      expect((global.window.Engage as any).test).toEqual('test');
      /* eslint-enable @typescript-eslint/no-explicit-any */
      expect(global.window.Engage?.getBrowserId).toBeDefined;
    });

    it('should add the library version to window.Engage object', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.window.Engage = undefined as any;
      expect(global.window.Engage).toBeUndefined();
      await init(settingsParams);
      expect(global.window.Engage.versions).toBeDefined();
      expect(global.window.Engage.versions).toEqual({ personalize: LIBRARY_VERSION });
    });

    it('should throw error if window is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global.window;

      await expect(async () => {
        await init(settingsParams);
      }).rejects.toThrowError(
        // eslint-disable-next-line max-len
        `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
      );
    });

    it('should expand the window.Engage object', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
      await init(settingsParams);
      expect(global.window.Engage.versions).toBeDefined();
      expect(global.window.Engage.versions).toEqual({
        personalize: LIBRARY_VERSION,
        testV: '1.0.0',
      });
    });
  });
});
