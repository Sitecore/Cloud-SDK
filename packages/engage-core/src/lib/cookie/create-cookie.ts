// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { createCookieString } from '@sitecore-cloudsdk/engage-utils';
import { ICookieSettings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { getProxySettings } from '../init/get-proxy-settings';
/**
 * Creates and adds the cookie to the document
 * @param contextId - The contextId from global settings
 * @param settings - The ICookieSettings settings object
 * @returns - browserId or undefined on error
 */
export async function createCookie(contextId: string, settings: ICookieSettings): Promise<string> {
  const { browserId } = await getProxySettings(contextId);
  if (browserId) {
    const attributes = getDefaultCookieAttributes(settings.cookieExpiryDays, settings.cookieDomain);
    document.cookie = createCookieString(settings.cookieName, browserId, attributes);
  }

  return browserId;
}
