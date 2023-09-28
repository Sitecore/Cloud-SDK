import { IPersonalizeIdentifierInput, IPersonalizerInput, Personalizer } from './personalizer';
import { IPersonalizeClient, CallFlowCDPClient } from './callflow-cdp-client';
// import { LIBRARY_VERSION } from '../consts';
import { ISettings, Infer } from '@sitecore-cloudsdk/engage-core';
import * as flatten from '@sitecore-cloudsdk/engage-utils';

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('Test Personalizer Class', () => {
  let personalizeHelper: IPersonalizeClient;
  let settingsMock: ISettings;
  let personalizeInputMock: IPersonalizerInput;
  const id = 'test_id';
  const infer = new Infer();
  beforeEach(() => {
    infer.language = jest.fn().mockImplementation(() => 'EN');
    personalizeInputMock = {
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: 'personalizeintegrationtest',
      language: 'EN',
      pointOfSale: 'spinair.com',
    };

    settingsMock = {
      clientKey: 'key',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        forceServerCookieMode: false,
      },
      includeUTMParameters: true,
      targetURL: 'https://domain',
    };

    personalizeHelper = new CallFlowCDPClient(settingsMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Personalizer validation ', () => {
    function callValidation(personalizeInputMock: IPersonalizerInput, errorMessage: string) {
      const action = async () => {
        await new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);
      };
      expect(() => action()).rejects.toThrowError(errorMessage);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validateSpy = jest.spyOn(Personalizer.prototype as any, 'validate');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    it('should not throw error when pointOfSale and friendlyId are provided', async () => {
      await new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);
      expect(validateSpy).toHaveBeenCalledTimes(1);
      expect(() => validateSpy).not.toThrowError(`[MV-0008] "friendlyId" is required.`);
      expect(() => validateSpy).not.toThrowError(`[MV-0003] "pointOfSale" is required.`);
      expect(sanitizeInputSpy).toBeCalledTimes(1);
    });

    it('should throw error when friendlyId is undefined ', async () => {
      const mockData = undefined;
      personalizeInputMock.friendlyId = mockData as unknown as string;
      callValidation(personalizeInputMock, `[MV-0008] "friendlyId" is required.`);
    });

    it('should throw error when friendlyId is empty space string', async () => {
      personalizeInputMock.friendlyId = ' ';
      callValidation(personalizeInputMock, `[MV-0008] "friendlyId" is required.`);
    });

    it('should throw error when friendlyId is empty string', async () => {
      personalizeInputMock.friendlyId = '';
      callValidation(personalizeInputMock, `[MV-0008] "friendlyId" is required.`);
    });
  });

  describe('Test Personalizer getInteractiveExperienceData method and private calls', () => {
    const getInteractiveExperienceDataSpy = jest.spyOn(Personalizer.prototype, 'getInteractiveExperienceData');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapPersonalizeInputToCDPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToCDPData');
    const sendCallFlowSpy = jest.spyOn(CallFlowCDPClient.prototype, 'sendCallFlowsRequest');

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as unknown),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return undefined language if infer and language is not provided', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(personalizeHelper, id).getInteractiveExperienceData(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(infer.language).toBeCalledTimes(0);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        browserId: id,
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: undefined,
        pointOfSale: 'spinair.com',
      });
    });

    it('should return infer language if infer is provided and no page is provided ', () => {
      personalizeInputMock.language = undefined;
      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(infer.language).toBeCalledTimes(1);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        browserId: id,
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pointOfSale: 'spinair.com',
      });
    });
    it('should call all the respective functions and attributes when infer is not provided', () => {
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

      new Personalizer(personalizeHelper, id).getInteractiveExperienceData(personalizeInputMock);

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
        pointOfSale: 'spinair.com',
      });

      expect(infer.language).toBeCalledTimes(0);
      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);

      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: 'key',
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
        pointOfSale: 'spinair.com',
      });

      expect(sendCallFlowSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          clientKey: 'key',
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
          pointOfSale: 'spinair.com',
        },
        undefined
      );
    });
  });

  describe('Test sanitizeInput', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizeInputSpy = jest.spyOn(Personalizer.prototype as any, 'sanitizeInput');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flattenObjectSpy = jest.spyOn(flatten as any, 'flattenObject');
    let expected: IPersonalizerInput;
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
        pointOfSale: 'spinair.com',
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
        clientKey: 'key',
        cookieSettings: {
          cookieDomain: 'cDomain',
          cookieExpiryDays: 730,
          cookieName: 'bid_name',
          cookiePath: '/',
          forceServerCookieMode: false,
        },
        includeUTMParameters: true,
        pointOfSale: 'test.com',
        targetURL: 'https://domain',
      };

      const callFlowCDPClient = new CallFlowCDPClient(settingsMock);

      personalizeInputMock.pointOfSale = undefined;
      new Personalizer(callFlowCDPClient, id, infer).getInteractiveExperienceData(interactiveExperienceDataMock);

      const expectedResult = {
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pointOfSale: 'test.com',
      };

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expectedResult);
    });
    it('Test return object of the sanitizeInput method without email and identifier ', () => {
      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

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

      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

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

      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method without identifier object ', () => {
      personalizeInputMock.email = 'test';
      const mockIdentifier = {} as IPersonalizeIdentifierInput;
      personalizeInputMock.identifier = mockIdentifier;

      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

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

      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expected.params = { customNumber: 123, customString: 'example value', customValue_value: 123 };
      expect(flattenObjectSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });

    it('Test return object of the sanitizeInput method with params object as empty object', () => {
      personalizeInputMock.params = {};

      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

      expect(sanitizeInputSpy).toHaveBeenCalledTimes(1);
      expect(sanitizeInputSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
      expect(sanitizeInputSpy).toHaveReturnedWith(expected);
    });
  });

  describe('Test mapPersonalizeInputToCDPData functionality and APICall', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapPersonalizeInputToCDPDataSpy = jest.spyOn(Personalizer.prototype as any, 'mapPersonalizeInputToCDPData');
    const sendCallFlowSpy = jest.spyOn(CallFlowCDPClient.prototype, 'sendCallFlowsRequest');

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
      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(infer.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        browserId: id,
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        language: 'EN',
        pointOfSale: 'spinair.com',
      });
      expect(sendCallFlowSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowSpy).toHaveBeenCalledWith(
        {
          browserId: id,
          channel: 'WEB',
          clientKey: 'key',
          currencyCode: 'EUR',
          friendlyId: 'personalizeintegrationtest',
          language: 'EN',
          pointOfSale: 'spinair.com',
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
      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(infer.language).toHaveBeenCalledTimes(0);

      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledWith({
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
        pointOfSale: 'spinair.com',
      });

      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        browserId: id,
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        email: undefined,
        friendlyId: 'personalizeintegrationtest',
        identifiers: undefined,
        language: 'EN',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params: { customNumber: 123, customString: 'example value', customValue_value: 123 },
        pointOfSale: 'spinair.com',
      });
      expect(sendCallFlowSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowSpy).toHaveBeenCalledWith(
        {
          browserId: id,
          channel: 'WEB',
          clientKey: 'key',
          currencyCode: 'EUR',
          friendlyId: 'personalizeintegrationtest',
          language: 'EN',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { customNumber: 123, customString: 'example value', customValue_value: 123 },
          pointOfSale: 'spinair.com',
        },
        undefined
      );
    });

    it('Test return object of the map method without email ', () => {
      personalizeInputMock.identifier = {
        id: '1',
        provider: 'email',
      };
      new Personalizer(personalizeHelper, id, infer).getInteractiveExperienceData(personalizeInputMock);

      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledTimes(1);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveBeenCalledWith(personalizeInputMock);
      expect(mapPersonalizeInputToCDPDataSpy).toHaveReturnedWith({
        channel: 'WEB',
        clientKey: 'key',
        currencyCode: 'EUR',
        friendlyId: 'personalizeintegrationtest',
        identifiers: {
          id: '1',
          provider: 'email',
        },
        language: 'EN',
        pointOfSale: 'spinair.com',
      });

      expect(sendCallFlowSpy).toHaveBeenCalledTimes(1);
      expect(sendCallFlowSpy).toHaveBeenCalledWith(
        {
          channel: 'WEB',
          clientKey: 'key',
          currencyCode: 'EUR',
          friendlyId: 'personalizeintegrationtest',
          identifiers: {
            id: '1',
            provider: 'email',
          },
          language: 'EN',
          pointOfSale: 'spinair.com',
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
      const cdpClient = new CallFlowCDPClient(settingsMock);

      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(expectedResponse) }));

      const response = await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(
        personalizeInputMock,
        100
      );

      // expect(fetch).toHaveBeenCalledWith('https://domain/v2/callFlows', {
      //   body: '{"channel":"WEB","clientKey":"key","currencyCode":"EUR","friendlyId":"personalizeintegrationtest","language":"EN","pointOfSale":"spinair.com","browserId":"test_id"}',
      //   // eslint-disable-next-line @typescript-eslint/naming-convention
      //   headers: { 'Content-Type': 'application/json', 'X-Library-Version': LIBRARY_VERSION },
      //   method: 'POST',
      //   signal: new AbortController().signal,
      // });

      expect(response).toBe(expectedResponse);
    });

    it('should throw error if a negative number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.';

      const cdpClient = new CallFlowCDPClient(settingsMock);

      expect(async () => {
        await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(personalizeInputMock, -10);
      }).rejects.toThrowError(expectedErrorMessage);
    });

    it('should throw error if a float number is used for timeout value', async () => {
      const expectedErrorMessage =
        '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.';
      const cdpClient = new CallFlowCDPClient(settingsMock);

      expect(async () => {
        await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(personalizeInputMock, 420.69);
      }).rejects.toThrowError(expectedErrorMessage);
    });

    it("should call abort method of AbortController if didn't get a response in time", async () => {
      jest.useFakeTimers();
      const cdpClient = new CallFlowCDPClient(settingsMock);

      global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => Promise.resolve('anything') }));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(personalizeInputMock, 100);
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
      const expectedError = '[IE-0003] Timeout exceeded. The server did not respond within the allotted time.';
      const cdpClient = new CallFlowCDPClient(settingsMock);

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      try {
        await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(personalizeInputMock, 0);
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
      const expectedError = '[IE-0003] Timeout exceeded. The server did not respond within the allotted time.';
      const cdpClient = new CallFlowCDPClient(settingsMock);

      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(personalizeInputMock, 100).catch((err) => {
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

      const cdpClient = new CallFlowCDPClient(settingsMock);
      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      const response = await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(
        personalizeInputMock,
        100
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

      const cdpClient = new CallFlowCDPClient(settingsMock);
      global.fetch = jest.fn().mockRejectedValue(new FetchError('Failed to fetch'));

      const response = await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(
        personalizeInputMock,
        100
      );

      expect(response).toBeNull();
    });

    it('should return null if an unhandled error occurs', async () => {
      const cdpClient = new CallFlowCDPClient(settingsMock);

      global.fetch = jest.fn().mockImplementation(() => Promise.resolve('bad object'));

      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      const response = await new Personalizer(cdpClient, id, infer).getInteractiveExperienceData(
        personalizeInputMock,
        100
      );

      expect(response).toBeNull();

      expect(abortSpy).toHaveBeenCalledTimes(0);
    });
  });
});
