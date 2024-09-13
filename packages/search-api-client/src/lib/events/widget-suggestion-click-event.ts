// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type {
  SearchEventRequest,
  SearchEventRequestDTO,
  SuggestionFilter,
  SuggestionFilterDTO,
  WidgetSuggestionClickEventParams
} from './interfaces';
import { ErrorMessages } from '../consts';
import type { NestedObject } from '@sitecore-cloudsdk/utils';

export class WidgetSuggestionClickEvent {
  protected request: SearchEventRequest;
  protected filters: Array<SuggestionFilter>;
  protected pathname: string;
  protected page: string;
  protected widgetIdentifier: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;

  /**
   * Creates a widget suggestion click event.
   * @param request - A  request object.
   * @param filters - An array of {@link SuggestionFilter} filters.
   * @param pathname - Current uri of the page.
   * @param widgetIdentifier - Unique ID of a widget.
   * @param page - A string that identifies the page.
   * @param currency - Three-letter currency code of the location-specific website in the ISO 42178 format.
   * @param language - Two-letter language code in the ISO 639-1 format.
   * @param channel - The touchpoint where the user interacts.
   */
  constructor({
    request,
    filters,
    pathname,
    page,
    widgetIdentifier,
    currency,
    language,
    channel
  }: WidgetSuggestionClickEventParams) {
    this._validate(currency, language);

    this.request = request;
    this.filters = filters;
    this.pathname = pathname;
    this.page = page;
    this.widgetIdentifier = widgetIdentifier;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

  private _mapFiltersToDTO(): Array<SuggestionFilterDTO> {
    return this.filters.map((filter) => ({
      display_name: [filter.displayName],
      name: filter.name,
      title: filter.title,
      value: [filter.value],
      value_position: [filter.valuePosition]
    }));
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
