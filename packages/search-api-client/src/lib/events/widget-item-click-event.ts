// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type {
  SearchEventEntity,
  SearchEventEntityDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetItemClickEventParams
} from './interfaces';

export class WidgetItemClickEvent {
  protected request: SearchEventRequest;
  protected entity: SearchEventEntity;
  protected itemPosition: number;
  protected pathname: string;
  protected widgetId: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;

  /**
   * Creates a search widget item event.
   * @param widgetItemClickEventParams - An object with the widget item click params
   * {@link WidgetItemClickEventParams}
   */
  constructor({
    request,
    entity,
    itemPosition,
    pathname,
    widgetId,
    page,
    currency,
    language,
    channel
  }: WidgetItemClickEventParams) {
    this._validate(currency, language);

    this.entity = entity;
    this.itemPosition = itemPosition;
    this.page = page;
    this.request = request;
    this.pathname = pathname;
    this.widgetId = widgetId;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.IV_0011);
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
          rfk_id: this.widgetId
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_CLICK'
    };
  }
}
