import { ErrorMessages } from '../const';
import type { SearchEventRequest } from './interfaces';
import { WidgetSuggestionClickEvent } from './widget-suggestion-click-event';

describe('widget suggestion click event class', () => {
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
    filters: [
      {
        displayName: 'test',
        name: 'test',
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

  it('should return a widgetSuggestionClickEvent object mapped to its DTO', () => {
    const expected = {
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
          filters: [
            {
              display_name: ['test'],
              name: 'test',
              title: 'test',
              value: ['test'],
              value_position: [1]
            }
          ],
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
    };

    const widgetItemEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventData).toDTO();

    expect(widgetItemEventDTO).toEqual(expected);
  });

  it(`should throw an error if 'language' provided is invalid`, () => {
    const invalidWidgetSuggestionClickEventData = {
      ...widgetSuggestionClickEventData,
      language: 'TEST'
    };

    expect(() => new WidgetSuggestionClickEvent(invalidWidgetSuggestionClickEventData)).toThrow(ErrorMessages.MV_0007);
  });

  it(`should throw an error if 'currency' provided is invalid`, () => {
    const invalidWidgetSuggestionClickEventData = {
      ...widgetSuggestionClickEventData,
      currency: 'TEST'
    };

    expect(() => new WidgetSuggestionClickEvent(invalidWidgetSuggestionClickEventData)).toThrow(ErrorMessages.IV_0015);
  });

  it(`should not throw an error if 'language' is undefined`, () => {
    const invalidWidgetSuggestionClickEventData = {
      ...widgetSuggestionClickEventData,
      language: undefined
    };

    expect(() => new WidgetSuggestionClickEvent(invalidWidgetSuggestionClickEventData)).not.toThrow();
  });

  it(`should not throw an error if 'currency' is undefined`, () => {
    const invalidWidgetSuggestionClickEventData = {
      ...widgetSuggestionClickEventData,
      currency: undefined
    };

    expect(() => new WidgetSuggestionClickEvent(invalidWidgetSuggestionClickEventData)).not.toThrow();
  });
});
