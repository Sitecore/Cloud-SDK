import { IBrowserEventsSettings, init, setDependencies } from './initializer';
import packageJson from '../../../../package.json';
import { LIBRARY_VERSION } from '../../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import * as EventApiClient from '../../cdp/EventApiClient';
import { EventQueue } from '../../eventStorage/eventStorage';
import '../../../global.d.ts';

jest.mock('../../cdp/EventApiClient');
jest.mock('../../eventStorage/eventStorage');

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

const settingsParams: core.ISettingsParamsBrowser = {
  cookieDomain: 'cDomain',
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'https://localhost',
};

describe('initializer', () => {
  const { window } = global;
  const id = 'test_id';

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.ICdpResponse) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  beforeEach(() => {
    setDependencies(null as unknown as IBrowserEventsSettings);
  });
  const eventApiClientSpy = jest.spyOn(EventApiClient, 'EventApiClient');
  const getSettingsSpy = jest.spyOn(core, 'getSettings');

  jest.spyOn(core, 'createCookie').mock;
  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
  jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
  jest.spyOn(core, 'getSettings');
  jest.spyOn(core, 'getGuestId').mockResolvedValueOnce('test');
  jest.spyOn(core, 'initCore');

  it('should be initialized properly if all settings are configured', () => {
    expect(async () => {
      await init(settingsParams);

      expect(core.initCore).toHaveBeenCalledTimes(1);
      expect(getSettingsSpy).toHaveBeenCalledTimes(1);
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);
      expect(eventApiClientSpy).toHaveBeenCalledTimes(1);
      expect(eventApiClientSpy).toHaveBeenCalledWith('https://localhost', '123', '456');
      expect(eventApiClientSpy).not.toHaveBeenCalledWith('https://edge-platform.sitecorecloud.io', '123', '456');
      expect(EventQueue).toHaveBeenCalledTimes(1);
    }).not.toThrow(`[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`);
  });

  it('should return an object with available functionality', async () => {
    await init(settingsParams);

    expect(typeof LIBRARY_VERSION).toBe('string');
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
  });

  it('should return the browser id when calling the getBrowserId method from the window Engage property', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = { test: 'test' } as any;
    expect(global.window.Engage).toBeDefined();
    await init(settingsParams);
    if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
    expect(core.getBrowserId).toHaveBeenCalledTimes(2);
  });

  it('should return the browser id when calling the getBrowserId method from the window while Engage property is missing from the window', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    global.window.Engage = undefined as any;

    expect(global.window.Engage).toBeUndefined();
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

  it('should add the library version to window.Engage object', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = undefined as any;

    expect(global.window.Engage).toBeUndefined();
    await init(settingsParams);
    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({ events: LIBRARY_VERSION });
  });
  it('should expand the window.Engage object', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
    await init(settingsParams);

    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({
      events: LIBRARY_VERSION,
      testV: '1.0.0',
    });
  });
});
