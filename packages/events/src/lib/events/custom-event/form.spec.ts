import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import type { EPResponse } from '@sitecore-cloudsdk/core/internal';
import * as utils from '@sitecore-cloudsdk/utils';
import { ErrorMessages, PACKAGE_VERSION, X_CLIENT_SOFTWARE_ID } from '../../consts';
import * as initializerModule from '../../initializer/browser/initializer';
import { form } from './form';

jest.mock('@sitecore-cloudsdk/core/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});
jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn()
  };
});

const id = 'test_id';

describe('form event', () => {
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');

  it('should send the form event without EP optional attributes', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as EPResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getCookieValueClientSideSpy = jest.spyOn(utils, 'getCookieValueClientSide').mockReturnValueOnce(id);
    const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser').mockReturnValue({
      cookieSettings: {
        domain: 'cDomain',
        expiryDays: 730,
        name: { browserId: 'bid_name' },
        path: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io'
    });
    const expectedBody = JSON.stringify({
      /* eslint-disable sort-keys, @typescript-eslint/naming-convention */
      type: 'FORM',
      ext: { componentInstanceId: 'test', formId: '1234', interactionType: 'SUBMITTED' },
      browser_id: 'test_id',
      client_key: '',
      pos: '',
      requested_at: '2024-01-01T00:00:00.000Z'
      /* eslint-enable sort-keys, @typescript-eslint/naming-convention */
    });

    await form('1234', 'SUBMITTED', 'test');

    expect(getCookieValueClientSideSpy).toHaveBeenCalledTimes(1);
    expect(getSettingsSpy).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://edge-platform.sitecorecloud.io/v1/events/v1.2/events?sitecoreContextId=123&siteId=456',
      {
        body: expectedBody,
        headers: {
          /* eslint-disable @typescript-eslint/naming-convention */
          'Content-Type': 'application/json',
          'X-Client-Software-ID': X_CLIENT_SOFTWARE_ID,
          'X-Library-Version': PACKAGE_VERSION
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        method: 'POST'
      }
    );
  });
  it('should throw error if settings have not been configured properly', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    const getSettingsSpy = jest.spyOn(coreInternalModule, 'getCloudSDKSettingsBrowser');

    getSettingsSpy.mockImplementation(() => {
      throw new Error(ErrorMessages.IE_0014);
    });

    await expect(async () => await form('1234', 'SUBMITTED', 'test')).rejects.toThrow(ErrorMessages.IE_0014);
  });
});
