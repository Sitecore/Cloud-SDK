// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../const';
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import type { WidgetNavigationEventParams } from './interfaces';

export class WidgetNavigationEvent {
  protected itemPosition: number;
  protected pathname: string;
  protected widgetIdentifier: string;
  protected page?: string;
  protected currency?: string;
  protected language?: string;
  protected channel?: string;
  /**
   * Creates a search widget navigation event.
   * @param itemPosition - Position of the item that was clicked.
   * @param pathname - Current uri of the page.
   * @param widgetIdentifier - Unique ID of a widget.
   * @param page - A string that identifies the page.
   * @param currency - Three-letter currency code of the location-specific website in the ISO 42178 format.
   * @param language - Two-letter language code in the ISO 639-1 format.
   * @param channel - The touchpoint where the user interacts.
   */
  constructor({
    itemPosition,
    pathname,
    widgetIdentifier,
    page,
    currency,
    language,
    channel
  }: WidgetNavigationEventParams) {
    this._validate(currency, language);
    this.itemPosition = itemPosition;
    this.page = page;
    this.pathname = pathname;
    this.widgetIdentifier = widgetIdentifier;
    this.currency = currency;
    this.language = language;
    this.channel = channel;
  }

  private _validate(currency?: string, language?: string) {
    if (currency !== undefined && currency.length !== 3) throw new Error(ErrorMessages.IV_0015);
    if (language !== undefined && language.length !== 2) throw new Error(ErrorMessages.MV_0007);
  }

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
