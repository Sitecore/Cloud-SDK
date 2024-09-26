// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ServerSettings } from '@sitecore-cloudsdk/core/internal';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetNavigationEventParams } from '../../events/interfaces';
import { WidgetNavigationEvent } from '../../events/widget-navigation-event';

/**
 * This function sends a widget navigation click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetNavigationEventParams - An object containing widget click event params
 * from {@link WidgetNavigationEventParams}
 */

export async function widgetNavigationClickServer(
  httpRequest: Request,
  widgetNavigationEventParams: WidgetNavigationEventParams
) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetClickEventDTO = new WidgetNavigationEvent(widgetNavigationEventParams).toDTO();

  return await event(httpRequest, widgetClickEventDTO);
}
