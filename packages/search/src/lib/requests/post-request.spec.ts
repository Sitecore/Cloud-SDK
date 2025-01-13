import { sendPostRequest } from './post-request';

describe('sendPostRequest', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Sends event with the correct values to Sitecore Cloud ', async () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' })
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const expectedUrl = 'http://testurl.com/v1/search?sitecoreContextId=test';
    const expectedBody = 'test_body';
    const settings = {
      siteName: 'test',
      sitecoreEdgeContextId: 'test',
      sitecoreEdgeUrl: 'http://testurl.com'
    };

    const result = await sendPostRequest(expectedBody, settings);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      body: expectedBody,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    expect(result).toEqual({ status: 'OK' });
  });

  it('should return null if an error occurs', async () => {
    const mockFetch = Promise.reject('Error');

    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const expectedBody = 'test_body';
    const settings = {
      siteName: 'test',
      sitecoreEdgeContextId: 'test',
      sitecoreEdgeUrl: 'test'
    };

    const result = await sendPostRequest(expectedBody, settings);

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(result).toEqual(null);
  });
});
