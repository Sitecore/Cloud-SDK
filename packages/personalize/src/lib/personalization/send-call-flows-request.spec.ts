import { EPResponse } from '@sitecore-cloudsdk/core';
import { sendCallFlowsRequest, EPCallFlowsBody } from './send-call-flows-request';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import debug from 'debug';
import { PERSONALIZE_NAMESPACE } from '../consts';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn()),
  };
});

const settingsObj: core.Settings = {
  cookieSettings: {
    cookieDomain: 'cDomain',
    cookieExpiryDays: 730,
    cookieName: 'name',
    cookiePath: '/',
  },
  siteName: 'site',
  sitecoreEdgeContextId: '123',
  sitecoreEdgeUrl: 'http://testurl',
};

describe('CallFlow sendCallFlowsRequest', () => {
  let personalizeData: EPCallFlowsBody;
  const debugMock = debug as unknown as jest.Mock;

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    personalizeData = {
      channel: 'WEB',
      clientKey: '',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sends personalize with the correct values', async () => {
    personalizeData = {
      channel: 'WEB',
      clientKey: 'key',
      currencyCode: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: '',
    };

    const payload = await sendCallFlowsRequest(personalizeData, settingsObj);

    expect(payload).toEqual({ status: 'OK' });
  });

  it('should return null if an error occurs and show debug', async () => {
    const mockFetch = Promise.reject('Error');
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj);

    expect(response).toEqual(null);

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
    );
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Error personalize response: %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe('Error');
  });

  it('should return null if resolved response equals null and show debug', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockResolvedValue(null);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj, 100);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
    );
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response: %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBeNull();
  });

  it('should return null if resolved response does not contain .json()', async () => {
    const fetchWithTimeoutSpy = jest
      .spyOn(utils, 'fetchWithTimeout')
      .mockResolvedValue({ test: () => Promise.resolve({ status: 'OK' }) } as any);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj, 100);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);
  });

  it('should return null if resolved response does not contain .json() (part 2)', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockResolvedValue(false as any);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj, 100);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);
  });

  it('should return the resolved value and show debug', async () => {
    const fetchWithTimeoutSpy = jest
      .spyOn(utils, 'fetchWithTimeout')
      .mockResolvedValue({ json: () => Promise.resolve({ status: 'OK' }), status: 200 } as any);

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj, 100);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ status: 'OK' });

    expect(debugMock).toHaveBeenCalled();
    expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
    expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
    expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
      'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
    );
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response: %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        json: expect.any(Function),
        status: 200,
      })
    );
  });

  it('should throw [IV-0006] when we pass negative timeout value', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockImplementationOnce(() => {
      throw new Error(
        '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.'
      );
    });

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    await expect(async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj, -100);
    }).rejects.toThrow(
      '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.'
    );
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw [IE-0002] when we get an AbortError', async () => {
    const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockImplementationOnce(() => {
      throw new Error('[IE-0002] Timeout exceeded. The server did not respond within the allotted time.');
    });

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    await expect(async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj, -100);
    }).rejects.toThrow('[IE-0002] Timeout exceeded. The server did not respond within the allotted time.');
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null if generic error is thrown', async () => {
    const fetchWithTimeoutSpy = jest
      .spyOn(utils, 'fetchWithTimeout')
      .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email',
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value',
    };

    const response = await sendCallFlowsRequest(personalizeData, settingsObj, 100);
    expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(null);
    expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Error personalize response: %O');
    expect(debugMock.mock.results[1].value.mock.calls[0][1]).toEqual({ message: 'random error' });
  });
});
