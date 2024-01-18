import { PersonalizeIdentifierInput, PersonalizerInput, Personalizer } from './personalizer';
import * as CallFlowsRequest from './send-call-flows-request';
import { LIBRARY_VERSION } from '../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as flatten from '@sitecore-cloudsdk/utils';

jest.mock('@sitecore-cloudsdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('Test Personalizer Class', () => {
  const { window } = global;
  let settingsMock: core.Settings;
  let personalizeInputMock: PersonalizerInput;
  const id = 'test_id';

  jest.spyOn(core, 'getBrowserId').mockReturnValue(id);

  beforeEach(() => {
    jest.spyOn(core as any, 'language').mockImplementation(() => 'EN');
    personalizeInputMock = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
    };

    settingsMock = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
    };

    global.window ??= Object.create(window);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Personalizer validation ', () => {
    function callValidation(personalizeInputMock: PersonalizerInput, errorMessage: string) {
      const action = async () => {
        await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
      };
      expect(() => action()).rejects.toThrowError(errorMessage);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    }
    const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not throw error when friendlyId are provided', async () => {
      await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(() => validateSpy).not.toThrowError(`[MV-0004] "friendlyId" is required.`);
      expect(sanitizeInputSpy).toBeCalledTimes(1);
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
        json: () => Promise.resolve({ status: 'OK' } as unknown),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return undefined language if language methods in not on window or window.document.documentElement.lang.length is less than 2', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toBeCalledTimes(1);
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
        pointOfSale: '',
      });
    });

    it('should return infer language if infer is provided and no page is provided ', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
      expect(mapPersonalizeInputToEPDataSpy).toHaveBeenCalledTimes(1);
      expect(core.language).toBeCalledTimes(1);
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
        pointOfSale: '',
      });
    });
    it('should call all the respective functions and attributes when infer is not provided', () => {
      jest.spyOn(core as any, 'language').mockImplementation(() => undefined);

      personalizeInputMock.language = undefined;
      personalizeInputMock.email = 'test';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledTimes(1);
      expect(getInteractiveExperienceDataSpy).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'EUR',
        email: 'test',
        friendlyId: 'personalizeintegrationtest',
        identifier: {
          id: '1',
          provider: 'email',
        },
        language: undefined,
        params: {
          customNumber: 123,
          customString: 'example value',
        },
      },
      { cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: "https://edge-platform.sitecorecloud.io",
    });

      expect(core.language).toBeCalledTimes(1);
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
        pointOfSale: '',
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
            provider: 'email',
          },
          language: undefined,
          params: {
            customNumber: 123,
            customString: 'example value',
          },
          pointOfSale: '',
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/',
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
        },
        undefined
      );
    });
  });

  describe('Test sanitizeInput', () => {
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    const flattenObjectSpy = jest.spyOn(flatten as any, 'flattenObject');
    let expected: PersonalizerInput;
    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);

      expected = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
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
        language: 'EN',
      };

      settingsMock = {
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/',
        },

        siteName: '456',
        sitecoreEdgeContextId: '123',
        sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
      };

  
      new Personalizer(id).getInteractiveExperienceData(interactiveExperienceDataMock, settingsMock);

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });
    it('Test return object of the sanitizeInput method without email and identifier ', () => {
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
     });

    it('Test return object of the sanitizeInput method with empty space email ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expected.identifier = {
        id: '1',
        provider: 'email',
      };
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
    it('Test return object of the sanitizeInput method with empty space email and empty space id ', () => {
      personalizeInputMock.email = ' ';
      personalizeInputMock.identifier = {
        id: ' ',
        provider: 'email',
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method without identifier object ', () => {
      personalizeInputMock.email = 'test';
      const mockIdentifier = {} as PersonalizeIdentifierInput;
      personalizeInputMock.identifier = mockIdentifier;

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

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
        customValue: { value: 123 },
      };

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expected.params = { customNumber: 123, customString: 'example value', customValue_value: 123 };
      expect(flattenObjectSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with params object as empty object', () => {
      personalizeInputMock.params = {};

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
  });

  describe('Test mapPersonalizeInputToEpData functionality and APICall', () => {
    const mapPersonalizeInputToEPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToEPData');
    const sendCallFlowsRequestSpy = jest.spyOn(CallFlowsRequest, 'sendCallFlowsRequest');

    // map
    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Test return object of the map method without email and identifier ', () => {
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
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
        pointOfSale: '',
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
          pointOfSale: '',
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/',
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
        },
        undefined
      );
    });

    it('Test return object of the map method without email and identifier but with params ', () => {
      personalizeInputMock.params = {
        customNumber: 123,
        customString: 'example value',
        customValue: { value: 123 },
      };
      personalizeInputMock.email = undefined;
      personalizeInputMock.identifier = undefined;
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);
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
          // eslint-disable-next-line @typescript-eslint/naming-convention
          customValue_value: 123,
        },
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params: { customNumber: 123, customString: 'example value', customValue_value: 123 },
        pointOfSale: '',
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
            customValue_value: 123,
          },
          pointOfSale: '',
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/',
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
        },
        undefined
      );
    });

    it('Test return object of the map method without email ', () => {
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };
      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock);

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
        pointOfSale: '',
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
            provider: 'email',
          },
          language: 'EN',

          params: undefined,
          pointOfSale: '',
        },
        {
          cookieSettings: {
            cookieDomain: 'cDomain',
            cookieExpiryDays: 730,
            cookieName: 'bid_name',
            cookiePath: '/',
          },

          siteName: '456',
          sitecoreEdgeContextId: '123',
          sitecoreEdgeUrl: core.SITECORE_EDGE_URL,
        },
        undefined
      );
    });
  });

  describe('timeout', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the response', async () => {
      const expectedResponse = { test: '420' };
     
      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(expectedResponse) }));

      const response = await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100);

      expect(fetch).toHaveBeenCalledWith(
        `${core.SITECORE_EDGE_URL}/personalize/v2/callFlows?sitecoreContextId=${settingsMock.sitecoreEdgeContextId}&siteId=${settingsMock.siteName}`,
        {
          body: '{"channel":"WEB","clientKey":"","currencyCode":"EUR","friendlyId":"personalizeintegrationtest","language":"EN","pointOfSale":"","browserId":"test_id"}',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { 'Content-Type': 'application/json', 'X-Library-Version': LIBRARY_VERSION },
          method: 'POST',
          signal: new AbortController().signal,
        }
      );

      expect(response).toBe(expectedResponse);
    });

    it('should throw error if a negative number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.';

  
      expect(async () => {
        await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, -10);
      }).rejects.toThrowError(expectedErrorMessage);
    });

    it('should throw error if a float number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.';
  
      expect(async () => {
        await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 420.69);
      }).rejects.toThrowError(expectedErrorMessage);
    });

    it("should call abort method of AbortController if didn't get a response in time", async () => {
      jest.useFakeTimers();
  
      global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => Promise.resolve('anything') }));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100);
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
        await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 0);
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

      new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100).catch((err) => {
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

      const response = await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100);

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

      const response = await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100);

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs', async () => {
   
      global.fetch = jest.fn().mockImplementation(() => Promise.resolve('bad object'));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      const response = await new Personalizer(id).getInteractiveExperienceData(personalizeInputMock, settingsMock, 100);

      expect(response).toBeNull();

      expect(abortSpy).toHaveBeenCalledTimes(0);
    });
  });
});
