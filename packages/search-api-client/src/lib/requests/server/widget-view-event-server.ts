// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetViewEventParams } from '../../events/interfaces';
import { WidgetViewEvent } from '../../events/widget-view-event';
import type { ServerSettings } from '../../types';

/**
 * This function sends a widget view event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetViewEventParams - An object containing widget view event params
 * from {@link WidgetViewEventParams}
 */
export async function widgetViewServer(httpRequest: Request, widgetViewEventParams: WidgetViewEventParams) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetViewEventDTO = new WidgetViewEvent(widgetViewEventParams).toDTO();

  return await event(httpRequest, widgetViewEventDTO);
}
