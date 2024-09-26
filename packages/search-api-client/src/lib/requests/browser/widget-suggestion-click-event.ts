// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import { PACKAGE_NAME } from '../../consts';
import type { WidgetSuggestionClickEventParams } from '../../events/interfaces';
import { WidgetSuggestionClickEvent } from '../../events/widget-suggestion-click-event';
import { awaitInit } from '../../init/browser/initializer';

/**
 * This function sends a suggestion click event from browser.
 * @param widgetSuggestionClickEventParams - An object containing widget click event params
 * from {@link WidgetSuggestionClickEventParams}
 */
export async function widgetSuggestionClick(widgetSuggestionClickEventParams: WidgetSuggestionClickEventParams) {
  await awaitInit();

  const widgetSuggestionClickEventDTO = new WidgetSuggestionClickEvent(widgetSuggestionClickEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  return await event(widgetSuggestionClickEventDTO);
}
