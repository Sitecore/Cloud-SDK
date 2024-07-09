import type { SearchEventRequest } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';
import { sendWidgetSuggestionClickEventServer } from './send-widget-suggestion-click-server';

jest.mock('@sitecore-cloudsdk/events/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn().mockResolvedValue(null)
  };
});

jest.mock('@sitecore-cloudsdk/core', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule
  };
});

describe('sendWidgetSuggestionClickEventServer', () => {
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

  beforeEach(() => {
    const mockFetch = Promise.resolve({
      json: () => Promise.resolve({ status: 'OK' })
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Sends a custom event with the correct values', async () => {
    const response = await sendWidgetSuggestionClickEventServer(httpRequest, widgetSuggestionClickEventData);

    expect(response).toBeNull();
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
