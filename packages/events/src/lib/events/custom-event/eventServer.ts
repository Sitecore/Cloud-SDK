// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getCookieValueFromRequest, getSettingsServer, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { CustomEvent } from './custom-event';
import type { EPResponse } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../../consts';
import type { EventData } from './custom-event';
import type { Request } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 *
 * @param request - Interface with constraint for extending request
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function eventServer<T extends Request>(request: T, eventData: EventData): Promise<EPResponse | null> {
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0005);
  const id = getCookieValueFromRequest(request, settings.cookieSettings.cookieName);

  return new CustomEvent({
    eventData,
    id,
    sendEvent,
    settings
  }).send();
}
