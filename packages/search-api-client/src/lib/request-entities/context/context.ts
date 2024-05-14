// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Campaign, ContextDTO, ContextData, LocaleData, PageData, StoreData } from './interfaces';
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
  private _campaign?: Campaign;

  constructor(context: ContextData) {
    this.locale = context.locale;
    this.page = context.page;
    this.store = context.store;

    this._validateContext();
  }

  /**
   * Sets the campaign data.
   * @param campaign - The new value to set.
   *
   */
  set campaign(campaign: Campaign) {
    this._campaign = campaign;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeCampaign() {
    this._campaign = undefined;
  }

  /**
   * Validate context object.
   */
  private _validateContext(): void {
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
    /* eslint-disable @typescript-eslint/naming-convention */
    const dto: ContextDTO = {
      locale: this.locale,
      page: this.page,
      store: {
        group_id: this.store && this.store.groupId,
        id: this.store && this.store.id
      }
    };

    if (this._campaign)
      dto.campaign = {
        utm_campaign: this._campaign.campaign,
        utm_content: this._campaign.content,
        utm_medium: this._campaign.medium,
        utm_source: this._campaign.source,
        utm_term: this._campaign.term
      };
    /* eslint-enable @typescript-eslint/naming-convention */

    return dto;
  }
}
