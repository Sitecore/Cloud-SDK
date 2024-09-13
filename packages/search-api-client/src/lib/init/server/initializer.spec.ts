import * as core from '@sitecore-cloudsdk/core/internal';
import { getSettings, initServer } from './initializer';
import { ErrorMessages } from '../../consts';
import type { ServerSettings } from '../../types';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('Initialization and Settings Retrieval on server search-api-client', () => {
  const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' }) });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const initCoreServerSpy = jest.spyOn(core, 'initCoreServer');

  const serverSettings: ServerSettings = {
    enableServerCookie: true,
    siteName: '123',
    sitecoreEdgeContextId: '456',
    userId: 'user123'
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

  const res = {
    cookies: {
      set() {
        return 'test';
      }
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when settings are not initialized', () => {
    expect(getSettings).toThrow(ErrorMessages.IE_0019);
  });

  it('initializes the search-api-client with provided settings', async () => {
    await initServer(req, res, serverSettings);
    expect(initCoreServerSpy).toHaveBeenCalledTimes(1);
    const retrievedSettings = getSettings();
    expect(retrievedSettings).toEqual(serverSettings);
    expect;
  });

  it('should throw error if settings have not been configured properly', async () => {
    const incompleteSettings = {
      siteName: 'TestSite',
      sitecoreEdgeContextId: 'abc123'
    };
    await expect(async () => await initServer(req, res, incompleteSettings as ServerSettings)).rejects.toThrow(
      ErrorMessages.MV_0005
    );
  });
});
