// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { ConversionEvent } from '../../events/conversion-event';
import type { ConversionEventParams } from '../../events/interfaces';
import { PACKAGE_NAME } from '../../consts';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a conversion event from browser.
 * @param conversionEventParams - An object containing conversion event params from {@link ConversionEventParams}
 */
export async function sendConversionEvent(conversionEventParams: ConversionEventParams) {
  await awaitInit();

  const conversionEventDTO = new ConversionEvent(conversionEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  return await event(conversionEventDTO);
}
