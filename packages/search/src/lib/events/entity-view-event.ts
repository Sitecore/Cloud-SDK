// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { BaseSearchEvent } from './base-widget-event';
import type { EntityViewEventParams, SearchEventEntity, SearchEventEntityDTO } from './interfaces';

export class EntityViewEvent extends BaseSearchEvent {
  protected entity: SearchEventEntity;

  /**
   * Creates an entity view event.
   * @param entityViewEventParams - {@link EntityViewEventParams} An object with the entity view event params
   */
  constructor({ entity, ...rest }: EntityViewEventParams) {
    super(rest);
    this.entity = entity;
  }

  /**
   *
   * @returns - map of EntityViewEvent in its DTO format.
   */
  toDTO() {
    const eventEntityDTO: SearchEventEntityDTO = {
      attributes: this.entity.attributes,
      entity_subtype: this.entity.entityType,
      entity_type: this.entity.entity,
      id: this.entity.id,
      source_id: this.entity.sourceId,
      uri: this.entity.uri
    };

    return {
      currency: this.currency,
      language: this.language,
      page: this.page,
      searchData: {
        value: {
          ...this._searchContextToDTO(),
          entities: [eventEntityDTO]
        }
      } as unknown as NestedObject,
      type: 'VIEW'
    };
  }
}
