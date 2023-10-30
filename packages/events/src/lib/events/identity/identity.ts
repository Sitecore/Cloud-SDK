// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ExtensionData } from '../common-interfaces';
import { ICdpResponse } from '@sitecore-cloudsdk/engage-core';
import { getDependencies } from '../../initializer/browser/initializer';
import { IIdentityEventAttributesInput, IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore CDP returns
 */
export function identity(
  eventData: IIdentityEventAttributesInput,
  extensionData?: ExtensionData
): Promise<ICdpResponse | null> {
  const { eventApiClient, id, settings } = getDependencies();
  return new IdentityEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    settings,
  }).send();
}
