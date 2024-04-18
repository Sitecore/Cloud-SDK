// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { HttpRequest, HttpResponse } from '@sitecore-cloudsdk/utils';
import { createCookieString, getCookieServerSide } from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { fetchBrowserIdFromEdgeProxy } from '../init/fetch-browser-id-from-edge-proxy';
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
  const { cookieName } = options.cookieSettings;

  const cookieValueFromRequest = request.headers.cookie;

  let cookie;
  let cookieValue;

  if (cookieValueFromRequest) {
    cookie = getCookieServerSide(cookieValueFromRequest, cookieName);
    if (cookie) cookieValue = cookie.value;
  }

  if (!cookieValue)
    cookieValue = (await fetchBrowserIdFromEdgeProxy(options.sitecoreEdgeUrl, options.sitecoreEdgeContextId, timeout))
      .browserId;

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );

  const cookieString = createCookieString(cookieName, cookieValue, defaultCookieAttributes);

  if (!cookie)
    request.headers.cookie = cookieValueFromRequest ? cookieValueFromRequest + '; ' + cookieString : cookieString;

  response.setHeader('Set-Cookie', cookieString);
}
