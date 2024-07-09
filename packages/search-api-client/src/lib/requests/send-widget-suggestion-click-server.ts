// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request } from '@sitecore-cloudsdk/utils';
import { WidgetSuggestionClickEvent } from '../events/widget-suggestion-click-event';
import type { WidgetSuggestionClickEventParams } from '../events/interfaces';
import { event } from '@sitecore-cloudsdk/events/server';

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
  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  return await event(httpRequest, widgetSuggestionClickEventDTO);
}
