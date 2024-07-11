// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request } from '@sitecore-cloudsdk/utils';
import { WidgetViewEvent } from '../events/widget-view-event';
import type { WidgetViewEventParams } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';

/**
 * This function sends a widget view event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetViewEventParams - An object containing widget view event params
 * from {@link WidgetViewEventParams}
 */
export async function widgetViewServer(httpRequest: Request, widgetViewEventParams: WidgetViewEventParams) {
  const widgetViewEventDTO = new WidgetViewEvent(widgetViewEventParams).toDTO();

  return await event(httpRequest, widgetViewEventDTO);
}
