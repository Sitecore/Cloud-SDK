// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type {
  FacetFilter,
  FacetFilterDTO,
  RangeFacetFilter,
  RangeFacetFilterDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetFacetClickEventParams
} from './interfaces';
import { ErrorMessages } from '../const';
import type { NestedObject } from '@sitecore-cloudsdk/utils';

export class WidgetFacetClickEvent {
  protected request: SearchEventRequest;
  protected pathname: string;
  protected widgetIdentifier: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;
  protected filters: Array<FacetFilter | RangeFacetFilter>;

  /**
   * Creates a search widget facet click event.
   * @param channel - The touchpoint where the user interacts.
   * @param currency - Three-letter currency code of the location-specific website in the ISO 42178 format.
   * @param filters - An array of {@link FacetFilter} or {@link RangeFacetFilter} filters.
   * @param language - Two-letter language code in the ISO 639-1 format.
   * @param page - A string that identifies the page.
   * @param pathname - Current uri of the page.
   * @param request - A  request object.
   * @param widgetIdentifier - Unique ID of a widget.
   */
  constructor({
    request,
    pathname,
    widgetIdentifier,
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
    this.widgetIdentifier = widgetIdentifier;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

  private _mapFiltersToDTO(): Array<FacetFilterDTO | RangeFacetFilterDTO> {
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

  private _rangeFacetFilterTypeGuard(filter: FacetFilter | RangeFacetFilter): filter is RangeFacetFilter {
    return 'startValue' in filter;
  }

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
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_CLICK'
    };
  }
}
