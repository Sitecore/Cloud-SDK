// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { ErrorMessages } from '../consts';
import type { WidgetNavigationClickEventParams } from './interfaces';

export class WidgetNavigationClickEvent {
  protected itemPosition: number;
  protected pathname: string;
  protected widgetIdentifier: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;
  /**
   * Creates a search widget navigation event.
   * @param widgetNavigationClickEventParams - an object containing navigation click params
   *   {@link WidgetNavigationClickEventParams}
   */
  constructor({
    itemPosition,
    pathname,
    widgetId,
    page,
    currency,
    language,
    channel
  }: WidgetNavigationClickEventParams) {
    this._validate(currency, language);
    this.itemPosition = itemPosition;
    this.page = page;
    this.pathname = pathname;
    this.widgetIdentifier = widgetId;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
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
   * @returns map of WidgetNavigationClickEvent in its DTO format.
   */
  toDTO() {
    return {
      channel: this.channel,
      currency: this.currency,
      language: this.language,
      page: this.page,
      searchData: {
        action_cause: 'navigation',
        value: {
          context: {
            page: {
              uri: this.pathname
            }
          },
          index: this.itemPosition,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    };
  }
}
