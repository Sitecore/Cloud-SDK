// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/browser';
import type { WidgetFacetClickEventParams } from '../../events/interfaces';
import { WidgetFacetClickEvent } from '../../events/widget-facet-click-event';
import { awaitInit } from '../../initializer/browser/initializer';

/**
 * This function sends a widget facet click event from browser.
 * @param widgetFacetClickEventParams - An object containing widget facet click event params
 * from {@link WidgetFacetClickEventParams}
 */
export async function widgetFacetClick(widgetFacetClickEventParams: WidgetFacetClickEventParams) {
  await awaitInit();

  const widgetFacetClickEventDTO = new WidgetFacetClickEvent(widgetFacetClickEventParams).toDTO();

  return await event(widgetFacetClickEventDTO);
}
