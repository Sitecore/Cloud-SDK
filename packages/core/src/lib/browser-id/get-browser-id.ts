// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { getSettings } from '../init/init-core';
import { getCloudSDKSettings, initCoreState } from '../initializer/browser/initializer';

/**
 * Get the browser ID from the cookie
 * @returns The browser ID if the cookie exists
 */
export function getBrowserId() {
  if (initCoreState) {
    const cloudSDKSettings = getCloudSDKSettings();
    return getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
  } else {
    const settings = getSettings();
    return getCookieValueClientSide(settings.cookieSettings.cookieNames.browserId);
  }
}
