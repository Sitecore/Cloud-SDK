// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { cookieExists, createCookieString } from '@sitecore-cloudsdk/utils';
import { ISettings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { getProxySettings } from '../init/get-proxy-settings';
import { BID_PREFIX } from '../consts';
/**
 * Creates and adds the cookie to the document
 * @param sitecoreEdgeContextId - The sitecoreEdgeContextId from global settings
 * @param settings - The ICookieSettings settings object
 * @returns - browserId or undefined on error
 */
export async function createCookie(settings: ISettings): Promise<void> {
  const { browserId, clientKey } = await getProxySettings(settings.sitecoreEdgeContextId);

  settings.cookieSettings.cookieName = `${BID_PREFIX}${clientKey}`;

  if (cookieExists(window.document.cookie, settings.cookieSettings.cookieName) || !browserId) return;

  const attributes = getDefaultCookieAttributes(
    settings.cookieSettings.cookieExpiryDays,
    settings.cookieSettings.cookieDomain
  );
  document.cookie = createCookieString(settings.cookieSettings.cookieName, browserId, attributes);
}
