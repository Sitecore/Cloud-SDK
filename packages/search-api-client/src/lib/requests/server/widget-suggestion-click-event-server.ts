// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetSuggestionClickEventParams } from '../../events/interfaces';
import { WidgetSuggestionClickEvent } from '../../events/widget-suggestion-click-event';
import type { ServerSettings } from '../../types';

/**
 * This function sends a suggestion click event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param widgetSuggestionClickEventParams - An object containing widget click event params
 * from {@link WidgetSuggestionClickEventParams}
 */
export async function widgetSuggestionClickServer(
  httpRequest: Request,
  widgetSuggestionClickEventParams: WidgetSuggestionClickEventParams
) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  return await event(httpRequest, widgetSuggestionClickEventDTO);
}
