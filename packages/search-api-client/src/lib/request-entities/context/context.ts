// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ContextDTO, ContextData, LocaleData, PageData, StoreData } from './interfaces';
import { ErrorMessages } from '../../const';
import { isValidHttpURL } from '@sitecore-cloudsdk/utils';

/**
 * Create context object.
 * @param context - The context object.
 * @returns the validated and mapped context object
 */
export class Context {
  locale?: LocaleData;
  page?: PageData;
  store?: StoreData;

  constructor(context: ContextData) {
    this.locale = context.locale;
    this.page = context.page;
    this.store = context.store;

    this.validateContext();
  }

  /**
   * Validate context object.
   */
  private validateContext(): void {
    if (
      this.locale &&
      ((this.locale.country && !this.locale.language) || (!this.locale.country && this.locale.language))
    )
      throw new Error(ErrorMessages.MV_0006);

    if (
      this.page &&
      this.page.custom &&
      ((Object.keys(this.page.custom).length && (!this.page.uri || !isValidHttpURL(this.page.uri))) ||
        (!Object.keys(this.page.custom).length && this.page.uri && isValidHttpURL(this.page.uri)))
    )
      throw new Error(ErrorMessages.MV_0007);

    if (this.store && ((this.store.groupId && !this.store.id) || (!this.store.groupId && this.store.id)))
      throw new Error(ErrorMessages.MV_0008);
  }

  /**
   * Map context object to DTO.
   */
  toDTO(): ContextDTO {
    return {
      locale: this.locale,
      page: this.page,
      store: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        group_id: this.store && this.store.groupId,
        id: this.store && this.store.id
      }
    };
  }
}
