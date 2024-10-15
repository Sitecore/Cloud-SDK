import * as core from '@sitecore-cloudsdk/core/internal';
import * as eventsBrowserModule from '@sitecore-cloudsdk/events/browser';
import { event } from '@sitecore-cloudsdk/events/browser';
import type { SearchEventEntity, SearchEventRequest } from '../../events/interfaces';
import * as initializerModule from '../../init/browser/initializer';
import { widgetItemClick } from './widget-item-click-event';

jest.mock('@sitecore-cloudsdk/events/browser', () => {
  const originalModule = jest.requireActual('@sitecore-cloudsdk/events/browser');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    event: jest.fn(),
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

describe('widgetItemClick', () => {
  jest.spyOn(core, 'getBrowserId').mockReturnValue('test_id');
  const initEventsSpy = jest.spyOn(eventsBrowserModule, 'init');

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

  const widgetItemClickEventData = {
    channel: 'WEB',
    currency: 'EUR',
    entity: eventEntityData,
    itemPosition: 1,
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: eventRequestData,
    widgetId: '12345'
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
  });

  it('Sends a custom event with the correct values', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue(undefined);

    await widgetItemClick(widgetItemClickEventData);

    expect(initEventsSpy).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'entity',
        value: {
          context: {
            page: {
              uri: widgetItemClickEventData.pathname
            }
          },
          entities: [
            {
              attributes: widgetItemClickEventData.entity.attributes,
              entity_subtype: widgetItemClickEventData.entity.entityType,
              entity_type: widgetItemClickEventData.entity.entity,
              id: widgetItemClickEventData.entity.id,
              source_id: widgetItemClickEventData.entity.sourceId,
              uri: widgetItemClickEventData.entity.uri
            }
          ],
          index: widgetItemClickEventData.itemPosition,
          request: {
            advanced_query_text: widgetItemClickEventData.request.advancedQueryText,
            keyword: widgetItemClickEventData.request.keyword,
            modified_keyword: widgetItemClickEventData.request.modifiedKeyword,
            num_requested: widgetItemClickEventData.request.numRequested,
            num_results: widgetItemClickEventData.request.numResults,
            page_number: widgetItemClickEventData.request.pageNumber,
            page_size: widgetItemClickEventData.request.pageSize,
            redirect_url: widgetItemClickEventData.request.redirectUrl,
            total_results: widgetItemClickEventData.request.totalResults
          },
          rfk_id: widgetItemClickEventData.widgetId
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });
  it('Sends a custom event with the correct values using the new init', async () => {
    jest.spyOn(initializerModule, 'awaitInit').mockResolvedValueOnce();
    jest.spyOn(core, 'getEnabledPackageBrowser').mockReturnValue({ initState: true } as any);

    await widgetItemClick(widgetItemClickEventData);

    expect(initEventsSpy).not.toHaveBeenCalled();
    expect(event).toHaveBeenCalledTimes(1);
    expect(event).toHaveBeenCalledWith({
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'entity',
        value: {
          context: {
            page: {
              uri: widgetItemClickEventData.pathname
            }
          },
          entities: [
            {
              attributes: widgetItemClickEventData.entity.attributes,
              entity_subtype: widgetItemClickEventData.entity.entityType,
              entity_type: widgetItemClickEventData.entity.entity,
              id: widgetItemClickEventData.entity.id,
              source_id: widgetItemClickEventData.entity.sourceId,
              uri: widgetItemClickEventData.entity.uri
            }
          ],
          index: widgetItemClickEventData.itemPosition,
          request: {
            advanced_query_text: widgetItemClickEventData.request.advancedQueryText,
            keyword: widgetItemClickEventData.request.keyword,
            modified_keyword: widgetItemClickEventData.request.modifiedKeyword,
            num_requested: widgetItemClickEventData.request.numRequested,
            num_results: widgetItemClickEventData.request.numResults,
            page_number: widgetItemClickEventData.request.pageNumber,
            page_size: widgetItemClickEventData.request.pageSize,
            redirect_url: widgetItemClickEventData.request.redirectUrl,
            total_results: widgetItemClickEventData.request.totalResults
          },
          rfk_id: widgetItemClickEventData.widgetId
        }
      },
      type: 'SC_SEARCH_WIDGET_CLICK'
    });
  });
});
