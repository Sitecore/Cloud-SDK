// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IEPResponse } from '@sitecore-cloudsdk/core';
import { ExtensionData } from '../common-interfaces';
import { ICustomEventInput, CustomEvent } from './custom-event';
import { getDependencies } from '../../initializer/browser/initializer';

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
  eventData: ICustomEventInput,
  extensionData?: ExtensionData
): Promise<IEPResponse | null> {
  const { eventApiClient, id, settings } = getDependencies();

  return new CustomEvent({
    eventApiClient,
    eventData,
    extensionData,
    id,
    settings,
    type,
  }).send();
}
