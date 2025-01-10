// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import type { WidgetNavigationClickEventParams } from '../../events/interfaces';
import { WidgetNavigationClickEvent } from '../../events/widget-navigation-click-event';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';

/**
 * This function sends a widget navigation click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param WidgetNavigationClickEventParams - An object containing widget click event params
 * from {@link WidgetNavigationClickEventParams}
 */

export async function widgetNavigationClickServer(
  httpRequest: Request,
  widgetNavigationClickEventParams: WidgetNavigationClickEventParams
) {
  verifySearchPackageExistence();

  const widgetClickEventDTO = new WidgetNavigationClickEvent(widgetNavigationClickEventParams).toDTO();

  return await event(httpRequest, widgetClickEventDTO);
}
