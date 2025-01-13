// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/browser';
import type { WidgetNavigationClickEventParams } from '../../events/interfaces';
import { WidgetNavigationClickEvent } from '../../events/widget-navigation-click-event';
import { awaitInit } from '../../initializer/browser/initializer';

/**
 * This function sends a widget navigation click event from browser.
 * @param widgetNavigationClickEventParams - An object containing widget navigation click event
 * params from {@link WidgetNavigationClickEventParams}
 */
export async function widgetNavigationClick(widgetNavigationClickEventParams: WidgetNavigationClickEventParams) {
  await awaitInit();

  const widgetNavigationClickEventDTO = new WidgetNavigationClickEvent(widgetNavigationClickEventParams).toDTO();

  await event(widgetNavigationClickEventDTO);
}
