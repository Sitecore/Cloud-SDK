// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import type { WidgetFacetClickEventParams } from '../../events/interfaces';
import { WidgetFacetClickEvent } from '../../events/widget-facet-click-event';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';

/**
 * This function sends a widget facet click event from server.
 * @param httpRequest - An  http {@link Request} object. Either HttpRequest or MiddlewareRequest.
 * @param widgetFacetClickEventParams - An object containing widget facet click event params
 * from {@link WidgetFacetClickEventParams}
 */
export async function widgetFacetClickServer(
  httpRequest: Request,
  widgetFacetClickEventParams: WidgetFacetClickEventParams
) {
  verifySearchPackageExistence();

  const widgetFacetClickEventDTO = new WidgetFacetClickEvent(widgetFacetClickEventParams).toDTO();

  return await event(httpRequest, widgetFacetClickEventDTO);
}
