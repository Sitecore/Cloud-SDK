// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { ICdpResponse } from '@sitecore-cloudsdk/engage-core';
import { getDependencies } from '../../initializer/browser/initializer';
import { CustomEvent } from './custom-event';
/**
 * A function that sends a form event to SitecoreCloud API
 * @param formId - The required form ID string
 * @param interactionType - The required interaction type string. Possible values: "VIEWED", "SUBMITTED"
 *  settings object, you must specify it here
 * @returns The response object that Sitecore CDP returns or null
 */
export function form(formId: string, interactionType: 'VIEWED' | 'SUBMITTED'): Promise<ICdpResponse | null> {
  const { eventApiClient, id, settings } = getDependencies();
  const formEvent = new CustomEvent({
    eventApiClient,
    eventData: {},
    extensionData: {
      formId,
      interactionType: interactionType.toUpperCase(),
    },
    id,
    settings,
    type: 'FORM',
  });

  formEvent.page = undefined as unknown as string;

  return formEvent.send();
}
