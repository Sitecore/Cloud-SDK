// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import { PACKAGE_NAME } from '../../consts';
import type { ServerSettings } from '../../types';
import { WidgetFacetClickEvent } from '../../events/widget-facet-click-event';
import type { WidgetFacetClickEventParams } from '../../events/interfaces';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
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
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetFacetClickEventDTO = new WidgetFacetClickEvent(widgetFacetClickEventParams).toDTO();

  return await event(httpRequest, widgetFacetClickEventDTO);
}
