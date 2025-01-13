// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/browser';
import type { WidgetItemClickEventParams } from '../../events/interfaces';
import { WidgetItemClickEvent } from '../../events/widget-item-click-event';
import { awaitInit } from '../../initializer/browser/initializer';

/**
 * This function sends a widget click event from browser.
 * @param widgetItemClickEventParams - An object containing widget click event params
 * from {@link WidgetItemClickEventParams}
 */
export async function widgetItemClick(widgetItemClickEventParams: WidgetItemClickEventParams) {
  await awaitInit();

  const widgetClickEventDTO = new WidgetItemClickEvent(widgetItemClickEventParams).toDTO();

  await event(widgetClickEventDTO);
}
