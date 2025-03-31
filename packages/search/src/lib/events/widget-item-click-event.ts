// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { BaseSearchEvent } from './base-widget-event';
import type {
  SearchEventEntity,
  SearchEventEntityDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetItemClickEventParams
} from './interfaces';

export class WidgetItemClickEvent extends BaseSearchEvent {
  protected request: SearchEventRequest;
  protected entity: SearchEventEntity;
  protected itemPosition: number;
  protected widgetId: string;

  /**
   * Creates a search widget item event.
   * @param widgetItemClickEventParams - An object with the widget item click params
   * {@link WidgetItemClickEventParams}
   */
  constructor({ request, entity, itemPosition, widgetId, ...rest }: WidgetItemClickEventParams) {
    super(rest);
    this.entity = entity;
    this.itemPosition = itemPosition;
    this.request = request;
    this.widgetId = widgetId;
  }

  /**
   *
   * @returns a map of WidgetItemClickEvent in its DTO format.
   */
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
          ...this._searchContextToDTO(),
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
