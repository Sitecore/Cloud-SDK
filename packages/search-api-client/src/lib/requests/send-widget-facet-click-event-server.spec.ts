import { event } from '@sitecore-cloudsdk/events/server';
import { sendWidgetFacetClickEventServer } from './send-widget-facet-click-event-server';

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

describe('sendWidgetFacetClickEventServer', () => {
  it('Sends a custom event with the correct values', async () => {
    const httpRequest = {
      cookies: { get: jest.fn(), set: jest.fn() },
      headers: {
        get: jest.fn()
      }
    };
    const widgetItemRequest = {
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

    const response = await sendWidgetFacetClickEventServer(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      filters: [],
      language: 'EN',
      page: 'test',
      pathname: 'https://www.sitecore.com/products/content-cloud',
      request: widgetItemRequest,
      widgetIdentifier: '12345'
    });

    expect(response).toBeNull();
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
