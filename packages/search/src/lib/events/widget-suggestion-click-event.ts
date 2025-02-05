// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type {
  SearchEventRequest,
  SearchEventRequestDTO,
  SuggestionFilterEventParams,
  SuggestionFilterEventParamsDTO,
  WidgetSuggestionClickEventParams
} from './interfaces';

export class WidgetSuggestionClickEvent {
  protected request: SearchEventRequest;
  protected filters?: Array<SuggestionFilterEventParams>;
  protected pathname: string;
  protected page?: string;
  protected widgetIdentifier: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;

  /**
   * Creates a widget suggestion click event.
   * @param widgetSuggestionClickEventParams - An object with the widget suggestion click event params
   *  {@link WidgetSuggestionClickEventParams}
   */
  constructor({
    request,
    filters,
    pathname,
    page,
    widgetId,
    currency,
    language,
    channel
  }: WidgetSuggestionClickEventParams) {
    this._validate(currency, language);

    this.request = request;
    this.filters = filters;
    this.pathname = pathname;
    this.page = page;
    this.widgetIdentifier = widgetId;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
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
