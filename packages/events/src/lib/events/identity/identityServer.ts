// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ExtensionData } from '../common-interfaces';
import { Request } from '@sitecore-cloudsdk/utils';
import { EPResponse, getBrowserIdFromRequest } from '@sitecore-cloudsdk/core';
import { getServerDependencies } from '../../initializer/server/initializer';
import { IdentityEventAttributesInput, IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param request - Interface with constraint for extending request
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export function identityServer(
  eventData: IdentityEventAttributesInput,
  request: Request,
  extensionData?: ExtensionData
): Promise<EPResponse | null> {
  const { eventApiClient, settings } = getServerDependencies();
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  return new IdentityEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    settings: settings,
  }).send();
}
