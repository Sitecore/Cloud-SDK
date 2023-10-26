import { CustomEvent, ICustomEventInput } from './custom-event';
import { EventApiClient } from '../cdp/EventApiClient';
import { MAX_EXT_ATTRIBUTES } from './consts';
import * as core from '@sitecore-cloudsdk/engage-core';
import * as utils from '@sitecore-cloudsdk/engage-utils';

jest.mock('../cdp/EventApiClient');
jest.mock('@sitecore-cloudsdk/engage-core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

jest.mock('@sitecore-cloudsdk/engage-utils', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/engage-utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
  };
});

describe('CustomEvent', () => {
  const eventApiClient = new EventApiClient('http://test.com', 'key', 'site');
  const id = 'test_id';
  const infer = new core.Infer();
  infer.language = jest.fn().mockImplementation(() => 'EN');
  infer.pageName = jest.fn().mockImplementation(() => 'races');
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('constructor', () => {
    let eventData: ICustomEventInput;
    const type = 'CUSTOM_TYPE';
    const settings: core.ISettings = {
      contextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        cookieTempValue: 'bid_value'
      },
      siteId: '456',
    };

    beforeEach(() => {
      eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races'
      };
    });
    it('should not call flatten object method when no extension data is passed', () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', { value: { search: '' }, writable: true });
      new CustomEvent({ eventApiClient, eventData, id, infer, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });
    it('should send a custom event without ext attribute if extensionData is an empty object', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = {};
      new CustomEvent({ eventApiClient, eventData, extensionData, id, infer, settings, type }).send();
      expect(sendEventSpy).toHaveBeenCalledWith(expect.not.objectContaining({ ext: {} }));
    });

    it('should not call flatten object method when no extension data is passed', () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', { value: { search: '' }, writable: true });
      new CustomEvent({ eventApiClient, eventData, id, infer, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });

    it('should send a custom event without ext attribute if extensionData is an empty object', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = {};
      new CustomEvent({ eventApiClient, eventData, extensionData, id, infer, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expect.not.objectContaining({ ext: {} }));
    });

    it('should send a custom event with flattened ext attributes', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22, za: undefined };
      new CustomEvent({ eventApiClient, eventData, extensionData, id, infer, settings, type }).send();

      const expectedExt = {
        ext: {
          /* eslint-disable @typescript-eslint/naming-convention */
          test_a_b: 'b',
          test_c: 11,
          /* eslint-enable @typescript-eslint/naming-convention */
          testz: 22,
        },
      };
      expect(sendEventSpy).toHaveBeenCalledWith(expect.objectContaining(expectedExt));
    });

    it('should throw an error when more than 50 ext attributes are passed', () => {
      const extErrorMessage = '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.';
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < 51; i++) {
        extensionData[`key${i}`] = `value${i}`;
      }
      expect(() => {
        new CustomEvent({ eventApiClient, eventData, extensionData, id, infer, settings, type });
      }).toThrowError(extErrorMessage);
    });

    it('should not throw an error when no more than 50 ext attributes are passed', () => {
      const extErrorMessage = '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.';
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) {
        extensionData[`key${i}`] = `value${i}`;
      }
      expect(() => {
        new CustomEvent({ eventApiClient, eventData, extensionData, id, infer, settings, type });
      }).not.toThrowError(extErrorMessage);
    });
  });

  describe('send', () => {
    const settings: core.ISettings = {
      contextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
        cookieTempValue: 'bid_value'
      },
      siteId: '456',
    };

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as core.ICdpResponse),
      });
      global.fetch = jest.fn().mockImplementationOnce(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should send the event with top level attributes', async () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        testAttr1: 'test',
        testAttr2: true,
        testAttr3: 22,
      };
      const type = 'CUSTOM_TYPE';
      const expectedExt = {
        testAttr1: 'test',
        testAttr2: true,
        testAttr3: 22,
      };

      new CustomEvent({ eventApiClient, eventData, id, infer, settings, type }).send();
      expect(sendEventSpy).toHaveBeenCalledWith(expect.objectContaining(expectedExt));
    });

    it('should not call flatten object method when no extension data is passed', async () => {
      const eventData = {
        channel: 'WEB',
        currency: 'EUR'
      };
      const type = 'CUSTOM_TYPE';
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      new CustomEvent({ eventApiClient, eventData, id, infer, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
      expect(infer.language).toHaveBeenCalledTimes(1);
      expect(infer.pageName).toHaveBeenCalledTimes(1);
    });

    it('should send the event without the ext object', async () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races'
      };
      const type = 'CUSTOM_TYPE';
      const expectedData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        browser_id: id,
        channel: 'WEB',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_key: '',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        pos: '',
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventApiClient, eventData, id, infer, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData);
      expect(infer.language).toHaveBeenCalledTimes(0);
      expect(infer.pageName).toHaveBeenCalledTimes(0);
    });

    it('should send the event without infer', async () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR'
      };
      const type = 'CUSTOM_TYPE';
      const expectedData = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        browser_id: id,
        channel: 'WEB',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_key: '',
        currency: 'EUR',
        language: undefined,
        page: '',
        pos: '',
        type: 'CUSTOM_TYPE',
      };

      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData);
      expect(infer.language).toHaveBeenCalledTimes(0);
      expect(infer.pageName).toHaveBeenCalledTimes(0);
    });
  });
});
