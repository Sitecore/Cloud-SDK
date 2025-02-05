// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type { EntityViewEventParams, SearchEventEntity, SearchEventEntityDTO } from './interfaces';

export class EntityViewEvent {
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected pathname: string;
  protected entity: SearchEventEntity;

  /**
   * Creates an entity view event.
   * @param entityViewEventParams - {@link EntityViewEventParams} An object with the entity view event params
   */
  constructor({ page, currency, language, pathname, entity }: EntityViewEventParams) {
    this._validate(currency, language);

    this.page = page;
    this.currency = currency;
    this.language = language;
    this.pathname = pathname;
    this.entity = entity;
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
          context: {
            page: {
              uri: this.pathname
            }
          },
          entities: [eventEntityDTO]
        }
      } as unknown as NestedObject,
      type: 'VIEW'
    };
  }
}
