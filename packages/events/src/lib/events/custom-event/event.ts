// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getBrowserId, EPResponse, getSettings } from '@sitecore-cloudsdk/core';
import { ExtensionData } from '../common-interfaces';
import { CustomEventInput, CustomEvent } from './custom-event';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 * @param type - The required type of the event
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export function event(
  type: string,
  eventData: CustomEventInput,
  extensionData?: ExtensionData
): Promise<EPResponse | null> {
  const settings = getSettings();

  const id = getBrowserId();

  return new CustomEvent({
    eventData,
    extensionData,
    id,
    sendEvent,
    settings,
    type,
  }).send();
}
