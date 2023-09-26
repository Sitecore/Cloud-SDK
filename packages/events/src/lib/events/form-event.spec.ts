import { ICdpResponse, ISettingsParamsBrowser } from '@sitecore-cloudsdk/engage-core';
import * as GetBrowserId from '../../../../engage-core/src/lib/init/get-browser-id';
import * as CreateSettings from '../../../../engage-core/src/lib/settings/create-settings';
import * as CookieExists from '../../../../engage-utils/src/lib/cookies/cookie-exists';
import { init } from '../browser/initializer';
import { LIBRARY_VERSION } from '../consts';

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
    jest.spyOn(GetBrowserId, 'getBrowserId').mockReturnValue(id);
    jest.spyOn(CookieExists, 'cookieExists').mockReturnValue(true);
    jest.spyOn(CreateSettings, 'createSettings').mockReturnValue(settingsObj);
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
