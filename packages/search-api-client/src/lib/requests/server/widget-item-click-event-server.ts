// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { ServerSettings } from '@sitecore-cloudsdk/core/internal';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetItemClickEventParams } from '../../events/interfaces';
import { WidgetItemClickEvent } from '../../events/widget-item-click-event';

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
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetClickEventDTO = new WidgetItemClickEvent(widgetItemClickEventParams).toDTO();

  return await event(httpRequest, widgetClickEventDTO);
}
