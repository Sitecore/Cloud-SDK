// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { cookieExists, createCookieString } from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { fetchBrowserIdFromEdgeProxy } from '../init/fetch-browser-id-from-edge-proxy';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

/**
 * Creates and adds the cookie to the document
 * @param settings - The CookieSettings settings object
 * @returns - browserId or undefined on error
 */
export async function createCookie(settings: Settings): Promise<void> {
  if (cookieExists(window.document.cookie, settings.cookieSettings.cookieName)) return;

  const { browserId } = await fetchBrowserIdFromEdgeProxy(settings.sitecoreEdgeUrl, settings.sitecoreEdgeContextId);

  const attributes = getDefaultCookieAttributes(
    settings.cookieSettings.cookieExpiryDays,
    settings.cookieSettings.cookieDomain
  );
  document.cookie = createCookieString(settings.cookieSettings.cookieName, browserId, attributes);
}
