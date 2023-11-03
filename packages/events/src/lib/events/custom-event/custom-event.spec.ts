import { CustomEvent, ICustomEventInput } from './custom-event';
import { EventApiClient } from '../../cdp/EventApiClient';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';

jest.mock('../../cdp/EventApiClient');
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

describe('CustomEvent', () => {
  const eventApiClient = new EventApiClient('http://test.com', '123', '456');
  const id = 'test_id';

  const languageSpy = jest.spyOn(core, 'language').mockImplementation(() => 'EN');
  const pageNameSpy = jest.spyOn(core, 'pageName').mockImplementation(() => 'races');

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('constructor', () => {
    let eventData: ICustomEventInput;
    const type = 'CUSTOM_TYPE';
    const settings: core.ISettings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
    };

    beforeEach(() => {
      eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        pointOfSale: 'spinair.com',
      };
    });
    it('should not call flatten object method when no extension data is passed', () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', { value: { search: '' }, writable: true });
      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });
    it('should send a custom event without ext attribute if extensionData is an empty object', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = {};
      new CustomEvent({ eventApiClient, eventData, extensionData, id, settings, type }).send();
      expect(sendEventSpy).toHaveBeenCalledWith(expect.not.objectContaining({ ext: {} }));
    });

    it('should not call flatten object method when no extension data is passed', () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', { value: { search: '' }, writable: true });
      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });

    it('should send a custom event without ext attribute if extensionData is an empty object', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = {};
      new CustomEvent({ eventApiClient, eventData, extensionData, id, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expect.not.objectContaining({ ext: {} }));
    });

    it('should send a custom event with flattened ext attributes', () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22, za: undefined };
      new CustomEvent({ eventApiClient, eventData, extensionData, id, settings, type }).send();

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
        new CustomEvent({ eventApiClient, eventData, extensionData, id, settings, type });
      }).toThrowError(extErrorMessage);
    });

    it('should not throw an error when no more than 50 ext attributes are passed', () => {
      const extErrorMessage = '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.';
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) {
        extensionData[`key${i}`] = `value${i}`;
      }
      expect(() => {
        new CustomEvent({ eventApiClient, eventData, extensionData, id, settings, type });
      }).not.toThrowError(extErrorMessage);
    });
  });

  describe('send', () => {
    const settings: core.ISettings = {
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeContextId: '123',
      sitecoreEdgeUrl: '',
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
        pointOfSale: 'spinair.com',
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

      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();
      expect(sendEventSpy).toHaveBeenCalledWith(expect.objectContaining(expectedExt));
    });

    it('should not call flatten object method when no extension data is passed', async () => {
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        pointOfSale: 'spinair.com',
      };
      const type = 'CUSTOM_TYPE';
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(pageNameSpy).toHaveBeenCalledTimes(1);
    });

    it('should send the event without the ext object', async () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
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

      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData);
      expect(languageSpy).toHaveBeenCalledTimes(0);
      expect(pageNameSpy).toHaveBeenCalledTimes(0);
    });

    it('should send the event without infer', async () => {
      const sendEventSpy = jest.spyOn(EventApiClient.prototype, 'send');
      const eventData = {
        channel: 'WEB',
        currency: 'EUR',
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

      new CustomEvent({ eventApiClient, eventData, id, settings, type }).send();

      expect(sendEventSpy).toHaveBeenCalledWith(expectedData);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(pageNameSpy).toHaveBeenCalledTimes(1);
    });
  });
});
