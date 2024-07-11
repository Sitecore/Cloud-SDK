// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core';
import { WidgetViewEvent } from '../events/widget-view-event';
import type { WidgetViewEventParams } from '../events/interfaces';
import { awaitInit } from '../initializer/browser/initializer';

/**
 * This function sends a widget view event from browser.
 * @param widgetViewEventParams - An object containing widget view event params from {@link WidgetViewEventParams}
 */
export async function widgetView(widgetViewEventParams: WidgetViewEventParams) {
  const widgetViewEventDTO = new WidgetViewEvent(widgetViewEventParams).toDTO();

  await awaitInit();
  await initEvents({} as BrowserSettings);
  await event(widgetViewEventDTO);
}
