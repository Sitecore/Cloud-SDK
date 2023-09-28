import { ICdpResponse, ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';
import { init } from '../browser/initializer';
import { LIBRARY_VERSION } from '../consts';
import * as core from '@sitecore-cloudsdk/engage-core';
import * as utils from '@sitecore-cloudsdk/engage-utils';

jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('form function', () => {
  const settingsParams: ISettingsParamsBrowser = {
    clientKey: 'key',
    cookieDomain: 'cDomain',
    targetURL: 'https://domain',
  };
  const id = 'test_id';
  const settingsObj = {
    clientKey: 'key',
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieName: 'name',
      cookiePath: '/',
      forceServerCookieMode: false,
    },
    includeUTMParameters: true,
    targetURL: 'https://domain',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the form event without CDP optional attributes', async () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    jest.spyOn(core, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(utils, 'cookieExists').mockReturnValue(true);
    jest.spyOn(core, 'createSettings').mockReturnValue(settingsObj);
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ ref: 'ref' } as ICdpResponse) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const engage = await init(settingsParams);
    engage.form('1234', 'SUBMITTED', 'spinair.com');

    const expectedBody = JSON.stringify({
      type: 'FORM',
      // eslint-disable-next-line sort-keys
      ext: {
        formId: '1234',
        interactionType: 'SUBMITTED',
      },
      // eslint-disable-next-line sort-keys
      browser_id: 'test_id',
      client_key: 'key',
      pos: 'spinair.com',
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://domain/v1.2/events', {
      body: expectedBody,
      headers: {
        'Content-Type': 'application/json',

        'X-Library-Version': LIBRARY_VERSION,
      },
      method: 'POST',
    });
    /* eslint-enable @typescript-eslint/naming-convention */
  });
});
