// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event, init as initEvents } from '@sitecore-cloudsdk/events/browser';
import type { BrowserSettings } from '@sitecore-cloudsdk/core/internal';
import { EntityViewEvent } from '../../events/entity-view-event';
import type { EntityViewEventParams } from '../../events/interfaces';
import { PACKAGE_NAME } from '../../consts';
import { awaitInit } from '../../init/browser/initializer';
import { getEnabledPackageBrowser as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends an entity view event from browser.
 * @param entityViewEventParams - An object containing conversion event params from {@link EntityViewEventParams}
 */
export async function entityView(entityViewEventParams: EntityViewEventParams) {
  await awaitInit();

  const conversionEventDTO = new EntityViewEvent(entityViewEventParams).toDTO();

  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as BrowserSettings);

  return await event(conversionEventDTO);
}
