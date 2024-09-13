// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse, Settings } from '@sitecore-cloudsdk/core/internal';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import {
  getBrowserId,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage,
  getSettings,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import type { PageViewData } from './page-view-event';
import { PageViewEvent } from './page-view-event';
import { awaitInit } from '../../init/browser/initializer';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { sendEvent } from '../send-event/sendEvent';

/**
 * A function that sends a VIEW event to SitecoreCloud API
 *
 * @param pageViewData - The optional attributes in order to be send to SitecoreCloud API
 * This object will be flattened and sent in the ext object of the payload
 * @returns The response object that Sitecore EP returns
 */
export async function pageView(pageViewData?: PageViewData): Promise<EPResponse | null> {
  await awaitInit();

  if (getEnabledPackage(PACKAGE_NAME)?.initState) {
    const settings = getCloudSDKSettings();
    const id = getCookieValueClientSide(settings.cookieSettings.names.browserId);

    return new PageViewEvent({
      id,
      pageViewData,
      searchParams: window.location.search,
      sendEvent,
      settings: settings as unknown as Settings
    }).send();
  } else {
    const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0014);
    const id = getBrowserId();

    return new PageViewEvent({
      id,
      pageViewData,
      searchParams: window.location.search,
      sendEvent,
      settings
    }).send();
  }
}
