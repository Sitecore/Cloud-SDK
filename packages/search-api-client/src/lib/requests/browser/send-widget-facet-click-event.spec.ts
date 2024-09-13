import * as coreInternalModule from '@sitecore-cloudsdk/core/internal';
import * as eventsBrowserModule from '@sitecore-cloudsdk/events/browser';
import * as initializerModule from '../../init/browser/initializer';
import { event } from '@sitecore-cloudsdk/events/browser';
import { sendWidgetFacetClickEvent } from './send-widget-facet-click-event';

jest.mock('@sitecore-cloudsdk/events/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn().mockResolvedValue(null),
    init: jest.fn()
  };
});

jest.mock('@sitecore-cloudsdk/core/internal', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/core/internal');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    getCloudSDKSettingsBrowser: jest.fn()
  };
});

describe('sendWidgetFacetClickEvent', () => {
  const initEventsSpy = jest.spyOn(eventsBrowserModule, 'init');
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(coreInternalModule, 'getBrowserId').mockReturnValue('test_id');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue(undefined);

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

    const response = await sendWidgetFacetClickEvent({
      channel: 'WEB',
      currency: 'EUR',
      filters: [],
      language: 'EN',
      page: 'test',
      pathname: 'https://www.sitecore.com/products/content-cloud',
      request: widgetItemRequest,
      widgetIdentifier: '12345'
    });

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
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
    jest.spyOn(coreInternalModule, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);
    jest.spyOn(coreInternalModule, 'getBrowserId').mockReturnValue('test_id');
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
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

    const response = await sendWidgetFacetClickEvent({
      channel: 'WEB',
      currency: 'EUR',
      filters: [],
      language: 'EN',
      page: 'test',
      pathname: 'https://www.sitecore.com/products/content-cloud',
      request: widgetItemRequest,
      widgetIdentifier: '12345'
    });

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(response).toBeNull();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
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
