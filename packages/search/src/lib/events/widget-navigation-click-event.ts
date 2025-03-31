// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { NestedObject } from '@sitecore-cloudsdk/utils';
import { BaseSearchEvent } from './base-widget-event';
import type { WidgetNavigationClickEventParams } from './interfaces';

export class WidgetNavigationClickEvent extends BaseSearchEvent {
  protected itemPosition: number;
  protected widgetIdentifier: string;
  /**
   * Creates a search widget navigation event.
   * @param widgetNavigationClickEventParams - an object containing navigation click params
   *   {@link WidgetNavigationClickEventParams}
   */
  constructor({ itemPosition, widgetId, ...rest }: WidgetNavigationClickEventParams) {
    super(rest);
    this.itemPosition = itemPosition;
    this.widgetIdentifier = widgetId;
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
          ...this._searchContextToDTO(),
          index: this.itemPosition,
          rfk_id: this.widgetIdentifier
        }
      } as unknown as NestedObject,
      type: 'SC_SEARCH_WIDGET_NAVIGATION_CLICK'
    };
  }
}
