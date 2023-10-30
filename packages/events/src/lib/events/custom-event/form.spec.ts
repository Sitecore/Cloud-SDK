/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/naming-convention */
import { ICdpResponse, ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';
import { LIBRARY_VERSION } from '../../consts';
import * as core from '@sitecore-cloudsdk/engage-core';
import * as utils from '@sitecore-cloudsdk/engage-utils';
import { form } from './form';
import { init } from '../../initializer/browser/initializer';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});
describe('form function', () => {
  const settingsParams: ISettingsParamsBrowser = {
    contextId: '123',
    cookieDomain: 'cDomain',
    siteId: '456',
  };
  const id = 'test_id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the form event without CDP optional attributes', async () => {
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);

    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as ICdpResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    await init(settingsParams);
    form('1234', 'SUBMITTED');

    const expectedBody = JSON.stringify({
      type: 'FORM',
      ext: { formId: '1234', interactionType: 'SUBMITTED' },
      browser_id: 'test_id',
      client_key: '',
      pos: '',
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://edge-platform.sitecorecloud.io/events/v1.2/events?sitecoreContextId=123&siteId=456',
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
