// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ConversionEventParams, SearchEventEntity, SearchEventEntityDTO } from './interfaces';
import { ErrorMessages } from '../consts';
import type { NestedObject } from '@sitecore-cloudsdk/utils';

export class ConversionEvent {
  protected page: string;
  protected currency: string;
  protected language: string;
  protected pathname: string;
  protected entity: SearchEventEntity;

  /**
   * Creates a conversion event.
   * @param page - A string that identifies the page.
   * @param currency - Three-letter currency code of the location-specific website in the ISO 42178 format.
   * @param language - Two-letter language code in the ISO 639-1 format.
   * @param pathname - Current uri of the page.
   * @param entity - An object containing entity information.
   */
  constructor({ page, currency, language, pathname, entity }: ConversionEventParams) {
    this._validate(currency, language);

    this.page = page;
    this.currency = currency;
    this.language = language;
    this.pathname = pathname;
    this.entity = entity;
  }

  private _validate(currency: string, language: string) {
    if (currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

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
        action_sub_type: 'conversion',
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
