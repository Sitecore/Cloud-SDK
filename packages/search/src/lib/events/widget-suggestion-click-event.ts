// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { BaseSearchEvent } from './base-widget-event';
import type {
  SearchEventRequest,
  SearchEventRequestDTO,
  SuggestionFilterEventParams,
  SuggestionFilterEventParamsDTO,
  WidgetSuggestionClickEventParams
} from './interfaces';

export class WidgetSuggestionClickEvent extends BaseSearchEvent {
  protected request: SearchEventRequest;
  protected filters?: Array<SuggestionFilterEventParams>;
  protected widgetIdentifier: string;

  /**
   * Creates a widget suggestion click event.
   * @param widgetSuggestionClickEventParams - An object with the widget suggestion click event params
   *  {@link WidgetSuggestionClickEventParams}
   */
  constructor({ request, filters, widgetId, ...rest }: WidgetSuggestionClickEventParams) {
    super(rest);
    this.request = request;
    this.filters = filters;
    this.widgetIdentifier = widgetId;
  }

  /**
   *
   * @returns the filters property in its DTO format {@link SuggestionFilterEventParamsDTO}[].
   */
  private _mapFiltersToDTO(): Array<SuggestionFilterEventParamsDTO> | undefined {
    return this.filters?.map((filter) => ({
      display_name: [filter.displayName],
      name: filter.name,
      title: filter.title,
      value: [filter.value],
      value_position: [filter.valuePosition]
    }));
  }

  /**
   *
   * @returns the request property in its DTO format {@link SearchEventRequestDTO}.
   */
  private _mapRequestToDTO(): SearchEventRequestDTO {
    return {
      advanced_query_text: this.request.advancedQueryText,
      keyword: this.request.keyword,
      modified_keyword: this.request.modifiedKeyword,
      num_requested: this.request.numRequested,
      num_results: this.request.numResults,
      page_number: this.request.pageNumber,
      page_size: this.request.pageSize,
      redirect_url: this.request.redirectUrl,
      total_results: this.request.totalResults
    };
  }

  /**
   *
   * @returns WidgetSuggestionClickEvent in its DTO format.
   */
  toDTO() {
    const filtersDTO = this._mapFiltersToDTO();
    const requestDTO = this._mapRequestToDTO();

    return {
      channel: this.channel,
      currency: this.currency,
      language: this.language,
      page: this.page,
      searchData: {
        action_cause: 'suggestion',
        value: {
          ...this._searchContextToDTO(),
          filters: filtersDTO,
          request: requestDTO,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_CLICK'
    };
  }
}
