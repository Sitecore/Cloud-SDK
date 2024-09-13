// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages, PACKAGE_NAME } from '../consts';
import {
  getBrowserId,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage,
  getSettings,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import type { EventData } from '../events';
import type { QueueEventPayload } from './eventStorage';
import type { Settings } from '@sitecore-cloudsdk/core/internal';
import { awaitInit } from '../init/browser/initializer';
import { eventQueue } from './eventStorage';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';

/**
 * A function that adds event to the queue
 *
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 */
export async function addToEventQueue(eventData: EventData): Promise<void> {
  await awaitInit();

  if (getEnabledPackage(PACKAGE_NAME)?.initState) {
    const settings = getCloudSDKSettings();
    const id = getCookieValueClientSide(settings.cookieSettings.names.browserId);
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings: settings as unknown as Settings
    };

    eventQueue.enqueueEvent(queueEventPayload);
  } else {
    const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0014);
    const id = getBrowserId();
    const queueEventPayload: QueueEventPayload = {
      eventData,
      id,
      settings
    };

    eventQueue.enqueueEvent(queueEventPayload);
  }
}
