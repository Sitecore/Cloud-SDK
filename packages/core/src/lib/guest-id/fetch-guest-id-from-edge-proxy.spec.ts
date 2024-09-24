/* eslint-disable max-len */
import { API_VERSION, ErrorMessages, LIBRARY_VERSION, SITECORE_EDGE_URL } from '../consts';
import type { GetGuestRefResponse, GetGuestRefResponseError } from './fetch-guest-id-from-edge-proxy';
import { fetchGuestIdFromEdgeProxy } from './fetch-guest-id-from-edge-proxy';

describe('fetchGuestIdFromEdgeProxy', () => {
  const bid = 'bid';
  const sitecoreEdgeContextId = 'contextId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the guest id', async () => {
    const expectedResponse = 'ref';
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: expectedResponse } } as GetGuestRefResponse),
      ok: true
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const response = await fetchGuestIdFromEdgeProxy(bid, sitecoreEdgeContextId, SITECORE_EDGE_URL);
    expect(response).toBe(expectedResponse);
  });

  it('should call fetch with the correct url', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: 'ref' } } as GetGuestRefResponse),
      ok: true
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const expectedUrl = `${SITECORE_EDGE_URL}/v1/events/${API_VERSION}/browser/${bid}/show.json?sitecoreContextId=${sitecoreEdgeContextId}&client_key=&api_token=`;
    await fetchGuestIdFromEdgeProxy(bid, sitecoreEdgeContextId, SITECORE_EDGE_URL);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-Library-Version': LIBRARY_VERSION
      }
    });
  });

  it('should return the error message if invalid params are passed', () => {
    const expectedMsg = 'error_message';
    const expectedMoreInfo = 'more_info';
    const mockFetch = Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      json: () => Promise.resolve({ error_msg: expectedMsg, moreInfo: expectedMoreInfo } as GetGuestRefResponseError),
      ok: false
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const expectedErrorMessage = `${expectedMsg}, for more info: ${expectedMoreInfo}`;
    expect(() => fetchGuestIdFromEdgeProxy(bid, sitecoreEdgeContextId, SITECORE_EDGE_URL)).rejects.toThrowError(
      expectedErrorMessage
    );
  });

  it('should throw IE-0011 error if no ref exists', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: {} }),
      ok: true
    });

    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    expect(async () => {
      await fetchGuestIdFromEdgeProxy(bid, sitecoreEdgeContextId, SITECORE_EDGE_URL);
    }).rejects.toThrow(ErrorMessages.IE_0011);
  });
});
