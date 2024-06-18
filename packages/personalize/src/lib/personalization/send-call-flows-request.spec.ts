import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import { LIBRARY_VERSION, PERSONALIZE_NAMESPACE } from '../consts';
import type { EPCallFlowsBody } from './send-call-flows-request';
import debug from 'debug';
import { sendCallFlowsRequest } from './send-call-flows-request';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    generateCorrelationId: () => 'b10bb699bfb3419bb63f638c62ed1aa7'
  };
});

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

describe('sendCallFlowsRequest', () => {
  let currentTime = 1609459200000; // Starting timestamp

  const settingsObj: core.Settings = {
    cookieSettings: {
      cookieDomain: 'cDomain',
      cookieExpiryDays: 730,
      cookieNames: { browserId: 'bid_name', guestId: 'gid_name' },
      cookiePath: '/'
    },
    siteName: 'site',
    sitecoreEdgeContextId: '123',
    sitecoreEdgeUrl: 'http://testurl'
  };
  const personalizeDataOriginal = {
    channel: 'WEB',
    clientKey: '',
    currencyCode: 'EUR',
    friendlyId: 'personalizeintegrationtest',
    guestRef: 'guestRef',
    language: 'EN',
    pointOfSale: ''
  };
  let personalizeData: EPCallFlowsBody = { ...personalizeDataOriginal };

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as core.EPResponse)
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    personalizeData = { ...personalizeDataOriginal };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requests', () => {
    const debugMock = debug as unknown as jest.Mock;
    personalizeData.email = 'test';
    personalizeData.identifiers = {
      id: '1',
      provider: 'email'
    };
    personalizeData.params = {
      customNumber: 123,
      customString: 'example value'
    };

    it('sends personalize with the correct values', async () => {
      jest.spyOn(core, 'processDebugResponse').mockReturnValue({
        headers: {},
        redirected: undefined,
        status: undefined,
        statusText: undefined,
        url: undefined
      });
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      personalizeData = {
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'guestRef',
        language: 'EN',
        pointOfSale: ''
      };

      const payload = await sendCallFlowsRequest(personalizeData, settingsObj);

      expect(payload).toEqual({ status: 'OK' });
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
        'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
      );

      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response in %dms : %O');
      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
      expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
        body: { status: 'OK' },
        headers: {},
        redirected: undefined,
        status: undefined,
        statusText: undefined,
        url: undefined
      });
    });

    it('sends personalize with the correct values but dont show the debug', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      personalizeData = {
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'guestRef',
        language: 'EN',
        pointOfSale: ''
      };

      const payload = await sendCallFlowsRequest(personalizeData, settingsObj);

      expect(payload).toEqual({ status: 'OK' });
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
        'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
      );
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response in %dms : %O');
      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
      expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
        body: { status: 'OK' },
        headers: {},
        redirected: undefined,
        status: undefined,
        statusText: undefined,
        url: undefined
      });
    });

    it('should return null if an error occurs and show debug', async () => {
      const mockFetch = Promise.reject('Error');
      global.fetch = jest.fn().mockImplementation(() => mockFetch);

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
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockResolvedValue(null);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);

      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
        'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
      );
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response in %dms : %O');
      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
      expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
        body: null
      });
    });

    it('should return null if resolved response does not contain .json()', async () => {
      const fetchWithTimeoutSpy = jest
        .spyOn(utils, 'fetchWithTimeout')
        .mockResolvedValue({ test: () => Promise.resolve({ status: 'OK' }) } as any);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);

      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Error personalize response: %O');
    });

    it('should return null if resolved response does not contain .json() (part 2)', async () => {
      const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockResolvedValue(false as any);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);
    });

    it('should return the resolved value and show debug', async () => {
      jest.spyOn(core, 'processDebugResponse').mockReturnValue({});
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });
      const fetchWithTimeoutSpy = jest
        .spyOn(utils, 'fetchWithTimeout')
        .mockResolvedValue({ json: () => Promise.resolve({ status: 'OK' }), status: 200 } as any);

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ status: 'OK' });
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
        'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site'
      );
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response in %dms : %O');
      expect(typeof debugMock.mock.results[1].value.mock.calls[0][1]).toBe('number');

      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
      expect(debugMock.mock.results[1].value.mock.calls[0][2]).toEqual({
        body: { status: 'OK' }
      });
    });

    it('should throw [IV-0006] when we pass negative timeout value', async () => {
      const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockImplementationOnce(() => {
        throw new Error(
          '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'
        );
      });

      await expect(async () => {
        await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: -100 });
      }).rejects.toThrow(
        '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'
      );
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw [IE-0002] when we get an AbortError', async () => {
      const fetchWithTimeoutSpy = jest.spyOn(utils, 'fetchWithTimeout').mockImplementationOnce(() => {
        throw new Error('[IE-0002] Timeout exceeded. The server did not respond within the allotted time.');
      });

      await expect(async () => {
        await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: -100 });
      }).rejects.toThrow('[IE-0002] Timeout exceeded. The server did not respond within the allotted time.');
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('should return null if generic error is thrown', async () => {
      const fetchWithTimeoutSpy = jest
        .spyOn(utils, 'fetchWithTimeout')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(null);
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Error personalize response: %O');
      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toEqual({ message: 'random error' });
    });
  });

  describe('opts object', () => {
    const personalizeData: EPCallFlowsBody = { ...personalizeDataOriginal, email: 'test' };
    const expectedUrl = 'http://testurl/v1/personalize?sitecoreContextId=123&siteId=site';
    const expectedOpts = {
      body: JSON.stringify({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        guestRef: 'guestRef',
        language: 'EN',
        pointOfSale: '',
        // eslint-disable-next-line sort-keys
        email: 'test'
      }),
      headers: {
        /* eslint-disable @typescript-eslint/naming-convention */
        'Content-Type': 'application/json',
        'X-Library-Version': LIBRARY_VERSION,
        'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7'
        /* eslint-enable @typescript-eslint/naming-convention */
      },
      method: 'POST'
    };

    it('should call fetchWithTimeout with user agent if provided', async () => {
      const fetchWithTimeoutSpy = jest
        .spyOn(utils, 'fetchWithTimeout')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100, userAgent: 'test_ua' });
      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);

      const expectedOptsWithUA = {
        ...expectedOpts,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { ...expectedOpts.headers, 'User-Agent': 'test_ua' }
      };

      expect(fetchWithTimeoutSpy).toHaveBeenLastCalledWith(expectedUrl, 100, expectedOptsWithUA);
      expect(response).toEqual(null);
    });

    it('should call fetchWithTimeout without user agent if not provided', async () => {
      const fetchWithTimeoutSpy = jest
        .spyOn(utils, 'fetchWithTimeout')
        .mockReturnValueOnce(Promise.reject({ message: 'random error' }));

      const response = await sendCallFlowsRequest(personalizeData, settingsObj, { timeout: 100 });

      expect(fetchWithTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(fetchWithTimeoutSpy).toHaveBeenLastCalledWith(expectedUrl, 100, expectedOpts);
      expect(response).toEqual(null);
    });

    it('should call fetch without user agent if not provided', async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj);

      expect(global.fetch).toHaveBeenLastCalledWith(expectedUrl, expectedOpts);
    });

    it('should call fetch with user agent if provided', async () => {
      await sendCallFlowsRequest(personalizeData, settingsObj, { userAgent: 'test_ua' });

      const expectedOptsWithUA = {
        ...expectedOpts,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { ...expectedOpts.headers, 'User-Agent': 'test_ua' }
      };

      expect(global.fetch).toHaveBeenLastCalledWith(expectedUrl, expectedOptsWithUA);
    });
  });
});
