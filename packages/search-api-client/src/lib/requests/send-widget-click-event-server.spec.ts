import type { SearchEventEntity, SearchEventRequest } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';
import { sendWidgetClickEventServer } from './send-widget-click-event-server';

jest.mock('@sitecore-cloudsdk/events/server', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/server');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn(),
    init: jest.fn().mockResolvedValue(() => '')
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

describe('sendWidgetClickEvent', () => {
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

  const eventEntityData: SearchEventEntity = {
    attributes: {
      author: 'ABC'
    },
    entity: 'category',
    entityType: 'subcat',
    id: '123',
    sourceId: '534',
    uri: 'https://www.sitecore.com/products/content-cloud3333333'
  };

  const widgetItemEventData = {
    channel: 'WEB',
    currency: 'EUR',
    entity: eventEntityData,
    itemPosition: 1,
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
    await sendWidgetClickEventServer(httpRequest, widgetItemEventData);

    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith(httpRequest, {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'entity',
        value: {
          context: {
            page: {
              uri: widgetItemEventData.pathname
            }
          },
          entities: [
            {
              attributes: widgetItemEventData.entity.attributes,
              entity_subtype: widgetItemEventData.entity.entityType,
              entity_type: widgetItemEventData.entity.entity,
              id: widgetItemEventData.entity.id,
              source_id: widgetItemEventData.entity.sourceId,
              uri: widgetItemEventData.entity.uri
            }
          ],
          index: widgetItemEventData.itemPosition,
          request: {
            advanced_query_text: widgetItemEventData.request.advancedQueryText,
            keyword: widgetItemEventData.request.keyword,
            modified_keyword: widgetItemEventData.request.modifiedKeyword,
            num_requested: widgetItemEventData.request.numRequested,
            num_results: widgetItemEventData.request.numResults,
            page_number: widgetItemEventData.request.pageNumber,
            page_size: widgetItemEventData.request.pageSize,
            redirect_url: widgetItemEventData.request.redirectUrl,
            total_results: widgetItemEventData.request.totalResults
          },
          rfk_id: widgetItemEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });
});
