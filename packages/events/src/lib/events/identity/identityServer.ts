// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { Request } from '@sitecore-cloudsdk/utils';
import {
  EPResponse,
  getBrowserIdFromRequest,
  getSettingsServer,
  handleGetSettingsError,
} from '@sitecore-cloudsdk/core';
import { IdentityData, IdentityEvent } from './identity-event';
import { sendEvent } from '../send-event/sendEvent';
import { ErrorMessages } from '../../consts';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 *
 * @param request - Interface with constraint for extending request
 * @param identityData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export function identityServer(request: Request, identityData: IdentityData): Promise<EPResponse | null> {
  const settings = handleGetSettingsError(getSettingsServer, ErrorMessages.IE_0005);
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);

  return new IdentityEvent({
    id,
    identityData,
    sendEvent,
    settings: settings,
  }).send();
}
