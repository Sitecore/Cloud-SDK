// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getBrowserId, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { CustomEvent } from './custom-event';
import type { EPResponse } from '@sitecore-cloudsdk/core';
import { ErrorMessages } from '../../consts';
import type { EventData } from './custom-event';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends an event to SitecoreCloud API with the specified type
 *
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function event(eventData: EventData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0004);
  const id = getBrowserId();

  return new CustomEvent({
    eventData,
    id,
    sendEvent,
    settings
  }).send();
}
