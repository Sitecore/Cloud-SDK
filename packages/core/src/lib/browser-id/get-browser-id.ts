// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { getCookieValueClientSide } from '@sitecore-cloudsdk/utils';
import { getCloudSDKSettings } from '../initializer/browser/initializer';

/**
 * Get the browser ID from the cookie
 * @returns The browser ID if the cookie exists
 */
export function getBrowserId() {
  const cloudSDKSettings = getCloudSDKSettings();
  return getCookieValueClientSide(cloudSDKSettings.cookieSettings.name.browserId);
}
