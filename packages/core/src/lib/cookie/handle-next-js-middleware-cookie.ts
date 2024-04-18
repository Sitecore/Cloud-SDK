// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import type { MiddlewareNextResponse, MiddlewareRequest } from '@sitecore-cloudsdk/utils';
import type { Settings } from '../settings/interfaces';
import { fetchBrowserIdFromEdgeProxy } from '../init/fetch-browser-id-from-edge-proxy';
import { getBrowserIdFromMiddlewareRequest } from './get-browser-id-from-middleware-request';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

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
 * @throws [IE-0003] - This exception is thrown in the case fetchBrowserIdFromEdgeProxy wasn't able to retrieve a browserId.
 *
 */
export async function handleNextJsMiddlewareCookie(
  request: MiddlewareRequest,
  response: MiddlewareNextResponse,
  options: Settings,
  timeout?: number
) {
  const { cookieName } = options.cookieSettings;

  let cookieValue = getBrowserIdFromMiddlewareRequest(request, cookieName);

  if (!cookieValue)
    cookieValue = (await fetchBrowserIdFromEdgeProxy(options.sitecoreEdgeUrl, options.sitecoreEdgeContextId, timeout))
      .browserId;

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );
  request.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
  response.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
}
