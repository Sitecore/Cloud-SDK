// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core';
import { WidgetSuggestionClickEvent } from '../events/widget-suggestion-click-event';
import type { WidgetSuggestionClickEventParams } from '../events/interfaces';
import { awaitInit } from '../initializer/browser/initializer';

/**
 * This function sends a suggestion click event from browser.
 * @param widgetSuggestionClickEventParams - An object containing widget click event params
 * from {@link WidgetSuggestionClickEventParams}
 */
export async function sendWidgetSuggestionClickEvent(
  widgetSuggestionClickEventParams: WidgetSuggestionClickEventParams
) {
  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  await awaitInit();
  await initEvents({} as BrowserSettings);
  return await event(widgetSuggestionClickEventDTO);
}
