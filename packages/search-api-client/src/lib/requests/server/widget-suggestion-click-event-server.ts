// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import type { WidgetSuggestionClickEventParams } from '../../events/interfaces';
import { WidgetSuggestionClickEvent } from '../../events/widget-suggestion-click-event';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';

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
  verifySearchPackageExistence();

  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  return await event(httpRequest, widgetSuggestionClickEventDTO);
}
