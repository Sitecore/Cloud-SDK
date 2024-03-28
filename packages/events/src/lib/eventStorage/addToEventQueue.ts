// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { awaitInit } from '../initializer/browser/initializer';
import { EventData } from '../events';
import { QueueEventPayload, eventQueue } from './eventStorage';
import { getBrowserId, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../consts';

/**
 * A function that adds event to the queue
 *
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 */
export async function addToEventQueue(eventData: EventData): Promise<void> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0004);
  const id = getBrowserId();

  const queueEventPayload: QueueEventPayload = {
    eventData,
    id,
    settings,
  };

  eventQueue.enqueueEvent(queueEventPayload);
}
