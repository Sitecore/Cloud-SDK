// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { EPResponse, Settings } from '@sitecore-cloudsdk/core/internal';
import {
  getBrowserId,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage,
  getSettings,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { ErrorMessages, PACKAGE_NAME } from '../../consts';
import { awaitInit } from '../../init/browser/initializer';
import { sendEvent } from '../send-event/sendEvent';
import type { IdentityData } from './identity-event';
import { IdentityEvent } from './identity-event';

/**
 * A function that sends an IDENTITY event to SitecoreCloud API
 *
 * @param eventData - The required/optional attributes in order to be send to SitecoreCloud API
 * @returns The response object that Sitecore EP returns
 */
export async function identity(identityData: IdentityData): Promise<EPResponse | null> {
  await awaitInit();

  if (getEnabledPackage(PACKAGE_NAME)?.initState) {
    const settings = getCloudSDKSettings();
    const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

    return new IdentityEvent({
      id,
      identityData,
      sendEvent,
      settings: settings as unknown as Settings
    }).send();
  } else {
    const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0014);
    const id = getBrowserId();

    return new IdentityEvent({
      id,
      identityData,
      sendEvent,
      settings
    }).send();
  }
}
