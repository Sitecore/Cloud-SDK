// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetNavigationClickEventParams } from '../../events/interfaces';
import { WidgetNavigationClickEvent } from '../../events/widget-navigation-click-event';
import { awaitInit } from '../../init/browser/initializer';

/**
 * This function sends a widget navigation click event from browser.
 * @param widgetNavigationClickEventParams - An object containing widget navigation click event
 * params from {@link WidgetNavigationClickEventParams}
 */
export async function widgetNavigationClick(widgetNavigationClickEventParams: WidgetNavigationClickEventParams) {
  await awaitInit();

  const widgetNavigationClickEventDTO = new WidgetNavigationClickEvent(widgetNavigationClickEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  await event(widgetNavigationClickEventDTO);
}
