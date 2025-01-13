import { ErrorMessages } from '../consts';
import type { SearchEventEntity, SearchEventRequest, WidgetViewEventParams } from './interfaces';
import { WidgetViewEvent } from './widget-view-event';

describe('widget view event class', () => {
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
    widgetId: '12345'
  };

  it('should return a widgetViewEvent object mapped to its DTO', () => {
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
          rfk_id: widgetViewEventData.widgetId
        }
      },
      type: 'SC_SEARCH_WIDGET_VIEW'
    };

    const widgetViewEventDTO = new WidgetViewEvent(widgetViewEventData).toDTO();

    expect(widgetViewEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetViewEventData = {
      ...widgetViewEventData,
      language: 'TEST'
    };

    expect(() => new WidgetViewEvent(invalidWidgetViewEventData)).toThrow(ErrorMessages.IV_0011);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetViewEventData = {
      ...widgetViewEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetViewEvent(invalidWidgetViewEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetViewEventData = {
      ...widgetViewEventData,
      language: undefined
    };

    expect(() => new WidgetViewEvent(invalidWidgetViewEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetViewEventData = {
      ...widgetViewEventData,
      currency: undefined
    };

    expect(() => new WidgetViewEvent(invalidWidgetViewEventData)).not.toThrow();
  });
});
