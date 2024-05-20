// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { CampaignData, ContextDTO, ContextData, LocaleData, PageData, StoreData } from './interfaces';
import { ErrorMessages } from '../../const';
import { isValidHttpURL } from '@sitecore-cloudsdk/utils';

/**
 * Create context object.
 * @param context - The context object.
 * @returns the validated and mapped context object
 */
export class Context {
  private _campaign?: CampaignData;
  private _locale?: LocaleData;
  private _page?: PageData;
  private _store?: StoreData;

  /**
   * @param context - The context object.
   * @returns the validated and mapped context object
   */
  constructor(context: ContextData) {
    this._validateContext(context);

    this._campaign = context.campaign;
    this._locale = context.locale;
    this._page = context.page;
    this._store = context.store;
  }

  /**
   * Sets the locale data.
   * @param locale - The new value to set.
   *
   */
  set locale(locale: LocaleData) {
    this._validateContextLocale(locale);

    this._locale = locale;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeLocale() {
    this._locale = undefined;
  }

  /**
   * Sets the campaign data.
   * @param campaign - The new value to set.
   *
   */
  set campaign(campaign: CampaignData) {
    this._campaign = campaign;
  }

  /**
   * Sets the campaign data to undefined
   */
  removeCampaign() {
    this._campaign = undefined;
  }

  /**
   * Validate context locale object.
   */
  private _validateContextLocale(locale?: LocaleData): void {
    if (!locale) return;

    if (locale.country.length !== 2) throw new Error(ErrorMessages.MV_0006);
    if (locale.language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

  /**
   * Validate context object.
   */
  private _validateContext(context: ContextData): void {
    this._validateContextLocale(context.locale);

    if (
      context.page &&
      context.page.custom &&
      ((Object.keys(context.page.custom).length && (!context.page.uri || !isValidHttpURL(context.page.uri))) ||
        (!Object.keys(context.page.custom).length && context.page.uri && isValidHttpURL(context.page.uri)))
    )
      throw new Error(ErrorMessages.MV_0008);

    if (context.store && ((context.store.groupId && !context.store.id) || (!context.store.groupId && context.store.id)))
      throw new Error(ErrorMessages.MV_0009);
  }

  /**
   * Map context object to DTO.
   * @returns The DTO representation of the filter.
   */
  toDTO(): ContextDTO {
    /* eslint-disable @typescript-eslint/naming-convention */
    const dto: ContextDTO = {
      locale: this._locale,
      page: this._page,
      store: {
        group_id: this._store && this._store.groupId,
        id: this._store && this._store.id
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
