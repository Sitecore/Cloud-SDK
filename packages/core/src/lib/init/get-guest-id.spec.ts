/* eslint-disable max-len */
import { API_VERSION, LIBRARY_VERSION, TARGET_URL } from '../consts';
import { getGuestId, IGetGuestRefResponse, IGetGuestRefResponseError } from './get-guest-id';

describe('getGuestId', () => {
  const sitecoreEdgeContextId = 'contextId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the guest id', async () => {
    const expectedResponse = 'ref';
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: expectedResponse } } as IGetGuestRefResponse),
      ok: true,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const bid = 'bid';
    const response = await getGuestId(bid, sitecoreEdgeContextId);
    expect(response).toBe(expectedResponse);
  });

  it('should call fetch with the correct url', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: 'ref' } } as IGetGuestRefResponse),
      ok: true,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const bid = 'bid';

    const expectedUrl = `${TARGET_URL}/events/${API_VERSION}/browser/${bid}/show.json?sitecoreContextId=${sitecoreEdgeContextId}&client_key=&api_token=`;
    await getGuestId(bid, sitecoreEdgeContextId);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-Library-Version': LIBRARY_VERSION,
      },
    });
  });

  it('should return the error message if invalid params are passed', () => {
    const expectedMsg = 'error_message';
    const expectedMoreInfo = 'more_info';
    const mockFetch = Promise.resolve({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      json: () => Promise.resolve({ error_msg: expectedMsg, moreInfo: expectedMoreInfo } as IGetGuestRefResponseError),
      ok: false,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const bid = 'bid';

    const expectedErrorMessage = `${expectedMsg}, for more info: ${expectedMoreInfo}`;
    expect(() => getGuestId(bid, sitecoreEdgeContextId)).rejects.toThrowError(expectedErrorMessage);
  });
});
