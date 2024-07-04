// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type {
  SearchEventEntity,
  SearchEventEntityDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetClickEventParams
} from './interfaces';
import { ErrorMessages } from '../const';
import type { NestedObject } from '@sitecore-cloudsdk/utils';

export class WidgetItemEvent {
  protected request: SearchEventRequest;
  protected entity: SearchEventEntity;
  protected itemPosition: number;
  protected pathname: string;
  protected widgetIdentifier: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;

  /**
   * Creates a search widget item event.
   * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
   * @param request - A  request object.
   * @param entity - An object containing entity information.
   * @param itemPosition - Position of the item that was clicked.
   * @param pathname - Current uri of the page.
   * @param widgetIdentifier - Unique ID of a widget.
   * @param page - A string that identifies the page.
   * @param currency - Three-letter currency code of the location-specific website in the ISO 42178 format.
   * @param language - Two-letter language code in the ISO 639-1 format.
   * @param channel - The touchpoint where the user interacts.
   */
  constructor({
    request,
    entity,
    itemPosition,
    pathname,
    widgetIdentifier,
    page,
    currency,
    language,
    channel
  }: WidgetClickEventParams) {
    this._validate(currency, language);

    this.entity = entity;
    this.itemPosition = itemPosition;
    this.page = page;
    this.request = request;
    this.pathname = pathname;
    this.widgetIdentifier = widgetIdentifier;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

  toDTO() {
    const eventRequestDTO: SearchEventRequestDTO = {
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

    const eventEntityDTO: SearchEventEntityDTO = {
      attributes: this.entity.attributes,
      entity_subtype: this.entity.entityType,
      entity_type: this.entity.entity,
      id: this.entity.id,
      source_id: this.entity.sourceId,
      uri: this.entity.uri
    };

    return {
      channel: this.channel,
      currency: this.currency,
      language: this.language,
      page: this.page,
      searchData: {
        action_cause: 'entity',
        value: {
          context: {
            page: {
              uri: this.pathname
            }
          },
          entities: [eventEntityDTO],
          index: this.itemPosition,
          request: eventRequestDTO,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_CLICK'
    };
  }
}
