// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { CustomEventInput, ExtensionData } from '../events';
import { QueueEventPayload, eventQueue } from './eventStorage';
import { getBrowserId, getSettings } from '@sitecore-cloudsdk/core';

/**
 * A function that adds event to the queue
 * @param type - The required type of the event
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @param extensionData - The optional extensionData attributes that will be sent to SitecoreCloud API.
 * This object will be flattened and sent in the ext object of the payload
 */
export function addToEventQueue(type: string, eventData: CustomEventInput, extensionData?: ExtensionData): void {
  const settings = getSettings();

  const id = getBrowserId();

  const queueEventPayload: QueueEventPayload = {
    eventData,
    extensionData,
    id,
    settings,
    type,
  };

  eventQueue.enqueueEvent(queueEventPayload);
}
