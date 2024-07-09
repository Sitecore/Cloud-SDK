import type { SearchEventRequest, WidgetFacetClickEventParams } from './interfaces';
import { ErrorMessages } from '../const';
import { WidgetFacetClickEvent } from './widget-facet-click-event';

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

  const widgetItemEventData: WidgetFacetClickEventParams = {
    channel: 'WEB',
    currency: 'EUR',
    filters: [
      {
        displayName: 'test',
        facetPosition: 1,
        name: 'test',
        title: 'test',
        value: 'test',
        valuePosition: 1
      },
      {
        displayName: 'test',
        endValue: '1',
        facetPosition: 999,
        name: 'test',
        startValue: '1',
        title: 'test',
        value: 'test',
        valuePosition: 1
      }
    ],
    language: 'EN',
    page: 'test',
    pathname: 'https://www.sitecore.com/products/content-cloud',
    request: eventRequestData,
    widgetIdentifier: '12345'
  };

  it('should return a widgetFacetClickEvent object mapped to its DTO', () => {
    const expected = {
      channel: 'WEB',
      currency: 'EUR',
      language: 'EN',
      page: 'test',
      searchData: {
        action_cause: 'filter',
        value: {
          context: {
            page: {
              uri: widgetItemEventData.pathname
            }
          },
          filters: [
            {
              display_name: ['test'],
              facet_position: 1,
              name: 'test',
              title: 'test',
              value: ['test'],
              value_position: [1]
            },
            {
              display_name: ['test'],
              end_value: '1',
              facet_position: 0,
              name: 'test',
              start_value: '1',
              title: 'test',
              value: ['test'],
              value_position: [1]
            }
          ],
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

    const widgetDTO = new WidgetFacetClickEvent(widgetItemEventData).toDTO();

    expect(widgetDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      language: 'TEST'
    };

    expect(() => new WidgetFacetClickEvent(invalidWidgetItemEventData)).toThrow(ErrorMessages.MV_0007);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetFacetClickEvent(invalidWidgetItemEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      language: undefined
    };

    expect(() => new WidgetFacetClickEvent(invalidWidgetItemEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetItemEventData = {
      ...widgetItemEventData,
      currency: undefined
    };

    expect(() => new WidgetFacetClickEvent(invalidWidgetItemEventData)).not.toThrow();
  });
});
