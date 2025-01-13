// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import {
  getCloudSDKSettingsBrowser as getCloudSDKSettings,
  getGuestId as getGuestIdFromCore
} from '@sitecore-cloudsdk/core/internal';
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { awaitInit } from '../initializer/browser/initializer';

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

  const settings = getCloudSDKSettings();
  const id = getCookieValueClientSide(settings.cookieSettings.name.browserId);

  return getGuestIdFromCore(id, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
}
