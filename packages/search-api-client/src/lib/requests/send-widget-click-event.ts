// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core';
import type { WidgetClickEventParams } from '../events/interfaces';
import { WidgetItemEvent } from '../events/widget-item-event';
import { awaitInit } from '../initializer/browser/initializer';

/**
 * This function sends a widget click event from browser.
 * @param widgetClickEventParams - An object containing widget click event params from {@link WidgetClickEventParams}
 */
export async function sendWidgetClickEvent(widgetClickEventParams: WidgetClickEventParams) {
  const widgetClickEventDTO = new WidgetItemEvent(widgetClickEventParams).toDTO();

  await awaitInit();
  await initEvents({} as BrowserSettings);
  await event(widgetClickEventDTO);
}
