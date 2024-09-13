// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { PACKAGE_NAME } from '../../consts';
import { WidgetViewEvent } from '../../events/widget-view-event';
import type { WidgetViewEventParams } from '../../events/interfaces';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a widget view event from browser.
 * @param widgetViewEventParams - An object containing widget view event params from {@link WidgetViewEventParams}
 */
export async function widgetView(widgetViewEventParams: WidgetViewEventParams) {
  await awaitInit();

  const widgetViewEventDTO = new WidgetViewEvent(widgetViewEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  await event(widgetViewEventDTO);
}
