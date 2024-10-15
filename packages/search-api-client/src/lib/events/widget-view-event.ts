// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type {
  SearchEventEntity,
  SearchEventEntityDTO,
  SearchEventRequest,
  SearchEventRequestDTO,
  WidgetViewEventParams
} from './interfaces';

export class WidgetViewEvent {
  protected request: SearchEventRequest;
  protected entities: SearchEventEntity[];
  protected pathname: string;
  protected widgetIdentifier: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;

  /**
   * Creates a search widget view event.
   * @param widgetViewEventParams - An object with the widget view events params {@link WidgetViewEventParams}
   */
  constructor({ request, entities, pathname, widgetId, page, currency, language, channel }: WidgetViewEventParams) {
    this._validate(currency, language);

    this.entities = entities;
    this.page = page;
    this.request = request;
    this.pathname = pathname;
    this.widgetIdentifier = widgetId;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

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
          context: {
            page: {
              uri: this.pathname
            }
          },
          entities: entitiesDTO,
          request: requestDTO,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_VIEW'
    };
  }
}
