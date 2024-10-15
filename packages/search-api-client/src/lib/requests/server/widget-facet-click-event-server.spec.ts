import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventServerModule from '@sitecore-cloudsdk/events/server';
import { event } from '@sitecore-cloudsdk/events/server';
import type { SearchEventRequest } from '../../events/interfaces';
import { widgetFacetClickServer } from './widget-facet-click-event-server';

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsServer: jest.fn(),
    getEnabledPackageServer: jest.fn()
  };
});

jest.mock('@sitecore-cloudsdk/events/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn().mockResolvedValue(null),
    init: jest.fn().mockResolvedValue(() => '')
  };
});

describe('widgetFacetClickServer', () => {
  const httpRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn()
    }
  };
  const widgetItemRequest: SearchEventRequest = {
    advancedQueryText: 'test1',
    keyword: 'test_keyword',
    modifiedKeyword: 'test2',
    numRequested: 20,
    numResults: 10,
    pageNumber: 2,
    pageSize: 1,
    redirectUrl: 'test3',
    totalResults: 10
  };

  const widgetItemEventData = {
    channel: 'WEB',
    currency: 'EUR',
    filters: [],
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: widgetItemRequest,
    widgetId: '12345'
  };
  const initEventsSpy = jest.spyOn(eventServerModule, 'init');

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' })
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValue(undefined);

    await widgetFacetClickServer(httpRequest, widgetItemEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'filter',
        value: {
          context: {
            page: {
              uri: 'https://www.sitecore.com/products/content-cloud'
            }
          },
          filters: [],
          request: {
            advanced_query_text: widgetItemRequest.advancedQueryText,
            keyword: widgetItemRequest.keyword,
            modified_keyword: widgetItemRequest.modifiedKeyword,
            num_requested: widgetItemRequest.numRequested,
            num_results: widgetItemRequest.numResults,
            page_number: widgetItemRequest.pageNumber,
            page_size: widgetItemRequest.pageSize,
            redirect_url: widgetItemRequest.redirectUrl,
            total_results: widgetItemRequest.totalResults
          },
          rfk_id: '12345'
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await widgetFacetClickServer(httpRequest, widgetItemEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'filter',
        value: {
          context: {
            page: {
              uri: 'https://www.sitecore.com/products/content-cloud'
            }
          },
          filters: [],
          request: {
            advanced_query_text: widgetItemRequest.advancedQueryText,
            keyword: widgetItemRequest.keyword,
            modified_keyword: widgetItemRequest.modifiedKeyword,
            num_requested: widgetItemRequest.numRequested,
            num_results: widgetItemRequest.numResults,
            page_number: widgetItemRequest.pageNumber,
            page_size: widgetItemRequest.pageSize,
            redirect_url: widgetItemRequest.redirectUrl,
            total_results: widgetItemRequest.totalResults
          },
          rfk_id: '12345'
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });
});
