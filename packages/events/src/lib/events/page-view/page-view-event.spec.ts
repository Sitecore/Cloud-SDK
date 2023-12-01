/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/naming-convention */

import { PageViewEventInput, PageViewEvent } from './page-view-event';
import { EPResponse, Settings } from '@sitecore-cloudsdk/core';
import { MAX_EXT_ATTRIBUTES } from '../consts';
import * as core from '@sitecore-cloudsdk/core';
import * as utils from '@sitecore-cloudsdk/utils';
import { EventApiClient } from '../../ep/EventApiClient';
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
describe('PageViewEvent', () => {
  const eventApiClient = new EventApiClient('http://testurl', '123', '456');
  const fetchCallSpy = jest.spyOn(EventApiClient.prototype, 'send');
  const id = 'test_id';

  let expectedBasicAttributes = {};
  let eventData: PageViewEventInput;
  let settings: Settings;

  function callPageEvent(
    eventApiClient: any,
    eventData: any,
    id: any,
    settings: any,
    extensionData?: any,
    searchParams?: any
  ) {
    new PageViewEvent({
      eventApiClient,
      eventData,
      id,
      settings,
      searchParams: searchParams ?? window.location.search,
      extensionData,
    }).send();
  }
  beforeEach(() => {
    expectedBasicAttributes = {
      browser_id: id,
      channel: 'WEB',
      client_key: '',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      pos: '',
    };

    eventData = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      includeUTMParameters: true,
    };

    settings = {
      sitecoreEdgeContextId: '123',
      cookieSettings: {
        cookieDomain: 'cDomain',
        cookieExpiryDays: 730,
        cookieName: 'bid_name',
        cookiePath: '/',
      },
      siteName: '456',
      sitecoreEdgeUrl: '',
    };
    jest.spyOn(core, 'language').mockImplementation(() => 'EN');
    jest.spyOn(core, 'pageName').mockImplementation(() => 'races');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('isFirstPageView', () => {
    it('should exist and should have value of true as default value', () => {
      expect(PageViewEvent.isFirstPageView).not.toBeUndefined();
      expect(PageViewEvent.isFirstPageView).toBe(true);
    });

    it('should change state to false when the event is sent', async () => {
      global.window ??= Object.create(window);
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);

      const event = new PageViewEvent({
        eventApiClient,
        eventData,
        id,
        searchParams: '',
        settings,
      });

      expect(PageViewEvent.isFirstPageView).toBe(true);
      await event.send();
      expect(PageViewEvent.isFirstPageView).toBe(false);
    });
  });

  describe('check getPageVariantId function', () => {
    const getPageVariantIdSpy = jest.spyOn(PageViewEvent.prototype as any, 'getPageVariantId');
    let eventData: PageViewEventInput = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'races',
      includeUTMParameters: true,
    };

    beforeEach(() => {
      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);

      eventData = {
        channel: 'WEB',
        currency: 'EUR',
        language: 'EN',
        page: 'races',
        includeUTMParameters: true,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the variantid if exists in the url of the window and not present in the event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?variantid=test_pageVariantId',
        },
        writable: true,
      });

      callPageEvent(eventApiClient, eventData, id, settings);

      expect(getPageVariantIdSpy).toHaveReturnedWith('test_pageVariantId');
    });

    it('should return the variantid if exists in the search params that is passed from the server and not present in the event data', async () => {
      callPageEvent(eventApiClient, eventData, id, settings, undefined, '?variantid=test_pageVariantId');
      expect(getPageVariantIdSpy).toHaveReturnedWith('test_pageVariantId');
    });
    it('should return the variantid if passed as extension data and not present in neither the searchParams from the server nor in the event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      eventData.pageVariantId = undefined;
      const extensionData = { pageVariantId: 'extVid' };
      callPageEvent(eventApiClient, eventData, id, settings, extensionData, '?testVariantid=test_pageVariantId');
      expect(getPageVariantIdSpy).toHaveReturnedWith('extVid');
    });

    it('should return the variantid if passed as extension data and not present in neither the url nor in the event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      eventData.pageVariantId = undefined;
      const extensionData = { pageVariantId: 'extVid' };
      callPageEvent(eventApiClient, eventData, id, settings, extensionData);
      expect(getPageVariantIdSpy).toHaveReturnedWith('extVid');
    });
    it('should return null if the variantid does not exist in the search params property and event data', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getPageVariantIdSpy).toHaveReturnedWith(null);
    });
    it('should not call flatten object method when no extension data is passed', async () => {
      const flattenObjectSpy = jest.spyOn(utils, 'flattenObject');
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      callPageEvent(eventApiClient, eventData, id, settings);
      expect(flattenObjectSpy).toHaveBeenCalledTimes(0);
    });
    it('should prioritize pageVariantId value from event data over extension data when provided in both', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      const extensionData = { pageVariantId: 'extension_data_vid' };

      eventData.pageVariantId = 'vid';

      callPageEvent(eventApiClient, eventData, id, settings, extensionData);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{
          type: 'VIEW',
          ext: { pageVariantId: 'vid' },
        },
      };
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });
    it('should send an event with fetch without the pageVariantId', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });

      callPageEvent(eventApiClient, eventData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{
          type: 'VIEW',
        },
      };
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });
  });

  it('should send a view event with an ext property containing extension data when passed', () => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' } as EPResponse),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const extensionData = { test: { a: { b: 'b' }, c: 11 }, testz: 22 };
    callPageEvent(eventApiClient, eventData, id, settings, extensionData);
    const expectedAttributes = {
      ...expectedBasicAttributes,
      ...{
        type: 'VIEW',
        ext: { test_a_b: 'b', test_c: 11, testz: 22 },
      },
    };
    expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
  });

  describe('Should throw error', () => {
    it('should throw an error when more than 50 ext attributes are passed', () => {
      const extErrorMessage = '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.';
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < 51; i++) {
        extensionData[`key${i}`] = `value${i}`;
      }
      expect(() => {
        callPageEvent(eventApiClient, eventData, id, settings, extensionData);
      }).toThrowError(extErrorMessage);
    });

    it('should not throw an error when no more than 50 ext attributes are passed', () => {
      const extErrorMessage = '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.';
      const extensionData: { [key: string]: string } = {};
      for (let i = 0; i < MAX_EXT_ATTRIBUTES; i++) {
        extensionData[`key${i}`] = `value${i}`;
      }
      expect(() => {
        callPageEvent(eventApiClient, eventData, id, settings, extensionData);
      }).not.toThrowError(extErrorMessage);
    });
  });

  describe('getReferrer', () => {
    const getReferrerSpy = jest.spyOn(PageViewEvent.prototype as any, 'getReferrer');

    beforeEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });
    afterEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });

    it('getReferrer should return null if isFirstPageView is false ', async () => {
      PageViewEvent.isFirstPageView = false;
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(window).toBeDefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(PageViewEvent.isFirstPageView).toBeFalsy();
    });
    it('getReferrer should return null if isFirstPageView is true and document referrer is empty string ', async () => {
      expect(PageViewEvent.isFirstPageView).toBeTruthy();
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(document.referrer).toBe('');
      expect(window).toBeDefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
    });

    it('getReferrer should return url if hostName is different from referrer', async () => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://test.com/extra_path?search=test',
        writable: true,
      });
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'dddtest.com',
        },
        writable: true,
      });

      expect(PageViewEvent.isFirstPageView).toBeTruthy();
      callPageEvent(eventApiClient, eventData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{ type: 'VIEW' },
        referrer: 'http://test.com/extra_path?search=test',
      };
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith('http://test.com/extra_path?search=test');
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });

    it('should return null if host name is the same', async () => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://test.com/extra_path?search=test',
        writable: true,
      });
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'test.com',
        },
        writable: true,
      });
      PageViewEvent.isFirstPageView = true;
      callPageEvent(eventApiClient, eventData, id, settings, undefined);
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
    });

    it('getReferrer should be null if windows does not exists and referrer is not provided by the developer (Server Side Test)', async () => {
      Object.defineProperty(global, 'window', {
        get: jest.fn().mockReturnValueOnce(undefined),
        // writable: true,
      });

      expect(global.window).toBeUndefined();
      PageViewEvent.isFirstPageView = true;
      callPageEvent(eventApiClient, eventData, id, settings, undefined, '');
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{ type: 'VIEW' },
      };
      expect(window).toBeUndefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith(null);
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });

    it('getReferrer should be retrieved if provided eventData and window is undefined', async () => {
      Object.defineProperty(global, 'window', {
        get: jest.fn().mockReturnValueOnce(undefined),
        // writable: true,
      });
      PageViewEvent.isFirstPageView = true;
      eventData.referrer = 'campaign';
      callPageEvent(eventApiClient, eventData, id, settings, undefined, '');
      expect(window).toBeUndefined();
      expect(getReferrerSpy).toHaveBeenCalledTimes(1);
      expect(getReferrerSpy).toHaveReturnedWith('campaign');
    });
  });

  describe('check getUTMParameters function', () => {
    let windowSpy: jest.SpyInstance;
    let documentSpy: jest.SpyInstance;

    const getUTMParametersSpy = jest.spyOn(PageViewEvent.prototype as any, 'getUTMParameters');

    beforeEach(() => {
      jest.clearAllMocks();

      windowSpy = jest.spyOn(globalThis, 'window', 'get');
      documentSpy = jest.spyOn(globalThis, 'document', 'get');

      PageViewEvent.isFirstPageView = true;
      eventData.includeUTMParameters = undefined;

      const mockFetch = Promise.resolve({
        json: () => Promise.resolve({ status: 'OK' } as EPResponse),
      });
      global.fetch = jest.fn().mockImplementation(() => mockFetch);
    });

    afterEach(() => {
      jest.clearAllMocks();
      PageViewEvent.isFirstPageView = true;
    });

    it('should not call getUTMParameters if includeUTMParameters is false', async () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      eventData.includeUTMParameters = false;

      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getUTMParametersSpy).toHaveBeenCalledTimes(0);
    });

    it('should call getUTMParameters if includeUTMParameters is true', async () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));

      eventData.includeUTMParameters = true;
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getUTMParametersSpy).toHaveBeenCalledTimes(1);
    });

    it('should return {} if urlSearchParams is empty', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '',
        },
      }));
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getUTMParametersSpy).toHaveLastReturnedWith({});
    });

    it("should return an empty object if urlSearchParams doesn't contain utm_ params", () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '?banana=banana',
        },
      }));
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getUTMParametersSpy).toHaveReturnedWith({});
    });

    it('should return an object with utm_ params when urlSearchParams contains utm_params', () => {
      windowSpy.mockImplementation(() => ({
        location: {
          search: '?utm_campaign=campaign&utm_medium=email',
        },
      }));
      callPageEvent(eventApiClient, eventData, id, settings);
      expect(getUTMParametersSpy).toHaveReturnedWith({ utm_campaign: 'campaign', utm_medium: 'email' });
    });

    it('should send event without utm_ params if the returned object is empty {}', () => {
      documentSpy.mockImplementation(() => ({
        referrer: undefined,
      }));

      jest.spyOn(PageViewEvent.prototype as any, 'getUTMParameters').mockReturnValueOnce({});

      callPageEvent(eventApiClient, eventData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{
          type: 'VIEW',
        },
      };
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });

    it('should send an event with utm_ params if the returned object is not empty', () => {
      getUTMParametersSpy.mockReturnValueOnce({ utm_test: 'test' });
      callPageEvent(eventApiClient, eventData, id, settings);
      const expectedAttributes = {
        ...expectedBasicAttributes,
        ...{
          type: 'VIEW',
          utm_test: 'test',
        },
      };
      expect(fetchCallSpy).toHaveBeenCalledWith(expectedAttributes);
    });
  });
});
