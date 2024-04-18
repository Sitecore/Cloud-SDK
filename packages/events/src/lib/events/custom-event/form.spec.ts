/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/naming-convention */
import * as core from '@sitecore-cloudsdk/core';
import * as initializerModule from '../../initializer/browser/initializer';
import * as utils from '@sitecore-cloudsdk/utils';
import type { BrowserSettings, EPResponse } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import { form } from './form';
import { init } from '../../initializer/browser/initializer';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

const settingsParams: BrowserSettings = {
  sitecoreEdgeContextId: '123',
  cookieDomain: 'cDomain',
  siteName: '456',
  sitecoreEdgeUrl: core.SITECORE_EDGE_URL
};
const id = 'test_id';

describe('form function', () => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the form event without EP optional attributes', async () => {
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();

    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as EPResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    await init(settingsParams);
    await form('1234', 'SUBMITTED');

    const expectedBody = JSON.stringify({
      type: 'FORM',
      ext: { formId: '1234', interactionType: 'SUBMITTED' },
      browser_id: 'test_id',
      client_key: '',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z'
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://edge-platform.sitecorecloud.io/v1/events/v1.2/events?sitecoreContextId=123&siteId=456',
      {
        body: expectedBody,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
          'X-Library-Version': LIBRARY_VERSION
        },
        method: 'POST'
      }
    );
  });

  it('should throw error if settings have not been configured properly', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getSettingsSpy = jest.spyOn(core, 'getSettings');

    getSettingsSpy.mockImplementation(() => {
      throw new Error(`[IE-0008] You must first initialize the "core" package. Run the "init" function.`);
    });

    await expect(async () => await form('1234', 'SUBMITTED')).rejects.toThrow(
      `[IE-0004] You must first initialize the "events/browser" module. Run the "init" function.`
    );
  });
});
