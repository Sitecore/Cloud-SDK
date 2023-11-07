/* eslint-disable @typescript-eslint/naming-convention */
import { LIBRARY_VERSION, SITECORE_EDGE_URL } from '../consts';
import { ICdpResponse } from '../interfaces';
import { fetchBrowserIdFromEdgeProxy } from './fetch-browser-id-from-edge-proxy';
import * as constructGetBrowserIdUrl from './construct-get-browser-id-url';
import * as utils from '@sitecore-cloudsdk/utils';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('fetchBrowserIdFromEdgeProxy', () => {
  const constructBrowserIdUrlSpy = jest.spyOn(constructGetBrowserIdUrl, 'constructGetBrowserIdUrl');
  const sitecoreEdgeContextId = '83d8199c-2837-4c29-a8ab-1bf234fea2d1';
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

    const res = await fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId, 3000);
    expect(fetchWithTimeoutSpy).toHaveBeenCalled();
    expect(fetchWithTimeoutSpy).toHaveBeenCalledWith(
      `${SITECORE_EDGE_URL}/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`,
      3000,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
        },
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      `${SITECORE_EDGE_URL}/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Library-Version': LIBRARY_VERSION,
        },
        signal: new AbortController().signal,
      }
    );
    expect(res).toMatchObject({ browserId: mockResponse.ref });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(constructBrowserIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL, sitecoreEdgeContextId);
  });

  it('should resolve with an appropriate response object', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve(mockResponse as ICdpResponse),
    });
    global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId).then((res) => {
      expect(res).toMatchObject({ browserId: mockResponse.ref });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${SITECORE_EDGE_URL}/events/v1.2/browser/create.json?sitecoreContextId=83d8199c-2837-4c29-a8ab-1bf234fea2d1&client_key=`,
        {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'X-Library-Version': LIBRARY_VERSION,
          },
        }
      );
      expect(constructBrowserIdUrlSpy).toHaveBeenCalledWith(SITECORE_EDGE_URL, sitecoreEdgeContextId);
    });
  });

  it('should resolve with empty string if fetch returns null or undefined', () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    fetchBrowserIdFromEdgeProxy(SITECORE_EDGE_URL, sitecoreEdgeContextId).then((res) => {
      expect(res).toEqual({ browserId: '' });
    });
  });
});
