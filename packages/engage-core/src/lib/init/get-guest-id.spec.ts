/* eslint-disable max-len */
import { API_VERSION, LIBRARY_VERSION } from '../consts';
import { getGuestId, IGetGuestRefResponse, IGetGuestRefResponseError } from './get-guest-id';

describe('getGuestId', () => {
  const targetURL = 'https://test_url.com';
  const clientKey = 'client_key';

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
    const response = await getGuestId(bid, targetURL, clientKey);
    expect(response).toBe(expectedResponse);
  });

  it('should call fetch with the correct url', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ customer: { ref: 'ref' } } as IGetGuestRefResponse),
      ok: true,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);
    const bid = 'bid';

    const expectedUrl = `${targetURL}/${API_VERSION}/browser/${bid}/show.json?client_key=${clientKey}&api_token=${clientKey}`;
    await getGuestId(bid, targetURL, clientKey);

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
    expect(() => getGuestId(bid, targetURL, clientKey)).rejects.toThrowError(expectedErrorMessage);
  });
});
