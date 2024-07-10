// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ConversionEvent } from '../events/conversion-event';
import type { ConvertionEventParams } from '../events/interfaces';
import type { Request } from '@sitecore-cloudsdk/utils';
import { event } from '@sitecore-cloudsdk/events/server';

/**
 * This function sends a conversion event from server.
 * @param httpRequest - An  http request object. Either HttpRequest or MiddlewareRequest.
 * @param convertionEventParams - An object containing conversion event params from {@link ConvertionEventParams}
 */
export async function sendConversionEventServer(httpRequest: Request, convertionEventParams: ConvertionEventParams) {
  const conversionEventDTO = new ConversionEvent(convertionEventParams).toDTO();

  return await event(httpRequest, conversionEventDTO);
}
