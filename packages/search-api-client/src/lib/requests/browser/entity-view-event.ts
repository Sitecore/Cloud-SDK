// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/browser';
import { EntityViewEvent } from '../../events/entity-view-event';
import type { EntityViewEventParams } from '../../events/interfaces';
import { awaitInit } from '../../initializer/browser/initializer';

/**
 * This function sends an entity view event from browser.
 * @param entityViewEventParams - An object containing conversion event params from {@link EntityViewEventParams}
 */
export async function entityView(entityViewEventParams: EntityViewEventParams) {
  await awaitInit();

  const conversionEventDTO = new EntityViewEvent(entityViewEventParams).toDTO();

  return await event(conversionEventDTO);
}
