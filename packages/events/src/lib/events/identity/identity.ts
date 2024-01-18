// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ExtensionData } from '../common-interfaces';
import { getBrowserId, EPResponse, getSettings } from '@sitecore-cloudsdk/core';
import { IdentityEventAttributesInput, IdentityEvent } from './identity-event';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export function identity(
  eventData: IdentityEventAttributesInput,
  extensionData?: ExtensionData
): Promise<EPResponse | null> {
  const settings = getSettings();

  const id = getBrowserId();

  return new IdentityEvent({
    eventData,
    extensionData,
    id,
    sendEvent,
    settings,
  }).send();
}
