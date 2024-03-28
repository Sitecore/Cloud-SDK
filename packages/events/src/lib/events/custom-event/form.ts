// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { getBrowserId, EPResponse, getSettings, handleGetSettingsError } from '@sitecore-cloudsdk/core';
import { CustomEvent } from './custom-event';
import { sendEvent } from '../send-event/sendEvent';
import { awaitInit } from '../../initializer/browser/initializer';
import { ErrorMessages } from '../../consts';

/**
 * A function that sends a form event to SitecoreCloud API
 *
 * @param formId - The required form ID string
 * @param interactionType - The required interaction type string. Possible values: "VIEWED", "SUBMITTED"
 *  settings object, you must specify it here
 * @returns The response object that Sitecore EP returns or null
 */
export async function form(formId: string, interactionType: 'VIEWED' | 'SUBMITTED'): Promise<EPResponse | null> {
  await awaitInit();

  const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0004);
  const id = getBrowserId();

  const formEvent = new CustomEvent({
    eventData: {
      extensionData: {
        formId,
        interactionType: interactionType.toUpperCase(),
      },
      type: 'FORM',
    },
    id,
    sendEvent,
    settings,
  });

  formEvent.page = undefined as unknown as string;

  return formEvent.send();
}
