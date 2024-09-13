import * as core from '@sitecore-cloudsdk/core/internal';
import * as initModule from './initializer';
import * as utils from '@sitecore-cloudsdk/utils';
import { EVENTS_NAMESPACE, ErrorMessages, PACKAGE_VERSION } from '../../consts';
import { awaitInit, init } from './initializer';
import debug from 'debug';
import packageJson from '../../../../package.json';

jest.mock('../../eventStorage/eventStorage');
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getEnabledPackage: jest.fn()
  };
});
jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

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

const settingsParams: core.BrowserSettings = {
  cookieDomain: 'cDomain',
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'https://localhost'
};

describe('initializer', () => {
  const { window } = global;

  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });

  global.fetch = jest.fn().mockImplementation(() => mockFetch);
  jest.spyOn(core, 'getBrowserId');

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  jest.spyOn(core, 'createCookies').mock;
  jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
  jest.spyOn(core, 'getGuestId').mockResolvedValueOnce('test');
  jest.spyOn(core, 'initCore');

  it('should be initialized properly if all settings are configured', () => {
    expect(async () => {
      await init(settingsParams);
    }).not.toThrow(`[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`);

    expect(core.initCore).toHaveBeenCalledTimes(1);
  });

  it('should return an object with available functionality', async () => {
    await init(settingsParams);

    expect(typeof PACKAGE_VERSION).toBe('string');
    expect(PACKAGE_VERSION).toBe(packageJson.version);
    expect(PACKAGE_VERSION).toBe(packageJson.version);
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

  it('should return the browser id when calling the getBrowserId method from the window Engage property', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = { test: 'test' } as any;
    expect(global.window.Engage).toBeDefined();
    await init(settingsParams);
    jest.spyOn(core, 'getBrowserId').mockImplementation(() => 'test');
    if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
    expect(core.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should throw error if window is undefined', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;

    await expect(async () => {
      await init(settingsParams);
    }).rejects.toThrow(
      // eslint-disable-next-line max-len
      `[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.`
    );
  });

  it('should add the library version to window.Engage object', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = undefined as any;

    expect(global.window.Engage).toBeUndefined();
    await init(settingsParams);
    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({ events: PACKAGE_VERSION });
  });
  it('should expand the window.Engage object', async () => {
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
    await init(settingsParams);

    expect(global.window.Engage.versions).toBeDefined();
    expect(global.window.Engage.versions).toEqual({
      events: PACKAGE_VERSION,
      testV: '1.0.0'
    });
  });
  it('should reset the initPromise if initCore fails', async () => {
    jest.spyOn(core, 'initCore').mockImplementationOnce(async () => {
      throw new Error('error');
    });

    await expect(async () => {
      await init(settingsParams);
    }).rejects.toThrow('error');
  });
});

describe('awaitInit', () => {
  it('should throw error if both promises are null', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    initModule.initPromise = null;
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(undefined);
    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0014);
  });

  it('should not throw if initPromise is a Promise', async () => {
    const settingsParams: core.BrowserSettings = {
      cookieDomain: 'cDomain',
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: 'https://localhost'
    };

    await init(settingsParams);
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(undefined);

    expect(async () => {
      await awaitInit();
    }).not.toThrow();
  });

  it('should not throw if initState is a Promise', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    initModule.initPromise = null;
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce({ initState: Promise.resolve() } as any);

    expect(async () => {
      await awaitInit();
    }).resolves;
  });
});

describe('debug library in events', () => {
  const debugMock = debug as unknown as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:events' as a namespace`, async () => {
    await init(settingsParams);

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('eventsClient library initialized');
  });

  it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:events'
   as a namespace when error occur`, async () => {
    jest.spyOn(core, 'initCore').mockImplementationOnce(async () => {
      throw new Error('error');
    });

    try {
      await init(settingsParams);
    } catch (error) {
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe(`Error on initializing eventsClient library: %o`);
    }
  });
});
