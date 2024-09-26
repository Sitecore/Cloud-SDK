import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventServerModule from '@sitecore-cloudsdk/events/server';
import { event } from '@sitecore-cloudsdk/events/server';
import type { SearchEventRequest } from '../../events/interfaces';
import { widgetSuggestionClickServer } from './widget-suggestion-click-event-server';

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

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('widgetSuggestionClickServer', () => {
  const httpRequest = {
    cookies: { get: jest.fn(), set: jest.fn() },
    headers: {
      get: jest.fn()
    }
  };

  const eventRequestData: SearchEventRequest = {
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

  const widgetSuggestionClickEventData = {
    channel: 'WEB',
    currency: 'EUR',
    filters: [],
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: eventRequestData,
    widgetIdentifier: '12345'
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
    await widgetSuggestionClickServer(httpRequest, widgetSuggestionClickEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'suggestion',
        value: {
          context: {
            page: {
              uri: widgetSuggestionClickEventData.pathname
            }
          },
          filters: [],
          request: {
            advanced_query_text: widgetSuggestionClickEventData.request.advancedQueryText,
            keyword: widgetSuggestionClickEventData.request.keyword,
            modified_keyword: widgetSuggestionClickEventData.request.modifiedKeyword,
            num_requested: widgetSuggestionClickEventData.request.numRequested,
            num_results: widgetSuggestionClickEventData.request.numResults,
            page_number: widgetSuggestionClickEventData.request.pageNumber,
            page_size: widgetSuggestionClickEventData.request.pageSize,
            redirect_url: widgetSuggestionClickEventData.request.redirectUrl,
            total_results: widgetSuggestionClickEventData.request.totalResults
          },
          rfk_id: widgetSuggestionClickEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });

  it('Sends a custom event with the correct values using new init', async () => {
    jest.spyOn(coreInternalModule, 'getEnabledPackageServer').mockReturnValueOnce({} as any);

    await widgetSuggestionClickServer(httpRequest, widgetSuggestionClickEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'suggestion',
        value: {
          context: {
            page: {
              uri: widgetSuggestionClickEventData.pathname
            }
          },
          filters: [],
          request: {
            advanced_query_text: widgetSuggestionClickEventData.request.advancedQueryText,
            keyword: widgetSuggestionClickEventData.request.keyword,
            modified_keyword: widgetSuggestionClickEventData.request.modifiedKeyword,
            num_requested: widgetSuggestionClickEventData.request.numRequested,
            num_results: widgetSuggestionClickEventData.request.numResults,
            page_number: widgetSuggestionClickEventData.request.pageNumber,
            page_size: widgetSuggestionClickEventData.request.pageSize,
            redirect_url: widgetSuggestionClickEventData.request.redirectUrl,
            total_results: widgetSuggestionClickEventData.request.totalResults
          },
          rfk_id: widgetSuggestionClickEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });
});
