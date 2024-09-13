// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { Request, Response } from '@sitecore-cloudsdk/utils';
import { event, init as initEvents } from '@sitecore-cloudsdk/events/server';
import { ConversionEvent } from '../../events/conversion-event';
import type { ConversionEventParams } from '../../events/interfaces';
import { PACKAGE_NAME } from '../../consts';
import type { ServerSettings } from '../../types';
import { getEnabledPackageServer as getEnabledPackage } from '@sitecore-cloudsdk/core/internal';

/**
 * This function sends a conversion event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param conversionEventParams - An object containing conversion event params from {@link ConversionEventParams}
 */
export async function sendConversionEventServer(httpRequest: Request, conversionEventParams: ConversionEventParams) {
  if (!getEnabledPackage(PACKAGE_NAME)) await initEvents({} as Request, {} as Response, {} as ServerSettings);

  const conversionEventDTO = new ConversionEvent(conversionEventParams).toDTO();

  return await event(httpRequest, conversionEventDTO);
}
