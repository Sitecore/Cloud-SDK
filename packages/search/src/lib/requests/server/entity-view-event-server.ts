// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { event } from '@sitecore-cloudsdk/events/server';
import type { Request } from '@sitecore-cloudsdk/utils';
import { EntityViewEvent } from '../../events/entity-view-event';
import type { EntityViewEventParams } from '../../events/interfaces';
import { verifySearchPackageExistence } from '../../initializer/server/initializer';

/**
 * This function sends an entity view event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param entityViewEventParams - An object containing conversion event params from {@link EntityViewEventParams}
 */
export async function entityViewServer(httpRequest: Request, entityViewEventParams: EntityViewEventParams) {
  verifySearchPackageExistence();

  const conversionEventDTO = new EntityViewEvent(entityViewEventParams).toDTO();

  return await event(httpRequest, conversionEventDTO);
}
