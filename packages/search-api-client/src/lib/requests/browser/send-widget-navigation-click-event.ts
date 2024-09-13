// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { PACKAGE_NAME } from '../../consts';
import { WidgetNavigationEvent } from '../../events/widget-navigation-event';
import type { WidgetNavigationEventParams } from '../../events/interfaces';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a widget navigation click event from browser.
 * @param widgetClickEventParams - An object containing widget navigation click event
 * params from {@link WidgetNavigationEventParams}
 */
export async function sendWidgetNavigationClickEvent(widgetNavigationEventParams: WidgetNavigationEventParams) {
  await awaitInit();

  const widgetNavigationEventDTO = new WidgetNavigationEvent(widgetNavigationEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  await event(widgetNavigationEventDTO);
}
