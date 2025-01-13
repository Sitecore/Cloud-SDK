// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse, Settings } from '@sitecore-cloudsdk/core/internal';
import { getCloudSDKSettingsBrowser as getCloudSDKSettings } from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { awaitInit } from '../../initializer/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 *
 * @param pageViewData - The optional attributes in order to be send to SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export async function pageView(pageViewData?: PageViewData): Promise<EPResponse | null> {
  await awaitInit();

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return new PageViewEvent({
    id,
    pageViewData,
    searchParams: window.location.search,
    sendEvent,
    settings: settings as unknown as Settings
  }).send();
}
