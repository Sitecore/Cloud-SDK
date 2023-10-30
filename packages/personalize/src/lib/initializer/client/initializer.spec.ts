import * as initPersonalize from './initializer';
import * as core from '@sitecore-cloudsdk/engage-core';
import { LIBRARY_VERSION } from '../../consts';
import { CallFlowEdgeProxyClient } from '../../personalization/callflow-edge-proxy-client';
import '../../global.d.ts';

jest.mock('../../personalization/personalizer');
jest.mock('../../personalization/callflow-edge-proxy-client');

jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

const settingsParams: initPersonalize.ISettingsParamsBrowserPersonalize = {
  contextId: '123',
  cookieDomain: 'cDomain',
  enableBrowserCookie: true,
  siteId: '456',
};

describe('initializer', () => {
  const { window } = global;
  const id = 'test_id';

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  jest.spyOn(core, 'initCore');
  const getSettingsSpy = jest.spyOn(core, 'getSettings');
  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  getSettingsSpy.mockReturnValue({
    contextId: '123',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
    },
    siteId: '456',
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  beforeEach(() => {
    initPersonalize.setDependencies(null as unknown as initPersonalize.IBrowserPersonalizeSettings);
  });

  describe('getDependencies', () => {
    beforeEach(() => {
      initPersonalize.setDependencies(null as unknown as initPersonalize.IBrowserPersonalizeSettings);
    });
    it('should throw error if settings are not initialized', () => {
      expect(() => initPersonalize.getDependencies()).toThrow(
        `[IE-0008] You must first initialize the "personalize" module. Run the "init" function.`
      );
    });
    it('should throw error if settings are not initialized v2', () => {
      let settings;
      expect(() => {
        settings = initPersonalize.getDependencies();
      }).toThrowError(`[IE-0008] You must first initialize the "personalize" module. Run the "init" function.`);
      expect(settings).toBeUndefined();
    });

    it('should throw error if settings are not initialized v3', () => {
      expect(() => {
        initPersonalize.setDependencies(null);
        initPersonalize.getDependencies();
      }).toThrowError(`[IE-0008] You must first initialize the "personalize" module. Run the "init" function.`);
    });
  });
  describe('init', () => {
    it('should call all the necessary functions if all properties are set correctly', async () => {
      await initPersonalize.init(settingsParams);
      const settings = initPersonalize.getDependencies();

      expect(settings.settings.contextId).toBe('123');
      expect(settings).toBeDefined();
      expect(core.initCore).toHaveBeenCalledTimes(1);
      expect(core.getSettings).toHaveBeenCalledTimes(1);
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);

      expect(CallFlowEdgeProxyClient).toHaveBeenCalledTimes(1);
    });

    it('should call all the necessary functions if all properties are set correctly', async () => {
      await initPersonalize.init(settingsParams);
      expect(core.initCore).toHaveBeenCalledTimes(1);
      expect(core.getSettings).toHaveBeenCalledTimes(1);
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);

      expect(CallFlowEdgeProxyClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('window object', () => {
    beforeEach(() => {
      initPersonalize.setDependencies(null as unknown as initPersonalize.IBrowserPersonalizeSettings);
    });
    settingsParams.webPersonalization = undefined;
    it('should invoke get browser id method when calling the getBrowserId method', async () => {
      await initPersonalize.init(settingsParams);

      if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
      expect(core.getBrowserId).toHaveBeenCalledTimes(2);
    });
    it('adds method to get ID to window Engage property when engage is on window', async () => {
      await initPersonalize.init(settingsParams);
      expect(global.window.Engage).toBeDefined();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      global.window.Engage = { test: 'test' } as any;
      expect((global.window.Engage as any).test).toEqual('test');
      /* eslint-enable @typescript-eslint/no-explicit-any */
      expect(global.window.Engage?.getBrowserId).toBeDefined;
    });

    it('should add the library version to window.Engage object', async () => {
      global.window.Engage = undefined as any;

      expect(global.window.Engage).toBeUndefined();

      await initPersonalize.init(settingsParams);

      expect(global.window.Engage.versions).toBeDefined();
      expect(global.window.Engage.versions).toEqual({ personalize: LIBRARY_VERSION });
    });

    it('should throw error if window is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global.window;

      await expect(async () => {
        await initPersonalize.init(settingsParams);
      }).rejects.toThrowError(
        // eslint-disable-next-line max-len
        `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
      );
    });

    it('should expand the window.Engage object', async () => {
      global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
      await initPersonalize.init(settingsParams);

      expect(global.window.Engage.versions).toBeDefined();
      expect(global.window.Engage.versions).toEqual({
        personalize: LIBRARY_VERSION,
        testV: '1.0.0',
      });
    });
  });
});
