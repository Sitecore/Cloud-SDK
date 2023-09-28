import { LIBRARY_VERSION } from '../consts';
import { ICdpResponse } from '../interfaces';
import { getBrowserIdFromCdp } from './get-browser-id-from-cdp';
import * as generateBrowserIdUrl from './generate-browser-id-url';
import * as utils from '@sitecore-cloudsdk/engage-utils';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('getBrowserIdFromCdp', () => {
  const generateCreateBrowserIdUrlSpy = jest.spyOn(generateBrowserIdUrl, 'generateCreateBrowserIdUrl');
  const clientKey = 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ';
  const target = 'api-engage-eu.sitecorecloud.io';
  const spyParams = {
    api: target,
    clientKey: clientKey,
  };
  const mockResponse = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_key: 'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ',
    ref: 'dac13bc5-cdae-4e65-8868-13443409d05e',
    status: 'OK',
    version: '1.2',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with an appropriate response object when calling fetch with timeout', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout');

    const res = await getBrowserIdFromCdp(clientKey, target, 3000);
    expect(fetchWithTimeoutSpy).toHaveBeenCalled();
    expect(fetchWithTimeoutSpy).toHaveBeenCalledWith(
      'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ/v1.2/browser/create.json?client_key=api-engage-eu.sitecorecloud.io&message={}',
      3000,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
        },
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ/v1.2/browser/create.json?client_key=api-engage-eu.sitecorecloud.io&message={}',
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
        },
        signal: new AbortController().signal,
      }
    );
    expect(res).toEqual(mockResponse.ref);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(generateCreateBrowserIdUrlSpy).toHaveBeenCalledWith(spyParams.clientKey, spyParams.api);
  });

  it('should resolve with an appropriate response object', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    getBrowserIdFromCdp(clientKey, target).then((ref) => {
      expect(ref).toEqual(mockResponse.ref);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'pqsDATA3lw12v5a9rrHPW1c4hET73GxQ/v1.2/browser/create.json?client_key=api-engage-eu.sitecorecloud.io&message={}',
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'X-Library-Version': LIBRARY_VERSION,
          },
        }
      );
      expect(generateCreateBrowserIdUrlSpy).toHaveBeenCalledWith(spyParams.clientKey, spyParams.api);
    });
  });

  it('should resolve with empty string if fetch returns null or undefined', () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    getBrowserIdFromCdp(clientKey, target).then((ref) => {
      expect(ref).toEqual('');
    });
  });
});
