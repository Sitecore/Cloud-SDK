import * as CallFlowsRequest from './send-call-flows-request';
import * as core from '@sitecore-cloudsdk/core';
import { LIBRARY_VERSION, PERSONALIZE_NAMESPACE } from '../consts';
import type { PersonalizeData, PersonalizeIdentifierInput } from './personalizer';
import { Personalizer } from './personalizer';
import debug from 'debug';

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    generateCorrelationId: () => 'b10bb699bfb3419bb63f638c62ed1aa7'
  };
});

jest.mock('debug', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: jest.fn(() => jest.fn())
  };
});

describe('Test Personalizer Class', () => {
  const { window } = global;
  let settingsMock: core.Settings;
  let personalizeInputMock: PersonalizeData;
  const id = 'test_id';

  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  beforeEach(() => {
    jest.spyOn(core as any, 'language').mockImplementation(() => 'EN');
    personalizeInputMock = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN'
    };

    settingsMock = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/'
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: core.SITECORE_EDGE_URL
    };

    global.window ??= Object.create(window);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Personalizer validation ', () => {
    function callValidation(personalizeInputMock: PersonalizeData, errorMessage: string) {
      const action = async () => {
        await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      };
      expect(() => action()).rejects.toThrow(errorMessage);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    }
    const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown)
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not throw error when friendlyId are provided', async () => {
      await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(() => validateSpy).not.toThrow(`[MV-0004] "friendlyId" is required.`);
      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error when friendlyId is undefined ', async () => {
      const mockData = undefined;
      personalizeInputMock.friendlyId = mockData as unknown as string;
      callValidation(personalizeInputMock, `[MV-0004] "friendlyId" is required.`);
    });

    it('should throw error when friendlyId is empty space string', async () => {
      personalizeInputMock.friendlyId = ' ';
      callValidation(personalizeInputMock, `[MV-0004] "friendlyId" is required.`);
    });

    it('should throw error when friendlyId is empty string', async () => {
      personalizeInputMock.friendlyId = '';
      callValidation(personalizeInputMock, `[MV-0004] "friendlyId" is required.`);
    });
  });

  describe('Test Personalizer getInteractiveExperienceData method and private calls', () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    const mapPersonalizeInputToEPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToEPData');
    const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown)
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return undefined language if language methods in not on window or window.document.documentElement.lang.length is less than 2', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'test_id',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: ''
      });
    });

    it('should return infer language if infer is provided and no page is provided ', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'test_id',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: ''
      });
    });
    it('should call all the respective functions and attributes when infer is not provided', () => {
      jest.spyOn(core as any, 'language').mockImplementation(() => undefined);

      personalizeInputMock.language = undefined;
      personalizeInputMock.email = 'test';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email'
      };
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value'
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          currency: 'EUR',
          email: 'test',
          friendlyId: 'personalizeintegrationtest',
          identifier: {
            id: '1',
            provider: 'email'
          },
          language: undefined,
          params: {
            customNumber: 123,
            customString: 'example value'
          }
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/'
          },
          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: 'https://edge-platform.sitecorecloud.io'
        },
        ''
      );

      expect(core.language).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        identifiers: { id: '1', provider: 'email' },
        language: undefined,
        params: { customNumber: 123, customString: 'example value' },
        pointOfSale: ''
      });

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: 'test',
          friendlyId: 'personalizeintegrationtest',
          identifiers: {
            id: '1',
            provider: 'email'
          },
          language: undefined,
          params: {
            customNumber: 123,
            customString: 'example value'
          },
          pointOfSale: ''
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/'
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL
        },
        undefined
      );
    });
  });

  describe('Test sanitizeInput', () => {
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    let expected: PersonalizeData;
    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown)
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);

      expected = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an object from the sanitizeInput method that uses the pointOfSale from the settings', () => {
      const interactiveExperienceDataMock = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      };

      settingsMock = {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/'
        },

        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: core.SITECORE_EDGE_URL
      };

      new Personalizer(id).getInteractiveExperienceData(interactiveExperienceDataMock, settingsMock, '');

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN'
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });
    it('Test return object of the sanitizeInput method without email and identifier ', () => {
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with empty space email ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email'
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.identifier = {
        id: '1',
        provider: 'email'
      };
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
    it('Test return object of the sanitizeInput method with empty space email and empty space id ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: ' ',
        provider: 'email'
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method without identifier object ', () => {
      personalizeInputMock.email = 'test';
      const mockIdentifier = {} as PersonalizeIdentifierInput;
      personalizeInputMock.identifier = mockIdentifier;

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.email = 'test';
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    // Test params
    it('Test return object of the sanitizeInput method with params object and flatten method ', () => {
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 }
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.params = { customNumber: 123, customString: 'example value', customValue: { value: 123 } };
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with params object as empty object', () => {
      personalizeInputMock.params = {};

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('should return an object with geo in params if provided', () => {
      personalizeInputMock.geo = {
        city: 'T1',
        country: 'T2',
        region: 'T3'
      };
      const expectedSanitized = {
        ...expected,
        params: {
          geo: {
            city: 'T1',
            country: 'T2',
            region: 'T3'
          }
        }
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedSanitized);
    });

    it('should return an object with partial geo in params if provided', () => {
      personalizeInputMock.geo = {
        city: 'T1'
      };
      const expectedSanitized = {
        ...expected,
        params: {
          geo: {
            city: 'T1'
          }
        }
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedSanitized);
    });

    it('should return an object without params if empty geo is provided', () => {
      personalizeInputMock.geo = {};

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
  });

  describe('Test mapPersonalizeInputToEpData functionality and APICall', () => {
    const mapPersonalizeInputToEPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToEPData');
    const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');

    // map
    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown)
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Test return object of the map method without email and identifier ', () => {
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'test_id',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: undefined,
        language: 'EN',
        params: undefined,
        pointOfSale: ''
      });
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'test_id',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          identifiers: undefined,
          language: 'EN',
          params: undefined,
          pointOfSale: ''
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/'
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL
        },
        undefined
      );
    });

    it('Test return object of the map method without email and identifier but with params ', () => {
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 }
      };
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        params: {
          customNumber: 123,
          customString: 'example value',
          customValue: { value: 123 }
        }
      });

      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        browserId: 'test_id',
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: undefined,
        language: 'EN',
        params: { customNumber: 123, customString: 'example value', customValue: { value: 123 } },
        pointOfSale: ''
      });
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'test_id',
          channel: 'WEB',

          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          identifiers: undefined,
          language: 'EN',
          params: {
            customNumber: 123,
            customString: 'example value',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            customValue: { value: 123 }
          },
          pointOfSale: ''
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/'
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL
        },
        undefined
      );
    });

    it('Test return object of the map method without email ', () => {
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email'
      };
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, '');

      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: '',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: { id: '1', provider: 'email' },
        language: 'EN',
        params: undefined,
        pointOfSale: ''
      });

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',

          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          identifiers: {
            id: '1',
            provider: 'email'
          },
          language: 'EN',

          params: undefined,
          pointOfSale: ''
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/'
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL
        },
        undefined
      );
    });
  });

  describe('timeout', () => {
    const debugMock = debug as unknown as jest.Mock;
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the response', async () => {
      jest.spyOn(core, 'processDebugResponse').mockReturnValue({});
      let currentTime = 1609459200000;
      jest.spyOn(Date, 'now').mockImplementation(() => {
        const returnTime = currentTime;
        currentTime += 1000;
        return returnTime;
      });

      const expectedResponse = { test: '420' };

      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(expectedResponse) }));

      const response = await new Personalizer(id).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100
        }
      );

      expect(fetch).toHaveBeenCalledWith(
        `${core.SITECORE_EDGE_URL}/v1/personalize?sitecoreContextId=${settingsMock.sitecoreEdgeContextId}&siteId=${settingsMock.siteName}`,
        {
          body: '{"channel":"WEB","clientKey":"","currencyCode":"EUR","friendlyId":"personalizeintegrationtest","language":"EN","pointOfSale":"","browserId":"test_id"}',
          /* eslint-disable @typescript-eslint/naming-convention */
          headers: {
            'Content-Type': 'application/json',
            'X-Library-Version': LIBRARY_VERSION,
            'x-sc-correlation-id': 'b10bb699bfb3419bb63f638c62ed1aa7'
          },
          /* eslint-enable @typescript-eslint/naming-convention */
          method: 'POST',
          signal: new AbortController().signal
        }
      );
      expect(debugMock).toHaveBeenCalled();
      expect(debugMock).toHaveBeenLastCalledWith(PERSONALIZE_NAMESPACE);
      expect(debugMock.mock.results[0].value.mock.calls[0][0]).toBe('Personalize request: %s with options: %O');
      expect(debugMock.mock.results[0].value.mock.calls[0][1]).toBe(
        'https://edge-platform.sitecorecloud.io/v1/personalize?sitecoreContextId=123&siteId=456'
      );
      expect(debugMock.mock.results[1].value.mock.calls[0][0]).toBe('Personalize response in %dms : %O');

      expect(debugMock.mock.results[1].value.mock.calls[0][1]).toBe(1000);
      expect(debugMock.mock.results[1].value.mock.calls[0][2]).toStrictEqual({
        body: expectedResponse
      });

      expect(response).toBe(expectedResponse);
    });

    it('should throw error if a negative number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.';

      expect(async () => {
        await new Personalizer(id).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          {
            timeout: -10
          }
        );
      }).rejects.toThrow(expectedErrorMessage);
    });

    it('should throw error if a float number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.';

      expect(async () => {
        await new Personalizer(id).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          {
            timeout: 420.69
          }
        );
      }).rejects.toThrow(expectedErrorMessage);
    });

    it("should call abort method of AbortController if didn't get a response in time", async () => {
      jest.useFakeTimers();

      global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => Promise.resolve('anything') }));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, window.location.search, {
        timeout: 100
      });
      jest.advanceTimersByTime(1000);

      expect(abortSpy).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('should throw immediately a predifined error if timeout is 0', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'AbortError';
        }
      }
      const expectedError = '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.';

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      try {
        await new Personalizer(id).getInteractiveExperienceData(
          personalizeInputMock,
          settingsMock,
          window.location.search,
          { timeout: 0 }
        );
      } catch (error) {
        expect((error as FetchError).message).toBe(expectedError);
      }
    });

    it('should throw a predifined error if the request was aborted', async () => {
      expect.assertions(1);
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'AbortError';
        }
      }
      const expectedError = '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.';

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      new Personalizer(id)
        .getInteractiveExperienceData(personalizeInputMock, settingsMock, window.location.search, { timeout: 100 })
        .catch((err) => {
          expect(err.message).toEqual(expectedError);
        });
    });

    it('should return null if an unhandled error occurs with RandomError name', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'RandomError';
        }
      }

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      const response = await new Personalizer(id).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100
        }
      );

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs with empty name', async () => {
      class FetchError extends Error {
        constructor(message: string) {
          super(message);
          this.name = '';
        }
      }

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      const response = await new Personalizer(id).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100
        }
      );

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs', async () => {
      global.fetch = jest.fn().mockImplementation(() => Promise.resolve('bad object'));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      const response = await new Personalizer(id).getInteractiveExperienceData(
        personalizeInputMock,
        settingsMock,
        window.location.search,
        {
          timeout: 100
        }
      );

      expect(response).toBeNull();

      expect(abortSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Opts object', () => {
    it('should call sendCallFlowsRequest with the opts from the params', () => {
      const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
      const mapPersonalizeInputToEPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToEPData');
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const id = 'test_id';
      const settings = {} as core.Settings;
      const data = {} as PersonalizeData;
      const opts = { timeout: 100, userAgent: 'test_ua' };
      const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
      validateSpy.mockImplementationOnce(() => {
        return;
      });

      sanitizeInputSpy.mockReturnValueOnce({});
      mapPersonalizeInputToEPDataSpy.mockReturnValueOnce({});

      new Personalizer(id).getInteractiveExperienceData(data, settings, window.location.search, opts);

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith({ browserId: 'test_id' }, settings, opts);
    });
  });

  describe('check extractUrlParamsWithPrefix method and UTM params object sent to callflows requests', () => {
    it('should call extractUrlParamsWithPrefix and return a specific object', () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(Personalizer.prototype as any, 'extractUrlParamsWithPrefix');
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, urlParams, opts);

      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(1);
      expect(extractUrlParamsWithPrefixSpy).toHaveReturnedWith({
        campaign: 'campaign',
        medium: 'email'
      });
    });

    it(`should call extractUrlParamsWithPrefix when at least one url param contains the 'utm_' prefix`, () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(Personalizer.prototype as any, 'extractUrlParamsWithPrefix');
      const urlParams = '?utm56_campaign=campaign&utm7_medium=email&utm_campaign=campaign';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, urlParams, opts);
      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(1);
      expect(extractUrlParamsWithPrefixSpy).toHaveReturnedWith({
        campaign: 'campaign'
      });
    });

    it(`should not call extractUrlParamsWithPrefix when url params does not contain the 'utm_' prefix`, () => {
      const extractUrlParamsWithPrefixSpy = jest.spyOn(Personalizer.prototype as any, 'extractUrlParamsWithPrefix');
      const urlParams = '?utm56_campaign=campaign&utm7_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, urlParams, opts);
      expect(extractUrlParamsWithPrefixSpy).toHaveBeenCalledTimes(0);
    });

    it('should call sendCallFlowsRequest with UTM params extracted from the url', () => {
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, urlParams, opts);

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'test_id',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          identifiers: undefined,
          language: 'EN',
          params: {
            utm: {
              campaign: 'campaign',
              medium: 'email'
            }
          },
          pointOfSale: ''
        },
        settingsMock,
        opts
      );
    });

    it('should call sendCallFlowsRequest with UTM params passed manually (UTM params exists both in url and data sent manually by the developer)', () => {
      const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');
      const urlParams = '?utm_campaign=campaign&utm_medium=email';
      const opts = { timeout: 100, userAgent: 'test_ua' };
      const inputMockWithUTMParams = {
        ...personalizeInputMock,
        ...{
          params: {
            utm: {
              content: 'content',
              source: 'source'
            }
          }
        }
      };

      new Personalizer(id).getInteractiveExperienceData(inputMockWithUTMParams, settingsMock, urlParams, opts);

      expect(sendCallFlowsRequestSpy).toHaveBeenCalledWith(
        {
          browserId: 'test_id',
          channel: 'WEB',
          clientKey: '',
          currencyCode: 'EUR',
          email: undefined,
          friendlyId: 'personalizeintegrationtest',
          identifiers: undefined,
          language: 'EN',
          params: {
            utm: {
              content: 'content',
              source: 'source'
            }
          },
          pointOfSale: ''
        },
        settingsMock,
        opts
      );
    });
  });
});
