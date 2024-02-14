/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/naming-convention */
import { EPResponse, SettingsParamsBrowser } from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION } from '../../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import { form } from './form';
import { init } from '../../initializer/browser/initializer';
import * as initializerModule from '../../initializer/browser/initializer';

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
describe('form function', () => {
  const settingsParams: SettingsParamsBrowser = {
    sitecoreEdgeContextId: '123',
    cookieDomain: 'cDomain',
    siteName: '456',
    sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
  };
  const id = 'test_id';

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
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://edge-platform.sitecorecloud.io/v1/events/v1.2/events?sitecoreContextId=123&siteId=456',
      {
        body: expectedBody,
        headers: {
          'Content-Type': 'application/json',

          'X-Library-Version': LIBRARY_VERSION,
        },
        method: 'POST',
      }
    );
  });
});
