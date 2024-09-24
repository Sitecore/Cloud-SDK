// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { MiddlewareNextResponse, MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { fetchBrowserIdFromEdgeProxy } from '../browser-id/fetch-browser-id-from-edge-proxy';
import { getCookieValueFromMiddlewareRequest } from './get-cookie-value-from-middleware-request';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';
import { getGuestId } from '../init/get-guest-id';

/**
 * Handles the Middleware Request and sets a cookie with the provided 'cookieName' and 'cookieValue'.
 * If 'cookieValue' is not present in the request, it fetches it using the 'fetchBrowserIdFromEdgeProxy' function
 * and stores it in the request's cookies with the specified 'defaultCookieAttributes'.
 *
 * @param request - The Middleware Request object.
 * @param response - The Middleware Response object.
 * @param options - The settings object containing configuration options.
 * @param defaultCookieAttributes - The default attributes for the cookie.
 *
 * @throws [IE-0003] - This exception is thrown when fetchBrowserIdFromEdgeProxy wasn't able to retrieve a browserId.
 *
 */
export async function handleNextJsMiddlewareCookie(
  request: MiddlewareRequest,
  response: MiddlewareNextResponse,
  options: Settings,
  timeout?: number
) {
  const { browserId, guestId } = options.cookieSettings.cookieNames;

  let browserIdCookieValue = getCookieValueFromMiddlewareRequest(request, browserId);
  let guestIdCookieValue = getCookieValueFromMiddlewareRequest(request, guestId);

  if (!browserIdCookieValue) {
    const cookieValues = await fetchBrowserIdFromEdgeProxy(
      options.sitecoreEdgeUrl,
      options.sitecoreEdgeContextId,
      timeout
    );

    browserIdCookieValue = cookieValues.browserId;
    guestIdCookieValue = cookieValues.guestId;
  } else if (!guestIdCookieValue)
    guestIdCookieValue = await getGuestId(browserIdCookieValue, options.sitecoreEdgeContextId, options.sitecoreEdgeUrl);

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  request.cookies.set(browserId, browserIdCookieValue, defaultCookieAttributes);
  request.cookies.set(guestId, guestIdCookieValue, defaultCookieAttributes);

  response.cookies.set(browserId, browserIdCookieValue, defaultCookieAttributes);
  response.cookies.set(guestId, guestIdCookieValue, defaultCookieAttributes);
}
