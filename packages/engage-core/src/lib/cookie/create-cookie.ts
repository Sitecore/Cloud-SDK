// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { createCookieString } from '@sitecore-cloudsdk/engage-utils';
import { ICookieSettings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { getBrowserIdFromCdp } from '../init/get-browser-id-from-cdp';
/**
 * Creates and adds the cookie to the document
 * @param targetURL - The targetURL from global settings
 * @param clientKey - The clientKey from global settings
 * @param settings - The ICookieSettings settings object
 * @returns - browserId or undefined on error
 */
export async function createCookie(targetURL: string, clientKey: string, settings: ICookieSettings): Promise<string> {
  const browserId = await getBrowserIdFromCdp(targetURL, clientKey);

  const attributes = getDefaultCookieAttributes(settings.cookieExpiryDays, settings.cookieDomain);
  document.cookie = createCookieString(settings.cookieName, browserId, attributes);

  return browserId;
}
