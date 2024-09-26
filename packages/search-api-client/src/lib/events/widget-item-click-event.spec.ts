import { ErrorMessages } from '../consts';
import type { SearchEventEntity, SearchEventRequest } from './interfaces';
import { WidgetItemClickEvent } from './widget-item-click-event';

describe('widget item event class', () => {
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

  it('should return a widgetItemEvent object mapped to its DTO', () => {
    const expected = {
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
    };

    const widgetItemEventDTO = new WidgetItemClickEvent(widgetItemEventData).toDTO();

    expect(widgetItemEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      language: 'TEST'
    };

    expect(() => new WidgetItemClickEvent(invalidWidgetItemEventData)).toThrow(ErrorMessages.MV_0007);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetItemClickEvent(invalidWidgetItemEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      language: undefined
    };

    expect(() => new WidgetItemClickEvent(invalidWidgetItemEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      currency: undefined
    };

    expect(() => new WidgetItemClickEvent(invalidWidgetItemEventData)).not.toThrow();
  });
});
