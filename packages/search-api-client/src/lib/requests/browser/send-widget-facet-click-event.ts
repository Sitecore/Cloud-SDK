// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { PACKAGE_NAME } from '../../consts';
import { WidgetFacetClickEvent } from '../../events/widget-facet-click-event';
import type { WidgetFacetClickEventParams } from '../../events/interfaces';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a widget facet click event from browser.
 * @param widgetFacetClickEventParams - An object containing widget facet click event params
 * from {@link WidgetFacetClickEventParams}
 */
export async function sendWidgetFacetClickEvent(widgetFacetClickEventParams: WidgetFacetClickEventParams) {
  await awaitInit();

  const widgetFacetClickEventDTO = new WidgetFacetClickEvent(widgetFacetClickEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  return await event(widgetFacetClickEventDTO);
}
