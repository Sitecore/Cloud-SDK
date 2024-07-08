// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { ServerSettings } from '@sitecore-cloudsdk/core';
import { WidgetNavigationEvent } from '../events/widget-navigation-event';
import type { WidgetNavigationEventParams } from '../events/interfaces';

/**
 * This function sends a widget navigation click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetNavigationEventParams - An object containing widget click event params
 * from {@link WidgetNavigationEventParams}
 */

export async function sendWidgetNavigationClickEventServer(
  httpRequest: Request,
  widgetNavigationEventParams: WidgetNavigationEventParams
) {
  const widgetClickEventDTO = new WidgetNavigationEvent(widgetNavigationEventParams).toDTO();

  await initEvents({} as Request, {} as Response, {} as ServerSettings);

  await event(httpRequest, widgetClickEventDTO);
}
