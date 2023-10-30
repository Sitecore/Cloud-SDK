// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ICdpResponse, getBrowserIdFromRequest } from '@sitecore-cloudsdk/engage-core';
import { ExtensionData } from '../common-interfaces';
import { ICustomEventInput, CustomEvent } from './custom-event';
import { getServerDependencies } from '../../initializer/server/initializer';
import { TRequest } from '@sitecore-cloudsdk/engage-utils';
/**
 * A function that sends an event to SitecoreCloud API with the specified type
 * @param type - The required type of the event
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param request - Interface with constraint for extending request
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * @returns The response object that Sitecore CDP returns
 */
export function eventServer<T extends TRequest>(
  type: string,
  eventData: ICustomEventInput,
  request: T,
  extensionData?: ExtensionData
): Promise<ICdpResponse | null> {
  const { eventApiClient, settings } = getServerDependencies();
  const id = getBrowserIdFromRequest(request, settings.cookieSettings.cookieName);
  return new CustomEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    settings: settings,
    type,
  }).send();
}
