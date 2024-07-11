import type { SearchEventEntity, SearchEventRequest, WidgetViewEventParams } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';
import { widgetViewServer } from './widget-view-server';

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

describe('widgetViewServer', () => {
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

  const eventEntitiesData: Array<SearchEventEntity> = [
    {
      attributes: {
        author: 'ABC'
      },
      entity: 'category1',
      entityType: 'subcat1',
      id: '123',
      sourceId: '534',
      uri: 'https://www.sitecore.com/products/content-cloud3333333'
    },
    {
      attributes: {
        author: 'XYZ'
      },
      entity: 'category2',
      entityType: 'subcat2',
      id: '678',
      sourceId: '910',
      uri: 'https://www.sitecore.com/products/content-cloud4444444'
    }
  ];

  const widgetViewEventData: WidgetViewEventParams = {
    channel: 'WEB',
    currency: 'EUR',
    entities: eventEntitiesData,
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
    await widgetViewServer(httpRequest, widgetViewEventData);

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
              uri: widgetViewEventData.pathname
            }
          },
          entities: [
            {
              attributes: widgetViewEventData.entities[0].attributes,
              entity_subtype: widgetViewEventData.entities[0].entityType,
              entity_type: widgetViewEventData.entities[0].entity,
              id: widgetViewEventData.entities[0].id,
              source_id: widgetViewEventData.entities[0].sourceId,
              uri: widgetViewEventData.entities[0].uri
            },
            {
              attributes: widgetViewEventData.entities[1].attributes,
              entity_subtype: widgetViewEventData.entities[1].entityType,
              entity_type: widgetViewEventData.entities[1].entity,
              id: widgetViewEventData.entities[1].id,
              source_id: widgetViewEventData.entities[1].sourceId,
              uri: widgetViewEventData.entities[1].uri
            }
          ],
          request: {
            advanced_query_text: widgetViewEventData.request.advancedQueryText,
            keyword: widgetViewEventData.request.keyword,
            modified_keyword: widgetViewEventData.request.modifiedKeyword,
            num_requested: widgetViewEventData.request.numRequested,
            num_results: widgetViewEventData.request.numResults,
            page_number: widgetViewEventData.request.pageNumber,
            page_size: widgetViewEventData.request.pageSize,
            redirect_url: widgetViewEventData.request.redirectUrl,
            total_results: widgetViewEventData.request.totalResults
          },
          rfk_id: widgetViewEventData.widgetIdentifier
        }
      },
      type: 'SC_SEARCH_WIDGET_VIEW'
    });
  });
});
