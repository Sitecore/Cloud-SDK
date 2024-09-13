import * as core from '@sitecore-cloudsdk/core/internal';
import * as initModule from './initializer';
import { awaitInit, getSettings, init } from './initializer';
import type { BrowserSettings } from '../../types';
import { ErrorMessages } from '../../consts';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

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

describe('Browser Initialization and Settings Retrieval', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as core.EPResponse) });

  const { window } = global;

  const initCoreSpy = jest.spyOn(core, 'initCore');

  const browserSettings: BrowserSettings = {
    enableBrowserCookie: true,
    siteName: 'TestSite',
    sitecoreEdgeContextId: 'abc123',
    userId: 'user123'
  };

  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  afterEach(() => {
    jest.clearAllMocks();
    global.window ??= Object.create(window);
  });

  it('should throw an error when settings are not initialized', () => {
    expect(getSettings).toThrow(ErrorMessages.IE_0018);
  });

  it('initializes the search-api-client with provided settings and retrieves them', async () => {
    await init(browserSettings);
    expect(initCoreSpy).toHaveBeenCalledTimes(1);

    const retrievedSettings = getSettings();
    expect(retrievedSettings).toEqual(browserSettings);
  });

  it('allows re-initialization with new settings', async () => {
    const initialSettings = {
      siteName: 'InitialSite',
      sitecoreEdgeContextId: 'initialID',
      userId: 'initialUser'
    };
    const newSettings = {
      siteName: 'NewSite',
      sitecoreEdgeContextId: 'newID',
      userId: 'newUser'
    };

    await init(initialSettings);
    await init(newSettings);
    expect(initCoreSpy).toHaveBeenCalledTimes(2);

    const updatedSettings = getSettings();
    expect(updatedSettings).toEqual(newSettings);
  });

  it('should throw error if settings have not been configured properly', async () => {
    jest.spyOn(core, 'initCore').mockImplementationOnce(async () => {
      throw new Error('error');
    });

    await expect(async () => {
      await init({} as BrowserSettings);
    }).rejects.toThrow('error');
  });

  it('should throw error if window is undefined', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;

    await expect(async () => {
      await init(browserSettings);
    }).rejects.toThrow(
      // eslint-disable-next-line max-len
      `[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.`
    );
  });
});

describe('awaitInit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if both promises are null', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    initModule.initPromise = null;
    const getEnabledPackageSpy = jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(undefined);
    await expect(async () => {
      await awaitInit();
    }).rejects.toThrow(ErrorMessages.IE_0018);

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not throw if initPromise is a Promise', async () => {
    const settingsParams: core.BrowserSettings = {
      cookieDomain: 'cDomain',
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: 'https://localhost'
    };

    await init(settingsParams);
    const getEnabledPackageSpy = jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValueOnce(undefined);

    expect(async () => {
      await awaitInit();
    }).not.toThrow();

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not throw if initState is a Promise', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line import/namespace
    initModule.initPromise = null;
    const getEnabledPackageSpy = jest
      .spyOn(core, 'getEnabledPackageBrowser')
      .mockReturnValueOnce({ initState: Promise.resolve() } as any);

    await awaitInit();

    expect(getEnabledPackageSpy).toHaveBeenCalledTimes(1);
  });
});
