// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request } from '@sitecore-cloudsdk/utils';
import { WidgetFacetClickEvent } from '../events/widget-facet-click-event';
import type { WidgetFacetClickEventParams } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';

/**
 * This function sends a widget facet click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetFacetClickEventParams - An object containing widget facet click event params
 * from {@link WidgetFacetClickEventParams}
 */
export async function sendWidgetFacetClickEventServer(
  httpRequest: Request,
  widgetFacetClickEventParams: WidgetFacetClickEventParams
) {
  const widgetFacetClickEventDTO = new WidgetFacetClickEvent(widgetFacetClickEventParams).toDTO();

  return await event(httpRequest, widgetFacetClickEventDTO);
}
