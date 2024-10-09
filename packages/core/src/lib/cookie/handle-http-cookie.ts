// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import type { HttpRequest, HttpResponse } from '@sitecore-cloudsdk/utils';
import { createCookieString, getCookieServerSide } from '@sitecore-cloudsdk/utils';
import { fetchBrowserIdFromEdgeProxy } from '../browser-id/fetch-browser-id-from-edge-proxy';
import { getGuestId } from '../init/get-guest-id';
import type { Settings } from '../settings/interfaces';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

/**
 * Handles HTTP Cookie operations for setting the browser ID cookie in the request and response.
 *
 * @param request - The HTTP Request object containing request headers and data.
 * @param response - The HTTP Response object.
 * @param options - The settings object containing configuration options.
 * @param timeout - The timeout for the call to proxy to get browserId.
 * @returns A Promise that resolves once the browser ID cookie is handled.
 *
 * @throws [IE-0003] - This exception is thrown in the case getBrowserIdFromEP wasn't able to retrieve a browser id.
 */
export async function handleHttpCookie(
  request: HttpRequest,
  response: HttpResponse,
  options: Settings,
  timeout?: number
) {
  const { browserId, guestId } = options.cookieSettings.cookieNames;

  const browserIdCookie = getCookieServerSide(request.headers.cookie, browserId);
  let browserIdCookieValue: string;
  const guestIdCookie = getCookieServerSide(request.headers.cookie, guestId);
  let guestIdCookieValue: string;

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  if (!browserIdCookie) {
    const cookieValues = await fetchBrowserIdFromEdgeProxy(
      options.sitecoreEdgeUrl,
      options.sitecoreEdgeContextId,
      timeout
    );

    browserIdCookieValue = cookieValues.browserId;
    guestIdCookieValue = cookieValues.guestId;
  } else {
    browserIdCookieValue = browserIdCookie.value;
    if (!guestIdCookie)
      guestIdCookieValue = await getGuestId(
        browserIdCookie.value,
        options.sitecoreEdgeContextId,
        options.sitecoreEdgeUrl
      );
    else guestIdCookieValue = guestIdCookie.value;
  }

  const browserIdCookieString = createCookieString(browserId, browserIdCookieValue, defaultCookieAttributes);
  const guestIdCookieString = createCookieString(guestId, guestIdCookieValue, defaultCookieAttributes);

  if (!browserIdCookie)
    request.headers.cookie = request.headers.cookie
      ? request.headers.cookie + '; ' + browserIdCookieString
      : browserIdCookieString;

  if (!guestIdCookie)
    request.headers.cookie = request.headers.cookie
      ? request.headers.cookie + '; ' + guestIdCookieString
      : guestIdCookieString;

  response.setHeader('Set-Cookie', [browserIdCookieString, guestIdCookieString]);
}
