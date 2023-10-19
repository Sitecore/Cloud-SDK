// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

import { IMiddlewareNextResponse, IMiddlewareRequest } from '@sitecore-cloudsdk/engage-utils';
import { ISettings } from '../settings/interfaces';
import { BID_PREFIX, TARGET_URL } from '../consts';
import { getBrowserIdFromCdp } from '../init/get-browser-id-from-cdp';
import { getBrowserIdFromMiddlewareRequest } from './get-browser-id-from-middleware-request';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

/**
 * Handles the Middleware Request and sets a cookie with the provided 'cookieName' and 'cookieValue'.
 * If 'cookieValue' is not present in the request, it fetches it using the 'getBrowserIdFromCdp' function
 * and stores it in the request's cookies with the specified 'defaultCookieAttributes'.
 *
 * @param request - The Middleware Request object.
 * @param cookieName - The name of the cookie to set.
 * @param options - The settings object containing configuration options.
 * @param defaultCookieAttributes - The default attributes for the cookie.
 *
 * @throws [IE-0004] - This exception is thrown in the case getBrowserIdFromCdp wasn't able to retrieve a browser id.
 *
 */
export async function handleNextJsMiddlewareCookie(
  request: IMiddlewareRequest,
  response: IMiddlewareNextResponse,
  options: ISettings,
  timeout?: number
) {
  const cookieName = BID_PREFIX + options.clientKey;

  const cookieValue =
    getBrowserIdFromMiddlewareRequest(request, cookieName) ??
    (await getBrowserIdFromCdp(TARGET_URL, options.clientKey, timeout));

  if (!cookieValue)
    throw new Error(
      '[IE-0004] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'
    );

  const defaultCookieAttributes = getDefaultCookieAttributes(
    options.cookieSettings.cookieExpiryDays,
    options.cookieSettings.cookieDomain
  );
  request.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
  response.cookies.set(cookieName, cookieValue, defaultCookieAttributes);
}
