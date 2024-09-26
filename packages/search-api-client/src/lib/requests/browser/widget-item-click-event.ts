// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetItemClickEventParams } from '../../events/interfaces';
import { WidgetItemClickEvent } from '../../events/widget-item-click-event';
import { awaitInit } from '../../init/browser/initializer';

/**
 * This function sends a widget click event from browser.
 * @param widgetItemClickEventParams - An object containing widget click event params
 * from {@link WidgetItemClickEventParams}
 */
export async function widgetItemClick(widgetItemClickEventParams: WidgetItemClickEventParams) {
  await awaitInit();

  const widgetClickEventDTO = new WidgetItemClickEvent(widgetItemClickEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  await event(widgetClickEventDTO);
}
