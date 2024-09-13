// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import { PACKAGE_NAME } from '../../consts';
import type { ServerSettings } from '../../types';
import { WidgetSuggestionClickEvent } from '../../events/widget-suggestion-click-event';
import type { WidgetSuggestionClickEventParams } from '../../events/interfaces';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a suggestion click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetSuggestionClickEventParams - An object containing widget click event params
 * from {@link WidgetSuggestionClickEventParams}
 */
export async function sendWidgetSuggestionClickEventServer(
  httpRequest: Request,
  widgetSuggestionClickEventParams: WidgetSuggestionClickEventParams
) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  return await event(httpRequest, widgetSuggestionClickEventDTO);
}
