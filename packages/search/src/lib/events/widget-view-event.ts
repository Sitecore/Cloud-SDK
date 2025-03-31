// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { BaseSearchEvent } from './base-widget-event';
import type {
  SearchEventEntity,
  SearchEventEntityDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetViewEventParams
} from './interfaces';

export class WidgetViewEvent extends BaseSearchEvent {
  protected request: SearchEventRequest;
  protected entities: SearchEventEntity[];
  protected widgetIdentifier: string;

  /**
   * Creates a search widget view event.
   * @param widgetViewEventParams - An object with the widget view events params {@link WidgetViewEventParams}
   */
  constructor({ request, entities, widgetId, ...rest }: WidgetViewEventParams) {
    super(rest);
    this.entities = entities;
    this.request = request;
    this.widgetIdentifier = widgetId;
  }

  /**
   *
   * @returns the property entities in its DTO format {@link SearchEventEntityDTO}[].
   */
  private _mapEntitiesToDTO(): Array<SearchEventEntityDTO> {
    return this.entities.map((entity) => ({
      attributes: entity.attributes,
      entity_subtype: entity.entityType,
      entity_type: entity.entity,
      id: entity.id,
      source_id: entity.sourceId,
      uri: entity.uri
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
   * @returns the WidgetViewEvent in its DTO format.
   */
  toDTO() {
    const entitiesDTO = this._mapEntitiesToDTO();
    const requestDTO = this._mapRequestToDTO();

    return {
      channel: this.channel,
      currency: this.currency,
      language: this.language,
      page: this.page,
      searchData: {
        action_cause: 'entity',
        value: {
          ...this._searchContextToDTO(),
          entities: entitiesDTO,
          request: requestDTO,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_VIEW'
    };
  }
}
