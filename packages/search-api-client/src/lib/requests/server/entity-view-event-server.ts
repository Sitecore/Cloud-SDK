// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import { EntityViewEvent } from '../../events/entity-view-event';
import type { EntityViewEventParams } from '../../events/interfaces';
import { PACKAGE_NAME } from '../../consts';
import type { ServerSettings } from '../../types';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends an entity view event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param entityViewEventParams - An object containing conversion event params from {@link EntityViewEventParams}
 */
export async function entityViewServer(httpRequest: Request, entityViewEventParams: EntityViewEventParams) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const conversionEventDTO = new EntityViewEvent(entityViewEventParams).toDTO();

  return await event(httpRequest, conversionEventDTO);
}
