// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetClickEventParams } from '../../events/interfaces';
import { WidgetItemEvent } from '../../events/widget-item-event';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a widget click event from browser.
 * @param widgetClickEventParams - An object containing widget click event params from {@link WidgetClickEventParams}
 */
export async function sendWidgetClickEvent(widgetClickEventParams: WidgetClickEventParams) {
  await awaitInit();

  const widgetClickEventDTO = new WidgetItemEvent(widgetClickEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  await event(widgetClickEventDTO);
}
