// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { createCookieString, getCookie } from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { fetchBrowserIdFromEdgeProxy } from '../init/fetch-browser-id-from-edge-proxy';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { getGuestId } from '../init/get-guest-id';

/**
 * Creates and adds the cookie to the document
 * @param settings - The CookieSettings settings object
 */

export async function createCookies(settings: Settings): Promise<void> {
  const attributes = getDefaultCookieAttributes(
    settings.cookieSettings.cookieExpiryDays,
    settings.cookieSettings.cookieDomain
  );

  const browserIdCookie = getCookie(window.document.cookie, settings.cookieSettings.cookieNames.browserId);

  if (browserIdCookie) {
    const guestIdCookie = getCookie(window.document.cookie, settings.cookieSettings.cookieNames.guestId);

    if (guestIdCookie) return;

    const guestId = await getGuestId(browserIdCookie.value, settings.sitecoreEdgeContextId, settings.sitecoreEdgeUrl);
    document.cookie = createCookieString(settings.cookieSettings.cookieNames.guestId, guestId, attributes);

    return;
  }

  const { browserId, guestId } = await fetchBrowserIdFromEdgeProxy(
    settings.sitecoreEdgeUrl,
    settings.sitecoreEdgeContextId
  );

  document.cookie = createCookieString(settings.cookieSettings.cookieNames.browserId, browserId, attributes);
  document.cookie = createCookieString(settings.cookieSettings.cookieNames.guestId, guestId, attributes);
}
