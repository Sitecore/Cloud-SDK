// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type {
  FacetFilterEventParams,
  FacetFilterEventParamsDTO,
  RangeFacetFilterEventParams,
  RangeFacetFilterEventParamsDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetFacetClickEventParams
} from './interfaces';

export class WidgetFacetClickEvent {
  protected request: SearchEventRequest;
  protected pathname: string;
  protected widgetId: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;
  protected filters: Array<FacetFilterEventParams | RangeFacetFilterEventParams>;

  /**
   * Creates a search widget facet click event.
   * @param widgetFacetClickEventParams - An object with the widget facet click params
   *   {@link WidgetFacetClickEventParams}
   */
  constructor({
    request,
    pathname,
    widgetId,
    page,
    currency,
    language,
    channel,
    filters
  }: WidgetFacetClickEventParams) {
    this._validate(currency, language);

    this.request = request;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
    this.filters = filters;
    this.page = page;
    this.pathname = pathname;
    this.widgetId = widgetId;
  }

  /**
   * @param currency - three-letter currency code in the ISO 4217 format.
   * @param language - two-letter language code in the ISO 639-1 format.
   * @throws - {@link ErrorMessages.IV_0015} | {@link ErrorMessages.IV_0011}
   */
  private _validate(currency?: string, language?: string): void {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.IV_0011);
  }

  /**
   *
   * @returns - {@link FacetFilterEventParamsDTO}[] | {@link RangeFacetFilterEventParamsDTO}[]
   */
  private _mapFiltersToDTO(): Array<FacetFilterEventParamsDTO | RangeFacetFilterEventParamsDTO> {
    return this.filters.map((filter) => {
      if (this._rangeFacetFilterTypeGuard(filter))
        return {
          display_name: [filter.displayName],
          end_value: filter.endValue,
          facet_position: 0,
          name: filter.name,
          start_value: filter.startValue,
          title: filter.title,
          value: [filter.value],
          value_position: [filter.valuePosition]
        };

      return {
        display_name: [filter.displayName],
        facet_position: filter.facetPosition,
        name: filter.name,
        title: filter.title,
        value: [filter.value],
        value_position: [filter.valuePosition]
      };
    });
  }

  /**
   * @returns a search event request in DTO format {@link SearchEventRequestDTO}.
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
   * @param filter - {@link FacetFilterEventParams} | {@link RangeFacetFilterEventParams}
   * @returns true if `filter` is {@link RangeFacetFilterEventParams}
   */
  private _rangeFacetFilterTypeGuard(
    filter: FacetFilterEventParams | RangeFacetFilterEventParams
  ): filter is RangeFacetFilterEventParams {
    return 'startValue' in filter;
  }

  /**
   * @returns map of WidgetFacetClickEvent in its DTO format.
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
        action_cause: 'filter',
        value: {
          context: {
            page: {
              uri: this.pathname
            }
          },
          filters: filtersDTO,
          request: requestDTO,
          rfk_id: this.widgetId
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_CLICK'
    };
  }
}
