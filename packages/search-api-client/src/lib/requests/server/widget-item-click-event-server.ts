// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import type { WidgetItemClickEventParams } from '../../events/interfaces';
import { WidgetItemClickEvent } from '../../events/widget-item-click-event';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';

/**
 * This function sends a widget click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetItemClickEventParams - An object containing widget click event params
 * from {@link WidgetItemClickEventParams}
 */
export async function widgetItemClickServer(
  httpRequest: Request,
  widgetItemClickEventParams: WidgetItemClickEventParams
) {
  verifySearchPackageExistence();

  const widgetClickEventDTO = new WidgetItemClickEvent(widgetItemClickEventParams).toDTO();

  return await event(httpRequest, widgetClickEventDTO);
}
