import * as core from '@sitecore-cloudsdk/core';
import { getSettings, init } from './initializer';
import type { BrowserSettings } from '../../types';
import { ErrorMessages } from '../../const';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

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
    expect(getSettings).toThrow(ErrorMessages.IE_0009);
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
    }).rejects.toThrow(ErrorMessages.IE_0001);
  });
});
