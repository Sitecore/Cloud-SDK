// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core';
import { ConversionEvent } from '../events/conversion-event';
import type { ConvertionEventParams } from '../events/interfaces';
import { awaitInit } from '../initializer/browser/initializer';

/**
 * This function sends a conversion event from browser.
 * @param convertionEventParams - An object containing conversion event params from {@link ConvertionEventParams}
 */
export async function sendConversionEvent(convertionEventParams: ConvertionEventParams) {
  const conversionEventDTO = new ConversionEvent(convertionEventParams).toDTO();

  await awaitInit();
  await initEvents({} as BrowserSettings);
  return await event(conversionEventDTO);
}
