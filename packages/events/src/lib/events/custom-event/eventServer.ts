// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import {
  EPResponse,
  getBrowserIdFromRequest,
  getSettingsServer,
  handleGetSettingsError,
} from '@sitecore-cloudsdk/core';
import { EventData, CustomEvent } from './custom-event';
import { Request } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';
import { ErrorMessages } from '../../consts';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 *
 * @param request - Interface with constraint for extending request
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function eventServer<T extends Request>(request: T, eventData: EventData): Promise<EPResponse | null> {
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0005);
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);

  return new CustomEvent({
    eventData,
    id,
    sendEvent,
    settings,
  }).send();
}
