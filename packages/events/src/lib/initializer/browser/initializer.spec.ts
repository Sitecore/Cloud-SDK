import { init, awaitInit } from './initializer';
import packageJson from '../../../../package.json';
import { ErrorMessages, LIBRARY_VERSION, EVENTS_NAMESPACE } from '../../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import '../../../global.d.ts';
import debug from 'debug';

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

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn()),
  };
});

const settingsParams: core.SettingsParamsBrowser = {
  cookieDomain: 'cDomain',
  siteName: '456',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'https://localhost',
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

  jest.spyOn(core, 'createCookie').mock;
  jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
  jest.spyOn(core, 'getGuestId').mockResolvedValueOnce('test');
  jest.spyOn(core, 'initCore');

  it('should be initialized properly if all settings are configured', () => {
    expect(async () => {
      await init(settingsParams);

      expect(core.initCore).toHaveBeenCalledTimes(1);
    }).not.toThrow(`[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`);
  });

  it('should return an object with available functionality', async () => {
    await init(settingsParams);

    expect(typeof LIBRARY_VERSION).toBe('string');
    expect(LIBRARY_VERSION).toBe(packageJson.version);
    expect(LIBRARY_VERSION).toBe(packageJson.version);
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
  it('should throw error if initPromise is null', async () => {
    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0004);
  });
  it('should not throw if initPromise is a Promise', async () => {
    jest.spyOn(core, 'initCore').mockImplementationOnce(() => Promise.resolve());

    const settingsParams: core.SettingsParamsBrowser = {
      cookieDomain: 'cDomain',
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: 'https://localhost',
    };

    await init(settingsParams);

    expect(async () => {
      await awaitInit();
    }).not.toThrow();
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
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('eventsClient library initialized');
  });

  it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:events' as a namespace when error occur`, async () => {
    jest.spyOn(core, 'initCore').mockImplementationOnce(async () => {
      throw new Error('error');
    });

    try {
      await init(settingsParams);
    } catch (error) {
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(EVENTS_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe(
        `Error on initializing eventsClient library: %o`
      );
    }
  });

});
