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
 * A function that returns the guest ID.
 * @returns - A promise that resolves with the guest ID
 * @throws - Will throw an error if the sitecoreEdgeContextId is incorrect
 * @deprecated Cloud SDK v0.4 introduces a new getGuestId function. If you are upgrading from v0.3, we recommend that
 * you use the getGuestId function that is exposed from \@sitecore-cloudsdk/core/browser. The v0.3 function will be
 * deprecated and removed in a future Cloud SDK release.
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
