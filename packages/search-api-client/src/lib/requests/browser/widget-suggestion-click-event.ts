// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/browser';
import type { WidgetSuggestionClickEventParams } from '../../events/interfaces';
import { WidgetSuggestionClickEvent } from '../../events/widget-suggestion-click-event';
import { awaitInit } from '../../initializer/browser/initializer';

/**
 * This function sends a suggestion click event from browser.
 * @param widgetSuggestionClickEventParams - An object containing widget click event params
 * from {@link WidgetSuggestionClickEventParams}
 */
export async function widgetSuggestionClick(widgetSuggestionClickEventParams: WidgetSuggestionClickEventParams) {
  await awaitInit();

  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  return await event(widgetSuggestionClickEventDTO);
}
