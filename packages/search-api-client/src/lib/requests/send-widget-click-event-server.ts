// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { ServerSettings } from '@sitecore-cloudsdk/core';
import type { WidgetClickEventParams } from '../events/interfaces';
import { WidgetItemEvent } from '../events/widget-item-event';

/**
 * This function sends a widget click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetClickEventParams - An object containing widget click event params from {@link WidgetClickEventParams}
 */
export async function sendWidgetClickEventServer(httpRequest: Request, widgetClickEventParams: WidgetClickEventParams) {
  const widgetClickEventDTO = new WidgetItemEvent(widgetClickEventParams).toDTO();

  await initEvents({} as Request, {} as Response, {} as ServerSettings);

  await event(httpRequest, widgetClickEventDTO);
}
