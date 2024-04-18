// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getBrowserIdFromRequest, getSettingsServer, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import type { EPResponse } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../../consts';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';
import type { Request } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';

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
    settings: settings
  }).send();
}
