// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import type { EventData } from '../events';
import { awaitInit } from '../initializer/browser/initializer';
import type { QueueEventPayload } from './eventStorage';
import { eventQueue } from './eventStorage';

/**
 * A function that adds event to the queue
 *
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 */
export async function addToEventQueue(eventData: EventData): Promise<void> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);
  const queueEventPayload: QueueEventPayload = {
    eventData,
    id,
    settings
  };

  eventQueue.enqueueEvent(queueEventPayload);
}
