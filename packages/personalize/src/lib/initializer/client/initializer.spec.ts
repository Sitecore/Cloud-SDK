import * as core from '@sitecore-cloudsdk/core';
import { ErrorMessages, LIBRARY_VERSION, PERSONALIZE_NAMESPACE } from '../../consts';
import '../../global.d.ts';
import { init, awaitInit } from './initializer';
import debug from 'debug';

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

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn()),
  };
});

const settingsParams: core.SettingsParamsBrowser = {
  cookieDomain: 'cDomain',
  enableBrowserCookie: true,
  siteName: '456',
  sitecoreEdgeContextId: '123',
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
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
    },
    siteName: '456',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: '',
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  describe('init', () => {
    it('should call all the necessary functions if all properties are set correctly', async () => {
      await init(settingsParams);

      expect(settingsParams.sitecoreEdgeContextId).toBe('123');
      expect(settingsParams).toBeDefined();
      expect(core.initCore).toHaveBeenCalledTimes(1);
    });

    it('should call all the necessary functions if all properties are set correctly', async () => {
      await init(settingsParams);
      expect(core.initCore).toHaveBeenCalledTimes(1);
    });
  });

  describe('window object', () => {
    it('should invoke get browser id method when calling the getBrowserId method', async () => {
      await init(settingsParams);

      if (global.window.Engage?.getBrowserId) global.window.Engage.getBrowserId();
      expect(core.getBrowserId).toHaveBeenCalledTimes(1);
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
      }).rejects.toThrow(
        // eslint-disable-next-line max-len
        `[IE-0001] The "window" object is not available on the server side. Use the "window" object only on the client side, and in the correct execution context.`
      );
    });

    it('should expand the window.Engage object', async () => {
      global.window.Engage = { test: 'test', versions: { testV: '1.0.0' } } as any;
      await init(settingsParams);

      expect(global.window.Engage.versions).toBeDefined();
      expect(global.window.Engage.versions).toEqual({
        personalize: LIBRARY_VERSION,
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

  describe('debug library in personalize', () => {
    const debugMock = debug as unknown as jest.Mock;

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:personalize' as a namespace`, async () => {
      await init(settingsParams);

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('personalizeClient library initialized');
    });

    it(`should call 'debug' third-party lib with 'sitecore-cloudsdk:personalize' as a namespace when error occur`, async () => {
      jest.spyOn(core, 'initCore').mockImplementationOnce(async () => {
        throw new Error('error');
      });

      await expect(async () => {
        await init(settingsParams);
      }).rejects.toThrow(`Error`);

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe(
        `Error on initializing personalizeClient library with error: %o`
      );
    });
  });
});

describe('awaitInit', () => {
  it('should throw error if initPromise is null', async () => {
    await expect(async () => {
      await awaitInit();
    }).rejects.toThrowError(ErrorMessages.IE_0006);
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
