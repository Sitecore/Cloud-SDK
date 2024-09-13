// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages, PACKAGE_NAME } from '../consts';
import {
  getBrowserId,
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getEnabledPackageBrowser as getEnabledPackage,
  getGuestId as getGuestIdFromCore,
  getSettings,
  handleGetSettingsError
} from '@sitecore-cloudsdk/core/internal';
import { awaitInit } from '../init/browser/initializer';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';

/**
 * A function that returns the guest id.
 * @returns - A promise that resolves with the guest id
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export async function getGuestId(): Promise<string> {
  await awaitInit();

  if (getEnabledPackage(PACKAGE_NAME)?.initState) {
    const settings = getCloudSDKSettings();
    const id = getCookieValueClientSide(settings.cookieSettings.names.browserId);

    return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
  } else {
    const settings = handleGetSettingsError(getSettings, ErrorMessages.IE_0014);
    const id = getBrowserId();

    return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
  }
}
