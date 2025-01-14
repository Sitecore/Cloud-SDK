// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse } from '@sitecore-cloudsdk/core/internal';
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import { CustomEvent } from './custom-event';

/**
 * A function that sends a form event to SitecoreCloud API
 *
 * @param formId - The required form ID string
 * @param interactionType - The required interaction type string. Possible values: "VIEWED", "SUBMITTED"
 * @param componentInstanceId - The required component instance ID string
 * @returns The response object that Sitecore EP returns or null
 */
export async function form(
  formId: string,
  interactionType: 'VIEWED' | 'SUBMITTED',
  componentInstanceId: string
): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);
  const formEvent = new CustomEvent({
    eventData: {
      extensionData: {
        componentInstanceId,
        formId,
        interactionType: interactionType.toUpperCase()
      },
      type: 'FORM'
    },
    id,
    sendEvent,
    settings
  });

  formEvent.page = undefined as unknown as string;

  return formEvent.send();
}
